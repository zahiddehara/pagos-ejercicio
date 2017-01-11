var express = require('express');
var path = require('path');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var ObjectID = mongodb.ObjectID;

var url = 'mongodb://localhost:27017/pagos-ejercicio';
var TRANSFERS_COLLECTION = 'transfers';

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var db;

mongodb.MongoClient.connect(url, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    db = database;
    console.log('database ready');

    var server = app.listen(process.env.PORT || 8080, function () {
        var port = server.address().port;
        console.log('app running on: ', port);
    });
});

function handleError(res, reason, message, code) {
    console.log('error: ', reason);
    console.log('message: ', message);
    res.status(code || 500).json({ "error": message });
}

app.get('/transfers', function (req, res) {
    db.collection(TRANSFERS_COLLECTION).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "We could not get the transfers.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post('/transfers', function (req, res) {
    var newTransfer = req.body;
    newTransfer.createDate = new Date();

    if (!(req.body.clientName)) {
        handleError(res, "Campo Invalido", "El cliente es requerido.", 400);
    } else {
        db.collection(TRANSFERS_COLLECTION).insertOne(newTransfer, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Can not create transfer.");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    }
});

app.get("/transfers/:id", function (req, res) {
    db.collection(TRANSFERS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Error getting the transfer");
        } else {
            res.status(200).json(doc);
        }
    });
});

app.delete("/transfers/:id", function (req, res) {
    db.collection(TRANSFERS_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
        if (err) {
            handleError(res, err.message, "Failed to delete the transfer");
        } else {
            res.status(204).end();
        }
    });
});