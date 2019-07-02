// pages/orderLogistics/orderLogistics.js

var util = require('../../utils/util.js');

Page({
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:'物流信息'
  },
  onLoad: function (options) {
  },
  onShow(){
    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, '', '');
  },
  onReady: function () {

  },
  clickDdata(){
    let reqObj = {
      url: '/api/orderLogistics/findMyOrderLogisticsInfo',
      data: {
        subOrderNo:'20181124001-1'
      }
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({             title: res.resDesc,             icon: 'none',             duration: 1500           });
      }
      //成功数据
     
    })
  }
})