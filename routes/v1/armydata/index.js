const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const credentials = require('../../../credentials');
const { mongoUser, mongoPw } = credentials;

let db;
MongoClient.connect(`mongodb://${mongoUser}:${mongoPw}@ds111078.mlab.com:11078/infinity-tactics`, (err, database) => {
    if (err) return console.log(err);
    db = database.db('infinity-tactics');
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.collection(id).find().toArray((err, result) => {
        if (err) return console.log(err);
        res.send({[id]: result});
    });
});

module.exports = router;