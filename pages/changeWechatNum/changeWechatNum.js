// pages/changeWechatNum/changeWechatNum.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:'微信修改',
    wechat_num:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      wechat_num : option.wechat
    })
  },
  change(){

    wx.redirectTo({
      url: '/pages/bindWechat/bindWechat',
    })
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
    wx.setNavigationBarTitle({
      title: "绑定微信"//页面标题为路由参数  
    })
    util.mdFun(this, '', '')
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