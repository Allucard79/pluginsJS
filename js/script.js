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
        smoothPanAndZoom(map, 7, locations[index]);
    });
    var smoothPanAndZoom = function(map, zoom, coords){
		// Trochę obliczeń, aby wyliczyć odpowiedni zoom do którego ma oddalić się mapa na początku animacji.
		var jumpZoom = zoom - Math.abs(map.getZoom() - zoom);
		jumpZoom = Math.min(jumpZoom, zoom -1);
		jumpZoom = Math.max(jumpZoom, 3);

		// Zaczynamy od oddalenia mapy do wyliczonego powiększenia. 
		smoothZoom(map, jumpZoom, function(){
			// Następnie przesuwamy mapę do żądanych współrzędnych.
			smoothPan(map, coords, function(){
				// Na końcu powiększamy mapę do żądanego powiększenia. 
				smoothZoom(map, zoom); 
			});
		});
	};
	
	var smoothZoom = function(map, zoom, callback) {
		var startingZoom = map.getZoom();
		var steps = Math.abs(startingZoom - zoom);
		
		// Jeśli steps == 0, czyli startingZoom == zoom
		if(!steps) {
			// Jeśli podano trzeci argument
			if(callback) {
				// Wywołaj funkcję podaną jako trzeci argument.
				callback();
			}
			// Zakończ działanie funkcji
			return;
		}

		// Trochę matematyki, dzięki której otrzymamy -1 lub 1, w zależności od tego czy startingZoom jest mniejszy od zoom
		var stepChange = - (startingZoom - zoom) / steps;

		var i = 0;
		// Wywołujemy setInterval, który będzie wykonywał funkcję co X milisekund (X podany jako drugi argument, w naszym przypadku 80)
		var timer = window.setInterval(function(){
			// Jeśli wykonano odpowiednią liczbę kroków
			if(++i >= steps) {
				// Wyczyść timer, czyli przestań wykonywać funkcję podaną w powyższm setInterval
				window.clearInterval(timer);
				// Jeśli podano trzeci argument
				if(callback) {
					// Wykonaj funkcję podaną jako trzeci argument
					callback();
				}
			}
			// Skorzystaj z metody setZoom obiektu map, aby zmienić powiększenie na zaokrąglony wynik poniższego obliczenia
			map.setZoom(Math.round(startingZoom + stepChange * i));
		}, 80);
	};

	// Poniższa funkcja działa bardzo podobnie do smoothZoom. Spróbuj samodzielnie ją przeanalizować. 
	var smoothPan = function(map, coords, callback) {
		var mapCenter = map.getCenter();
		coords = new google.maps.LatLng(coords);

		var steps = 12;
		var panStep = {lat: (coords.lat() - mapCenter.lat()) / steps, lng: (coords.lng() - mapCenter.lng()) / steps};

		var i = 0;
		var timer = window.setInterval(function(){
			if(++i >= steps) {
				window.clearInterval(timer);
				if(callback) callback();
			}
			map.panTo({lat: mapCenter.lat() + panStep.lat * i, lng: mapCenter.lng() + panStep.lng * i});
		}, 1000/30);
	}; 
	
}