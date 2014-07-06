var database = require( "../../lib/database" ),
    util = require( "util" ),
    users = require( "../../app/models/users" );

function Token() {

}
exports.Token = Token;

exports.createToken = function( user, cb ) {
    var token = "TOKEN1";
    database.getDB().insert( {
        type: "token",
        user: user._id,
    }, function( err, body ) {
        cb( body.id );
    } );
}

exports.userForToken = function( token, cb ) {
    database.getDB().get( token, function( err, body ) {
        if( !err ) {
            database.getDB().get( body.user, function( user_err, user_body ) {
                if( !user_err ) {
                    cb( new users.User( user_body ), null );
                } else {
                    cb( null, "No User for Userid" );
                }
            } )
        } else {
            cb( null, "No User for Token" );
        }
    } );
}

exports.createViews = function( db, cb ) {
    db.insert( {
        "views": {
            "tokens_for_user": {
                "map": function( doc ) {
                    if( doc.type === "user" ) {
                        emit( [doc._id, 0], doc );
                    } else if( doc.type === "token" ) {
                        emit( [doc.user, 1], doc );
                    }
                },
                "reduce": function( keys, values ) {
                    var user = { _id: null, tokens: [] };
                    for( var value in values ) {
                        var cur = values[value];
                        if( cur.type === "user" ) {
                            user._id = cur._id;
                        }
                        if( cur.type === "token" ) {
                            user.tokens.push( cur._id );
                        }
                    }
                    return user;
                }
            }
        }
    }, "_design/tokens" )
}
