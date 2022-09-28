const express = require('express');
const router = express.Router();
const mysql_conn = require('../db_lib');
const axios = require('axios');
const path = require('path');

const { randomChracter, mailSender } = require('../db_lib/back_lib.js');

const multer = require('multer');
const fs = require('fs');
const nodemailer = require('nodemailer');

const moment = require('moment');
const { render } = require('nunjucks');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");


router.get('/test', (req, res, next) => {
    var testStr = "ijijij0123";
    const text = `abcde ascde`;
    let setVal = text.match(/[\w]*/g);
    console.log(setVal);
    res.send('ladjfliajsdfiajsldifj')
})


router.get('/', async (req, res, next) => {
    // console.log(req.session);
    // console.log(req.cookies);
    // console.log(req.user);
    // console.log(req.isAuthenticated());

    const reviewSql = `SELECT * FROM reviews ORDER BY id DESC LIMIT 8;`;
    const reviewDatas = await mysql_conn.promise().query(reviewSql);
    const all_reviews = reviewDatas[0]
    // console.log(all_reviews);

    for await (const [i, review] of all_reviews.entries()) {
        const thumbReg = /\<img\ssrc\=\"[\w\/\.]+[^\"]/;
        if (thumbReg.exec(review.rv_content) == null) {
            review.rv_thumb = ""
        } else {
            var tempThumb = thumbReg.exec(review.rv_content);
            var tempThumb = tempThumb[0].replace(/\<img\ssrc\=\"/g, "");
            review.rv_thumb = tempThumb
        }


        // 날짜 형식 변경
        let getDate = review.rv_created_at.getDate()
        let getMonth = review.rv_created_at.getMonth() + 1
        let getFullYear = review.rv_created_at.getFullYear()
        let setDate = getFullYear + "." + getMonth + "." + getDate;
        review.rv_created_at = setDate

        // 이름 가운데 가리기
        let firstStr = review.rv_name.charAt(0);
        let lastStr = review.rv_name.charAt(review.rv_name.length - 1);
        let setName = firstStr + '*' + lastStr;
        review.rv_name = setName

        // P태그, 이미지 태그 빼기
        var myRegExp1 = /<IMG(.*?)>/gi;
        var mtRegExp2 = /[\<p\>\/]/g;
        review.rv_content = review.rv_content.replace(myRegExp1, '');
        review.rv_content = review.rv_content.replace(mtRegExp2, ' ');
    }

    res.render('renty/renty_main', { all_reviews });
})

router.get('/form/:id', (req, res, next) => {
    console.log(req.params);

    const setTong = req.params.id;
    console.log(setTong);
    if (setTong == 'sk') {
        var rapidArr = ['100M', '500M', '1G'];
        var chnArr = ['이코노미TV', '스탠다드TV', 'BTV ALL', '인터넷 단독'];
    } else if (setTong == 'kt') {
        var rapidArr = ['100M', '500M', '1G'];
        var chnArr = ['베이직TV', '라이트TV', '에센스TV', '인터넷 단독'];
    } else if (setTong == 'lg') {
        var rapidArr = ['100M', '500M', '1G'];
        var chnArr = ['베이직TV', '프리미엄TV', '프리미엄디즈니TV', '인터넷 단독'];
    } else if (setTong == 'hello') {
        var rapidArr = ['160M', '500M', '1G'];
        var chnArr = ['이코노미TV', '뉴베이직TV', '인터넷 단독'];
    } else if (setTong == 'sky') {
        var rapidArr = ['100M', '200M', '500M', '1G'];
        var chnArr = ['SKY ALL', 'SKY 포인트', '인터넷 단독'];
    }

    const set_tong = { chk: req.params.id, rapidArr, chnArr };
    res.render('renty/renty_form', { set_tong });
})


router.post('/success', async (req, res, next) => {
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
    let form_type_in = '인터넷';

    console.log(mb_phone);
    console.log(mb_regnum);
    console.log(mb_email);
    console.log(mb_address);
    console.log(mb_bank_regnum);
    console.log(mb_card_validity);

    let valueArr = [form_type_in, getVal.itn_item, getVal.tv_item, getVal.item_other, getVal.mb_name, mb_phone, getVal.mb_phone_cpn, mb_regnum, mb_email, mb_address, getVal.mb_pay_type, getVal.mb_bank_cpn, getVal.mb_bank_accountnum, getVal.mb_bank_name, mb_bank_regnum, getVal.mb_card_cpn, getVal.mb_card_cardnum, getVal.mb_card_name, mb_card_validity, getVal.mb_gift_bankname, getVal.mb_gift_accountnum, getVal.mb_gift_name, nowDateTime]

    let formInertSql = `INSERT INTO application_form (form_type_in, itn_item,tv_item,item_other,mb_name,mb_phone,mb_phone_cpn,mb_regnum,mb_email,mb_address,mb_pay_type,mb_bank_cpn,mb_bank_accountnum,mb_bank_name,mb_bank_regnum,mb_card_cpn,mb_card_cardnum,mb_card_name,mb_card_validity,mb_gift_bankname,mb_gift_accountnum,mb_gift_name,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;

    if (getVal.itn_item) {
        await mysql_conn.promise().query(formInertSql, valueArr)
    }


    res.render('renty/renty_form_success', {});
})



router.get('/policy', (req, res, next) => {
    res.render('renty/renty_policy');
})

router.post('/policy', (req, res, next) => {
    res.render('renty/renty_policy');
})

router.get('/mailtest', (req, res, next) => {
    // console.log(process.env.N_MAIL_ID);
    // const mailSubject = "창용아 집에 갈까?? ㅠㅠ";
    // const mailContent = "아 존나 피곤하네 진짜루";
    // mailSender.sendEmail('changyong112@naver.com', mailSubject, mailContent)
    res.send('메일 발송 테슷흐!!!!!')
})



module.exports = router;