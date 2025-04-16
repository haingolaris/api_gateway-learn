const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/notification', require('./routes'));

app.listen(3004, () => console.log('✅ Notification service running on port 3004'));
