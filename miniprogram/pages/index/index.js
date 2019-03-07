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
    contentItems: [{
        image: '../../img/index/suggest1.jpg',
        text: '特朗普称若朝鲜重建导弹发射基将“非常失望”'
      },
      {
        image: '../../img/index/suggest2.jpg',
        text: '王毅霸气发声：坚决反对外部势力干预挑战台湾等问题'
      },
      {
        image: '../../img/index/suggest3.jpg',
        text: '非洲一犀牛的牛角被偷猎者残忍割掉'
      },
      {
        image: '../../img/index/suggest4.jpg',
        text: '伊拉克某某地区发生了一起爆炸事件'
      }
    ],
    listItems: [{
      image1: '../../img/index/hotEvent1.png',
     // image2: '../../img/index/suggest1.jpg',
      head: '百度无人车正式量产',
      content: '7月4日，百度 AI 开发者大会（Baidu Create 2018）上，在7000余名开发者面前，李彦宏兑现了自己一年前“吹的牛”：全球首款 L4 级量产自动驾驶巴士“阿波龙”量产下线！'

    }, {
        image1: '../../img/index/hotEvent2.png',
        // image2: '../../img/index/suggest1.jpg',
        head: '苹果公司市值突破万亿美元',
        content: '北京时间8月2日晚间消息，苹果股价盘中再创历史新高至207.05美元/股，涨幅2.5%，市值首次超过1万亿美元大关，成为美国历史上首个万亿美元市值的公司，也成为第一个突破万亿美元的科技公司.'

      }, {
        image1: '../../img/index/hotEvent3.png',
        //image2: '../../img/index/suggest1.jpg',
        head: '顺风车安全成隐患',
        content: '月最大事件一定是滴滴顺风车司机杀人事件。5月10日，《某空姐李某搭乘滴滴顺风车遇害》一则消息在全网迅速轰炸开来，遇害空姐深夜完成工作后计划坐火车回老家参加婚礼，在机场搭乘了滴滴顺风车，被司机残忍杀害。'

      }, {
        image1: '../../img/index/hotEvent4.png',
        //image2: '../../img/index/suggest1.jpg',
        head: 'P2P平台爆雷潮席卷',
        content: '“P2P”应该是今夏最令人谈之色变的词之一了。自六月以来，一场时间长、波及广、影响大的爆雷潮席卷整个P2P行业。'

      },
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