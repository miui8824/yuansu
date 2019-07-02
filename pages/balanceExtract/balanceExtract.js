// pages/balanceExtract/balanceExtract.js
var util = require('../../utils/util.js');
// var util = require('../../utils/util.js');
var apiUrl = require('../../static/js/url.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    extractState:4,//审核未通过
    //extractState:1,//申请成功
    //extractState:2,//申请成功 等待审核
    //extractState:3,//申请通过
    //extractState:5,//提现成功
    extractCash:'未知金额',
    extractNum: "",
    rule_text:"",
    instructions: "1、每次提现金额不少于5元，上限20000元。\n2、每月只可以提现2次\n3、操作提现暂不收取手续费（以后根据政策调整）\n4、提现需要绑定手机号\n5、提现将会通过微信的【通知服务】进行通知，打款到微信零钱，请注意查收",
    alldata:""
  },
  // 提现详情
  details_Presentation(){
    let token = wx.getStorageSync('myxzToken');
    let reqObj = {
      url: 'api/withdrawalBalance/detail?auth-token=' + token,
      data:{
       id:this.data.extractNum
      }
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 1500
        })
        //商品已下架 跳首页

      }
      if (res.resCode == '0000') {
        //初始化富文本
        console.log(res);
        this.setData({
          alldata:res.model,
          amountReceived: Number(res.model.amountReceived).toFixed(2),
          withdrawalMoney: Number(res.model.withdrawalMoney).toFixed(2),
        })
        console.log(this.data.amountReceived, this.data.withdrawalMoney)
      }
    })
  },
  rules(){
    let that = this
    console.log(that.data.num);
    let token = wx.getStorageSync('myxzToken');
    let url = apiUrl.API_URL +'/api/withdrawalBalance/rules'
    console.log(token);
    if (token) {
      // let header = Object.assign({ 'auth-token': token }, headerData);
      wx.request({
        url: url,
        // method: 'POST',
        header: {
          'auth-token': token,
        },
        success(res) {
          wx.hideLoading();
          if (res.data.resCode == '0000') {
            // Toast('~');
            // 打印的是提现的规则
            // console.log(res.data.model.instructions);
            that.setData({
              rule_text: res.data.model.instructions,
            
            })
            // wx.navigateTo({
            //   url: "/pages/balanceExtract/balanceExtract?tixian=" + that.data.num
            // })
          } else {
            Toast(res.data.resDesc);
          }

        }
      })
    } else {
      console.log('跳转授权页面');
      wx.navigateTo({
        url: "/pages/init/init"
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      extractNum: options.extractNum
    })
    this.rules();
    this.details_Presentation();
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