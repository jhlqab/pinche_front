//index.js

var app = getApp();
var amapFile = require('../../../../page/common/lib/amap-wx.js');//高德地图API 用于计算距离和规划驾驶路线 @author--xp

Page({
  data: {
    daytype: '',
    imgbg: '/page/common/images/ditu1.jpg',
    imgUrls: [],
    list: [],
    date: app.mag.formatTime(0, 'yyyy年 MM月 dd日'),
    showTopToast: true,
    time: '',
    countOfSeats: ['0', '1', '2', '3', '4', '5', '6'],
    defaultCountOfSeats: 0,
    from_place: '',
    to_place: '',
    mid_place: 0,

    note: '',
    submitDisabled: false,
    username: '',
    usershowname: '',
    usersex: '',
    userphone: '',
    editId: 0,
    sex: '',
    currentType: 0,
    filterOptions: {},
    currentp: 1,
    loaded: false,
    loading: false,
    currentType: 0,
    indicatorDots: true,
    autoplay: true,
    shareTitle: '',
    shareDesc: '',
    sharePic: '',
    shareImageHeight: 0,
    paymoney: '',
    userNum: '',
    distance: 0,
    price: 0,
    count: 0,
    from_place_longitude: 116.332606,
    from_place_latitude: 39.944546,
    controls: [], // 展现地图-控件 @author--xp 
    markers: null, //地图起始点 @author--xp
    polyline: null, // 地图线路 @author--xp
  },


  // ------------------------------------点击拨打商家电话
  phone: function (e) {
    var that = this
    var phone = that.data.userphone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  // ------------------------------------点击回到首页
  shouye: function (e) {
    wx: wx.reLaunch({
      url: '/page/component/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },


  requestFirstPageList: function (options) {
    var me = this;
    if (!me.data.loading) {

      me.setData({
        loading: true
      });
      options.page = 1;
      app.mag.request('/carpool/carpool/listCarpool', options, function (res) {
        var newlist = [];
        if (res.data.success && res.data.data.length) {
          wx.hideToast();
          newlist = res.data.data;
          for (var item in newlist) {
            // 今天 明天 数据处理
            newlist[item].daytype = app.mag.getDayType(newlist[item].start_time);
            newlist[item].start_time = app.mag.formatTime(newlist[item].start_time);
            newlist[item].postdate = app.mag.formatTime(newlist[item].postdate);
          }
          me.setData({
            list: newlist
          });
        } else {
          me.setData({
            list: newlist
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
  onReachBottom: function () {
    var me = this;
    if (me.data.loaded) {

      return;
    }
    if (!me.data.loading) {

      me.setData({
        loading: true
      });
      me.data.currentp++;
      me.data.filterOptions.page = me.data.currentp;
      me.data.filterOptions.type = me.data.currentType;
      app.mag.request('/carpool/carpool/listCarpool', me.data.filterOptions, function (res) {
        var list = me.data.list,
          newlist = [];
        if (res.data.success && res.data.data.length) {
          wx.hideToast();
          newlist = res.data.data;
          for (var item in newlist) {
            // 今天 明天 数据处理
            newlist[item].daytype = app.mag.getDayType(newlist[item].start_time);
            newlist[item].start_time = app.mag.formatTime(newlist[item].start_time);
            newlist[item].postdate = app.mag.formatTime(newlist[item].postdate);
          }
          for (var i = 0; i < newlist.length; i++) {
            list.push(newlist[i]);
          }
          me.setData({
            list: list,
            loading: false
          });
        } else {
          me.setData({
            loading: false,
            loaded: true
          });

        }
      });
    }
  },
  refreshList: function (event) {
    this.setData({
      filterOptions: {}
    });
    this.requestFirstPageList({
      type: event.currentTarget.dataset.type
    });
  },

  previewImage: function (e) {
    var current = e.target.dataset.src;
    // wx.previewImage({
    //   urls: this.data.scene.split(',')  
    // })
  },
  openMap1: function () {
    wx.navigateTo({
      url: '/page/component/pages/AppUrl/AppUrl'
    })
  },

  openNavigation: function (event) {
    var x = event.currentTarget.dataset.navigationType;
    var that = this;
    if (x >= that.data.markers.length) {
      x = 0;
    }
    var marker = that.data.markers[x];
    wx.openLocation({
      latitude: marker.latitude, // 纬度，范围为-90~90，负数表示南纬
      longitude: marker.longitude, // 经度，范围为-180~180，负数表示西经

      scale: 28, // 缩放比例          
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
  shareImageLoad: function (e) {
    var me = this;
    wx.getSystemInfo({
      success: function (res) {
        me.setData({
          shareImageHeight: res.windowWidth * 0.8
        });
      }
    });
  },
  onPullDownRefresh: function () {
    this.requestFirstPageList({
      type: this.data.currentType
    });
  },
  requestFirstPageList: function (options) {
    var me = this;
    if (!me.data.loading) {

      me.setData({
        loading: true
      });
      options.page = 1;
      app.mag.request('/carpool/carpool/listCarpool', options, function (res) {
        var newlist = [];
        if (res.data.success && res.data.data.length) {
          wx.hideToast();
          newlist = res.data.data;
          for (var item in newlist) {
            // 今天 明天 数据处理
            newlist[item].daytype = app.mag.getDayType(newlist[item].start_time);
            newlist[item].start_time = app.mag.formatTime(newlist[item].start_time);
            newlist[item].postdate = app.mag.formatTime(newlist[item].postdate);
          }
          me.setData({
            list: newlist
          });
        } else {
          me.setData({
            list: newlist
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
  onReachBottom: function () {
    var me = this;
    if (me.data.loaded) {

      return;
    }
    if (!me.data.loading) {

      me.setData({
        loading: true
      });
      me.data.currentp++;
      me.data.filterOptions.page = me.data.currentp;
      me.data.filterOptions.type = me.data.currentType;
      app.mag.request('/carpool/carpool/listCarpool', me.data.filterOptions, function (res) {
        var list = me.data.list,
          newlist = [];
        if (res.data.success && res.data.data.length) {
          wx.hideToast();
          newlist = res.data.data;
          for (var item in newlist) {
            // 今天 明天 数据处理
            newlist[item].daytype = app.mag.getDayType(newlist[item].start_time);
            newlist[item].start_time = app.mag.formatTime(newlist[item].start_time);
            newlist[item].postdate = app.mag.formatTime(newlist[item].postdate);
          }
          for (var i = 0; i < newlist.length; i++) {
            list.push(newlist[i]);
          }
          me.setData({
            list: list,
            loading: false
          });
        } else {
          me.setData({
            loading: false,
            loaded: true
          });

        }
      });
    }
  },
  refreshList: function (event) {
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


    this.requestFirstPageList({
      type: this.data.currentType
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
    });
  },
  onShow: function () {
    var me = this;
    wx.getStorage({
      key: 'filter_options',
      success: function (res) {
        var options = JSON.parse(res.data);
        me.setData({
          filterOptions: options
        });
        me.requestFirstPageList(me.data.filterOptions);
        wx.removeStorage({
          key: 'filter_options',
          success: function (res) { }
        })
      }
    });
    wx.getStorage({
      key: 'publish',
      success: function (res) {
        if (parseInt(res.data) == 1 || parseInt(res.data) == 2) {
          me.requestFirstPageList({
            type: parseInt(res.data)
          });
        }
        wx.removeStorage({
          key: 'publish',
          success: function (res) { }
        })
      }
    });
  },
  tapBanner: function () {
    console.log('you tapped banner');
  },
  tapBroadcastTitle: function () {
    wx.navigateTo({
      url: 'pages/statement/statement'
    })
  },
  goFilterInfo: function () {
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
  goUserPost: function () {
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
  goDetail: function (event) {
    var types = event.currentTarget.dataset.type;
    //人找车
    if (types === 1) {
      wx.navigateTo({
        url: 'pages/pinche_detail_car/pinche_detail_car?id=' + event.currentTarget.id
      })
      //车找人
    } else if (types === 2) {
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
  makeCall: function (event) {
    var id = event.currentTarget.id,
      list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        let phone = list[i].phone;
        wx.showModal({
          title: '提示',
          content: '确定拨打电话：' + phone,
          cancelColor: '#8A8A8A',
          confirmText: '立即拨打',
          confirmColor: '#FF7F00',
          success: function (res) {
            if (res.confirm) {
              wx.makePhoneCall({
                phoneNumber: phone,
                success: function (res) {
                  console.log(res, 'phone call success');
                },
                fail: function () {
                  console.log('phone call fail');
                }
              })
            }
          }
        })
      }
    }
  },

  copyTBL: function (e) {
    var self = this;
    wx.setClipboardData({
      data: self.data.car,
      success: function (res) {
        // self.setData({copyTip:true}),  
        wx.showModal({
          title: '提示',
          content: '微信号复制成功，快去添加好友吧',
          success: function (res) {
            if (res.confirm) {
              console.log('确定')
            } else if (res.cancel) {
              console.log('取消')
            }
          }
        })
      }
    });
  },

  makeCall1: function (event) {
    var id = event.currentTarget.id,
      list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        let car = list[i].car;
        wx.showModal({
          title: '提示',
          content: '微信号：' + car,
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





  onLoad: function (options) {
    var id = parseInt(options.id),

      me = this;
    if (id) {
      me.setData({
        editId: id
      });
      var openid = options["openid"];
      app.mag.request('/carpool/carpool/getCarpool', { id: id }, function (res) {
        if (res.data.success) {
          var start_time = res.data.data.start_time;
          var markers = [ // 起始点坐标 @author--xp
            {
              iconPath: "/page/common/images/zhongdian.png",
              id: 1,
              latitude: res.data.data.to_place_latitude,
              longitude: res.data.data.to_place_longitude,
              width: 20,
              height: 20
            }, {
              iconPath: "/page/common/images/qidian.png",
              id: 0,
              latitude: res.data.data.from_place_latitude,
              longitude: res.data.data.from_place_longitude,
              width: 20,
              height: 20
            }
          ];

          var polyline = [];//JSON.parse(res.data.data.polyline);
          if (!res.data.data.polyline == undefined) {
            polyline = JSON.parse(res.data.data.polyline);
          }
          var distance = parseInt(res.data.data.distance);  //起始点距离@author--xp
          var price = parseFloat(res.data.data.price).toFixed(2); //单价快照 @author--xp
          var count = parseFloat(res.data.data.count).toFixed(2); //总价 @author--xp
          me.setData({
            markers: markers,//起始点@author--xp
            distance: parseInt(distance), //起始点距离@author--xp
            price: parseFloat(price).toFixed(2),//单价快照 @author--xp
            count: parseFloat(count).toFixed(2),//总价 @author--xp
            polyline: polyline,//起始点线路 @author--xp
            username: res.data.data.name,
            sex: res.data.data.sex == "1" ? "先生" : "女士",
            userphone: res.data.data.phone,
            date: app.mag.formatTime(start_time, 'yyyy年 MM月 dd日'),
            time: app.mag.formatTime(start_time, 'hh:mm'),
            from_place: res.data.data.from_place,
            to_place: res.data.data.to_place,
            mid_place: res.data.data.mid_place,
            car: res.data.data.car,
            note: res.data.data.note,
            defaultCountOfSeats: parseInt(res.data.data.user_count),
            from_place_longitude: res.data.data.from_place_longitude,
            from_place_latitude: res.data.data.from_place_latitude,
            
          });
          if (polyline.length == 0) { //polyline数组太多，get未保存，重新请求高德api 
            var originStr = '' + res.data.data.from_place_longitude + ',' + res.data.data.from_place_latitude;
            var destinationStr = '' + res.data.data.to_place_longitude + ',' + res.data.data.to_place_latitude;

            var myAmapFunf = new amapFile.AMapWX({ key: app.mag.amapkey });//声明API @author--xp
            myAmapFunf.getDrivingRoute({
              origin: originStr,
              destination: destinationStr,
              success: function (data) {
                console.log('calculateDistance', data);
                var points = [];
                if (data.paths && data.paths[0] && data.paths[0].steps) {
                  var steps = data.paths[0].steps;
                  for (var i = 0; i < steps.length; i++) {
                    var poLen = steps[i].polyline.split(';');
                    for (var j = 0; j < poLen.length; j++) {
                      points.push({
                        longitude: parseFloat(poLen[j].split(',')[0]),
                        latitude: parseFloat(poLen[j].split(',')[1])
                      })
                    }
                  }
                }
                me.setData({
                  polyline: [{
                    points: points,
                    color: app.mag.polyline_color,
                    width: app.mag.polyline_width
                  }]
                });
                if (data.paths[0] && data.paths[0].distance) {
                  me.setData({
                    distance: parseInt(data.paths[0].distance),
                    count: (parseInt(data.paths[0].distance) * price * 0.001).toFixed(2)
                  });

                }
              },
              fail: function (info) {
                console.log("calculateDistance-X-fail", info);
                // wx.showToast({
                //   image: '../../resource/images/static/error.png',
                //   title: '调用失败,本机不支持测距!',
                // });
              }
            });
          }//if((res.data.data.polyline+"").length<3){
        } else {
          app.mag.alert(res.data.msg);
        }
      });

      app.mag.request('/carpool/carpool/getShareInfo', {}, function (res) {
        var shareDesc = res.data.data.share_desc || '人人拼车小程序，方便大家快捷、安全的拼车出行！';
        me.setData({
          shareTitle: res.data.data.share_title,
          shareDesc: shareDesc
        });

      });

    }
  }, 
  onShareAppMessage: function (event) {
    return {
      title: "【人找车】" + this.data.from_place+"→"+this.data.to_place,//this.data.shareTitle,
      desc: this.data.shareDesc,
      path: 'page/component/pages/pinche_detail_car/pinche_detail_car?id=' + this.data.editId
    }
  }
})
