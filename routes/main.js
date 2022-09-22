const express = require('express');
const { executeQuery } = require('../db/dbset.js');
const router = express.Router();

const axios = require('axios');

const moment = require('moment');
const { render } = require('nunjucks');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");




router.get('/', (req, res, next) => {
    try {
        console.log(req.user.nick);
        userInfo = { 'user': req.user, 'req': req };
    } catch {
        userInfo = {}
    }

    res.render('renty/renty_main', { userInfo });
})


router.get('/reviewconfig', (req, res, next) => {
    res.render('review_config')
})

router.post('/reviewconfig', (req, res, next) => {
    res.render('review_config')
})

router.get('/form', (req,res, next) => {
    console.log(req.query);

    const setTong = req.query.t;
    if(setTong == 'sk'){
        var rapidArr = ['100M', '500M', '1G'];
        var chnArr = ['이코노미TV', '스탠다드TV', 'BTV ALL', '인터넷 단독'];
    }else if(setTong == 'kt'){
        var rapidArr = ['100M', '500M', '1G'];
        var chnArr = ['베이직TV', '라이트TV', '에센스TV', '인터넷 단독'];
    }else if(setTong == 'lg'){
        var rapidArr = ['100M', '500M', '1G'];
        var chnArr = ['베이직TV', '프리미엄TV', '프리미엄디즈니TV', '인터넷 단독'];
    }else if(setTong == 'hello'){
        var rapidArr = ['160M', '500M', '1G'];
        var chnArr = ['이코노미TV', '뉴베이직TV', '인터넷 단독'];
    }else if(setTong == 'sky'){
        var rapidArr = ['100M', '200M', '500M', '1G'];
        var chnArr = ['SKY ALL', 'SKY 포인트', '인터넷 단독'];
    }

    const set_tong = {chk: req.query.t, rapidArr, chnArr}


    console.log('진입!!!');
    res.render('renty/renty_form', { set_tong });
})

router.get('/success', (req,res, next) => {
    console.log('진입!!! 성공!!!!!!!!!!!!!!!!!!');
    res.render('renty/renty_form_success', {});
})


router.post('/success', async (req,res, next) => {
    console.log('진입!!! 성공!!!!!!!!!!!!!!!!!!');
    console.log(req.body);

    var nowDateTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    const getVal = req.body
    let mb_phone = getVal.mb_phone1 + getVal.mb_phone2 + getVal.mb_phone3;
    let mb_regnum = getVal.mb_regnum1 + '-' + getVal.mb_regnum2;
    let mb_email = getVal.mb_email1 + '@' + getVal.mb_email2;
    let mb_address = getVal.mb_address_zip + ' ' + getVal.mb_address1 + ' ' + getVal.mb_address2 + ' ' + getVal.mb_address3;
    let mb_bank_regnum = getVal.mb_bank_regnum1 + '-' + getVal.mb_bank_regnum2;
    let mb_card_validity = getVal.mb_card_validity1 + "년 " + getVal.mb_card_validity2 + "월"

    console.log(mb_phone);
    console.log(mb_regnum);
    console.log(mb_email);
    console.log(mb_address);
    console.log(mb_bank_regnum);
    console.log(mb_card_validity);

    let valueArr = [getVal.itn_item, getVal.tv_item, getVal.item_other, getVal.mb_name, mb_phone, getVal.mb_phone_cpn, mb_regnum, mb_email, mb_address, getVal.mb_pay_type, getVal.mb_bank_cpn, getVal.mb_bank_accountnum, getVal.mb_bank_name, mb_bank_regnum, getVal.mb_card_cpn, getVal.mb_card_cardnum, getVal.mb_card_name, mb_card_validity, getVal.mb_gift_bankname, getVal.mb_gift_accountnum, getVal.mb_gift_name, nowDateTime]

    let formInertSql = `INSERT INTO application_form (itn_item,tv_item,item_other,mb_name,mb_phone,mb_phone_cpn,mb_regnum,mb_email,mb_address,mb_pay_type,mb_bank_cpn,mb_bank_accountnum,mb_bank_name,mb_bank_regnum,mb_card_cpn,mb_card_cardnum,mb_card_name,mb_card_validity,mb_gift_bankname,mb_gift_accountnum,mb_gift_name,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;

    if(getVal.itn_item){
        await executeQuery(formInertSql, valueArr);
    }
    

    res.render('renty/renty_form_success', {});
})


router.get('/review', (req,res, next) => {
    console.log('진입!!!');
    res.render('renty/renty_review', {});
})


router.get('/policy', (req, res, next) => {
    res.render('renty/renty_policy');
})

router.post('/policy', (req, res, next) => {
    res.render('renty/renty_policy');
})


/** 알리고 문자 발송  **/
const sendSms = ({ receivers, message }) => {
    return axios.post('https://apis.aligo.in/send/', null, {
        params: {
            key: '2wyw9p9g4zzqoruwmhewiz0grwhu2w7v',
            user_id: 'adpeak',
            sender: '010-7907-1127',
            receiver: '010-4478-1127',
            msg: message,
            // 테스트모드
            testmode_yn: 'Y'
        },
    }).then((res) => res.data).catch(err => {
        console.log('err', err);
    });
}

router.get('/aligosend', (req, res, next) => {
    
    let receiveArr = ['010-4478-1127', '010-2190-2197']
    let message = "테스트 메세지"
    sendSms({receiveArr, message});
    res.send('알리고 메세지 발송 함!!!')
})

module.exports = router;