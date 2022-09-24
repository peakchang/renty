const express = require('express');
const { executeQuery } = require('../db_lib/dbset.js');
const router = express.Router();
const mysql_conn = require('../db_lib');
const axios = require('axios');

const moment = require('moment');
const { render } = require('nunjucks');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");


router.get('/test', (req, res, next) => {
    var testStr = "ijijij0123";
    // var testReg = /[ija]/;
    // var getTest = testReg.test(testStr)
    // console.log(getTest);

    // var getMatch = testStr.match(/i/ig);
    // console.log(getMatch);

    // const targetStr = 'This is a pen.';
    // const reg = /is/ig;
    // console.log(reg.exec(targetStr)); // 정보를 모두 출력
    // console.log(reg.test(targetStr)); // 있는지 확인 bool 형태 반환

    // console.log(targetStr.match(reg)); // 내용을 배열로 반환
    // console.log(targetStr.replace(reg, 'ON')); // 내용을 뒤에 나오는 문자열로 변환

    // console.log(targetStr.search(reg)); // 있는지 확인 int 형태로 반환 (포함 갯수)
    // console.log(targetStr.split(reg)); // 자른다~


    const chkStr1 = `대나무 빨대 a급 제품은 10개 남아있습니다. 010-1111-2222 로 Call Me~!`

    // const chkStr1 = 'This is a pen.';
    // console.log(/c/i.test(chkStr1));
    // console.log(chkStr1.search(/a/));
    // console.log(chkStr1.search(/빨대/ig)); // 있는지 확인 int 형태로 반환 (포함 갯수)
    // console.log(chkStr1.replace(/대나무/,'소나무'));
    // console.log(chkStr1.replace(/[대빨2]/g, '공'));
    // console.log(chkStr1.replace(/[0-9]/g, '수'));
    // console.log(chkStr1.match(/[0-9]/g));
    // console.log(chkStr1.replace(//ig,'k'));
    
    // const text = `대나무 빨대 구입 문의 : http://dogumaster.com https://google.com 010-1111-2222 02-333-7777 curryyou@aaa.com`;

    // let setVal = text.match(/https?:\/\/[\w\-\.]+/g);
    // let setVal = text.match(/http/g);
    // let setVal = text.match(/http?s?/g);
    // let setVal = text.match(/http?s?\:\/\/[\w\-\.]+/g);
    // let setVal = text.match(/[\w\-]+/g);
    // let setVal = text.match(/\d{2,3}\-\d{3,4}\-\d{3,4}/g);

    // let setVal = text.match(/[\s]*빨대/ig)
    const text = `abcde ascde`;
    let setVal = text.match(/[\w]*/g);
    console.log(setVal);


    
    
    res.send('ladjfliajsdfiajsldifj')
})



router.get('/', (req, res, next) => {
    res.render('renty/renty_main');
})


router.get('/reviewconfig', (req, res, next) => {
    console.log(typeof(moment.utc().format('YYYY-MM-DD HH:mm:ss Z')));
    
    res.render('renty/review_config')
})

router.post('/reviewconfig', async (req, res, next) => {
    console.log(req.body.rv_name);
    console.log(req.body.rv_phone);
    console.log(req.body.rv_created_at);
    console.log(req.body.rv_content);
    var setDateTime = moment(req.body.rv_created_at).format('YYYY-MM-DD HH:mm:ss');
    // var nowDateTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    const tempSqlArr = [req.body.rv_name, req.body.rv_phone, req.body.rv_content, setDateTime];


    const tempInserSql = `INSERT INTO reviews (rv_name, rv_phone, rv_content, rv_created_at) VALUES (?,?,?,?);`;

    await mysql_conn.promise().query(tempInserSql, tempSqlArr)
    
    res.render('renty/review_config')
})



router.get('/form/:id', (req,res, next) => {
    console.log(req.params);

    const setTong = req.params.id;
    console.log(setTong);
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

    const set_tong = {chk: req.params.id, rapidArr, chnArr};
    res.render('renty/renty_form', { set_tong });
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
        await sql_con.promise().query(formInertSql, valueArr)
    }
    

    res.render('renty/renty_form_success', {});
})


router.get('/review', async (req,res, next) => {

    const reviewSql = `SELECT * FROM reviews;`;
    const reviewDatas = await mysql_conn.promise().query(reviewSql);
    const all_reviews = reviewDatas[0]
    // console.log(all_reviews);

    for await(const [ i, review ] of all_reviews.entries() ) {
        console.log(review);
        console.log(i);
        let getDate = review.rv_created_at.getDate()
        let getMonth = review.rv_created_at.getMonth() + 1
        let getFullYear = review.rv_created_at.getFullYear()
        let setDate = getFullYear + "." + getMonth + "." + getDate;
        review.rv_created_at = setDate

        let firstStr = review.rv_name.charAt(0);
        let lastStr = review.rv_name.charAt(review.rv_name.length - 1);
        let setName = firstStr + '*' + lastStr;
        review.rv_name = setName
        
        var myRegExp1 = /<IMG(.*?)>/gi;
        review.rv_content = review.rv_content.replace(myRegExp1, '');
    }

    console.log(all_reviews);
    res.render('renty/renty_review', { all_reviews });
})


router.get('/policy', (req, res, next) => {
    res.render('renty/renty_policy');
})

router.post('/policy', (req, res, next) => {
    res.render('renty/renty_policy');
})

module.exports = router;