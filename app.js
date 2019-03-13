//app.js
App({
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  mag: {
    'amapkey': '0826af3c2a26316c55eaa2f122cc122e',//高德key @author--xp
    'polyline_color': "#0091ff", //线路颜色 @author--xp
    'polyline_width': 6,//线路宽度 @author--xp,
    apiHost: 'https://zhongxiang.wxbo.xin',
    'user_token': '',
    posters: {//分享海报配置
      main_url: "http://www.mbtlj.com/dcxsgsApp/images/xzx.jpg",//海报主图 宽高1:1 宽1200px以上
      bg_url: "/page/common/images/bg.png", //海报背景纯色1px,
      bg_color: "#fff" //海报纯色背景填充颜色
    },
    formatTime: function (timestamp, fmt) {
      var fmt = fmt || 'yyyy-MM-dd hh:mm';
      var date = new Date();
      if (timestamp) {
        timestamp = parseInt(timestamp);
        date.setTime(timestamp * 1000);
      }
      var meta = {
        "M+": date.getMonth() + 1,                 //月份   
        "d+": date.getDate(),                    //日   
        "h+": date.getHours(),                   //小时   
        "m+": date.getMinutes(),                 //分   
        "s+": date.getSeconds(),                 //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds()             //毫秒   
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in meta) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (meta[k]) : (("00" + meta[k]).substr(("" + meta[k]).length)));
        }
      }
      return fmt;
    },
    isTimeValidForPost: function (timeString) {
      if (!timeString) return;
      var currentTimestamp = parseInt(new Date().getTime() / 1000);
      var postTimestamp = parseInt(new Date(timeString).getTime() / 1000);
      return (postTimestamp - currentTimestamp) > 0;
    },
    getDayType: function (timestamp) {
      timestamp = parseInt(timestamp);
      var daytype = 0,
        currentTimestamp = parseInt(new Date().getTime() / 1000),
        currentDay = new Date().getDate();
      var currentMonth = new Date().getMonth();
      var currentYear = new Date().getFullYear();

      var todayStart = currentYear + '-' + (currentMonth + 1) + '-' + currentDay + ' 00:00:00',
        todayStartTimestamp = parseInt(new Date(todayStart).getTime() / 1000);

      var today = currentYear + '-' + (currentMonth + 1) + '-' + currentDay + ' 23:59:59',
        todayDiff = parseInt(new Date(today).getTime() / 1000) - parseInt(new Date().getTime() / 1000);

      var isToday = timestamp >= todayStartTimestamp && (timestamp - todayStartTimestamp) < 24 * 60 * 60;
      if (isToday) {
        daytype = 1;
      }
      var isTomorrow = (timestamp - currentTimestamp - todayDiff) > 0
        && (timestamp - currentTimestamp - todayDiff) < 24 * 60 * 60;
      if (isTomorrow) {
        daytype = 2;
      }
      return daytype;
    },
    request: function (url, data, suc, fail) {
      var me = this;
      wx.request({
        url: me.apiHost + url,
        data: data,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'user-token': me.user_token
        },
        method: 'GET',
        success: function (res) {
          if (suc) {
            suc(res);
          }
        },
        fail: function (res) {
          if (fail) {
            fail(res);
          }
        }
      });
    },
    requestpost: function (url, data, suc, fail) {
      var me = this;
      wx.request({
        url: me.apiHost + url,
        data: data,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'user-token': me.user_token
        },
        method: 'post',
        success: function (res) {
          if (suc) {
            suc(res);
          }
        },
        fail: function (res) {
          if (fail) {
            fail(res);
          }
        }
      });
    },
    alert: function (msg) {
      wx.showModal({
        title: '提示',
        content: msg,
        success: function (res) {
        }
      });
    },
    toast: function (msg) {
      wx.showToast({
        title: msg,
        icon: 'success',
        duration: 1000
      });
    },
    loading: function (msg, duration) {
      if (!duration) {
        duration = 2000;
      }
      wx.showToast({
        title: msg,
        icon: 'loading',
        duration: duration
      });
    }
  }
});