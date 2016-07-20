"use strict";

// See https://github.com/mongodb/node-mongodb-native for details.
//account should be {name:"", numberOfGames:"", win:"", lost:""}
var MongoClient = require("mongodb").MongoClient;


class MongoDB{

    constructor(u, p, db, host, port) {

        this._user   = u;
        this._passwd = p;
        this._dbname = db;
        this._host   = host || "localhost";
        this._port   = port || 27017;
        this._db = db;
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
    getAllAccounts(callback) {

        var collection = this._db.collection("accounts");

        collection.find({}).toArray(function(err, data){
            if(err){
                callback(err, null);
            }else{
                callback(null, data);
            }
        });

    }

    /**
     * Adds a account to the database.
     *
     * @param account {object} represents the account to be added to the DB.
     * @param callback {function} called when query finishes.
     *      Takes a single error parameter.
     */
    addAccount(account, callback) {

        //task.id = (new Date()).getTime();
        var collection = this._db.collection("accounts");
        collection.insertOne(account, function(err, result){
            if(err) callback(err);
            else callback(null);
        });

    }

    updateAccount(username, win, callback) {


        var collection = this._db.collection("accounts");
        collection.update({username:username},{$win: {win: win+1}}, function(err, result){
            if(err) callback(err);
            else callback(null);
        });

    }
    /**
     * Remove a task from the database.
     *
     * @param id {number} id of object to remove.
     * @param callback {function} called when remove is completed.
     */
    removeAccount(username, callback) {

        var collection = this._db.collection("accounts");

        collection.deleteOne({username : username}, function(err, data){
            if(err || data.length !== 0) callback(err, null);
            else callback(null, data[0]);
        });

    }

}

module.exports = MongoDB;
