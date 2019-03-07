// pages/walk/walk.js

const app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js')
var qqmapsdk

Page({
  data: {
    Height: 0,
    scale: 16,
    startLat: '',
    startLng: '',
    endLat:'',
    endLng:'',
    markers: [],
    location:'',
    polyline:[],

    // controls: [{
    //   id: 1,
    //   iconPath: '../../img/control/jia.png',
    //   position: {
    //     left: 375-60,
    //     top: 0,
    //     width: 40,
    //     height: 40
    //   },
    //   clickable: true
    // }, {
    //   id: 2,
    //   iconPath: '../../img/control/jian.png',
    //   position: {
    //     left: 375-60,
    //     top: 40,
    //     width: 40,
    //     height: 40
    //   },
    //   clickable: true
    // }],
  },

  onLoad: function () {

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'OXRBZ-IMN6K-5ZXJ4-AOVGT-2IEE2-A2FPW'
    });

    // 页面加载获取当前定位位置为地图的中心坐标
    var _this = this;

    wx.getSystemInfo({
      success: function (res) {
        //设置map高度，根据当前设备宽高满屏显示
        _this.setData({
          view: {
            Height: res.windowHeight
          }
        })
      }
    })
    setInterval(function() {
      wx.getLocation({
        type: 'gcj02',
        success(data) {
          if (data) {
            _this.setData({
              startLat: data.latitude,
              startLng: data.longitude,
              location: data.latitude + ',' + data.longitude
            });
          }
        }
      })
    }, 5000)
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          mobileModel: res.model,
          mobileePixelRatio: res.pixelRatio,
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          language: res.language,
          version: res.version
        })
      }
    })
    // console.log(app.globalData.location.latitude)
    
  },

  onReady: function(){
    // this.nearby_search();
  },

  onShow: function () {
    // // 调用接口
    // qqmapsdk.search({
    //   keyword: '商场',
    //   success: function (res) {
    //     console.log(res);
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   }
    // });
    this.nearby_search();
  },

  walking: function (res) {
    var _this = this;
    console.log(res);
    var target = res.markerId;
    console.log(target);
    for (let item of _this.data.markers) {
      if (item.id === target) {
        var endLat = item.latitude;
        var endLng = item.longitude;
        break;
      }
    }
    //网络请求设置
    var opt = {
      //WebService请求地址，from为起点坐标，to为终点坐标，开发key为必填
      url: 'https://apis.map.qq.com/ws/direction/v1/walking/?from=' + _this.data.location + '&to=' + endLat + ',' + endLng +'&key=OXRBZ-IMN6K-5ZXJ4-AOVGT-2IEE2-A2FPW',
      method: 'GET',
      dataType: 'json',
      //请求成功回调
      success: function (res) {
        console.log('!!!!!!!!!!!!!!!!!!walking route\n')
        console.log(res)
        // console.log(this.url)
        var ret = res.data
        if (ret.status != 0) return; //服务异常处理
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        //设置polyline属性，将路线显示出来
        var polyline = [{
          points: pl,
          color: '#FF0000DD',
          width: 4
        }];
        _this.setData({
          polyline: polyline
          })
        console.log(polyline)
      }
    };
    console.log(opt.url);
    wx.request(opt);
  },

  nearby_search: function () {
    var _this = this;
    // 调用接口
    qqmapsdk.search({
      keyword: '商场',  //搜索关键词
      location: _this.data.location, //设置周边搜索中心点
      success: function (res) { //搜索成功后的回调
        var mks = []
        for (var i = 0; i < res.data.length; i++) {
          mks.push({ // 获取返回结果，放到mks数组中
            title: res.data[i].title,
            id: i ,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            iconPath: "../../img/map/market.png", //图标路径
            width: (i == 0) ? 32 : 20,
            height: (i == 0) ? 32 : 20
          })
        }
        _this.setData({ //设置markers属性，将搜索结果显示在地图中
          markers: _this.data.markers.concat(mks)
        })
        // console.log(_this.markers)
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
        console.log(_this.data.markers)
      }
    });

    qqmapsdk.search({
      keyword: '警察',  //搜索关键词
      location: _this.data.location, //设置周边搜索中心点
      success: function (res) { //搜索成功后的回调
        var mks = []
        for (var i = 0; i < res.data.length; i++) {
          mks.push({ // 获取返回结果，放到mks数组中
            title: res.data[i].title,
            id: i + 10,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            iconPath: "../../img/map/police.png", //图标路径
            width: (i == 0) ? 32 : 20,
            height: (i == 0) ? 32 : 20
          })
        }
        _this.setData({ //设置markers属性，将搜索结果显示在地图中
          markers: _this.data.markers.concat(mks)
        })
        // console.log(_this.markers)
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
        console.log(_this.data.markers)
      }
    });
  },

  controltap(e) {
    var that = this;
    console.log("scale===" + this.data.scale)
    if (e.controlId === 1) {
      that.setData({
        scale: ++this.data.scale
      })
    } else {
      that.setData({
        scale: --this.data.scale
      })
    }
  },
})