const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const sql_con = require('../db_lib');

const router = express.Router();



router.get('/', async (req, res, next) => {
    console.log('아아니 씨발 넌 또 왜 지랄인데');
    const allDbSql = "SELECT * FROM application_form WHERE mb_name='testname';";
    const tempData = await sql_con.promise().query(allDbSql)
    const wData = tempData[0];
    console.log(wData);
    res.render('crm/crm_main', { wData });
})

module.exports = router;