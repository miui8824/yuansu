// pages/orderPayment/orderPayment.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    orderState:1,   //订单已支付
    //orderState:2,  //订单已退款
    receivePerson:'杨志军',
    receivePhone:'18927547291',
    receiveAddress: '北京市朝阳区双桥西地铁东侧意菲克大厦西区1栋A座101室',
    productDescribe: '米皇秋冬新款半高领加厚套头羊绒衫女纯羊绒纯色毛衣针织打底衫休底衫休底衫休底衫休闲',
    productAttr:{
      color:'纯色',
      size:'95/S',
      type:'简约高领',
      style:'中腰',
    },
    productPrice:'1070.00',
    productNum:1,
    totalPrice: '1070.00',
    balancePayment:'73.00',
    weChatPayment:'10.00',
    orderNum: 63490142352790,
    paymentTime:'2018-11-01 17:32:21'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, '', '');
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
  onShareAppMessage: function () {

  }
})