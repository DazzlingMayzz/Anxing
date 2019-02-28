// 云函数入口文件
const cloud = require('wx-server-sdk')
const https = require('https')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx9ed0a37e28b8bed8&secret=a9f020cc3c24e12758106932654c2842', function (resp) {
    var data = '';
    resp.on('data', function (d) {
      data += d;
    });
    resp.on('end', function () {
      resolve(data);
    });
  })
})