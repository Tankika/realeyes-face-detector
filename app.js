var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

var AWS = require('aws-sdk');

var index = require('./routes/index');
var users = require('./routes/users');
var hike = require('./routes/hike');

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_KEY,
	region: 'eu-west-1'
});
fs.readFile('./public/images/faces.jpg', (err, data) => {
	var recognition = new AWS.Rekognition();
	recognition.detectFaces({
		Image: {
			Bytes: data
		}
	}, (err, data) => {
		if (err) console.log(err, err.stack); // an error occurred
		else     console.log(data);           // successful response
	});
});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
/*app.use('/users', users);

app.get('/hikes', hike.index);
app.post('/add_hike', hike.add_hike);*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	
	// render the error page
	res.status(err.status || 500);
	res.send('error');
});

module.exports = app;
