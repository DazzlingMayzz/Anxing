// pages/drive/drive.js

const app = getApp();
var util=require("../../utils/util.js");
const recorderManager = wx.getRecorderManager()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js')
var qqmapsdk

Page({
  data: {
    Height: 0,
    scale: 16,
    startLat: '',
    startLng: '',
    endLat: '',
    endLng: '',
    markers: [],
    location: '',
    polyline: [],
    hiddenSuggest: false,
    suggestion: [],
    recording: false,

    // controls: [{
    //   id: 1,
    //   iconPath: '../../img/control/jia.png',
    //   position: {
    //     left: 375 - 60,
    //     top: 0,
    //     width: 40,
    //     height: 40
    //   },
    //   clickable: true
    // }, {
    //   id: 2,
    //   iconPath: '../../img/control/jian.png',
    //   position: {
    //     left: 375 - 60,
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
    setInterval(function () {
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
    // console.log(app.globalData.location.latitude)
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
  },

  onReady: function () {
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

  driving: function(target) {
    var _this = this;

    //网络请求设置
    var opt = {
      //WebService请求地址，from为起点坐标，to为终点坐标，开发key为必填
      url: 'https://apis.map.qq.com/ws/direction/v1/driving/?from=' + _this.data.location + '&to=' + target + '&key=OXRBZ-IMN6K-5ZXJ4-AOVGT-2IEE2-A2FPW',
      method: 'GET',
      dataType: 'json',
      //请求成功回调
      success: function (res) {
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
        // console.log(polyline)
      }
    };
    console.log(opt.url);
    wx.request(opt);
  },

  nearby_search: function () {
    var _this = this;
    // 调用接口

    qqmapsdk.search({
      keyword: '派出所',  //搜索关键词
      location: _this.data.location, //设置周边搜索中心点
      success: function (res) { //搜索成功后的回调
        var mks = []
        for (var i = 0; i < 10; i++) {
          mks.push({ // 获取返回结果，放到mks数组中
            title: res.data[i].title,
            id: i,
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

  //数据回填方法
  backfill: function (e) {
    var id = e.currentTarget.id;
    for (var i = 0; i < this.data.suggestion.length; i++) {
      if (i == id) {
        this.setData({
          backfill: this.data.suggestion[i].title
        });
        var target = this.data.suggestion[i].latitude + ',' + this.data.suggestion[i].longitude
        break;
      }
    }
    console.log(target)
    this.driving(target)
  },

  //触发关键词输入提示事件
  getsuggest: function (e) {
    var _this = this;
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      region: app.globalData.location.city, //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function (res) {//搜索成功后的回调
        console.log(res);
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  
  blur:function(){
    this.setData({
      hiddenSuggest:true
    })
  },
  
  focus:function(){
    this.setData({
      hiddenSuggest:false
    })
  },

  recording:function(){
    var _this=this;
    this.getRecording();
    var tempFilePath;
    const options = {
      duration: 600000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
      _this.setData({
        recording:true
      })
    });
    wx.showToast({
      title: '录音开始',
      duration: 2000
    })
  },

  stoprecording:function(){
    var _this=this;
    var path="";
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('recorder stop', res.tempFilePath)
      path = res.tempFilePath;
      const { tempFilePath } = res
      _this.setData({
        recording: false
      })
      var TIME = util.formatTime(new Date());

      setTimeout(function () {
        wx.navigateTo({
          url: '../records/records?path=' + path + '&time=' + TIME,
        })
      }, 2000)

      wx.showToast({
        title: '录音结束',
        duration: 2000
      })
    })
  },

  getRecording:function(){
    var _this = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.record']) {
          _this.setData({
            mkf: '麦克风权限已启用'
          })
        } else {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              // wx.startRecord()
              _this.setData({
                mkf: '麦克风权限已启用'
              })
            }
          })
        }
      }
    })
  },
})
