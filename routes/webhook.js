const express = require('express');
const fs = require('fs');
const { executeQuery } = require('../db/dbset.js');

const router = express.Router();

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

router.get('/', (req, res) => {
    let testVal = [ {ad_id: '23851065075770490',ad_name: '광고 이름', adset_id: '23851065075780490'}];
    console.log(testVal);
    console.log(testVal[0].ad_id);

    console.log('2nd chk here!!!');
    console.log(req.query['hub.mode']);
    console.log(req.query['hub.verify_token']);

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


router.post('/' , (req,res) => {
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
    if(get_form_name){
        executeQuery(formInertSql, getArr);
    }
    

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