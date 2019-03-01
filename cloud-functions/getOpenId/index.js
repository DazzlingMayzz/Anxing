// 云函数入口文件
const cloud = require('wx-server-sdk')
const https = require('https')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  https.get('https://api.weixin.qq.com/sns/jscode2session?appid=wx4ad376e7939e964e&secret=3d64d7374927aef6f64cb0b0b2592c74&js_code='+event.code+'&grant_type=authorization_code', function (resp) {
    var data = '';
    resp.on('data', function (d) {
      data += d;
    });
    resp.on('end', function () {
      resolve(data);
    });
  })
})