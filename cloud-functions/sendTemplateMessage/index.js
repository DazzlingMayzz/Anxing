// 云函数入口文件
const cloud = require('wx-server-sdk')
var request = require('request');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  request({
    url: "https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=" + event.token,
    method: "POST",
    json: true,
    headers: {
      "content-type": "application/json",
    },
    body: {
      "access_token": event.token,
      "touser": event.openid,
      "template_id": "I8y0WipE0YE2fMmLmaHNuhBsq9BWGwUa1cUgV2wr_8k",
      "form_id": event.formid,
      "page": event.page,
      "data": event.data,
      "emphasis_keyword": event.emphasis_keyword
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      resolve(body) // 请求成功的处理逻辑
      // resolve({ errorMessage: "ok"});
    }
    else {
      resolve({ errorMessage: "error" });
    }
  });
})