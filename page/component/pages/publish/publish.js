var app = getApp();
Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    banner: '../../resources/pic/my_banner.jpeg',
    infor:"请选择要发布的类目",
    img1:"../../resources/pic/car5.png",
    img2: "../../resources/pic/car2.png",
    img3: "../../resources/pic/car3.png",
    img4:"../../resources/pic/car4.png",
  }, 
  goPeopleFindCar: function () {
    wx.navigateTo({
      url: '../post-find-car/post-find-car'
    })
  },
  goCarFindPeople: function () {
    wx.navigateTo({
      url: '../post-find-people/post-find-people'
    })
  },
  goGoodsFindCar: function () {
    wx.navigateTo({
      url: '../post-goods-find-car/post-goods-find-car'
    })
  },
  goCarFindGoods: function () {
    wx.navigateTo({
      url: '../post-find-goods/post-find-goods'
    })
  },
  onLoad: function () {
    var me = this;
    app.mag.request('/carpool/banner/getBannerByLocation', { location: 2, page: 1, step: 10 }, function (res) {
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
  }
})