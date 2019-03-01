//mine.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util')

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log(this.data.userInfo)
      this.register(this.data.userInfo)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log(this.data.userInfo)
        this.register(this.data.userInfo)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          console.log(this.data.userInfo)
          this.register(this.data.userInfo)
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  gotorecords: function(){
    wx.navigateTo({
      url: '../records/records',
    })
  },
  gotofriends: function () {
    wx.navigateTo({
      url: '../friends/friends',
    })
  },
  submit: function (e) {
    var form_id = e.detail.formId;
    // wx.cloud.init();
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getAccessToken',
      // 传给云函数的参数
      data: {
      },
    }).then(res => {
      console.log(res)
      app.globalData.access_token = JSON.parse(res.result).access_token;
      console.log(app.globalData.access_token + typeof (app.globalData.access_token))
      wx.cloud.callFunction({
        name: 'sendTemplateMessage',
        data: {
          "token": app.globalData.access_token,
          "openid": "ofYS94kia5Z-9yeK-8b05C0Q2LQI",
          "formid": form_id,
          "page": "",
          "data": {
            "keyword1": {
              "value": "危险"
            },
            "keyword2": {
              "value": util.formatTime(new Date())
            },
            "keyword3": {
              "value": "腾讯微信总部"
            },
          },
          "emphasis_keyword": ""
        }
      }).then(res => {
        console.log(res);
      }).catch(console.error)
    }).catch(console.error)
  },

  register: function(userInfo){
    var _this=this
    const db = wx.cloud.database({
      env: 'anxing-917314'
    })
    console.log(app.globalData.openid)
    wx.cloud.callFunction({
      name:"getOpenId"
    }).then(res => {
      console.log(res.result.OPENID)
      app.globalData.openid=res.result.OPENID
      console.log(app.globalData.openid)
      const users = db.collection('users')
      db.collection('users').where({
        _openid: app.globalData.openid,
      })
        .get({
          success(res) {
            console.log(res)
            if(res.data.length!=0){
              console.log(_this.data.userInfo.nickName)
              return
            }
            else{
              db.collection('users').add({
                data: {
                  openid: app.globalData.openid,
                  nickname: _this.data.userInfo.nickName
                },
                success(res) {
                  console.log(res)
                }
              })
            }
          }
        })
    })
  }
})
