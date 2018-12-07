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
var locations = slideData.map(function(a) {return a.coords;});

var markers = [];

var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: {
            lat: 50.8697854,
            lng: 15.8698772
        }
    });
}

function drop() {
    for (var i = 0; i < locations.length; i++) {
        addMarkerWithTimeout(locations[i], i * 200);
    }
}

function addMarkerWithTimeout(position, timeout) {
    window.setTimeout(function () {
        markers.push(new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.DROP
        }));
    }, timeout);
}
drop();