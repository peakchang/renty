const express = require('express');
const fs = require('fs');
const { mailSender } = require('../db_lib/back_lib.js');
const axios = require('axios');
const router = express.Router();
const mysql_conn = require('../db_lib');
const { sendSms } = require('../db_lib/back_lib');
const nodemailer = require('nodemailer');

var token = process.env.TOKEN || 'token';
var received_updates = [];

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");


router.get('/', async (req, res) => {

    let byteString = `인터넷 초특가 렌티입니다. 사이트를 확인해주세요 renty.co.kr`;
    let byteLength = 0;
    //정규식으로 Byte계산
    byteLength = byteString.replace(/[\0-\x7f]:([0-\u07ff]:(.))/g, "$&$1$2").length;
    console.log(byteLength + " Bytes");

    let temp_phone = "+821021902197"
    if(temp_phone.includes('+820')){
        var get_phone = temp_phone.replace('+820', '0')
    }else{
        var get_phone = temp_phone.replace('+82', '0')
    }
    console.log(get_phone);
    await sendSms(get_phone, byteString)

    // let testSql = `SELECT * FROM application_form`;
    // let getTestVal = await mysql_conn.promise().query(testSql)
    // console.log(getTestVal);

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


router.post('/', async (req, res) => {

    const sendMsg = `인터넷 초특가 렌티입니다. 사이트를 확인해주세요 renty.co.kr`;
    var nowDateTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    let getData = req.body

    console.log(getData);
    const setData = getData[0];
    console.log(setData);

    let get_form_name = setData.form_name;
    let get_full_name = setData.full_name;
    let temp_phone = setData.phone_number;
    if (temp_phone.includes('+820')) {
        var get_phone = temp_phone.replace('+820', '0')
    } else {
        var get_phone = temp_phone.replace('+82', '0')
    }

    console.log(get_phone);
    
    if (get_form_name.includes('인터넷')) {
        var form_type_in = '인터넷'
        console.log('인터넷 포함!!');
        await sendSms(get_phone, sendMsg)
    } else if (get_form_name.includes('분양')) {
        console.log('분양 포함!!');
        var form_type_in = '분양'
    } else {
        var form_type_in = '미정'
        console.log('암것도 포함 안됨!!');
    }


    const mailSubject = `${form_type_in} 고객명 ${get_full_name} 접수되었습니다.`;
    const mailContent = `${form_type_in} 고객명 ${get_full_name} 접수되었습니다\n\ ${get_form_name} 폼에서 접수되었습니다.`;
    // mailSender.sendEmail('adpeak@naver.com',mailSubject, mailContent);
    // mailSender.sendEmail('changyong112@naver.com',mailSubject, mailContent);

    let getArr = [get_form_name, form_type_in, get_full_name, get_phone, nowDateTime];
    let formInertSql = `INSERT INTO application_form (form_name, form_type_in, mb_name, mb_phone, created_at) VALUES (?,?,?,?,?);`;

    await mysql_conn.promise().query(formInertSql, getArr)

    console.log('success!!!!!');
    res.send('zapzaapapapapapapap')
})

module.exports = router;