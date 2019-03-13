// pages/dis_dil/dis_d5.js  
var app = getApp();
Page({
  data: {
    scene: ''
  },
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        console.log(res.data);
        console.log(app.mag.apiHost)
        var scene_img = app.mag.apiHost + '/public/uploads/img/wxacode/' + res.data +'.jpg'//这里添加图片的地址
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
  }
})  