const experss = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = experss();
// const helmet = require('helmet');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const morgan = require('morgan');

let db;
const mongoUser = 'infinity-tactics-user';
const mongoPw = 'hikdmHG6UPY3';
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

app.use(cors());
app.use(bodyParser.json());
// app.use(helmet());
// app.use(jwtCheck);
app.use(morgan('tiny'));

MongoClient.connect(`mongodb://${mongoUser}:${mongoPw}@ds111078.mlab.com:11078/infinity-tactics`, (err, database) => {
    if (err) return console.log(err);
    db = database.db('infinity-tactics');
    app.listen(8080, () => console.log('listening on 8080'))
});

app.get('/armydata/:id', (req, res) => {
    const { id } = req.params;
    db.collection(id).find().toArray((err, result) => {
        if (err) return console.log(err);
        res.send({[id]: result});
    });
});

app.get('/tactics', (req, res) => {
    db.collection('tactics').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.send({result});
    });
});

app.post('/tactics', jwtCheck, (req, res) => {
    console.log(req.body)
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


