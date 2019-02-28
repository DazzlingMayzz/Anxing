// pages/drive/drive.js

const app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    province: '',
    city: '',
    latitude: '',
    longitude: '',

    imgUrls: [
      // '../../img/other/friends.png',
      '../../img/index/pic1.jpg',
      '../../img/index/pic2.jpg',
      '../../img/index/pic3.jpg'
    ],
    contentItems:[
      '',
      '',
      '',
      ''
    ],
    listItems: [
      '',
      '',
      '',
      ''
    ]
  },
  onLoad: function() {
    qqmapsdk = new QQMapWX({
      key: 'OXRBZ-IMN6K-5ZXJ4-AOVGT-2IEE2-A2FPW'
    });
  },
  onShow: function() {
    let vm = this;
    vm.getUserLocation();
  },

  getUserLocation: function() {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        } else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocation: function() {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        vm.setData({
          latitude: latitude,
          longitude: longitude,
        })
        var speed = res.speed
        app.globalData.speed = speed;
        // console.log(app.globalData.speed);
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude);
        app.globalData.location.latitude = vm.data.latitude;
        app.globalData.location.longitude = vm.data.longitude;
        // console.log(app.globalData.location.latitude)
      },
      fail: function(res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 获取当前地理位置
  getLocal: function(latitude, longitude) {
    // console.log(latitude,longitude)
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(res) {
        console.log(JSON.stringify(res));
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        vm.setData({
          province: province,
          city: city,
        })
        app.globalData.location.province = vm.data.province;
        app.globalData.location.city = vm.data.city;
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        // console.log(res);
      }
    });
  }
})  