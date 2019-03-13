
var app = getApp();
var amapFile = require('../../../../page/common/lib/amap-wx.js');//高德地图API 用于计算距离和规划驾驶路线 @author--xp
var myAmapFun;//高低地图 @author--xp


Page({
  data: {
    date: app.mag.formatTime(0, 'yyyy-MM-dd'),
    time: app.mag.formatTime(0, 'hh:mm'),

    countOfPassagers: ['请选择车载重量', '100公斤以下', '100-200公斤', ' 200-500公斤 ', '500-800公斤', '800-1000公斤', '1-3吨', '3-5吨', '5-8吨', '8-10吨', '10吨以上'],
    defaultCountOfPassagers: 0,
    from_place: '',
    from_place_latitude: 0, //起点纬度 @author--xp
    from_place_longitude: 0, //起点经度 @author--xp
    mid_place: '',
    to_place: '',
    to_place_latitude: 0, //终点纬度 @author--xp
    to_place_longitude: 0, //终点经度纬度 @author--xp
    distance: 0, // 起点到终点距离（公里） @author--xp
    price: 0,  // 单价 @author--xp
    polyline: [], // 路线 @author--xp
    count: 0, // 总价 @author--xp
    note: '',
    showTopToast: true,
    username: '',
    usershowname: '',
    usersex: '',
    userphone: '',
    editId: 0,
    paymoney: '',
    isTopText: '置顶时长:',
    isAgree: 0,
    isTop: false,
    gujia: false,
    top: 0,
    isTopTime: 1,
    ischangqi: false,
    TopDayCost: 1,
    ownersPostCost: 1,
    userAmount: '',
    car: '',
  },

  /**
   * 打开地图选择位置
   */
  open_map_chonse: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        console.log("get location");
        that.setData({
          from_place_longitude: res.longitude, //@author--xp
          from_place_latitude: res.latitude,//@author--xp
          from_place: res.name
        });
        that.calculateDistance(); //计算距离 @author--xp
        //address: res.name || res.address
      },
      fail: function (res) {
        // wx.showToast({
        //   image: '../../resource/images/static/error.png',
        //   title: '调用失败,本机不支持地图选择地址!',
        // });
      },
      complete: function (res) {
        //console.log(res);
      }
    });


  },

  open_map_chonse1: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          to_place_longitude: res.longitude,//@author--xp
          to_place_latitude: res.latitude,//@author--xp
          to_place: res.name
        });
        that.calculateDistance(); //计算距离 @author--xp
        //address: res.name || res.address
      },
      fail: function (res) {
        // wx.showToast({
        //   image: '../../resource/images/static/error.png',
        //   title: '调用失败,本机不支持地图选择地址!',
        // });
      },
      complete: function (res) {
        //console.log(res);
      }
    });


  },

  /**
   * 计算距离
   * @author--xp
   */
  calculateDistance: function () {
    var that = this;
    if (that.data.from_place_latitude == 0 || that.data.to_place_latitude == 0) return;
    var originStr = '' + that.data.from_place_longitude + ',' + that.data.from_place_latitude;
    var destinationStr = '' + that.data.to_place_longitude + ',' + that.data.to_place_latitude;
    myAmapFun.getDrivingRoute({
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
        if (JSON.stringify(points).length < 2000) {
          that.setData({
            polyline: [{
              points: points,
              color: app.mag.polyline_color,
              width: app.mag.polyline_width
            }]
          });
        }
        else {
          that.setData({
            polyline: [] // 长多太长 get 传值报错 
          });
        }

        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: parseInt(data.paths[0].distance),
            count: (parseInt(data.paths[0].distance) * that.data.price * 0.001).toFixed(2)
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
  },//calculateDistance:function(){

  /**
  * 获取单价
  * @author--xp
  */
  getPrice: function () {
    var me = this;
    app.mag.request('/carpool/carpool/getPrice', '', function (res) {
      console.log(res.data.data);
      if (res.data.success) {
        me.setData({
          price: parseFloat(res.data.data).toFixed(2)
        })
      } else {

      }
    });
  },
  /**
  * 快捷信息填写
  */
  tap_txt: function (e) {
    var txt = e.currentTarget.dataset.text;
    var init_txt = this.data.note;
    init_txt = init_txt.replace(" " + txt, '');
    init_txt = init_txt + " " + txt;
    this.setData({
      note: init_txt
    });
  },
  onLoad: function (options) {
    var me = this;
    me.loadUserInfo();
    me.getUserAmount();
    me.getTopDayCost();
    me.getgoodsPostCost();
    myAmapFun = new amapFile.AMapWX({ key: app.mag.amapkey });//声明API @author--xp
    me.getPrice();//获取单价 @author--xp

  },
  formatUserinfo: function (_uname, _usex, _uphone) {
    var _ushowname = '';
    if (_usex == 1) {
      _ushowname = _uname.substring(0, 1) + '先生';
    } else if (_usex == 2) {
      _ushowname = _uname.substring(0, 1) + '女士';
    }
    this.setData({
      usershowname: _ushowname,
      username: _uname,
      usersex: _usex == 1 ? '男' : '女',
      userphone: _uphone
    });
  },
  //加载联系人信息
  loadUserInfo: function () {
    var me = this;
    app.mag.request('/carpool/carpool/getuserinfo', {}, function (res) {
      if (res.data.success) {
        if (res.data.data.name && res.data.data.phone && res.data.data.sex && res.data.data.car) {
          me.setData({
            username: res.data.data.name,
            usersex: res.data.data.sex === 1 ? '1' : '2',
            userphone: res.data.data.phone,
            car: res.data.data.car

          });
        }
        me.setData({
          paymoney: res.data.post_cost
        });
      } else {
        app.mag.alert(rs.data.msg);
      }
    });
  },



  onNameInput: function (e) {
    this.setData({
      username: e.detail.value
    });
  },
  showSexActionSheet: function () {
    var me = this,
      itemList = ['男', '女'];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#333',
      success: function (res) {
        if (!res.cancel) {
          me.setData({
            usersex: itemList[res.tapIndex]
          });
        }
      }
    })
  },
  checkboxChange: function (e) {
    this.setData({
      isAgree: e.detail.value.length
    });
  },
  onPhoneInput: function (e) {
    this.setData({
      userphone: e.detail.value
    });
  },
  closeTopToast: function () {
    this.setData({
      showTopToast: false
    })
  },
  dateChange: function (event) {
    this.setData({
      date: event.detail.value
    })
  },
  timeChange: function (event) {
    this.setData({
      time: event.detail.value
    })
  },
  countOfPassagersChange: function (event) {
    this.setData({
      defaultCountOfPassagers: event.detail.value
    })
  },
  isTopTap: function (e) {
    var me = this;
    if (me.data.isTopTime == 10) { return };
    me.data.isTopTime++
    this.setData({
      isTopTime: me.data.isTopTime
    });
  },
  isTopTapDome: function (e) {
    var me = this;
    if (me.data.isTopTime == 1) { return };
    me.data.isTopTime--
    this.setData({
      isTopTime: me.data.isTopTime
    });
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
  onAfterPlace: function (e) {
    this.setData({
      mid_place: e.detail.value
    });
  },
  cartype: function (e) {
    this.setData({
      car: e.detail.value
    });
  },

  onNote: function (e) {
    this.setData({
      note: e.detail.value
    });
  },
  goEditContact: function () {
    wx.navigateTo({
      url: '../contact-info/contact-info'
    })
  },
  goStatement: function () {
    wx.navigateTo({
      url: '../statement/statement'
    })
  },
  switchChange: function (e) {
    if (e.detail.value) {
      this.data.top = 1;
    } else {
      this.data.top = 0;
      this.setData({
        isTopTime: 0
      });
    }
    this.setData({
      isTop: e.detail.value
    });
  },
  switchChange1: function (e) {
    if (e.detail.value) {
      this.data.count = 1;
    } else {
      this.data.count = 0;
    }
    this.setData({
      gujia: e.detail.value
    });
  },
  postNow: function () {
    var me = this;
    if (!me.data.username) {
      app.mag.alert('小主，姓名还没未填哦');
      return;
    }
    var reg = /^1[0-9]{10}$/;
    var flag = reg.test(me.data.userphone)
    if (!reg.test(me.data.userphone)) {
      app.mag.alert('请填写手机号码或检查号码是否错误');
      return;
    }
    if (!me.data.from_place) {
      app.mag.alert('小主，出发地还未填写哦');
      return;
    }
    if (!me.data.to_place) {
      app.mag.alert('小主，目的地还未填写哦');
      return;
    }
    if (!me.data.date) {
      app.mag.alert('小主，出发日期还未填写哦');
      return;
    }
    if (!me.data.time) {
      app.mag.alert('小主，出发时间还未填写哦');
      return;
    }
    if (parseInt(me.data.defaultCountOfPassagers) == 0) {
      app.mag.alert('小主，载重还未填写哦');
      return;
    }
    if (me.data.isAgree == 0) {
      app.mag.alert('这个很关键，请先阅读并同意拼车协议哦');
      return;
    }
    var params = {
      name: me.data.username,
      phone: me.data.userphone,
      sex: me.data.usersex == 1 ? 1 : 2,
      from_place: me.data.from_place,
      mid_place: me.data.mid_place ? me.data.mid_place : '',
      to_place: me.data.to_place,
      start_time: me.data.date + ' ' + me.data.time,
      user_count: me.data.countOfPassagers[me.data.defaultCountOfPassagers],
      note: me.data.note,
      type: 4,
      paySource: 1,
      car: me.data.car ? me.data.car : '',
    
      top: me.data.top,
      top_len: me.data.isTopTime,
      from_place_latitude: me.data.from_place_latitude, //起点经度 @author--xp
      from_place_longitude: me.data.from_place_longitude,//起点纬度 @author--xp
      to_place_latitude: me.data.to_place_latitude,//终点经度 @author--xp
      to_place_longitude: me.data.to_place_longitude,//终点纬度 @author--xp
      polyline: JSON.stringify(me.data.polyline), //起始点路线图保存字符串 @author--xp
      distance: parseInt(me.data.distance),//起始点距离（米）@author--xp
      price: parseFloat(me.data.price).toFixed(2),//单价快照 @author--xp
      weight: me.data.countOfPassagers[me.data.defaultCountOfPassagers],
      count: parseFloat(me.data.count).toFixed(2) //总价 @@author--xp
    };

    console.log(JSON.stringify(params));
    app.mag.request('/carpool/carpool/createCarpoolNew', params, function (res) {
      var data = res.data;
      if (data.success) {

        wx.showModal({
          title: '提示',
          content: '恭喜您信息发布成功，请保持联络畅通！',
          cancelColor: '#8A8A8A',
          confirmText: '回到首页',
          canceltext: '我的发布',
          confirmColor: '#FF7F00',
          success: function (sm) {
            if (sm.confirm) {
              wx: wx.reLaunch({
                url: '/page/component/index',
              });
            }
            else if (sm.cancel) {
              wx: wx.reLaunch({
                url: '/page/component/pages/my-posted/my-posted',


              });
            }
          }
        });
      } else {
        app.mag.alert(data.msg);
      }
    });
  },

  /**
 * 性别选择
 */
  radioChange: function (e) {
    //console.log()
    this.setData({
      usersex: e.detail.value
    });
  },
  getLocation: function () {

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
  getUserAmount: function () {
    var me = this;
    app.mag.request('/carpool/user/getUserAmount', '', function (res) {
      if (res.data.success) {
        me.setData({
          userAmount: res.data.data
        })
      } else {

      }
    });
  },
  topayment: function () {
    wx.navigateTo({
      url: '../payment/payment'
    })
  },
  getTopDayCost: function () {
    var me = this;
    app.mag.request('/carpool/carpool/getTopDayCost', '', function (res) {
      console.log(res.data.data);
      if (res.data.success) {
        me.setData({
          TopDayCost: res.data.data
        })
      } else {

      }
    });
  },
  getgoodsPostCost: function () {
    var me = this;
    app.mag.request('/carpool/carpool/getgoodsPostCost', '', function (res) {
      console.log(res.data.data);
      if (res.data.success) {
        me.setData({
         goodsPostCost: res.data.data
        })
      } else {

      }
    });
  },


})
