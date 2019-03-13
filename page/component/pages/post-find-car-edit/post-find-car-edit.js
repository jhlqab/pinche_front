var app = getApp();
Page({
  data: {
    date: app.mag.formatTime(0, 'yyyy-MM-dd'),
    time: '',
    countOfPassagers: ['请选择乘车人数', '1', '2', '3', '4', '5', '6'],
    defaultCountOfPassagers: 0,
    from_place: '',
    to_place: '',
    note: '',
    submitDisabled: false,
    username: '',
    usershowname: '',
    usersex: '',
    userphone: '',
    editId: 0,
    paymoney: '',
    isAgree:1,
    top:0,
    car:'',
  },
  sexDeparture: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          from_place: res.address
        })
      }
    })
  }, 
  sexAfterPlace: function() {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          after_place: res.address
        })
      }
    })
  }, 
  sexDestination: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          to_place: res.address
        })
      }
    })
  },


  /**
   * 打开地图选择位置
   */
  open_map_chonse: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          from_place: res.name
        });
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
          longitude: res.longitude,
          latitude: res.latitude,
          to_place: res.name
        });
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
  onLoad: function (options) {
      var id = parseInt(options.id),
          me = this;
      if(id){
          me.setData({
            editId: id
          });
          app.mag.request('/carpool/carpool/getCarpool', {id: id}, function(res) {
            console.log(res)
              if(res.data.success) {
                console.log(res.data.data.note)
                  me.setData({
                      date : app.mag.formatTime(res.data.data.start_time, 'yyyy-MM-dd'),
                      time : app.mag.formatTime(res.data.data.start_time, 'hh:mm'),
                      from_place : res.data.data.from_place,
                      to_place : res.data.data.to_place,
                      note : res.data.data.note,
                      car: res.data.data.car,
                      defaultCountOfPassagers : parseInt(res.data.data.user_count)
                  });
                  me.formatUserinfo(res.data.data.name, res.data.data.sex, res.data.data.phone); 
              } else {
                  app.mag.alert(res.data.msg);
              }
          });
      }
  },
  formatUserinfo: function(_uname, _usex, _uphone) {
    var _ushowname = '';
    if(_usex == 1) {
      _ushowname = _uname.substring(0, 1) + '先生';
    } else if(_usex == 2) {
      _ushowname = _uname.substring(0, 1) + '女士';
    }
    this.setData({
        usershowname: _ushowname,
        username: _uname,
        usersex: _usex==1?'1':'2',
        userphone: _uphone
    });
  },
  onNameInput: function(e) {
    this.setData({
      username: e.detail.value
    });
  },
  showSexActionSheet: function(){
    var me = this,
        itemList = ['1', '2'];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#333',
      success: function(res) {
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
  onPhoneInput: function(e) {
    this.setData({
      userphone: e.detail.value
    });
  },
  timeChange: function(event){
    this.setData({
      time: event.detail.value
    })
  },
  countOfPassagersChange: function(event){
    this.setData({
      defaultCountOfPassagers: event.detail.value
    })
  },
  onFromPlace: function(e) {
    this.setData({
      from_place: e.detail.value
    });
  },
  onToPlace: function(e) {
    this.setData({
      to_place: e.detail.value
    });
  },
  cartype: function (e) {
    this.setData({
      car: e.detail.value
    });
  },
  onNote: function(e) {
    console.log(e.detail.value);
    this.setData({
      note: e.detail.value
    });
  },
  goEditContact: function() {
    wx.navigateTo({
      url: '../contact-info/contact-info'
    })
  },
  goStatement: function() {
    wx.navigateTo({
      url: '../statement/statement'
    })
  },
  savePost: function() {
      var me = this;
      if (!me.data.username) {
        app.mag.alert('联系人不能为空');
        return;
      }
      var reg = /^1[0-9]{10}$/;
      var flag = reg.test(me.data.userphone)
      if (!reg.test(me.data.userphone)) {
        app.mag.alert('手机号码格式错误');
        return;
      }
      if(!me.data.from_place) {
        app.mag.alert('出发地不能为空');
        return;
      }
      if(!me.data.to_place) {
        app.mag.alert('目的地不能为空');
        return;
      }
      if(!me.data.time) {
        app.mag.alert('出发时间不能为空');
        return;
      }
      wx.showToast({
          title: '保存中...',
          icon: 'loading',
          duration: 10000
      });
      app.mag.request('/carpool/carpool/editCarpool', {
          id:  me.data.editId,
          name: me.data.username,
          phone: me.data.userphone,
          sex: me.data.usersex == '1' ? 1 : 2,
          mid_place:  '',
          from_place: me.data.from_place,
          to_place: me.data.to_place,
          start_time: me.data.date + ' ' + me.data.time,
          user_count: me.data.countOfPassagers[me.data.defaultCountOfPassagers],
          note: me.data.note,
          car: me.data.car ? me.data.car : '',
         
          weight: '',
      }, function(res) {
          if(res.data.success) {
            wx.setStorage({
              key: "finish_edit",
              data: JSON.stringify({success: true})
            });
            wx.showToast({
                title: '编辑成功',
                icon: 'success',
                duration: 1000,
                success: function() {
                    wx.navigateBack();
                }
            });
          }
      });
  },
  getLocation:function () {
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res)
         
      },
      fail: function () {
        data.from_place='';
      } 
    })
  }
})
