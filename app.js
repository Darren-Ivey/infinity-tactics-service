const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.use('/v1',
    express.Router()
        .use('/tactics', require('./routes/v1/tactics'))
        .use('/armydata', require('./routes/v1/armydata'))
);

app.listen(8080, () => console.log('listening on 8080'))
