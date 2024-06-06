const express = require('express');
const router = express.Router();
const { store, show, index, update } = require('../controllers/posts.js');


router.post('/', store);

router.get('/', index);
router.get('/:slug', show);

router.put('/:slug', update);

module.exports = router;