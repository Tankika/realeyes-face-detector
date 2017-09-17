(function () {
	'use strict';

	const videoElement = document.querySelector('video#video');
	const canvasElement = document.querySelector('canvas#canvas');

	Realeyesit.EnvironmentalDetectionAPI.start(environmentalDetectionCallback);
	
	function environmentalDetectionCallback(result) {
		window.hideElement('#detecting');

		if(!result.checksPassed) {
			window.showElement('#non-capable');
			return;
		}

		window.showElement('#capable');
		navigator.mediaDevices.getUserMedia({
			video: true,
			audio: false
		})
		.then(handleGetUserMediaSuccess)
		.catch(handleGetUserMediaError);
	}
	
	function handleGetUserMediaSuccess(stream) {
		window.showElement('.camera-allowed');

		videoElement.srcObject = stream;
		
		const captureButton = document.querySelector('button#captureBtn');
		captureButton.onclick = captureButtonClickHandler;
	}

	function captureButtonClickHandler() {
		captureImage();
		sendFaceDetectionRequest();
	}

	function captureImage() {
		const canvasContext = canvasElement.getContext('2d');

		canvasContext.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);		
	}

	function sendFaceDetectionRequest() {
		const detectFacesRequest = new XMLHttpRequest();
		detectFacesRequest.onreadystatechange = detectFacesReadyListener;
		detectFacesRequest.open("POST", "/detectFaces");

		canvasElement.toBlob(
			blob => detectFacesRequest.send(blob),
			"image/jpeg"
		);
	}
	
	function detectFacesReadyListener (event) {
		const detectFacesRequest = event.target;

		if(detectFacesRequest.readyState !== XMLHttpRequest.DONE) {
			return;
		}

		if(400 <= detectFacesRequest.status) {
			handleDetectFacesError(detectFacesRequest);
			return;
		}

		handleDetectFacesSuccess(detectFacesRequest);
	}

	function handleDetectFacesSuccess(detectFacesRequest) {
		const response = JSON.parse(detectFacesRequest.response);

		window.showElement('.capture');

		drawFaceBoundingBoxes(response.FaceDetails);
		printAnalyzis(response.FaceDetails);
	}

	function drawFaceBoundingBoxes(faceDetails) {
		const canvasContext = canvasElement.getContext('2d');
		canvasContext.strokeStyle = 'green';
		canvasContext.lineWidth = 2.5;
		canvasContext.fillStyle = 'white';
		canvasContext.font = '14px';

		faceDetails.forEach(faceDetail => {
			drawBoundingBox(faceDetail);
			drawMostProbableEmotion(faceDetail);
		});
	}

	function drawBoundingBox(faceDetail) {
		const canvasContext = canvasElement.getContext('2d');
		canvasContext.strokeRect(
			canvasElement.width * faceDetail.BoundingBox.Left,
			canvasElement.height * faceDetail.BoundingBox.Top,
			canvasElement.width * faceDetail.BoundingBox.Width,
			canvasElement.height* faceDetail.BoundingBox.Height
		);
	}
	
	function drawMostProbableEmotion(faceDetail) {
		const canvasContext = canvasElement.getContext('2d');

		const mostProbableEmotion = _(faceDetail.Emotions).maxBy('Confidence');
		canvasContext.fillText(
				`${mostProbableEmotion.Type}: ${mostProbableEmotion.Confidence.toPrecision(3)}%`, // eg: SAD, 98.3%
				canvasElement.width * faceDetail.BoundingBox.Left + 5,
				canvasElement.height * faceDetail.BoundingBox.Top);
	}

	function printAnalyzis(faceDetails) {
		const analyzisOutputContainer = document.querySelector('#analyzis');

		analyzisOutputContainer.textContent = "";
		analyzisOutputContainer.textContent += `Faces: ${faceDetails.length}\n`;
		analyzisOutputContainer.textContent += getGendersAnalyzisText(faceDetails);
		analyzisOutputContainer.textContent += getSmilesAnalyzisText(faceDetails);
	}

	function getGendersAnalyzisText(faceDetails) {
		const genders = faceDetails
			.map(details => details.Gender.Value)
			.map(gender => gender.toUpperCase())
			.join(", ");

		return `Gender(s): ${genders}\n`;
	}

	function getSmilesAnalyzisText(faceDetails) {
		const numberOfSmiles = faceDetails
			.filter(details => details.Smile.Value)
			.length;
		
		return `Number of smiles: ${numberOfSmiles}\n`;
	}
	
	function handleGetUserMediaError(error) {
		console.error(error);
		window.showElement('.camera-denied');
	}
	
	function handleDetectFacesError(detectFacesRequest) {
		console.error(detectFacesRequest);
		window.showElement('#analyzisError');
	}

})();