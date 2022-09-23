const express = require('express');
const fs = require('fs');
const { executeQuery } = require('../db_lib/dbset.js');
const axios = require('axios');
const router = express.Router();
const mysql_conn = require('../db_lib');



var token = process.env.TOKEN || 'token';
var received_updates = [];

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");


router.get('/', async (req, res) => {

    let testSql = `SELECT * FROM application_form`;
    let getTestVal = await mysql_conn.promise().query(testSql)
    console.log(getTestVal);

    if (
        req.query['hub.mode'] == 'subscribe' &&
        req.query['hub.verify_token'] == token
    ) {
        console.log('3rd chk here!!! - is real true??');
        res.send(req.query['hub.challenge']);
    } else {
        console.log('3rd chk here!!! - is real false??');
    }
    res.send(`<form method="post"><button type=submit>asdfasdf</button></form>`)
});


router.post('/' , async (req,res) => {
    var nowDateTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    let getData = req.body

    console.log(getData);
    console.log('아니 씨발탱 안되는거야 뭐야??????????????????');
    // const setData = getData[0];
    // console.log(setData);
    // let get_form_name = setData.form_name;
    // let get_full_name = setData.full_name;
    // let temp_phone_temp = setData.phone_number;
    // let temp_phone = temp_phone_temp.replace('+820', '0')
    // let get_phone = temp_phone.replace('+82', '0')
    // console.log(get_form_name);
    // console.log(get_full_name);
    // console.log(get_phone);

    // let getArr = [get_form_name,get_full_name,get_phone,nowDateTime];
    // let formInertSql = `INSERT INTO application_form (form_name,mb_name,mb_phone,created_at) VALUES (?,?,?,?);`;

    // await mysql_conn.promise().query(formInertSql, getArr)

    console.log('success!!!!!');
    res.send('zapzaapapapapapapap')
})

module.exports = router;