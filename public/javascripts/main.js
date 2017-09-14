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

				document.querySelector('.capture').classList.remove('hidden');

				canvas.getContext('2d').strokeStyle = 'green';
				canvas.getContext('2d').lineWidth = 2.5;
				canvas.getContext('2d').fillStyle = 'white';
				canvas.getContext('2d').font = '14px';
				response.FaceDetails.forEach(details => {
					const bb = details.BoundingBox;
					canvas.getContext('2d')
						.strokeRect(canvas.width * bb.Left, canvas.height * bb.Top, canvas.width * bb.Width, canvas.height* bb.Height);

					const mostProbableEmotion = 
						_.maxBy(details.Emotions, emotion => emotion.Confidence);
					canvas.getContext('2d')
						.fillText(`${mostProbableEmotion.Type}: ${mostProbableEmotion.Confidence.toPrecision(3)}%`, canvas.width * bb.Left + 5, canvas.height * bb.Top);
				});

				document.querySelector('#analyzis').textContent = "";
				document.querySelector('#analyzis').textContent += `Faces: ${response.FaceDetails.length}\n`;
				
				const genders = response.FaceDetails
					.map(details => details.Gender.Value)
					.map(gender => gender.toUpperCase())
					.join(", ");
				document.querySelector('#analyzis').textContent += `Gender(s): ${genders}\n`;

				var numberOfSmiles = response.FaceDetails
					.filter(details => details.Smile.Value)
					.length;
				document.querySelector('#analyzis').textContent += `Number of smiles: ${numberOfSmiles}\n`;
			}
		};
	}
	
	function handleError(error) {
		const cameraDeniedContainer = document.querySelector('.camera-denied');
		cameraDeniedContainer.classList.remove('hidden');
	}
})();