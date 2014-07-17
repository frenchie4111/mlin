function posts( req, res, next ) {
    res.send( { hi: "hi there" } );
}

exports.setRoutes = function( server ) {
    server.get( "/posts", posts );
};