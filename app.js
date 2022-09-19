const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');



// 아래 두개는 서버 관련된 보안을 알아서 해준댜
const helmet = require('helmet');
const hpp = require('hpp');


dotenv.config();


// 라우터 불러오기
const crmRouter = require('./routes/crm');
const authRouter = require('./routes/auth');
const mainRouter = require('./routes/main');
const webhookRouter = require('./routes/webhook');




// DB SET
// const { executeQuery } = require('./db/dbset.js');


// 레디스 안쓸거면 주석
// const redis = require('redis');
// const RedisStore = require('connect-redis')(session);




// 레디스 안쓸거면 주석
// const redisClient = redis.createClient({
//   url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
//   password: process.env.REDIS_PASSWORD,
// });


// 라우터 샘플
// const pageRouter = require('./routes/page');

// 패스포트
const passportConfig = require('./passport');
const logger = require('./logger');


const app = express();
const xhub = require('express-x-hub');
passportConfig(); // 패스포트 설정
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});



if (process.env.NODE_ENV === 'production') {
  app.enable('trust proxy');
  app.use(morgan('combined'));
  app.use(helmet({ contentSecureityPolicy: false }));
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    // ▼ https 쓸거면 true
    secure: false,
  },
  // redis 쓸거면 주석 해제
  //   store: new RedisStore({ client: redisClient }),
};
if (process.env.NODE_ENV === 'production') {
  sessionOption.proxy = true;
  // ▼ https 쓸거면 주석 해제
  // sessionOption.cookie.secure = true;
}
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

// 라우터
app.use('/', mainRouter);
app.use('/auth', authRouter);
app.use('/crm', crmRouter);
app.use('/webhook', webhookRouter);


// 라우터 없을시 에러 발생
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  logger.info('hello');
  logger.error(error.message);
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;