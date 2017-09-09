'use strict';

(function () {
	const video = document.querySelector('video#video');
	const captureButton = document.querySelector('button#captureBtn');
	const canvas = document.querySelector('canvas#canvas');
	
	const constraints = {
		video: true,
		audio: false
	};
	
	navigator.mediaDevices.getUserMedia(constraints)
	.then(handleSuccess)
	.catch(handleError);
	
	function handleSuccess(stream) {
		const cameraAllowedContainer = document.querySelector('.camera-allowed');
		cameraAllowedContainer.classList.remove('hidden');
		video.srcObject = stream;
		
		captureButton.onclick = function() {			
			var oReq = new XMLHttpRequest();
			oReq.addEventListener("load", reqListener);
			oReq.open("POST", "/recognize");

			canvas.getContext('2d')
				.drawImage(video, 0, 0, canvas.width, canvas.height);
			canvas.toBlob(blob => {
				oReq.send(blob);
			}, "image/jpeg");

			function reqListener () {
				const response = JSON.parse(oReq.response);

				canvas.getContext('2d').strokeStyle = 'green';
				canvas.getContext('2d').lineWidth = 2.5;
				response.FaceDetails.forEach(details => {
					const bb = details.BoundingBox;
					canvas.getContext('2d')
						.strokeRect(canvas.width * bb.Left, canvas.height * bb.Top, canvas.width * bb.Width, canvas.height* bb.Height)
				});

				window.genders = response.FaceDetails.map(details => details.Gender.Value);
			}
		};
	}
	
	function handleError(error) {
		const cameraDeniedContainer = document.querySelector('.camera-denied');
		cameraDeniedContainer.classList.remove('hidden');
	}
})();