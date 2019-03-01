// 云函数入口文件
const cloud = require('wx-server-sdk')
const https = require('https')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx4ad376e7939e964e&secret=3d64d7374927aef6f64cb0b0b2592c74', function (resp) {
    var data = '';
    resp.on('data', function (d) {
      data += d;
    });
    resp.on('end', function () {
      resolve(data);
    });
  })
})