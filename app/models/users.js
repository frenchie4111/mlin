var database = require( "../../lib/database" ),
    Semaphore = require( "node-semaphore" ),
    crypto = require( "crypto" ),
    util = require( "util" ),
    tokens = require( "../../app/models/tokens" ),
    model = require( "./model" );

function User( json ) {
    this.updateFromJson( json );
}
exports.User = User;
util.inherits( User, model.Model );

function genHash( str ) {
    return crypto.createHash( "sha1" ).update( str ).digest( "hex" );
}

User.prototype.updateFromJson = function( json ) {
    this._id = json._id;
    this._rev = json._rev;
    this.username = json.username;
    this.password = json.password;
    this.email = json.email;
    this.type = "user";
};

User.prototype.authenticate = function( password, cb ) { // cb( token, error )
    var hashed_password = genHash( password );

    this.update( function( updated ) {
        if( updated.password === hashed_password ) {
            tokens.createToken( updated, function( token ) {
                cb( token, null );
            } );
        } else {
            cb( null, "Password Incorrect" );
        }
    } );
};

exports.getWithUsername = function( username, cb ) {
    database.getDB().view( "users", "by_username", { key: username }, function( err, body ) {
        if( body.rows.length == 1 ) {
            user = new User( body.rows[0].value );
            cb( user );
        } else {
            cb( null, "Username not found" );
        }
    } );
};

exports.newUser = function( userJson, password ) {
    user = new User( userJson );
    user.password = genHash( password );
    return user;
};

exports.createViews = function( db, cb ) {
    db.insert( {
        "views": {
            "by_username": {
                "map" : function( doc ) {
                    if( doc.type === "user" )
                        emit( doc.username, doc );
                }
            }
        }
    }, "_design/users", function( error, response ) {
        cb();
    } );
};
