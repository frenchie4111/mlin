var nano = require('nano')('http://localhost:5984'),
    winston = require( "winston" );
var db;

function use( dbName, models, cb ) {
    db = nano.use( dbName );

    var count = models.length;
    var callback = function() {
        count -= 1;
        if( count <= 0 ) {
            cb( db );
        }
    }

    models.forEach( function( model ) {
        model.createViews( db, callback );
    } );
}

exports.initializeDatabase = function( name, env, models, cb ) {
    winston.info( "Initializing database".green );
    if( env === null || env === "production" ) {
        winston.info( "Using production database".green );
        use( name+"_"+env, models, cb );
    } else if( env === "test" ) {
        winston.info( "Using test database".green );
        nano.db.destroy( name+"_"+env, function() {
            nano.db.create( name+"_"+env, function() {
                use( name+"_"+env, models, cb );
            } );
        } );
    } else {
        winston.error( "Invalid database enviroment specified".red );
        return;
    }
}

exports.getDB = function( name, env, cb ) {
    return db;
}
