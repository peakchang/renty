const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { executeQuery } = require('../db_lib/dbset.js');
const sql_con = require('../db_lib');

module.exports = () => {
  
  passport.use(new LocalStrategy({
    usernameField: 'userid',
    passwordField: 'password',
  }, async (userid, password, done) => {
    console.log('첫번째 관문');
    try {

      // const exUser = await User.findOne({ where: { userid } });
      let getUserSql = `SELECT * FROM users WHERE userid = '${userid}';`;
      const getUser = await sql_con.promise().query(getUserSql)
      let exUser = getUser[0]
      
      console.log(`두번째 관문 exUser는? : ${exUser}`);
      console.log(exUser);

      if (exUser[0]) {
        const result = await bcrypt.compare(password, exUser[0].password);
        if (result) {
          console.log('세번째 관문 통과함??');
          done(null, exUser[0]);
        } else {
          done(null, false, { message: 'noMatchPwd' });
        }
      } else {
        done(null, false, { message: 'nosub' });
      }

    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
