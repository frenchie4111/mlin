var database = require( "../../lib/database" ),
    Semaphore = require( "node-semaphore" ),
    crypto = require( "crypto" ),
    util = require( "util" ),
    tokens = require( "../../app/models/tokens" );

function User( json ) {
    this.updateFromJson( json );
}
exports.User = User;

var semas = {};
var sema = Semaphore( 1 );

function getSema( id ) { // One semaphore per user
    if( semas[id] === null ) {
        semas[ id ] = new Semaphore( 1 );
    }
    return semas[ id ];
}


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

User.prototype.update = function( cb ) {
    var self = this;
    database.getDB().get( this._id, function( err, body ) {
        self.updateFromJson( body );

        if( cb ) {
            cb( self, err );
        }
    } );
};

User.prototype.commit = function( cb ) {
    var self = this;
    if( this._id !== null ) {
        database.getDB().insert( this, this._id, function( err, body ) {
            cb( body, err );
        } );
    } else {
        database.getDB().insert( this, function( err, body ) {
            cb( body, err );
        } );
    }
};

User.prototype.transact = function( changes, cb ) {
    var self = this;
    getSema( this._id ).acquire( function() {
        self.update( function( updated ) {
            updated = changes( updated );

            self.commit( function( err, body ) {
                getSema( self._id ).release();
                if( cb ) {
                    cb( body, err );
                }
            } );
        } );
    } );
};

User.prototype.newToken = function( cb ) {
    var token = genHash( this + Date.now() + "michael9" );
    this.transact( function( updated ) {
        updated.tokens.push( token );
        return updated;
    }, function() {
        cb( token );
    } );
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
