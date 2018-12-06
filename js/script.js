var templateSlide = document.getElementById('template-slide').innerHTML;

Mustache.parse(templateSlide);

var listSlide = '';

for (var i = 0; i < slideData.length; i++) {
    console.log(slideData);
    listSlide += Mustache.render(templateSlide, slideData[i]);
}
results.insertAdjacentHTML('afterbegin', listSlide);

var elem = document.querySelector('.main-carousel');
var flkty = new Flickity(elem, {
    wrapAround: true,
    pageDots: false,
    hash: true
});

var flkty = new Flickity('.main-carousel');

var progressBar = document.querySelector('.progress-bar')

flkty.on('scroll', function (progress) {
    progress = Math.max(0, Math.min(1, progress));
    progressBar.style.width = progress * 100 + '%';
});

var button = document.querySelector('.button');

button.addEventListener('click', function () {
    flkty.select(0);
});

window.initMap = function () {
    var locations = [
        ['sokoliki', 50.8697854, 15.8698772],
        ['jura', 50.7495748, 19.2686115],
        ['frankenjura', 49.453872, 11.077298],
        ['arco', 45.9180319, 10.8860765],
        ['adlitzgraben', 47.6507972, 15.8154282]
    ];

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: {
            lat: 50.8697854,
            lng: 15.8698772
        }
    });

    var marker;

    for (var i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
        });
    }

};