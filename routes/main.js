const express = require('express');
const router = express.Router();
const mysql_conn = require('../db_lib');
const axios = require('axios');
const path = require('path');

const { randomChracter } = require('../db_lib/back_lib.js');

const multer = require('multer');
const fs = require('fs');


const moment = require('moment');
const { render } = require('nunjucks');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

try {
    fs.readdirSync('uploads');
    fs.readdirSync('uploads/editor');
} catch (error) {
    fs.mkdirSync('uploads');
    fs.mkdirSync('uploads/editor');
}

try {
    let nowDateTime = moment(Date.now()).format('YYMMDD');
    fs.readdirSync(`uploads/editor/${nowDateTime}`);
} catch (error) {
    let nowDateTime = moment(Date.now()).format('YYMMDD');
    fs.mkdirSync(`uploads/editor/${nowDateTime}`);
}

const upload = multer({
    
    storage: multer.diskStorage({
        // 경로를 설정
        destination(req, file, cb) {
            let dateFolder = moment(Date.now()).format('YYMMDD');
            console.log('여기에서는 어떻게 처리가 될까요???');
            cb(null, `uploads/editor/${dateFolder}`);
        },
        filename(req, file, cb) {
            //파일명 설정
            const ext = path.extname(file.originalname);
            const filename = randomChracter(6);
            cb(null, filename + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});


router.post('/review/img', upload.single('img'), (req, res) => {
    console.log(req.file);
    let dateFolder = moment(Date.now()).format('YYMMDD');
    res.json({ url: `/img/editor/${dateFolder}/${req.file.filename}` });
  });

const upload2 = multer();
router.post('/review', upload2.none(), async (req, res, next) => {
    // 내용 P태그로 바꾸기
    var reviewContent = req.body.review_content;
    if(reviewContent.includes('\r\n')){
        var reviewContent = reviewContent.replace(/\/r\/n/g, '</p><p>')
    }
    var reviewContent = `<p>${reviewContent}</p>`;
    // 이미지링크 태그 입히기
    var reviewImage = '';
    var reviewImageList = req.body.image_list.split(',');
    for await (const imageLink of reviewImageList) {
        var reviewImage = reviewImage + `<img src="${imageLink}">`;
    }

    const reviewAllContent = reviewImage + reviewContent;

    // DB 입력하기
    const reviewArr = [req.body.mb_name, req.body.mb_phone, reviewAllContent]
    const reviewSql = `INSERT INTO reviews (rv_name, rv_phone, rv_content) VALUES (?,?,?)`;

    await mysql_conn.promise().query(reviewSql, reviewArr)

    res.redirect('/review');
});

router.post('/review/delimg', upload.single('img'), (req, res) => {
    var delFileName = req.body.imgname;
    var delFileName = delFileName.replace('img','uploads');
    var delFileName = delFileName.substring(1);
    fs.unlink(delFileName, err => {
    })
    res.send('완료 되었습니다.')
  });


router.get('/test', (req, res, next) => {
    var testStr = "ijijij0123";
    const text = `abcde ascde`;
    let setVal = text.match(/[\w]*/g);
    console.log(setVal);
    res.send('ladjfliajsdfiajsldifj')
})



router.get('/', (req, res, next) => {
    res.render('renty/renty_main');
})


router.get('/reviewconfig', (req, res, next) => {
    console.log(typeof (moment.utc().format('YYYY-MM-DD HH:mm:ss Z')));

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

    console.log(mb_phone);
    console.log(mb_regnum);
    console.log(mb_email);
    console.log(mb_address);
    console.log(mb_bank_regnum);
    console.log(mb_card_validity);

    let valueArr = [getVal.itn_item, getVal.tv_item, getVal.item_other, getVal.mb_name, mb_phone, getVal.mb_phone_cpn, mb_regnum, mb_email, mb_address, getVal.mb_pay_type, getVal.mb_bank_cpn, getVal.mb_bank_accountnum, getVal.mb_bank_name, mb_bank_regnum, getVal.mb_card_cpn, getVal.mb_card_cardnum, getVal.mb_card_name, mb_card_validity, getVal.mb_gift_bankname, getVal.mb_gift_accountnum, getVal.mb_gift_name, nowDateTime]

    let formInertSql = `INSERT INTO application_form (itn_item,tv_item,item_other,mb_name,mb_phone,mb_phone_cpn,mb_regnum,mb_email,mb_address,mb_pay_type,mb_bank_cpn,mb_bank_accountnum,mb_bank_name,mb_bank_regnum,mb_card_cpn,mb_card_cardnum,mb_card_name,mb_card_validity,mb_gift_bankname,mb_gift_accountnum,mb_gift_name,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;

    if (getVal.itn_item) {
        await sql_con.promise().query(formInertSql, valueArr)
    }


    res.render('renty/renty_form_success', {});
})


router.get('/review', async (req, res, next) => {

    const reviewSql = `SELECT * FROM reviews;`;
    const reviewDatas = await mysql_conn.promise().query(reviewSql);
    const all_reviews = reviewDatas[0]
    // console.log(all_reviews);

    for await (const [i, review] of all_reviews.entries()) {
        console.log(review);
        console.log(i);

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

    console.log(all_reviews);
    res.render('renty/renty_review', { all_reviews });
})


router.post('/review', async (req, res, next) => {
    console.log('******************');
    console.log(req.body);
    res.render('renty/renty_review',);
})


router.get('/policy', (req, res, next) => {
    res.render('renty/renty_policy');
})

router.post('/policy', (req, res, next) => {
    res.render('renty/renty_policy');
})

module.exports = router;