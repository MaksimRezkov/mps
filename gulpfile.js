const path = require('path');
const gulp = require('gulp');
const { src, dest, series, watch, parallel } = gulp;
const dartSass = require('sass');
const gulpSass = require('gulp-sass');
const sass = gulpSass(dartSass);
const bulk = require('gulp-sass-bulk-importer');
const prefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean-css');
const concat = require('gulp-concat');
const map = require('gulp-sourcemaps');
const del = require('del');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const bs = require('browser-sync');
const include = require('gulp-file-include');
const chalk = require('chalk');

const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const recompress = require('imagemin-jpeg-recompress');
const pngquant = require('imagemin-pngquant');
const multiDest = require('gulp-multi-dest');
const plumber = require('gulp-plumber');
const webpConv = require('gulp-webp');
const svgmin = require('gulp-svgmin');
const svgCss = require('gulp-svg-css-pseudo');
const sprite = require('gulp-svg-sprite');
const ttf2woff2 = require('gulp-ttftowoff2');
const ttf2woff = require('gulp-ttf2woff');
const fs = require('fs');

const stylePlugins = []; // пути до стилей библиотек
const scriptsPlugins = []; // пути до скриптов библиотек

function clear() {
    return del(['dist']);
}

/** ===============styles=================== */
function style() {
    return src('src/scss/**/*.scss') //определяем источник исходного кода (source)
        .pipe(map.init()) //инициализируем маппинг, чтобы он отслеживал включаемые файлы
        .pipe(bulk()) //проводим код через плагин, который ползволяет использовать директиву @include в scss для директорий, а не только для отдельных файлов
        .pipe(sass({outputStyle: 'compressed'})) //проводим код через сам компиллятор sass
        .pipe(prefixer({
            overrideBrowserslist: ['last 8 versions'],
            browsers: [
                'Android >= 4',
                'Chrome >= 20',
                'Firefox >= 24',
                'Explorer >= 11',
                'iOS >= 6',
                'Opera >= 12',
                'Safari >= 6',
              ],
        })) //проводим код через префиксер, который расставит вендорные префиксы
        .pipe(clean({
            level: 2
        })) // проводим код через "очиститель" от лишнего css
        .pipe(concat('style.min.css')) // склеиваем все исходные файлы в один
        .pipe(map.write('../sourcemaps/')) // записываем "карту" источников полученного файла
        .pipe(dest('dist/css/')) // кладём итоговый файл в директорию
}

function libs_style(done) {
    if (stylePlugins.length > 0) {
		return src(stylePlugins)
			.pipe(map.init())
			.pipe(sass({
				outputStyle: 'compressed'
			}))
			.pipe(concat('libs.min.css'))
			.pipe(map.write('../sourcemaps/'))
			.pipe(dest('dist/css/'))
	} else {
		return done(console.log(chalk.bgYellowBright('No added CSS plugins')));
	}
}

/** ===============styles=================== */

/** ===============JS=================== */
function scripts_dev() {
    return src(['src/components/**/*.js', 'src/js/*.js'])
		.pipe(map.init())
		.pipe(uglify())
        .pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(concat('main.min.js'))
		.pipe(map.write('../sourcemaps'))
		.pipe(dest('dist/js/'))
        .pipe(bs.stream())
}

function scripts_libs(done) {
    if (scriptsPlugins.length > 0)
		return src(scriptsPlugins)
			.pipe(map.init())
			.pipe(uglify())
			.pipe(concat('libs.min.js'))
			.pipe(map.write('../sourcemaps'))
			.pipe(dest('dist/js/'))
	else {
		return done(console.log(chalk.bgYellowBright('No added JS plugins')));
	}
}
/** ===============JS=================== */

/** ===============HTML=================== */
function html() {
	return src(['src/**/*.html', '!src/components/html'])
		.pipe(include())
		.pipe(dest('dist'))
        .pipe(bs.stream())
}
/** ===============HTML=================== */

/** ==============images================== */
function rastr() {
	return src('src/img/**/*.+(png|jpg|jpeg|gif|svg|ico)')
		.pipe(changed('dist/img'))
		.pipe(imagemin({
				interlaced: true,
				progressive: true,
				optimizationLevel: 5,
			},
			[
				recompress({
					loops: 6,
					min: 50,
					max: 90,
					quality: 'high',
					use: [pngquant({
						quality: [0.8, 1],
						strip: true,
						speed: 1
					})],
				}),
				imagemin.gifsicle(),
				imagemin.optipng(),
				imagemin.svgo()
			], ), )
		.pipe(dest('dist/img'))
  	.pipe(bs.stream())
}

function webp() {
	return src('dist/img/**/*.+(png|jpg|jpeg)')
		.pipe(plumber())
		.pipe(changed('dist/img', {
			extension: '.webp'
		}))
		.pipe(webpConv())
		.pipe(multiDest(['src/img', 'dist/img']))
}

function svg_css() {
	return src('src/svg/css/**/*.svg')
		.pipe(svgmin({
			plugins: [{
					removeComments: true
				},
				{
					removeEmptyContainers: true
				}
			]
		}))
		.pipe(svgCss({
			fileName: '_svg',
			fileExt: 'scss',
			cssPrefix: '--svg__',
			addSize: false
		}))
		.pipe(dest('src/scss/global'))
}

function svg_sprite() {
	return src('src/svg/**/*.svg')
		.pipe(svgmin({
			plugins: [{
					removeComments: true
				},
				{
					removeEmptyContainers: true
				}
			]
		}))
		.pipe(sprite({
			mode: {
				stack: {
					sprite: '../sprite.svg'
				}
			}
		}))
		.pipe(dest('src/img'))
}
/** ==============images================== */

/** ==============fonts================== */
function ttf(done) {
	src('src/fonts/**/*.ttf')
		.pipe(changed('dist/fonts', {
			extension: '.woff2',
			hasChanged: changed.compareLastModifiedTime
		}))
		.pipe(ttf2woff2())
		.pipe(dest('dist/fonts'))

	src('src/fonts/**/*.ttf')
		.pipe(changed('dist/fonts', {
			extension: 'woff',
			hasChanged: changed.compareLastModifiedTime
		}))
		.pipe(ttf2woff())
		.pipe(dest('dist/fonts'))
	done();
}

let srcFonts = 'src/scss/_local-fonts.scss';
let appFonts = 'dist/fonts/';
function fonts(done) {
	fs.writeFile(srcFonts, '', () => {});
	fs.readdir(appFonts, (err, items) => {
		if (items) {
			let c_fontname;
			for (let i = 0; i < items.length; i++) {
				let fontname = items[i].split('.'),
					fontExt;
				fontExt = fontname[1];
				fontname = fontname[0];
				if (c_fontname != fontname) {
					if (fontExt == 'woff' || fontExt == 'woff2') {
						fs.appendFile(srcFonts, `@include font-face("${fontname}", "${fontname}", 400);\r\n`, () => {});
						console.log(chalk `
{bold {bgGray Added new font: ${fontname}.}
----------------------------------------------------------------------------------
{bgYellow.black Please, move mixin call from {cyan src/scss/_local-fonts.scss} to {cyan src/scss/_fonts.scss} and then change it!}}
----------------------------------------------------------------------------------
`);
					}
				}
				c_fontname = fontname;
			}
		}
	})
	done();
}
/** ==============fonts================== */

/** ==============local server================== */
function bs_html() {
	bs.init({
		server: {
			baseDir: 'dist/',
			host: '10.0.0.100',
		},
		callbacks: {
			ready: function (err, bs) {
				bs.addMiddleware("*", function (req, res) {
					res.writeHead(302, {
						location: "404.html"
					});
					res.end("Redirecting!");
				});
			}
		},
		browser: 'chrome',
		logPrefix: 'BS-HTML:',
		logLevel: 'info',
		logConnections: true,
		logFileChanges: true,
		open: true
	})
}
/** ==============local server================== */

function watching() {
	watch('src/**/*.html', parallel('html'));
	watch('src/**/*.scss', parallel('style'));
	watch('src/**/*.js', parallel('scripts_dev'));
	watch('src/**/*.json', parallel('html'));
	watch('src/img/**/*.+(png|jpg|jpeg|gif|svg|ico)', parallel('rastr'));
	watch('dist/img/**/*.+(png|jpg|jpeg)', parallel('webp'));
	watch('src/svg/css/**/*.svg', series('svg_css', 'style'));
	watch('src/svg/sprite/**/*.svg', series('svg_sprite', 'rastr'));
	watch('src/fonts/**/*.ttf', series('ttf', 'fonts'));
}

/**
 * exports.default = gulp.parallel(
	exports.libs_style,
	exports.style,
	exports.libs_js,
	exports.dev_js,
	exports.rastr,
	exports.webp,
	exports.svg_css,
	exports.svg_sprite,
	exports.ttf,
	exports.fonts,
	exports.html,
	exports.bs_html,
	exports.watch
)
 */

exports.clear = clear;
exports.style = style;
exports.libs_style = libs_style;
// exports.build_js = build_js;
exports.scripts_libs = scripts_libs;
exports.scripts_dev = scripts_dev;
exports.html = html;
exports.rastr = rastr;
exports.webp = webp;
exports.svg_css = svg_css;
exports.svg_sprite = svg_sprite;
exports.ttf = ttf;
exports.fonts = fonts;
exports.bs_html = bs_html;
exports.watching = watching;
// exports.deploy = deploy;

exports.build = parallel(
    libs_style,
    style,
    scripts_libs,
    scripts_dev,
    rastr,
    webp,
    svg_css,
    svg_sprite,
    ttf,
    fonts,
    html,
    bs_html,
    watching
);
