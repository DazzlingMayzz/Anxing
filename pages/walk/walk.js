// pages/walk/walk.js
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
    array: ['所有地点', '公安警察', '购物中心', '综合医院'],
    index: 0,
    polyline: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setCurrentLocation();
    this.search();
  },

  search: function () {
    var that = this;
    if (that.data.index == 0) {
      var mks = [];
      var distMin = Number.MAX_SAFE_INTEGER;
      var destination = "";
      for (let i = 1; i < that.data.array.length; i++) {
        var word = that.data.array[i];
        myAmapFun.getPoiAround({
          querykeywords: word,
          success: function (data) {
            // console.log(data);
            if (distMin > data.poisData["0"].distance) {
              distMin = data.poisData["0"].distance;
              destination = data.markers["0"].longitude + "," + data.markers["0"].latitude;
            }
            mks = mks.concat(data.markers);
            if (mks.length == 20 * (that.data.array.length-1)) {
              // console.log(destination);
              that.setData({
                markers: mks
              });
              myAmapFun.getRegeo({
                success: function (data) {
                  that.setData({
                    latitude: data["0"].latitude,
                    longitude: data["0"].longitude
                  });
                  myAmapFun.getWalkingRoute({
                    origin: that.data.longitude + "," + that.data.latitude,
                    destination: destination,
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
            }
          },
          fail: function (info) {
            console.log(info);
          }
        });
      }
    }
    else {
     myAmapFun.getPoiAround({
        querykeywords: that.data.array[that.data.index],
        success: function (data) {
          that.setData({
            markers: data.markers
          });
          var destination = data.markers["0"].longitude + "," + data.markers["0"].latitude;
          myAmapFun.getRegeo({
            success: function (data) {
              that.setData({
                latitude: data["0"].latitude,
                longitude: data["0"].longitude
              });
              myAmapFun.getWalkingRoute({
                origin: that.data.longitude + "," + that.data.latitude,
                destination: destination,
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
        },
        fail: function (info) {
          console.log(info);
        }
      });
    }
  },

  setCurrentLocation() {
    var that = this;
    myAmapFun.getRegeo({
      success: function (data) {
        that.setData({
          latitude: data["0"].latitude,
          longitude: data["0"].longitude
        });
      },
      fail: function (info) {
        console.log(info)
      }
    });
  },

  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    });
    this.search();
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