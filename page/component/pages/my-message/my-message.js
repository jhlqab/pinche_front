var app = getApp();
Page({
  data: {
    ma:'',
  
      username:"",
      userimg:"",
      useramount:"0",
      usermsgcount:"0",
      shareTitle:"人人拼车",// 分享标题 @author--xp
      imageUrl:"page/common/images/pinche5.jpg",// 分享图片路径 @author--xp
      path:"page/component/index"//分享路径 @author--xp
  },
  onShareAppMessage: function () { // 分享 @author--xp
    console.log("分享");
    return {
      title: this.data.shareTitle,
      imageUrl: this.data.imageUrl, 
      path: this.data.path 
    }

  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '我的'
    })
  },
  onShow:function(){
    var me = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          var code = res.code + '';
          wx.getUserInfo({
            success: function (res) {
              me.setData({
                userimg: res.userInfo.avatarUrl,
                username: res.userInfo.nickName
              });
              me.getUserAmount();
              me.getMyCarpoolCount();
            }
          });
        }
      }
    });
  },
  onLoad:function(){
    var me = this;
   
    wx.login({
      success: function (res) {
        if (res.code) {
          var code = res.code + '';
          wx.getUserInfo({
            success: function (res) {
              me.setData({
                userimg: res.userInfo.avatarUrl,
                username: res.userInfo.nickName
              });
              me.getUserAmount();
              me.getMyCarpoolCount();
            }
          });
        }
      }
    });

},

  
  topayment:function(){
    wx.navigateTo({
      url: '../payment/payment'
    })
  },
  payNow: function () {
    wx.navigateTo({
      url: '../operate-result/operate-result'
    })
  },
  myPublish: function(){
    wx.navigateTo({
      url: '../my-posted/my-posted'
    })
  },
  zhuanfa: function () {
    wx.navigateTo({
      url: '../haibao/haibao'
    })
  },
  zhuanfa1: function () {
    wx.navigateTo({
      url: '../info/info'
    })
  },

  canvasShare: function () {
    let username = this.data.username;
    let userimg = this.data.userimg;
    let sceneimg = this.data.scene;
    let openid = this.data.useropenid;
    // sceneimg = app.mag.apiHost + '/public/uploads/img/wxacode/oUMfw0Bfc4sdFAHqCvFnctixQ1AI.jpg';
    // userimg = app.mag.apiHost + '/public/uploads/img/wxacode/oUMfw0Bfc4sdFAHqCvFnctixQ1AI.jpg';
    let url = "../canvas/canvas?username=" + username + "&userimg=" + userimg + "&sceneimg=" + sceneimg + "&openid=" + openid;
    wx.navigateTo({
      url: url
    })
  },
  payHistory: function () {
    wx.navigateTo({
      url: '../pay-history/pay-history'
    })
  },
  pincheAgreement:function(){
    wx.navigateTo({
      url: '../statement/statement'
    })
  },
  commonProblem:function(){
    wx.navigateTo({
      url: '../common-problem/common-problem'
    })
  },
  aboutOuer:function(){
    wx.navigateTo({
      url: '../info/info'
    })
  },
  getUserAmount: function () {
    var me = this;
    app.mag.request("/carpool/user/getUserAmount", { }, function (res) {
      var amount = res.data.data;
      me.setData({
        useramount: amount
      });
    })
  },
  getMyCarpoolCount: function () {
    var me = this;
    app.mag.request("/carpool/carpool/myCarpoolCount", {}, function (res) {
      var count = res.data.data;
      me.setData({
        usermsgcount: count
      });
    })
  },


  pincheQRcode:function(){
    var that = this
    wx.getStorage({
      key: 'openid',
      fail:function(res){
        console.log("wx.getStorage,fail",res);
      },
      success: function (res) {
        console.log(res.data);
        console.log(app.mag.apiHost)
        var scene_img = app.mag.apiHost + '/public/uploads/img/wxacode/' + res.data + '.jpg'//这里添加图片的地址
        console.log(scene_img);
        that.setData({
          scene: scene_img
        })
        that.previewImage();
      }
    });
  },
  previewImage: function (e) {
    wx.previewImage({
      urls: this.data.scene.split(',')
      // 需要预览的图片http链接  使用split把字符串转数组。不然会报错      
    })
  },
})

