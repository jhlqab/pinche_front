var app = getApp();
Page({
  data: {
    listLi: [],
    page: 1,
    scrollTop: 0,
    done: false,
    hidden: true,
    typelist: ["现金", "推广","赠送"],
    statuslist: ["待支付", "成功", "失败"]
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '充值记录'
    })
  },
  payNow: function () {
    wx.navigateTo({
      url: '../operate-result/operate-result'
    })
  },
  payHistory: function () {
    wx.navigateTo({
      url: '../pay-history/pay-history'
    })
  },
  onLoad: function (options) {
    this.getList(1);
  },

 // onPullDownRefresh: function () {
   // wx.showToast({
    //  title: '加载中',
    //  icon: 'loading'
    //});
   // this.getList(1, true);
  //},

  getList: function (page, stopPull) {
    var that = this;
    app.mag.request("/carpool/pay/myPayList", {page: page , step: '20' }, function (res) {
      if (page === 1) {
        console.log(res.data.data.data);
        that.setData({
          page: page + 1,
          listLi: res.data.data.data,
          done: false
        })
        if (stopPull) {
          wx.stopPullDownRefresh()
        }
      } else {
        if (res.data < 20) {
          that.setData({
            page: page + 1,
            listLi: that.data.listLi.concat(res.data),
            done: true
          })
        } else {
          that.setData({
            page: page + 1,
            listLi: that.data.listLi.concat(res.data)
          })
        }
      }
    
    })
  },

 

  scrll: function (e) {
    var scrollTop = e.detail.scrollTop
    if (scrollTop > 600) {
      this.setData({
        scrollTop: 1,
        hidden: false
      })
    } else {
      this.setData({
        scrollTop: 1,
        hidden: true
      });
    }
  },

  goTop: function () {
    this.setData({
      scrollTop: 0,
      hidden: true
    })
  }
})

