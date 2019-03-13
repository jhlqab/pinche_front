var app = getApp();
Page({
  data: {
    'hour': 1,
    'id': '',
    'cost': '',
    'hourcost': '',

    hoursList: ['请选择置顶时间', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10','24','48'],
    defaultHour: 1,
  },
  onLoad: function(option) {
     if(option && option.id) {
       this.setData({
         id: option.id
       });
     }
     var me = this;
     app.mag.request('/carpool/carpool/getTopDayCost', {}, function(res) {
       console.log(res);
         me.setData({
             cost: res.data.data,
             hourcost: res.data.data
         });
     });
  },
  hourOnChange: function(event){
    var hour = parseInt(this.data.hoursList[event.detail.value]);
    var cost = 0;
    if(hour > 0){
      cost = parseFloat(this.data.hourcost) * hour;
      this.setData({
        defaultHour: event.detail.value,
        hour: hour,
        cost: cost
      });
    }
  },
  saveNow: function() {
    var me = this;
    if(!me.data.defaultHour){
      app.mag.alert('请选择置顶时间');
      return;
    }
    if(me.data.id && parseInt(me.data.hour) > 0) {
       app.mag.request('/carpool/carpool/createTopOrder', {
          id: me.data.id,
          hour: me.data.hour
          // paySource: 1
       }, function(res) {
         if (res.data.success){
           wx.showModal({
         
             content: '您发布的信息已置顶成功！',
             cancelColor: '#8A8A8A',
             confirmText: '我的发布',
             confirmColor: '#FF7F00',
           success: function () {
             wx.navigateBack();
           }
         });
         }
       });
    }
  }
});
