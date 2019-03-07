// pages/friends/friends.js
const app = getApp()
const util = require('../../utils/util')

Page({
  data: {
    userInfo:null
  },

  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})