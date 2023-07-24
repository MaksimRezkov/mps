import multiInput from 'rollup-plugin-multi-input';
export default {
    input: ['src/**/*.js'],
    // experimentalCodeSplitting: true,
    output: {
      format: 'iife',
      dir: 'dist'
    },
    plugins: [ multiInput() ],
};
