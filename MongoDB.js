"use strict";
/**
 * You must implement the methods in this
 * file to interact with the Mongo database.
 * 
 * Created by sdiemert on 2016-05-25.
 */

// See https://github.com/mongodb/node-mongodb-native for details.
var MongoClient = require("mongodb").MongoClient;
var DBAdapter   = require("./DBAdapter");


class MongoDB extends DBAdapter {

    constructor(u, p, db, host, port) {
        super(u, p, db, host, port);

        this._user   = u;
        this._passwd = p;
        this._dbname = db || "timerdb";
        this._host   = host || "localhost";
        this._port   = port || 27017;

        this._db = null;

    }

    /**
     * Connects to the database.
     * @param callback {function} called when the connection completes.
     *      Takes an error parameter.
     */
    connect(callback) {
        
        var that = this; 

        MongoClient.connect(
            "mongodb://" + this._host + ":" + this._port + "/" + this._dbname,
            function (err, db) {

                if (err) {
                    console.log("ERROR: Could not connect to database.");
                    that._db = null;
                    callback(err);
                } else {
                    console.log("INFO: Connected to database.");
                    that._db = db;
                    callback(null);
                }

            }
        );

    }

    /**
     * Closes the connection to the database.
     */
    close() {
        this._db.close();
    }

    /**
     * Queries the database for all tasks and returns them via the callback
     * function.
     *
     * @param callback {function} called when query finishes.
     *      Takes two parameters: 1) error parameter, 2) data returned from query.
     */
    getAllTasks(callback) {
		// Get the documents collection
		var collection = this._db.collection('documents');
	  // Find some documents
		collection.find({}).toArray(function(err, docs) {
		if(err){
			callback(err,docs);
		}
		else{
			callback(null,docs);
		}
  });
        // TODO: IMPLEMENT ME
        // See https://github.com/mongodb/node-mongodb-native for details.

    }

    /**
     * Adds a task to the database.
     *
     * @param task {object} represents the task to be added to the DB.
     * @param callback {function} called when query finishes.
     *      Takes a single error parameter.
     */
    addTask(task, callback) {
		// Get the documents collection
		var collection = this._db.collection('documents');
		task.id=(new Date()).getTime();
		 // Insert some documents
		 collection.insert(task, function(err) {
		if(err){
			callback(err);
		}
		else{
			callback(null);
		}
		});
        // TODO: IMPLEMENT ME
        // See https://github.com/mongodb/node-mongodb-native for details.

    }

    /**
     * Remove a task from the database.
     *
     * @param id {number} id of object to remove.
     * @param callback {function} called when remove is completed.
     */
    removeTask(id, callback) {
		// Get the documents collection
	  var collection = this._db.collection('documents');
	  // Insert some documents
	  collection.deleteOne(this.id, function(err, result) {
		if(err){
			callback(err);
		}else{
			callback(null);
		}
	  });

        // TODO: IMPLEMENT ME
        // See https://github.com/mongodb/node-mongodb-native for details.

    }

}

module.exports = MongoDB; 
