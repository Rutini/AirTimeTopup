const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const buyVoucher = require('./controllers/buyVoucher');

app.get('/api/topup', buyVoucher);

app.listen(3000, (err) => {
    err ? console.log(err) : console.log('Listening 3000...');
});
