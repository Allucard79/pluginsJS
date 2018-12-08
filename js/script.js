var templateSlide = document.getElementById('template-slide').innerHTML;

Mustache.parse(templateSlide);

var listSlide = '';

for (var i = 0; i < slideData.length; i++) {
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

var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: {
            lat: 50.8697854,
            lng: 15.8698772
        }
    });
    
    var marker, i;

	for (i = 0; i < locations.length; i++) {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(locations[i]),
            map: map,
            animation: google.maps.Animation.DROP
		});
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
			return function () {
				flkty.select(i);
			}
		})(marker, i));
    }
    flkty.on( 'change', function( index ) {
        map.panTo(locations[index]);
        map.setZoom(7);
    });
}