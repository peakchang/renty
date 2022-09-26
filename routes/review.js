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
            console.log(filename);

            cb(null, filename + Date.now() + ext);
        },
    }),
    // limits: { fileSize: 10 * 1024 * 1024 },
});




router.get('/', async (req, res, next) => {

    // const text = `대나무 빨대 구입 문의 : http://dogumaster.com http://google.com <img src=/slkdjfasf.com> 010-1111-2222 02-333-7777 curryyou@aaa.com`;
    // // const tesrReg = /https?\:\/\/[\w\-\.]+/g;
    // const tesrReg = /\<img\ssrc\=[\w\/\.]+/ig;
    // // var testchk = text.match();
    // var testchk = tesrReg.exec(text)

    // console.log(testchk);

    const reviewSql = `SELECT * FROM reviews ORDER BY id DESC LIMIT 8`;
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
    res.render('renty/renty_review', { all_reviews });
})

router.post('/img', upload.single('img'), (req, res) => {
    console.log(req.file);
    let dateFolder = moment(Date.now()).format('YYMMDD');
    res.json({ url: `/img/editor/${dateFolder}/${req.file.filename}` });
});

const upload2 = multer();
router.post('/', upload2.none(), async (req, res, next) => {
    console.log(req.body);
    // 내용 P태그로 바꾸기
    var reviewContent = req.body.review_content;
    if (reviewContent.includes('\r\n')) {
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

    console.log(req.body.mb_name);
    console.log(req.body.mb_phone);
    console.log(reviewAllContent);
    console.log(req.body.rv_created_at);
    if (req.body.rv_created_at != "") {
        var reviewArr = [req.body.mb_name, req.body.mb_phone, reviewAllContent, req.body.rv_created_at]
        var reviewSql = `INSERT INTO reviews (rv_name, rv_phone, rv_content, rv_created_at) VALUES (?,?,?,?)`;
    } else {
        var reviewArr = [req.body.mb_name, req.body.mb_phone, reviewAllContent]
        var reviewSql = `INSERT INTO reviews (rv_name, rv_phone, rv_content) VALUES (?,?,?)`;
    }
    await mysql_conn.promise().query(reviewSql, reviewArr)

    res.redirect('/review');
});

router.post('/delimg', upload.single('img'), (req, res) => {
    var delFileName = req.body.imgname;
    var delFileName = delFileName.replace('img', 'uploads');
    var delFileName = delFileName.substring(1);
    fs.unlink(delFileName, err => {
    })
    res.send('완료 되었습니다.')
});



router.post('/getreview', async (req, res, naxt) => {
    const getId = req.body.rv_id

    const getRvSql = `SELECT * FROM reviews WHERE id = ?`;
    const getData = await mysql_conn.promise().query(getRvSql, [getId])

    console.log(getData[0]);
    res.send(getData[0])
})

router.post('/getreview_direct', async (req, res, naxt) => {
    console.log(req.body);

    console.log(typeof (req.body.now_id));
    if (req.body.direction == 'left') {
        var getId = Number(req.body.now_id) - 1;
        var getSubId = Number(req.body.now_id) - 2;
    } else {
        var getId = Number(req.body.now_id) + 1;
        var getSubId = Number(req.body.now_id) - +2;
    }

    console.log(getId);

    try {
        const getRvSql = `SELECT * FROM reviews WHERE id = ?`;
        const getData = await mysql_conn.promise().query(getRvSql, [getId])
        res.send(getData)
    } catch (error) {
        try {
            const getRvSql = `SELECT * FROM reviews WHERE id = ?`;
            const getData = await mysql_conn.promise().query(getRvSql, [getSubId])
            res.send(getData)
        } catch (error) {
            return res.send('error')
        }
    }
})


router.get('/config', (req, res, next) => {
    console.log(typeof (moment.utc().format('YYYY-MM-DD HH:mm:ss Z')));

    res.render('renty/review_config')
})

router.post('/config', async (req, res, next) => {
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
module.exports = router;