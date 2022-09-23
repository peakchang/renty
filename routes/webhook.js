const express = require('express');
const fs = require('fs');
const { executeQuery } = require('../db_lib/dbset.js');
const axios = require('axios');
const router = express.Router();
const mysql_conn = require('../db_lib');
const { sendSms }  = require('../db_lib/back_lib');


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

    console.log('아니 씨발탱 안되는거야 뭐야??????????????????');
    const setData = getData[0];
    let get_form_name = setData.form_name;
    let get_full_name = setData.full_name;
    let temp_phone = setData.phone_number;
    if(temp_phone.includes('+820')){
        var get_phone = temp_phone.replace('+820', '0')
    }else{
        var get_phone = temp_phone.replace('+82', '0')
    }

    console.log(get_phone);
    console.log(get_form_name);
    console.log(get_full_name);
    console.log(get_phone);

    // if(get_form_name.includes('인터넷')){
    //     var form_type_in = '인터넷'
    //     await sendSms(get_phone, '테스트 메세지 입니다.')
    // }else if(get_form_name.includes('분양')){
    //     var form_type_in = '분양'
    // }else{
    //     var form_type_in = '미정'
    // }

    // let getArr = [get_form_name, form_type_in, get_full_name, get_phone, nowDateTime];
    // let formInertSql = `INSERT INTO application_form (form_name, form_type_in, mb_name, mb_phone, created_at) VALUES (?,?,?,?);`;

    // console.log(formInertSql);

    // await mysql_conn.promise().query(formInertSql, getArr)

    console.log('success!!!!!');
    res.send('zapzaapapapapapapap')
})

module.exports = router;