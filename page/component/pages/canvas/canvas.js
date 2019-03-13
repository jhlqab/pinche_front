var app = getApp();
// pages/canvas/canvas.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    shareTitle: "瀛洲拼车",// 分享标题 @author--xp
    imageUrl: "/page/common/images/pinche5.jpg",// 分享图片路径 @author--xp 
    codeImgUrl: "/page/common/images/code.jpg",//二维码路径
    path: "/page/component/index",//分享路径 @author--xp 
    username: "",//用户名称
    userimg: "page/common/images/userinfo.png",//用户头像
    hiddenc: false,
    classc: "classshow",
    bjColor: app.mag.posters.bg_color, 

  },
  onShareAppMessage: function (res) { // 分享 @author--xp
    console.log(res);
    return {
      title: this.data.shareTitle,
      imageUrl: this.data.imageUrl,
      path: this.data.path,
      success: function (res) {
        console.log(res);
      },
      fail: function (f) {
        console.log("转发失败");
        console.log(f);
      }
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '生成分享二维码',
    })
    let me = this;
    me.setData({
      username: options.username,
      //userimg: options.userimg,
      userimg: "http://www.mbtlj.com/dcxsgsApp/images/touxiang.jpg",//测试
      codeImgUrl: options.sceneimg, 
      path: "page/component/index?recommend=" + options.openid,
       
    });
    console.log(me);
    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: app.mag.posters.main_url,
        success: function (res) {
          resolve(res);
        }
      })
    });
    let promise2 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: me.data.codeImgUrl,
        success: function (res) {
          resolve(res);
        }
      })
    });
    let promise3 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: me.data.userimg,
        success: function (res) {
          resolve(res);
        }
      })
    });
    Promise.all([
      promise1, promise2, promise3
    ]).then(res => {
      console.log(res);
      const ctx = wx.createCanvasContext('shareImg');
      let width = wx.getSystemInfoSync().windowWidth;
      let height = wx.getSystemInfoSync().windowHeight;
      let row1 = '我是' + me.data.username;
      let row2 = '拼车出行·绿色环保';
      let row3 = '我为人人拼车帮打call';
      me.setData({
        "shareTitle": row1 + ',' + row2 + row3 + '.'
      });
      //主要就是计算好各个图文的位置
      ctx.drawImage(app.mag.posters.bg_url, 0, 0, width, height);//底图纯色或透明 1px
      ctx.drawImage(res[0].path, 0, 0, width, width);//海报 宽高比例1:1
      ctx.drawImage(res[1].path, width / 2 - 50, width / 2, 100, 100);//二维码
      ctx.drawImage(res[2].path, 20, 10, 70, 70);//头像
      ctx.setTextAlign('left')
      ctx.setFillStyle('#fff')
      ctx.setFontSize(14);
      ctx.fillText(row1, 20, 100) //第一行内容  
      ctx.fillText(row2, 20, 120) //第二行内容
      ctx.fillText(row3,20, 140) // 第三行内容
      ctx.setTextAlign('center');
      ctx.setFillStyle('#000');
      ctx.fillText("长按识别二维码", width / 2, height / 2 +90) //第一行内容        
      ctx.stroke();
      ctx.draw();
      setTimeout(this.canvasImg, 500);
    })
  },
  onReady: function () {

  },
  onCancel: function () {
    console.log("canll");
  },

  /**
   * 生成分享图
  */
  canvasImg: function () {
    var that = this

    var width = wx.getSystemInfoSync().windowWidth;
    var height = wx.getSystemInfoSync().windowHeight;

    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: width,  
      height: height,
      destWidth: width*3,
      destHeight: height*3,
      canvasId: 'shareImg',
      success: function (res) {
        that.setData({
          prurl: res.tempFilePath,
          imageUrl: res.tempFilePath,
          hidden: false
          
        })
        wx.hideLoading()
      },
      fail: function (res) {
        console.log(res);
        wx.hideLoading();
        wx.showToast({
          title: '生成失败，请稍候重试',
          success: function () {
            wx.navigateBack({

            });
          },
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  /**
   * 保存到相册
  */
  save: function () {
    var that = this;
    //生产环境时 记得这里要加入获取相册授权的代码
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');

            }
          }
        })
      }
    })

  }
  , goback: function () {
    wx.navigateBack({});
    // this.setData({ 
    //   hidden: !(this.data.hidden)

    // })
  }
  , showimg: function () {

    wx.previewImage({
      current: this.data.path, // 当前显示图片的http链接   
      urls: this.data.prurl.split(",") // 需要预览的图片http链接列表   
    })  
  }
})