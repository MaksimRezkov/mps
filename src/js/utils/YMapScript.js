const ourCoords = [55.675128, 37.561293];
// Функция ymaps.ready() будет вызвана, когда
// загрузятся все компоненты API, а также когда будет готово DOM-дерево.
ymaps.ready(init);
function init(){
    // Создание карты.
    var myMap = new ymaps.Map("map", {
        // Координаты центра карты.
        // Порядок по умолчанию: «широта, долгота».
        // Чтобы не определять координаты центра карты вручную,
        // воспользуйтесь инструментом Определение координат.
        center: ourCoords,
        // Уровень масштабирования. Допустимые значения:
        // от 0 (весь мир) до 19.
        zoom: 12
    });

    // Включим масштабирование колесом мыши
    myMap.behaviors.disable('scrollZoom');

    // Создание геообъекта с типом точка (метка).
    var myGeoObject = new ymaps.GeoObject({
        geometry: {
            type: "Point", // тип геометрии - точка
            coordinates: ourCoords // координаты точки
        },
        properties: {
            iconCaption: 'ул. Профсоюзная, д. 23.'
        }
    });

    // Размещение геообъекта на карте.
    myMap.geoObjects.add(myGeoObject);

    // Размещение подсказки к точке на карте
    // myMap.balloon.open(myMap.getCenter(), {
    //     contentBody: 'г. Москва, ул. Профсоюзная, д. 23.',
    // });
    
    // myMap.hint.open(ourCoords);
    

}