Page({
  data: {

  },

  formSubmit: function(e){
    // console.log(e);
    const db = wx.cloud.database();
    var name = e.detail.value.name;
    db.collection('contactPerson').add({
      data: {
        name: e.detail.value.name,
        phoneNumber: e.detail.value.phoneNumber
      },
      success: res => {
        wx.navigateBack({
          url: '../friends/friends'
        });
        wx.showToast({
          title: '添加联系人成功',
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
  }

})