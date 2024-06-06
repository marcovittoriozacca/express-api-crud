require('dotenv').config();
const express = require('express');

const app = express();

const { PORT } = process.env;
const { HOST } = process.env;

app.get('/', (req, res) => {
    res.send("Hello world");
})

app.listen(PORT, HOST, () => {
    console.log(`http://${HOST}:${PORT}`);
} )
