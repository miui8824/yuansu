import Toast from '../../dist/toast/toast';
var util = require('../../utils/util.js');
var apiUrl = require('../../static/js/url.js');
// pages/extractCash/extractCash.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:'余额提现',
    userName:"",
    tixian:"",
    avlBal:"",
    balance:'',
    extract_cash:'',
    botClass:'botGray',
    num:"",
    rule_text:"",
    user_leval:"",
    all_data:"",
    ServiceCharge:"0.00",//提现的手续费
    tixianValue:""//提现的 金额
  },

  inputCash: function (e) {
    var val=e.detail.value;
    // this.setData()
     var num=Number(val);
     this.setData({
       num:num,
       ServiceCharge: Number(num * this.data.all_data.commissionRatio / 100).toFixed(2)
     })
    console.log(num, this.data.ServiceCharge)
    if (num >= this.data.all_data.minSingle){
      this.setData({
        botClass:'botYellow',
        extract_cash: 'extractCash',   //定义提现的方法

      })
    }else{
      this.setData({
        botClass: 'botGray',        
        extract_cash: '',
      })
    }
  },
  extract_cash1(){
      // 1.4的版本所有人都能提现
      let that = this
      console.log(that.data.num);
    console.log(that.data.all_data.maxSingle);
    console.log(that.data.all_data.minSingle);
    if (/^[1-9]+\d*(\.\d{0,2})?$|^0?\.\d{0,2}$/.test(that.data.num)) {
      if (that.data.num >= that.data.all_data.minSingle) {
  if (that.data.num <= that.data.all_data.maxSingle){
        if (that.data.all_data.isBeyond =true){
          if (that.data.all_data.residueAmountToday >= that.data.num){
      
        console.log(that.data.num);
        let token = wx.getStorageSync('myxzToken');
        let url = apiUrl.API_URL +'/api/withdrawalBalance/saveProxy'
        console.log(token);
        if (token) {
          // let header = Object.assign({ 'auth-token': token }, headerData);
          wx.request({
            url: url,
            method: 'POST',
            header: {
              'auth-token': token,

            },
            data: {
              "withdrawalMoney": that.data.num,
              "withdrawalRate": that.data.ServiceCharge
            },
            success(res) {
              wx.hideLoading();
              if (res.data.resCode == '0000') {
                // Toast('~');
                wx.navigateTo({
                  url: "/pages/balanceExtract/balanceExtract?extractNum=" + res.data.model.id
                })
              } else if (res.data.resCode == '40013') {
                Toast(res.data.resDesc);
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
        }else{
            Toast('每日可提现金额超限')
        }
      }else{
          Toast('本月提现次数已用完')
      }
      }else{
    Toast("单笔提现金额超限")
      }
    }else{
        // this.setData({
        //   botClass: 'botGray',
        //   extract_cash: '',
        // })
    }
      }
       else {
      Toast("请输入正确的金额");
      }


  
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
              avlBal: res.data.model.avlBal,
              balance: Number(res.data.model.avlBal).toFixed(2),
              rule_text: res.data.model.instructions,
              all_data: res.data.model,
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
  all_money(){
  //  提现
    console.log(this.data.balance >= 5 && this.data.balance < 20000);
    // if (this.data.num >= this.data.all_data.minSingle && this.data.num < this.data.all_data.maxSingle) {
      this.setData({
        botClass: 'botYellow',
        extract_cash: 'extractCash',
        tixian: Number(this.data.avlBal).toFixed(2),   //定义提现的方法
        ServiceCharge: Number(this.data.avlBal * this.data.all_data.commissionRatio / 100).toFixed(2),
        tixianValue: this.data.avlBal,
      
    
      })
    // } else {
    //   this.setData({
    //     botClass: 'botGray',
    //     extract_cash: '',
    //   })
    //   Toast("每次提现金额不少于" + this.data.all_data.minSingle +"元，上限"+this.data.all_data.maxSingle+"元");
    // }

  },
  extractCash:function(){},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.rules();
    // console.log(options.user_leval);
    // this.setData({
    //   user_leval: options.user_leval
    // })
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
    this.setData({
      tixianValue:"",//清空提现金额
      ServiceCharge:"0.00",//清空手续费
      num:''
    })
    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, '', '');
    this.rules();
    
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