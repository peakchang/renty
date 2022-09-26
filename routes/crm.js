const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const sql_con = require('../db_lib');

const router = express.Router();



router.get('/', async (req, res, next) => {
    const allDbSql = "SELECT * FROM application_form;";
    const tempData = await sql_con.promise().query(allDbSql)
    const wData = tempData[0];
    console.log(wData);
    res.render('crm/crm_main', { wData });
})

module.exports = router;