var restify = require( "restify" ),
	colors = require( "colors" ),
	database = require( "./lib/database" );

// Controller imports
var controllers = [
	require( "./app/controllers/users_controller" )
];

// Models imports
var models = [
	require( "./app/models/users" ),
	require( "./app/models/tokens" )
];

var server = restify.createServer();
server.use(restify.bodyParser({ mapParams: false }));

server.get('/', function(req, res, next) {
	//res.send("Hello World");
	next( new restify.errors.NotAuthorizedError( { message: "test" } ) );
}, function(req, res, next) {
	res.send("Second time");
});

server.listen(1337, function() {
	console.log("Now listening on port 1337".green);

	database.initializeDatabase( "mlin", "test", models, function() {
		console.log( "\tDatabase initialize finished".green )
	} );

	// Controllers routing
	controllers.forEach(function( controller ) {
		controller.setRoutes( server );
	} );
});
