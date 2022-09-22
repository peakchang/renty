const express = require('express');
const fs = require('fs');
const { executeQuery } = require('../db/dbset.js');
const axios = require('axios');
const router = express.Router();
const mysql_conn = require('../db');

/** 알리고 문자 발송  **/
const sendSms = (receivers, message) => {
    return axios.post('https://apis.aligo.in/send/', null, {
        params: {
            key: process.env.ALIGOKEY,
            user_id: process.env.ALIGOID,
            sender: process.env.SENDER,
            receiver: receivers.join(','),
            msg: message,
            // 테스트모드
            testmode_yn: 'Y'
        },
    }).then((res) => res.data).catch(err => {
        console.log('err', err);
    });
}

var token = process.env.TOKEN || 'token';
var received_updates = [];




const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.post('/zap/' , (req,res) => {
    console.log(req.body);
    res.send('웹훅 수신!')
});

router.post('/zap/' , (req,res) => {
    res.send('웹훅 GET PAGE!!!!!')
});

router.get('/test', async (req, res) => {
    res.send('sfljsildfjsldjif')
})

router.get('/', async (req, res) => {


    // let testVal = [ {ad_id: '23851065075770490',ad_name: '광고 이름', adset_id: '23851065075780490'}];
    // console.log(testVal);
    // console.log(testVal[0].ad_id);

    // console.log('2nd chk here!!!');
    // console.log(req.query['hub.mode']);
    // console.log(req.query['hub.verify_token']);

    let testSql = `SELECT * FROM application_form`;
    let getTestVal = await executeQuery(testSql);
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
    // console.log(JSON.stringify(received_updates, null, 2));
    // res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
    res.send(`<form method="post"><button type=submit>asdfasdf</button></form>`)
});


router.post('/' , async (req,res) => {
    var nowDateTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    let getData = req.body
    console.log('Zap request body:', getData);
    setData = getData[0];
    let get_form_name = setData.form_name;
    let get_full_name = setData.full_name;
    let temp_phone = setData.phone_number;
    let get_phone = temp_phone.replace('+82', '0')

    let getArr = [get_form_name,get_full_name,get_phone,nowDateTime];
    let formInertSql = `INSERT INTO application_form (form_name,mb_name,mb_phone,created_at) VALUES (?,?,?,?);`;

    await mysql_conn.promise().query(formInertSql, getArr)
    
    console.log('success!!!!!');
    res.send('zapzaapapapapapapap')
})




// router.post('/facebook', async (req, res) => {
//     console.log('4th chk here!!!');
//     let getData = req.body
//     console.log('Facebook request body:', getData);
//     console.log('request header X-Hub-Signature validated');
//     console.log(getData.entry[0].changes);
//     setData = JSON.stringify(getData)
//     console.log(setData);
//     try {
//         await Webhookdata.create({
//             webhookdata : setData
//         });
//     } catch (error) {
//         console.log('에러가 났습니다요~~~~~~~~');
//     }
    
//     // Process the Facebook updates here111111111111111111
//     received_updates.unshift(req.body);
//     res.sendStatus(200);
// });

// router.post('/instagram', (req, res) => {
//     console.log('Instagram request body:');
//     console.log(req.body);
//     // Process the Instagram updates here
//     // let getData = JSON.stringify(req.body)
//     // await Webhookdata.create({
//     //     webhookdata : getData
//     // });
//     received_updates.unshift(req.body);
//     res.sendStatus(200);
// });

// router.post('/', (req, res) => {
//     console.log('1st chk here!!!');
//     for (const outPut in req) {
//         console.log(`값 : ${outPut}`);
//     }
//     res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
// });



// router.get(['/facebook', '/instagram'], (req, res) => {
//     console.log('2nd chk here!!!');
//     console.log(req.query['hub.mode']);
//     console.log(req.query['hub.verify_token']);

//     if (
//         req.query['hub.mode'] == 'subscribe' &&
//         req.query['hub.verify_token'] == token
//     ) {
//         console.log('3rd chk here!!! - is real true??');
//         res.send(req.query['hub.challenge']);
//     } else {
//         console.log('3rd chk here!!! - is real false??');
//         res.sendStatus(400);
//     }
// });


// router.get('/', async (req, res, next) => {
//     let wh_datas = await Webhookdata.findAll();
//     console.log(wh_datas);
//     res.render('webhookdata', {wh_datas})
// })

// router.post('/', async (req, res, next) => {
//     console.log(req.body);
//     let receive_json = req.body;
//     let string_json = JSON.stringify(receive_json);
//     console.log(string_json);
//     await Webhookdata.create({webhookdata: string_json})

//     console.log('--------------------------');
//     let wh_datas = await Webhookdata.findAll();
//     console.log(wh_datas);
//     res.render('webhookdata', {wh_datas})
// })


module.exports = router;