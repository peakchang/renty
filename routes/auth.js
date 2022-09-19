const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { executeQuery } = require('../db/dbset.js');

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const router = express.Router();

router.get('/join', isNotLoggedIn, async (req, res, next) => {
    // let today = new Date();
    // let now = today.toLocaleString();
    // console.log(now);

    // 회원가입 샘플
    // var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    // let sampleId = 'test111'
    // let sampleNick = '나야나야나야나'
    // let samplePWD = await bcrypt.hash('112313', 12);
    // let testSql = `INSERT INTO users (userid, nick, password, createdAt, updatedAt) VALUES('${sampleId}', '${sampleNick}', '${samplePWD}', '${mysqlTimestamp}', '${mysqlTimestamp}');`;

    // await executeQuery(testSql);

    // SELECT 출력 샘플
    








    res.render('auth/join');
})

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    var { userid_inp, nick, password } = req.body;

    try {
        console.log(userid_inp);
        let getUserSql = `SELECT userid FROM users WHERE userid = '${userid_inp}'`;
        let getUser = await executeQuery(getUserSql);

        const exUser = getUser[0]
        if (exUser) {
            return res.redirect('/auth/join?error=exist');
        }

        const hash = await bcrypt.hash(password, 12);
        let mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        let makeUserQuery = `INSERT INTO users (userid, nick, password, createdAt, updatedAt) VALUES(?, ?, ?, ?, ?);`;
        let valArr = [userid_inp, nick, hash, mysqlTimestamp, mysqlTimestamp]
        await executeQuery(makeUserQuery, valArr);

        return res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});


router.get('/login', isNotLoggedIn, (req, res, next) => {
    let loginErr = req.query
    res.render('auth/login', { loginErr });
});
router.post('/login', isNotLoggedIn, (req, res, next) => {
    let movePath = req.query
    console.log(req.body);
    
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            console.log(req.user);
            return res.redirect(`/auth/login/?loginError=${info.message}&move=${movePath.move}`)
        }
        return req.login(user, (loginError) => {
            console.log(user);

            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            if(movePath.move){
                res.redirect(movePath.move)
            }else{
                res.redirect('/')
            }
        });
    })(req, res, next) // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
    console.log(req.user);
    req.session.destroy();
    req.logout(() => {
        res.redirect('/');
    });

});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});

module.exports = router;