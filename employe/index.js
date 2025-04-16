const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/employe', require('./routes'));

app.listen(3002, () => console.log('✅ Employe service running on port 3002'));

