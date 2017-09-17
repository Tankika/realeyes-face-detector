(function () {
	'use strict';

    const CLASS_HIDDEN = 'hidden';

    window.showElement = function(selector) {
		const element = document.querySelector(selector);
        
        element.classList.remove(HIDDEN_CLASS);
    }
    
    window.hideElement = function(selector) {
        const element = document.querySelector(selector);
        
        element.classList.add(HIDDEN_CLASS);
    }
})();