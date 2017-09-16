(function () {
	'use strict';

    window.showElement = function(selector) {
		const element = document.querySelector(selector);
        
        element.classList.remove('hidden');
    }
})();