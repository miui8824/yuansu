// pages/bindInviteCode/bindInviteCode.js
var util = require('../../utils/util.js');
var apiUrl = require('../../static/js/url.js');
import Toast from '../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title: '绑定邀请码',
    userInputnum:"",
    isbdinviter:"",
    bdInviterCode:""
  },
  //绑定邀请码
  buttonBox_bind(){
    console.log(this.data.userInputnum)
    let bindInviter = {}
    bindInviter.code = this.data.userInputnum
    let token = wx.getStorageSync('myxzToken');
    let reqObj = {
      url: '/api/user/bindInviter?auth-token=' + token,
      data: bindInviter
    }
    util.RequestPost(reqObj, null, (res, message) => {
      if (message) {
        console.log(message);
        Toast(res.resDesc);
      }
      if (res.resCode == '0000') {
        //成功数据
        Toast("绑定成功")
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/mySelf/mySelf',
          })
        }, 1500);
      }
    })
  },
  userInputnum(e) {
    console.log(e.detail.value);
    this.setData({
      userInputnum: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.bdInviterCode=="undefined"){
      this.setData({
        bdInviterCode: "",
        isbdinviter: options.isbdinviter,
      })
    }else{
      this.setData({
        isbdinviter: options.isbdinviter,
        bdInviterCode: options.bdInviterCode
      })
    }

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