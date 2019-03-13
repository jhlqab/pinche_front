var app = getApp();
Page({
  data: {
    'name': '',
    'sex': '男',
    sexIndex: 1,
    'phone': '',
    submitDisabled: false
  },
  onLoad: function(option) {
     
  },
  onNameInput: function(e) {
    this.setData({
      name: e.detail.value
    });
  },
  showSexActionSheet: function(){
    var me = this,
        itemList = ['男', '女'];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#333',
      success: function(res) {
        if (!res.cancel) {
          me.setData({
            sex: itemList[res.tapIndex],
            sexIndex: res.tapIndex+1
          });
        }
      }
    })
  },
  onPhoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  saveNow: function() {
    var me = this;
    if(!me.data.name || !me.data.sex || !me.data.phone) {
      app.mag.alert('姓名、性别和手机号码都不能为空');
      return;
    }
    if(me.data.sex != '男' && me.data.sex != '女') {
      app.mag.alert('性别错误');
      return;
    }
    wx.setStorage({
      key: "linkmaninfo",
      data: {
        name: me.data.name,
        sex: me.data.sexIndex,
        phone: me.data.phone
      }
    });
    wx.navigateBack();
  }
});
