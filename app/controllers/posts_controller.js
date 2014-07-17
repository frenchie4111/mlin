var authenticationCheck = require( './users_controller' ).authenticationCheck;

function posts( req, res, next ) {
    res.send( { hi: 'hi there' } );
}

function createPost( req, res, next ) {

}

exports.setRoutes = function( server ) {
	var post_endpoint = '/posts';

    server.get( post_endpoint, posts );
    server.post( post_endpoint, authenticationCheck, createPost );
};