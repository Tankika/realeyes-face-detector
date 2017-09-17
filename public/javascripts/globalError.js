(function () {
	'use strict';

    window.onerror = function(message, source, lineNumber, columnNumber, error) {
        console.error(error);
        window.hideElement('#detecting');
        window.showElement('#non-capable');
    }

})();