var app = getApp();
Page({
  data: {
    
    date: '',
    time: '',
    
    chooseCount: ['请选择空位/人数', '1', '2', '3', '4', '5'],
    defaultChooseCount: 0,

    carpoolTypes: ['全部', '人找车', '车找人'],
    defaultCarpoolType: 0,

    from_place: '',
    to_place: '',
    mid_place: ''
  },
  onLoad: function () {
    
  },
  dateChange: function(event){
    this.setData({
      date: event.detail.value
    })
  },
  timeChange: function(event){
    this.setData({
      time: event.detail.value
    })
  },
  carpoolTypeChange: function (event) {
    this.setData({
      defaultCarpoolType: event.detail.value
    })
  },
  chooseCountChange: function(event){
    this.setData({
      defaultChooseCount: event.detail.value
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
  onMiddlePlace: function(e) {
    this.setData({
      mid_place: e.detail.value
    });
  },
  filterNow: function(){
    var options = {
      type: this.data.defaultCarpoolType
    }; 
    if(this.data.from_place){
      options.from_place = this.data.from_place;
    }
    if(this.data.to_place){
      options.to_place = this.data.to_place;
    }
    if(this.data.mid_place){
      options.mid_place = this.data.mid_place;
    }
    if(this.data.date || this.data.time){
      options.start_time = this.data.date+' '+this.data.time;
    }
    if(this.data.defaultChooseCount){
      options.user_count = this.data.defaultChooseCount;
    }
    wx.setStorage({
      key: "filter_options",
      data: JSON.stringify(options)
    });
    wx.navigateBack();
  }
})
