const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const recognize = require('./routes/recognize');

const app = express();

app.use(bodyParser.raw({
	limit: "10mb",
	type: "image/*"
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/recognize', recognize);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found');
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