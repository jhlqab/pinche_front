var app = getApp();
var WxParse = require('../../resources/lib/wxParse/wxParse.js');

Page({
  data: {
    content: ''
  },
  onLoad: function () {
    var me = this;
    app.mag.request('/carpool/carpool/getNoticeContent', {}, function(res) {
      WxParse.wxParse('content', 'html', res.data.data, me);
    });
    app.mag.request('/carpool/carpool/getShareInfo', {}, function (res) {
      var shareDesc = res.data.data.share_desc || '人人拼车小程序，方便大家快捷、安全的拼车出行！';
      me.setData({
        shareTitle: res.data.data.share_title,
        shareDesc: shareDesc
      });
     
    });
  },
  onShareAppMessage: function () {
    return {
      title: '拼车小程序常见问题',
      desc: '这是一款最具人气的小程序!',
      path: 'page/component/pages/common-problem/common-problem'
    }
  }
})
