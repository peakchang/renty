const passport = require('passport');
const local = require('./localStrategy');
const { executeQuery } = require('../db/dbset.js');
const sql_con = require('../db');

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log(`네번째 관문 ${user.id}`);
    console.log(done);
    done(null, user.id); // 세션에 유저의 id만 저장
  });

  // {id: 3, 'connect.sid' : s%23412324234234}
  passport.deserializeUser((id, done) => {
    console.log("5번째 관문은?");
    let getUserSql = `SELECT * FROM users WHERE id = '?'`;
    sql_con.query(getUserSql , [id], (err, result) => {
      if(err) console.log('mysql 에러');     
     
      console.log("deserializeUser mysql result : " , result);
      var json = JSON.stringify(result[0]);
      userinfo = JSON.parse(json);
      done(null, userinfo);
    })
  });

  local();
};