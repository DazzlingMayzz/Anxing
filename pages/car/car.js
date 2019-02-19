// pages/car/car.js
var amapFile = require('../../libs/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({ key: 'f86948cbde2457b00eaa0449ea5ff5fb' });
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 0,
    longitude: 0,
    speed: 0,
    accuracy: 0,
    markers: [],
    tips: {},
    destination: "",
    destLocation: "",
    polyline: [],
    inputTxt: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    myAmapFun.getRegeo({
      success: function (data) {
        that.setData({
          latitude: data["0"].latitude,
          longitude: data["0"].longitude
        });
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
  },

  bindInput: function(e){
    var that = this;
    var keywords = e.detail.value; 
    myAmapFun.getInputtips({
      keywords: keywords,
      location: '',
      success: function(data){
        // console.log(data);
        if(data && data.tips){
          that.setData({
            tips: data.tips
          });
        }

      }
    })
  },

  bindSearch: function(e){
    var that = this;
    // console.log(e);
    this.setData({
      destination: e.target.dataset.keywords,
      destLocation: e.target.dataset.location,
      inputTxt: e.target.dataset.keywords,
      tips: {}
    });
    myAmapFun.getRegeo({
      success: function (data) {
        that.setData({
          latitude: data["0"].latitude,
          longitude: data["0"].longitude
        });
        myAmapFun.getDrivingRoute({
          origin: that.data.longitude + "," + that.data.latitude,
          destination: that.data.destLocation,
          success: function (data) {
            // console.log(data);
            var points = [];
            if (data.paths && data.paths[0] && data.paths[0].steps) {
              var steps = data.paths[0].steps;
              for (var i = 0; i < steps.length; i++) {
                var poLen = steps[i].polyline.split(';');
                for (var j = 0; j < poLen.length; j++) {
                  points.push({
                    longitude: parseFloat(poLen[j].split(',')[0]),
                    latitude: parseFloat(poLen[j].split(',')[1])
                  })
                }
              }
            }
            that.setData({
              polyline: [{
                points: points,
                color: "#0091ff",
                width: 6
              }]
            });
            if (data.paths[0] && data.paths[0].distance) {
              that.setData({
                distance: data.paths[0].distance + '米'
              });
            }
            if (data.paths[0] && data.paths[0].duration) {
              that.setData({
                cost: parseInt(data.paths[0].duration / 60) + '分钟'
              });
            }
          },
          fail: function (info) {
            console.log(info);
          }
        });
      },
      fail: function (info) {
        console.log(info)
      }
    });
    myAmapFun.getDrivingRoute({
      origin: '116.481028,39.989643',
      destination: '116.434446,39.90816',
      success: function (data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.taxi_cost) {
          that.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }

      },
      fail: function (info) {

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})