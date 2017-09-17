(function () {
	'use strict';

    const CLASS_HIDDEN = 'hidden';

    window.showElement = function(selector) {
		const element = document.querySelector(selector);
        
        element.classList.remove(CLASS_HIDDEN);
    }
    
    window.hideElement = function(selector) {
        const element = document.querySelector(selector);
        
        element.classList.add(CLASS_HIDDEN);
    }
})();