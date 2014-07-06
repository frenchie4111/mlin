var restify = require( "restify" ),
    colors = require( "colors" ),
    database = require( "./database" );

// Controller imports
var controllers = [
    require( "../app/controllers/users_controller" )
];

// Models imports
var models = [
    require( "../app/models/users" ),
    require( "../app/models/tokens" )
];

exports.start = function( port, env, cb ) {
    var port = port || 1337;
    var env = env || "test";

    var server = restify.createServer();
    server.use(restify.bodyParser({ mapParams: false }));

    server.listen(1337, function() {
        console.log("Now listening on port 1337".green);

        // Controllers routing
        controllers.forEach(function( controller ) {
            controller.setRoutes( server );
        } );

        database.initializeDatabase( "mlin", env, models, function() {
            console.log( "\tDatabase initialize finished".green );
            cb();
        } );
    });
}
