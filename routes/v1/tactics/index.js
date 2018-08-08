const express = require('express');
const router = express.Router();

const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const MongoClient = require('mongodb').MongoClient;
const credentials = require('../../../credentials');
const { mongoUser, mongoPw } = credentials;

let db;
MongoClient.connect(`mongodb://${mongoUser}:${mongoPw}@ds111078.mlab.com:11078/infinity-tactics`, (err, database) => {
    if (err) return console.log(err);
    db = database.db('infinity-tactics');
});

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://infinity-tactics.eu.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://infinity-tactics.com/api',
    issuer: "https://infinity-tactics.eu.auth0.com/",
    algorithms: ['RS256']
});

router.get('/', (req, res) => {
    db.collection('tactics').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.send({result});
    });
});

router.use(jwtCheck).post('/', (req, res) => {
    db.collection('tactics').insert(req.body, (err, result) => {
        if (err) {
            return console.log(err)
        } else {
            const tactic = {
                tactic: result.ops[0].tactic,
                id: result.ops[0]._id
            };
            return res.status(200).send(tactic);
        }
    })
});

module.exports = router;