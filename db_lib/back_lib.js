
const axios = require('axios');

/** 알리고 문자 발송  **/
exports.sendSms = (receivers, message) => {
    return axios.post('https://apis.aligo.in/send/', null, {
        params: {
            key: process.env.ALIGOKEY,
            user_id: process.env.ALIGOID,
            sender: process.env.SENDER,
            // receiver: receivers.join(','),
            receiver: receivers,
            msg: message,
            // 테스트모드
            testmode_yn: 'N'
        },
    }).then((res) => res.data).catch(err => {
        console.log('err', err);
    });
}

/** length 만큼 랜덤 문자열 만들어줌 **/
exports.randomChracter = async (length) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let i = 0;
    while (i < length){
        i++;
        text = await text + possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

