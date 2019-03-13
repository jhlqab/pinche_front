//index.js

var app = getApp();
Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    userInfo: {},
    shareTitle: '',
    shareDesc: '',
    sharePic: '',
    shareImageHeight: 0,
    qrcodePic: '',
    bannerTitle: '【拼车必读】微信拼车平台免责声明',
    list: [],
    currentp: 1,
    loaded: false,
    loading: false,
    currentType: 0,
    filterOptions: {},
    from_place: '',
    to_place: '',
    openid:'',
    
   
   
    // scene: '/page/component/resources/pic/service.jpg',

  },



  
  previewImage: function (e) {
    var current = e.target.dataset.src;  
      // wx.previewImage({
      //   urls: this.data.scene.split(',')  
      // })
  },  
  openMap1: function () {
    wx.navigateTo({
      url: '/page/component/pages/haibao/haibao' 
    })
  },
  openMap: function () {
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        // success
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: res.latitude, // 纬度，范围为-90~90，负数表示南纬
          longitude: res.longitude, // 经度，范围为-180~180，负数表示西经

          scale: 28, // 缩放比例          
        })
      }
    })
  },
  onShareAppMessage: function () {
    console.log(this.data.openid);
      return {
        title: this.data.shareTitle,
        desc: this.data.shareDesc,
        path: 'page/component/index?openid=' + this.data.openid
      }
  },
  onFromPlace: function (e) {
    this.setData({
      from_place: e.detail.value
    });
  },
  onToPlace: function (e) {
    this.setData({
      to_place: e.detail.value
    });
  },
  shareImageLoad: function(e){
    var me = this;
    wx.getSystemInfo({
      success: function(res) {
          me.setData({
            shareImageHeight: res.windowWidth*0.8
          });
      }
    });  
  },
  onPullDownRefresh: function(){
    this.requestFirstPageList({
      type: this.data.currentType
    });
  },
  requestFirstPageList: function(options){
    var me = this;
    if(!me.data.loading){
      wx.showToast({
          title: '加载中...',
          icon: 'loading',
          duration: 10000
      });
      me.setData({
        loading: true
      });
      options.page = 1;
      app.mag.request('/carpool/carpool/listCarpool', options, function(res) {
          var newlist = [];       
          if(res.data.success && res.data.data.length){   
              wx.hideToast();                  
              newlist = res.data.data;
              for(var item in newlist){
                // 今天 明天 数据处理
                newlist[item].daytype = app.mag.getDayType(newlist[item].start_time);
                newlist[item].start_time = app.mag.formatTime(newlist[item].start_time);
                newlist[item].postdate = app.mag.formatTime(newlist[item].postdate);
              }
              me.setData({
                list: newlist
              });
          }else{
              me.setData({
                list: newlist
              });
              wx.showToast({
                  title: '没有更多了',
                  icon: 'success',
                  duration: 1000
              });
          }
          me.setData({
            loading: false,
            loaded: false,
            currentp: 1,
            currentType: parseInt(options.type)
          });
          wx.stopPullDownRefresh()
      });
    }
  },
  onReachBottom: function(){
    var me = this;
    if(me.data.loaded){
      wx.showToast({
        title: '没有更多了',
          icon: 'success',
          duration: 1000
      });
      return;
    }
    if(!me.data.loading){
      wx.showToast({
          title: '加载中...',
          icon: 'loading',
          duration: 10000
      });
      me.setData({
        loading: true
      });
      me.data.currentp++;
      me.data.filterOptions.page = me.data.currentp;
      me.data.filterOptions.type = me.data.currentType;
      app.mag.request('/carpool/carpool/listCarpool', me.data.filterOptions, function(res) {
          var list = me.data.list,
              newlist = [];       
          if(res.data.success && res.data.data.length){
              wx.hideToast();           
              newlist = res.data.data;
              for(var item in newlist){
                // 今天 明天 数据处理
                newlist[item].daytype = app.mag.getDayType(newlist[item].start_time);
                newlist[item].start_time = app.mag.formatTime(newlist[item].start_time);
                newlist[item].postdate = app.mag.formatTime(newlist[item].postdate);
              }
              for(var i=0; i<newlist.length; i++){
                list.push(newlist[i]);
              }
              me.setData({
                list: list,
                loading: false
              });
          }else{
              me.setData({
                loading: false,
                loaded: true
              });
              wx.showToast({
                title: '没有更多了',
                  icon: 'success',
                  duration: 1000
              });
          }
      });
    }
  },

  tiaozhuan: function (res) {
    wx.navigateToMiniProgram({
      appId: 'wx5f5b4eaa401836b8',
      path: 'pages/index/index',

      success(res) {
        // 打开成功
      }
    })
  },
  refreshList: function(event){
    this.setData({
      filterOptions: {}
    });
    this.requestFirstPageList({
      type: event.currentTarget.dataset.type
    });
  },
  onLoad: function (options) {
    var openid = options["openid"];
    var me = this;
    app.mag.request('/carpool/carpool/getBannerPathAndNotice', {}, function(res) {
      me.setData({
        bannerTitle: res.data.data.notice_title
      });
    });
    app.mag.request('/carpool/banner/getBannerByLocation', {location: 1,page: 1,step: 10}, function (res) {
      if (res.data.data.data) {
        var attr = [];
        var len = res.data.data.data;
        for (var i in len){
          attr[i] = { url: app.mag.apiHost + res.data.data.data[i].url} 
        };
        me.setData({
          imgUrls: attr
        });
      }
    });
    app.mag.request('/carpool/carpool/getShareInfo', {}, function(res) {
      var shareDesc = res.data.data.share_desc || '人人拼车小程序，方便大家快捷、安全的拼车出行！';
      me.setData({
        shareTitle: res.data.data.share_title,
        shareDesc: shareDesc
        
      });
      wx.setNavigationBarTitle({
        title: shareDesc,
      });
    });
  
 
    this.requestFirstPageList({
      type: this.data.currentType
    });
    wx.login({
      success: function(res) {
        if (res.code) {
          var code = res.code + '';
          wx.getUserInfo({
            success: function(res) {
              var data = {
                  code: code,
                  nickname: res.userInfo.nickName,
                  head: res.userInfo.avatarUrl,
                  sex: res.userInfo.gender
              };

              app.mag.request('/carpool/carpool/wxLogin', data, function(res) {
                app.mag.user_token = res.data.data.token;
                //微信登陆成功，获取openId
                app.mag.open_id = res.data.open_id;
                console.log(res.data.open_id )
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
    });
  },
  onShow: function(){
    var me = this;
    wx.getStorage({
      key: 'filter_options',
      success: function(res) {
          var options = JSON.parse(res.data);
          me.setData({
            filterOptions: options
          });
          me.requestFirstPageList(me.data.filterOptions);
          wx.removeStorage({
            key: 'filter_options',
            success: function(res) {} 
          })
      } 
    });
    wx.getStorage({
      key: 'publish',
      success: function(res) {
          if(parseInt(res.data) == 1 || parseInt(res.data) == 2) {
             me.requestFirstPageList({
               type: parseInt(res.data)
            });
          }
          wx.removeStorage({
            key: 'publish',
            success: function(res) {} 
          })
      } 
    });
  },
  tapBanner: function(){
    console.log('you tapped banner');
  },
  tapBroadcastTitle: function(){
    wx.navigateTo({
      url: 'pages/statement/statement'
    })
  },
  goFilterInfo: function(){
    // wx.navigateTo({
    //   url: 'pages/filter-info/filter-info'
    // })
  },
  filterNow: function () {
    var options = {
      type: this.data.currentType
    };
    if (this.data.from_place) {
      options.from_place = this.data.from_place;
    }
    if (this.data.to_place) {
      options.to_place = this.data.to_place;
    }
    options.mid_place = '';
    options.start_time = '';
    options.user_count = '';
    this.requestFirstPageList(options);
  },
  goUserPost: function(){
    wx.navigateTo({
      url: 'pages/my-posted/my-posted'
    })
  },
  // goFindCar: function(){
  //   wx.navigateTo({
  //     url: 'pages/post-find-car/post-find-car'
  //   })
  // },
  // goFindPeople: function(){
  //   wx.navigateTo({
  //     url: 'pages/post-find-people/post-find-people'
  //   })
  // },
  goDetail: function (event){
    var types = event.currentTarget.dataset.type;
    //人找车
    if(types === 1){
      wx.navigateTo({
        url: 'pages/pinche_detail_car/pinche_detail_car?id=' + event.currentTarget.id
      })
      //车找人
    } else if (types === 2){
      wx.navigateTo({
        url: 'pages/pinche_detail_cfp/pinche_detail_cfp?id=' + event.currentTarget.id
      })//货找车
    } else if (types === 3) {
      wx.navigateTo({
        url: 'pages/pinche_detail_gfc/pinche_detail_gfc?id=' + event.currentTarget.id
      })//车找货
    } else if (types === 4) {
      wx.navigateTo({
        url: 'pages/pinche_detail_cfg/pinche_detail_cfg?id=' + event.currentTarget.id
      })//
    }
  },
  makeCall: function(event){
    var id = event.currentTarget.id, 
        list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        let phone = list[i].phone;
        wx.showModal({
          title: '提示',
          content: '确定拨打电话：'+phone,
          cancelColor: '#8A8A8A',
          confirmText: '立即拨打',
          confirmColor: '#FF7F00',
          success: function(res) {
            if (res.confirm) {
              wx.makePhoneCall({
                phoneNumber: phone,
                success: function(res){
                  console.log(res, 'phone call success');
                },
                fail: function(){
                  console.log('phone call fail');
                }
              })
            }
          }
        })
      }
    }
  },


  
  makeCall1: function (event) {
    var id = event.currentTarget.id,
      list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        let car = list[i].car;
        wx.showModal({
          title: '提示',
          content: '微信号：' +car,
          cancelColor: '#8A8A8A',
          confirmText: '一键复制',
          confirmColor: '#FF7F00',
          success: function (res) {
            if (res.confirm) {
              wx.setClipboardData({
                data: car,
                success: function (res) {
                  wx.showToast({
                    title: '复制成功',
                    icon: 'success',
                    duration: 1000,
                    success: function () {
                      
                    }
                  });
                }
              })
            }
          }
        })
      }
    }
  },

})

