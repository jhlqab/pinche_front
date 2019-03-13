var app = getApp();
Page({
  data: {
    username: "",
    userimg: "",
    useramount: "0",
    paySetting:{},
    classindex:"0",
    amountPay : '0',
    paySourcePay : '1'
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '我的充值'
    })
  },
  onLoad: function () {
    var me = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          var code = res.code + '';
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              me.setData({
                userimg: res.userInfo.avatarUrl,
                username: res.userInfo.nickName
              });
              me.getUserAmount();
              me.getPaySetting();
            }
          });
        }
      }
    });
  },
  getUserAmount: function () {
    var me = this;
    app.mag.request("/carpool/user/getUserAmount", {}, function (res) {
      var amount = res.data.data;
      me.setData({
        useramount: amount
      });
    })
  },
  getPaySetting: function () {
    var me = this;
    app.mag.request("/carpool/pay/getPaySetting", {}, function (res) {
      var paySetting = res.data.data;

      console.log(paySetting);
      var amount = paySetting[0].amount;
      if (amount){
        amount = amount;
      }else{
        amount = 0;
      }
      me.setData({
        paySetting: paySetting,
        amountPay: amount
      });
    })
  },
  payfn: function (){
    var me = this;
    var paySourcePay = me.data.paySourcePay;
    var amountPay = me.data.amountPay;
    app.mag.request("/carpool/pay/create", { paySource: paySourcePay, amount: amountPay}, function (res) {
      var data = res.data;
      if(data.success){
        var pay_params = data.pay_params;
        wx.requestPayment({
          'timeStamp': pay_params.timeStamp + '',
          'nonceStr': pay_params.noncestr,
          'package': pay_params.package_,
          'signType': 'MD5',
          'paySign': pay_params.sign,
          'success': function (res) {
            if (res.errMsg == 'requestPayment:ok') {
              //支付成功
              wx.showToast({
                title: '充值成功',
                icon: 'success',
                duration: 1000,
                success: function (res) {
                  alert(res);
                  wx.navigateTo({
                    url: '../my-message/my-message'
                  });
                }
              });
            }
          }
        });
      }
    })
  },
  chooseClick: function (event){
    var me = this;
    console.log(event.currentTarget.dataset.amount);
    me.setData({
      classindex: event.currentTarget.dataset.id,
      amountPay: event.currentTarget.dataset.amount
    });
  }
})

