const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/utilisateur', require('./routes'));


app.listen(3001, () => console.log('✅ Utilisateur service running on port 3001'));
