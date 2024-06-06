const express = require('express');
const router = express.Router();
const { store, show, index } = require('../controllers/posts.js');


router.post('/', store);

router.get('/', index);
router.get('/:slug', show);

module.exports = router;