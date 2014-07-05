var restify = require( 'restify' ),
	colors = require( 'colors' );

var server = restify.createServer();

server.get('/', function(req, res, next) {
	//res.send("Hello World");
	next( new restify.errors.NotAuthorizedError( { message: "test" } ) );
}, function(req, res, next) {
	res.send("Second time");
});

server.listen(1337, function() {
	console.log("Now listening on port 1337".green);
});
