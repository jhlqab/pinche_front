Page({
  data: {
    
  },
  onReady: function () {
    wx.setNavigationBarTitle({
        title: '确认支付'
    })
  },
  payNow: function(){
      wx.navigateTo({
        url: '../operate-result/operate-result'
      })
  }
})

