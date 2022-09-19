const express = require('express');
const { executeQuery } = require('../db/dbset.js');

const router = express.Router();

router.get('/', (req, res, next) => {

    
    
    console.log('*************************************************************************************************');
    console.log(req.user);
    try {
        console.log(req.user.nick);
        userInfo = { 'user': req.user, 'req': req };
    } catch {
        userInfo = {}
    }

    res.render('renty/renty_main', { userInfo });
})

router.post('/', (req, res, next) => {
    console.log('진짜 여기로 오는걸까나~~~~~~~~~????????? 궁금하다요~~~~~~~');
    console.log(req.body);
    res.send(200);
})




router.get('/form', (req,res, next) => {
    console.log('진입!!!');
    res.render('renty/renty_form', {});
})

router.get('/policy', (req, res, next) => {
    res.render('renty/renty_policy');
})

router.post('/policy', (req, res, next) => {
    res.render('renty/renty_policy');
})

module.exports = router;