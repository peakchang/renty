const sql_con = require('./index');


exports.tableSetting = async () => {

    let make_users_form = `CREATE TABLE IF NOT EXISTS users(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        userid VARCHAR(50) UNIQUE,
        nick VARCHAR(50) NOT NULL,
        password VARCHAR(150),
        rate VARCHAR(10) NOT NULL DEFAULT '1',
        provider VARCHAR(10) NOT NULL DEFAULT 'local',
        snsId VARCHAR(50),
        created_at DATETIME DEFAULT NOW(),
        deleted_at DATETIME
    );`;
    try {
        sql_con.query(make_users_form, async (err, result) => { });
    } catch (err) {
        console.error(err);
    }


    let make_application_form = `CREATE TABLE IF NOT EXISTS application_form(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        form_name VARCHAR(50),
        form_type_in VARCHAR(50),
        form_location VARCHAR(50) DEFAULT '기본',
        itn_item  VARCHAR(50),
        tv_item VARCHAR(50),
        item_other VARCHAR(255),
        mb_name VARCHAR(50) NOT NULL,
        mb_phone VARCHAR(50) NOT NULL,
        mb_phone_cpn VARCHAR(50),
        mb_regnum VARCHAR(50),
        mb_email VARCHAR(50),
        mb_address VARCHAR(150),
        mb_pay_type VARCHAR(50),
        mb_bank_cpn VARCHAR(50),
        mb_bank_accountnum VARCHAR(50),
        mb_bank_name VARCHAR(50),
        mb_bank_regnum VARCHAR(50),
        mb_card_cpn VARCHAR(50),
        mb_card_cardnum VARCHAR(50),
        mb_card_name VARCHAR(50),
        mb_card_validity VARCHAR(50),
        mb_gift_bankname VARCHAR(50),
        mb_gift_accountnum VARCHAR(50),
        mb_gift_name VARCHAR(50),
        form_memo_1 VARCHAR(255),
        form_memo_2 VARCHAR(255),
        form_memo_3 VARCHAR(255),
        form_memo_4 VARCHAR(255),
        form_memo_5 VARCHAR(255),
        form_memo_6 VARCHAR(255),
        form_memo_7 VARCHAR(255),
        form_memo_8 VARCHAR(255),
        form_memo_9 VARCHAR(255),
        form_memo_10 VARCHAR(255),
        created_at DATETIME
        );`
    try {
        sql_con.query(make_application_form, (err, result) => { });
    } catch (err) {
        console.error(err);
    }
    let makeFormTypesTable = `CREATE TABLE IF NOT EXISTS form_types(
        form_name VARCHAR(50),
        form_type VARCHAR(50)
    );`
    try {
        sql_con.query(makeFormTypesTable, async (err, result) => { });
    } catch (err) {
        console.error(err);
    }



    



    // let changeArr = ['item_other', 'form_memo_1', 'form_memo_2', 'form_memo_3', 'form_memo_4', 'form_memo_5', 'form_memo_6', 'form_memo_7', 'form_memo_8', 'form_memo_9', 'form_memo_10', 'mb_address']

    // changeArr.forEach(element => {
    //     let setSql = `ALTER TABLE application_form MODIFY COLUMN ${element} varchar(255);`
    //     sql_con.query(setSql, (err, result) => { });
    // });

    // let chaneCNname = `ALTER TABLE application_form RENAME COLUMN createdat TO created_at;`
    // try {
    //     sql_con.query(chaneCNname, (err, result) => {});
    // } catch (error) {

    // }

};