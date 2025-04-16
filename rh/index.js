const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/rh', require('./routes'));

app.listen(3003, () => console.log('✅ RH service running on port 3003'));
