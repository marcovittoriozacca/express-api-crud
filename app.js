require('dotenv').config();
const express = require('express');
const posts = require('./routers/posts.js');
const app = express();

const { PORT } = process.env;
const { HOST } = process.env;

app.use(express.json());

app.use("/posts", posts);

app.listen(PORT, HOST, () => {
    console.log(`http://${HOST}:${PORT}`);
} )
