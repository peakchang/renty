const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { executeQuery } = require('../db/dbset.js');


const router = express.Router();



router.get('/', async (req, res, next) => {
    
    res.render('crm/crm_main', {});
})

module.exports = router;