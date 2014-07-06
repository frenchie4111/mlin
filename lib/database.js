var nano = require('nano')('http://localhost:5984');
var db;

function use( dbName, models, cb ) {
    db = nano.use( dbName );

    var count = models.length;
    function callback() {
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
    console.log( "Initializing database".green );
    if( env === null || env === "production" ) {
        console.log( "\tUsing production database".green );
        use( name+"_"+env, models, cb );
    } else if( env === "test" ) {
        console.log( "\tUsing test database".green );
        nano.db.destroy( name+"_"+env, function() {
            nano.db.create( name+"_"+env, function() {
                use( name+"_"+env, models, cb );
            } );
        } );
    } else {
        console.log( "\tInvalid database enviroment specified".red );
        return;
    }
}

exports.getDB = function( name, env, cb ) {
    return db;
}
