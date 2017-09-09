const router = require('express').Router();
const AWS = require('aws-sdk');

router.post('/', function(req, res, next) {
	const recognition = new AWS.Rekognition({
		region: 'eu-west-1'
	});
	recognition.detectFaces({
		Attributes: ["ALL"],
		Image: {
			Bytes: req.body
		}
	}, (err, data) => {
		if (err) {
			console.log(err, err.stack);
			next(err);
		} else {
			res.send(data);
		}
	});
});

module.exports = router;
