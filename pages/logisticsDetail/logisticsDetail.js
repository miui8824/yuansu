// pages/logisticsDetail/logisticsDetail.js
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:'物流列表',
    sendSum: 0,
    orderList: [], //物流订单

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  
    let orderNumber = options.orderNumber;
    this.getOrderList(orderNumber);
  },
  onShow(){
    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, '', '');
  },
  getOrderList(orderNumber){
    let reqObj = {
      url: '/api/orderLogistics/findMyOrderLogisticsInfo?subId=' + orderNumber
    }
    util.RequestGet(reqObj, null, (res, message) => {
     
      if (message) {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 1500
        })
      }
      if (res.resCode == '0000') {
        if (res.resultCount == 0 ){
            // resultCount =0 代表 商品没有 订单状态
            
        }
        for (let i of res.resultList){
          let goodNumbers=0;
          for (let ii of i.courierGoodInfo){
            goodNumbers += Number(ii.goodQuantity)
          }
          i.goodNumbers = goodNumbers;
        }
        //成功数据
        this.setData({
          orderList: res.resultList
        })
      }
    })
  },
  goSelectDetail(event){
    let com = event.currentTarget.dataset.com;
    let num = event.currentTarget.dataset.num;
    let name = event.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/logistics/logistics?com=' + com + '&num=' + num + '&name=' + name
    })
  }
})