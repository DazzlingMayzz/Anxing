// pages/records/records.js
const innerAudioContext = wx.createInnerAudioContext()

Page({
  data: {
    time:[],
    path:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this =this
    console.log(options.time +" "+ options.path)

    // wx.getStorage({
    //   key: 'time',
    //   success: function (res) {
    //     _this.setData({
    //       time: _this.data.time.concat(res.data)
    //     })
    //   }
    // })
    // wx.getStorage({
    //   key: 'path',
    //   success: function (res) {
    //     _this.setData({
    //       path:_this.data.path.concat(res.data)
    //     })
    //   }
    // })
    // this.setData({
    //   time: _this.data.time.concat(options.time),
    //   path: _this.data.path.concat(options.path)
    // })
    // wx.setStorageSync('time', _this.data.time);
    // wx.setStorageSync('path', _this.data.path);

    if(options.time!=null){
      let time = wx.getStorageSync("time") || []
      let path = wx.getStorageSync("path") || []

      time.unshift(options.time)
      path.unshift(options.path)

      this.setData({
        time: time,
        path: path
      })

      wx.setStorageSync('time', time);
      wx.setStorageSync('path', path);
    }
    else{
      let time = wx.getStorageSync("time") || []
      let path = wx.getStorageSync("path") || []

      this.setData({
        time: time,
        path: path
      })
    }
    //console.log(this.data.time)
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
  
  play: function (e) {
    // console.log(e)
    var i=e.currentTarget.id
    console.log(i)
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.path[i],
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
})