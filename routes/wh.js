const express = require('express');
const fs = require('fs');
const { executeQuery } = require('../db_lib/dbset.js');
const axios = require('axios');
const router = express.Router();
const mysql_conn = require('../db_lib');
const { sendSms } = require('../db_lib/back_lib');


var token = process.env.TOKEN || 'token';
var received_updates = [];

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");


router.get('/', (req, res) => {
    if (
        req.query['hub.mode'] == 'subscribe' &&
        req.query['hub.verify_token'] == token
    ) {
        console.log('3rd chk here!!! - is real true??');
        res.send(req.query['hub.challenge']);
    } else {
        console.log('3rd chk here!!! - is real false??');
        res.send('웹 훅 인증 대기 페이지 입니다!!!')
    }
    // res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
});


router.post('/' , async (req,res) => {
    console.log('4th chk here!!!');
    let getData = req.body
    console.log('Facebook request body:', getData);
    console.log('request header X-Hub-Signature validated');
    console.log(getData.entry[0].changes);
    setData = JSON.stringify(getData)
    const inserSql = "INSERT INTO application_form (form_memo_1) VALUES (?)";
    const setArr = [setData]
    await sql_con.promise().query(inserSql, setArr)
    // Process the Facebook updates here111111111111111111
    received_updates.unshift(req.body);
    res.sendStatus(200);
})

module.exports = router;