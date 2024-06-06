const express = require('express');
const router = express.Router();
const { store } = require('../controllers/posts.js');


router.post('/', store);


module.exports = router;