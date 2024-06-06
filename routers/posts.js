const express = require('express');
const router = express.Router();
const { store, show } = require('../controllers/posts.js');


router.post('/', store);

router.get('/:slug', show);

module.exports = router;