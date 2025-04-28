const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/assurance', require('./routes'));

app.listen(3005, () => console.log('✅ Assurance service running on port 3005'));
