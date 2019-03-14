// pages/friends/friends.js
const app = getApp()
const util = require('../../utils/util')

Page({
  data: {
    userInfo:null,
    contactPersons: {},
    startTime: 0,
    endTime: 0
  },

  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
    });
  },

  onReady: function () {

  },

  onShow: function () {
    this.refreshContactPerson();
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

  },

  handleTouchStart: function (e) {
    this.setData({
      startTime: e.timeStamp
    })
  }, 

  handleTouchEnd: function (e) {
    this.setData({
      endTime: e.timeStamp
    })
  }, 

  addContactPerson: function () {
    wx.navigateTo({
      url: '../addContactPerson/addContactPerson'
    })
  },

  refreshContactPerson: function() {
    var that = this;
    const db = wx.cloud.database()
    db.collection('contactPerson').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        // console.log(res.data)
        that.setData({
          contactPersons: res.data
        })
      },
      fail: err => {
        console.log('error')
      }
    })
  },

  deleteContactPersonById: function (deleteId) {
    var that = this;
    const db = wx.cloud.database()
    db.collection('contactPerson').doc(deleteId).remove({
      success: res => {
        that.refreshContactPerson();
        wx.showToast({
          title: '删除联系人成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: res => {
        wx.showToast({
          title: '发生错误',
          icon: 'none',
          duration: 2000
        });
      }
    })
  },

  callContactPhoneNumber: function(e) {
    if (this.data.endTime - this.data.startTime < 350) {
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.phonenumber
      })
    }
  },

  deleteContactPhoneNumber: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除' + e.currentTarget.dataset.name + '的联系方式？',
      success(res) {
        if (res.confirm) {
          var deleteId = e.currentTarget.dataset.id;
          that.deleteContactPersonById(deleteId);
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  }

})