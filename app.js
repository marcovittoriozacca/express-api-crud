require('dotenv').config();
const express = require('express');
const posts = require('./routers/posts.js');
const notFoundHandler = require('./middlewares/notFoundHandler.js');
const errorHandler = require('./middlewares/errorHandler.js');
const app = express();

const { PORT } = process.env;
const { HOST } = process.env;

app.use(express.json());

app.use("/posts", posts);

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(PORT, HOST, () => {
    console.log(`http://${HOST}:${PORT}`);
} )
