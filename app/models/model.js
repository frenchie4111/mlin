var database = require( "../../lib/database" ),
	Semaphore = require( "node-semaphore" ),
	winston = require( "winston" );
// model.js: Generic model for others to extend

function Model( json ) {

}
exports.Model = Model;

var semas = {};

function getSema( id ) { // One semaphore per model instance
    if( semas[id] === null ) {
        semas[ id ] = new Semaphore( 1 );
    }
    return semas[ id ];
}
exports.getSema = getSema;

Model.prototype.updateFromJson = function( json ) {
    throw new Error( "Inheriting class must implement updateFromJson" );
};

Model.prototype.update = function( cb ) {
    var self = this;
    database.getDB().get( this._id, function( err, body ) {
        self.updateFromJson( body );

        if( cb ) {
            cb( self, err );
        }
    } );
};

Model.prototype.commit = function( cb ) {
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

Model.prototype.transact = function( changes, cb ) {
    var self = this;
    model.getSema( this._id ).acquire( function() {
        self.update( function( updated ) {
            updated = changes( updated );

            self.commit( function( err, body ) {
                model.getSema( self._id ).release();
                if( cb ) {
                    cb( body, err );
                }
            } );
        } );
    } );
};