'use strict';

angular.module('blocitoffApp')
	.directive('timeRemaining', ['dateFilter', '$log', function(dateFilter, $log) {

		function dateDiff(date1, date2) {
			// difference in seconds
			var delta = (date2 - date1) / 1000;

			// whole days
			var days = Math.floor(delta / 86400);
			delta -= days * 86400;

			// whole hours
			var hours = Math.floor(delta / 3600) % 24;
			delta -= hours * 3600;

			// whole minutes
			var minutes = Math.floor(delta / 60) % 60;
			delta -= minutes * 60;

			// whole seconds
			var seconds = Math.floor(delta);

			return days + 'D ' + hours + 'H ' + minutes + 'M ' + seconds + 'S';
		}

		return function(scope, element, attrs) {
			
			var format = attrs.timeRemaining;
			var created = moment(attrs.itemCreated);
			var expires = created.add('d', 7);

			function updateTime() {
				var now = new Date();
				element.text(dateDiff(now, expires));
				// set element to expired
				if ((expires - now) <= 0) {
					scope;
				}
			}

			function nextTime() {
				setTimeout(function() {
					updateTime(); // updates the DOM
					nextTime();   // schedule next update
				}, 1000);
			}

			nextTime();
		}
	}]);