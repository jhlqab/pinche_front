// pages/prize/prize.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: "/images/txquan.png",
    wechat: "/images/wechat.png",
    quan: "/images/quan.png",
    ma: "/images/ma.png",

    inputValue: "",
    maskHidden: false,
    name: "",
    touxiang: "",
    icon4: "",
    code: "E7A93C"
  },
  //获取输入框的值
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //点击提交按钮
  btnclick: function () {
    var text = this.data.inputValue
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log();
    var that = this;
    wx.getUserInfo({
      success: res => {

        console.log(res.userInfo, "huoqudao le ")
        this.setData({
          name: res.userInfo.nickName,
        })

        wx.downloadFile({
          url: res.userInfo.avatarUrl, //仅为示例，并非真实的资源
          success: function (res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              console.log(res, "reererererer")
              that.setData({
                touxiang: res.tempFilePath
              })
            }
          }
        })
      }
      , fail: function (error) {
        console.log("onload fail==================================================");
        console.log(error);
      }
    
    });

    var openid = options["openid"];
    var me = this;
    app.mag.request('/carpool/carpool/getBannerPathAndNotice', {}, function (res) {
      me.setData({
        bannerTitle: res.data.data.notice_title
      });
    });
    app.mag.request('/carpool/banner/getBannerByLocation', { location: 1, page: 1, step: 10 }, function (res) {
      if (res.data.data.data) {
        var attr = [];
        var len = res.data.data.data;
        for (var i in len) {
          attr[i] = { url: app.mag.apiHost + res.data.data.data[i].url }
        };
        me.setData({
          imgUrls: attr
        });
      }
    });
    app.mag.request('/carpool/carpool/getShareInfo', {}, function (res) {
      var shareDesc = res.data.data.share_desc || '人人拼车小程序，方便大家快捷、安全的拼车出行！';
      me.setData({
        shareTitle: res.data.data.share_title,
        shareDesc: shareDesc
      });
      wx.setNavigationBarTitle({
        title: shareDesc,
      });
    });
    wx.login({
      success: function (res) {
        if (res.code) {
          var code = res.code + '';
          wx.getUserInfo({
            success: function (res) {
              var data = {
                code: code,
                nickname: res.userInfo.nickName,
                head: res.userInfo.avatarUrl,
                sex: res.userInfo.gender
              };

              app.mag.request('/carpool/carpool/wxLogin', data, function (res) {
                app.mag.user_token = res.data.data.token;
                //微信登陆成功，获取openId
                app.mag.open_id = res.data.open_id;
                console.log(res.data.open_id)
                me.setData({
                  openid: app.mag.open_id
                });
                wx.setStorage({
                  key: "openid",
                  data: app.mag.open_id
                })
                app.mag.request('/carpool/Weixin/getwxacode', { openid: app.mag.open_id }, function (res) {
                  console.log(res);
                });
                console.log(app.mag.open_id)
                if (openid) {
                  app.mag.request('/carpool/user/createExpandInfo', { openid: openid }, function (res) {
                    console.log(res);
                  });
                };
              });
            }
          });
        }
      }
    })
    this.pincheQRcode();
  },


  pincheQRcode: function () {
    var that = this;
    console.log(that);

    wx.getStorage({
      key: 'openid',
      fail: function (res) {
        console.log("wx.getStorage,fail", res);
        // 测试固定值 xp start  150
        var data = "oUMfw0BhtctrBFaDJjHa6cI7tBqQ";
        console.log(app.mag.apiHost)
        var scene_img = app.mag.apiHost + '/public/uploads/img/wxacode/' + data + '.jpg'//这里添加图片的地址
        console.log(scene_img);
        that.setData({
          scene: scene_img
        })
        //that.previewImage();
        // 测试固定值 xp end  150
      },
      success: function (res) {
        console.log(res.data);
        console.log(app.mag.apiHost)
        var scene_img = app.mag.apiHost + '/public/uploads/img/wxacode/' + res.data + '.jpg'//这里添加图片的地址
        console.log(scene_img);
        that.setData({
          scene: scene_img
        })
        //that.previewImage();
      }
    });
  },
  previewImage: function (e) {

    wx.previewImage({
      urls: this.data.scene.split(',')
      // 需要预览的图片http链接  使用split把字符串转数组。不然会报错      
    })
  },


  /** 
    * 获取特定页面的小程序码 
    */
  getSpecialM: function () {
    var that = this

    //请求获取小程序码  
    wx.request({
      method: 'GET',
      url: 'https://xin.0633weixiaobao.com/public/uploads/img/wxacode/' + openid + '.jpg',//小程序有关token的api接口需要写在后台服务器端  
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        wx.downloadFile({
          url: this.data.scene.split(','),
          success: function (res) {
            that.setData({
              icon4: res.tempFilePath,
            })
          },
          fail: function () {
            console.log('fail')
          }
        })
      }
    })
  },

  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#ffe200")
    context.fillRect(0, 0, 375, 667)
    var path = "/images/txquan.png";
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(path, 0, 0, 375, 183);
    var path1 = that.data.touxiang;
 

    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    var path2 = "/images/txquan.png";
    var path3 = "/images/heise.png";
    var path4 = "/images/wenziBg.png";
    var path5 = "/images/wenxin.png";
    //不知道是什么原因，手机环境能正常显示
    // context.save(); // 保存当前context的状态
    console.log(that.data.scene);
    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: that.data.scene,
        success: function (res) {
          resolve(res);
        }
      })
    });
    Promise.all([
      promise1
    ]).then(res => {
      var name = that.data.name;
      var path6 = res[0].path;
      //绘制名字
      context.setFontSize(24);
      context.setFillStyle('#333333');
      context.setTextAlign('center');
      context.fillText(name, 185, 220);
      context.stroke();
      //绘制一起吃面标语
      context.setFontSize(15);
      context.setFillStyle('#333333');
      context.setTextAlign('center');
      context.fillText("邀请你一起使用", 185, 250);
      context.stroke();
      //绘制验证码背景
      context.drawImage(path3, 48, 270, 280, 90);
      //绘制code码
      context.setFontSize(40);
      context.setFillStyle('#ffe200');
      context.setTextAlign('center');
      context.fillText(that.data.shareDesc, 185, 320);
      context.stroke();
      //绘制左下角文字背景图

      context.setFontSize(16);
      context.setFillStyle('#333333');
      context.setTextAlign('center');
      context.fillText(that.data.shareTitle, 185, 620);
      context.stroke();


      //绘制右下角扫码提示语

      context.drawImage(path5, 140, 548, 90, 25);
      //绘制头像
      context.arc(186, 420, 50, 0, 2 * Math.PI) //画出圆
      context.strokeStyle = "#ffe200";
      context.clip(); //裁剪上面的圆形
      context.drawImage(path6, 136, 370, 100, 100); // 在刚刚裁剪的园上画图
      context.draw();
      //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'mycanvas',
          success: function (res) {
            var tempFilePath = res.tempFilePath;
            that.setData({
              imagePath: tempFilePath,
              canvasHidden: true
            });
          },
          fail: function (res) {
            console.log(res);
          }
        });
      }, 200);
    })
  },
  //点击保存到相册
  baocun: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          }, fail: function (res) {
            console.log(11111)
          }
        })
      }
    })
  },
  //点击生成
  formSubmit: function (e) {
    var that = this;
    this.setData({
      maskHidden: false
    });
    wx.showToast({
      title: '正在生成中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg();
      that.setData({
        maskHidden: true
      });
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getUserInfo({
      success: res => {
        console.log(res.userInfo, "huoqudao le ")
        this.setData({
          name: res.userInfo.nickName,
          touxiang: res.userInfo.avatarUrl,
        })
        wx.downloadFile({
          url: res.userInfo.avatarUrl, //仅为示例，并非真实的资源
          success: function (res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 20) {
              console.log(res, "reererererer")
              that.setData({
                touxiang: res.tempFilePath
              })
            }
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(this.data.openid);
    return {
      title: this.data.shareTitle,
      desc: this.data.shareDesc,
      path: 'page/component/index?openid=' + this.data.openid,

      success: function (res) {
        console.log(res, "转发成功")
      },
      fail: function (res) {
        console.log(res, "转发失败")
      }
    }
  }
})