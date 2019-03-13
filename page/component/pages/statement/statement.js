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
  },
  onShareAppMessage: function () {
    return {
      title: '最新公告及拼车协议',
      desc: '这是一款最具人气的小程序!',
      path: 'page/component/pages/statement/statement'
    }
  }
})
