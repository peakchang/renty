const passport = require('passport');
const local = require('./localStrategy');
const { executeQuery } = require('../db_lib/dbset.js');
const sql_con = require('../db_lib');

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log(done);
    console.log('444 검증 다 완료 다음으로');
    console.log(user.id);
    done(null, user.id); // 세션에 유저의 id만 저장

    console.log('asldjflajsdfijasldifjalisjdf');
  });

  // {id: 3, 'connect.sid' : s%23412324234234}
  passport.deserializeUser((id, done) => {
    console.log('liajsdfljaslidfjlaisjdfajlisdf');
    console.log("5번째 관문은?");
    console.log('아니 여기는 왜 안오는건데?????');
    let getUserSql = `SELECT * FROM users WHERE id = '?'`;
    sql_con.query(getUserSql, [id], (err, result) => {
      if (err) console.log('mysql 에러');

      console.log("deserializeUser mysql result : ", result);
      var json = JSON.stringify(result[0]);
      userinfo = JSON.parse(json);
      done(null, userinfo);
    })
  });

  local();
};