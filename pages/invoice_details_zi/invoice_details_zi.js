// pages/invoice_details_zi/invoice_details_zi.js
const app = getApp()
var apiUrl = require('../../static/js/url.js');
var util = require('../../utils/util.js');
import Toast from '../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title: '发票详情', //文字描述的发票，能发邮箱
    show:false,
    id:'',
    allDate:'',
    invoice:"",
    email:""
  },
  userNameInput: function (e) {
    this.setData({
      email: e.detail.value
    })
    console.log(this.data.email);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      id: options.id
    })
    this.fp_xiangqing();
  },
  chakan_fapiao:function(){
    if (this.data.allDate.invoiceStatus == 2){
      Toast('暂无发票');
      // Dialog.alert({
      //   message: '弹窗内容'
      // }).then(() => {
      //   // on close
      // });
    }else{
      wx.navigateTo({
        url: '/pages/invoice_details/invoice_details?id=' + this.data.id
      })
    }

  },
  quxiao:function(){
    this.setData({
      show:false
    })
  },
  send:function(){
    console.log(this.data.allDate);
    console.log(this.data.email)
    var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if (reg.test(this.data.email)){
      console.log('1122')
      let token = wx.getStorageSync('myxzToken');
      let reqObj = {
        url: '/api/send/email? auth-token=' + token,
        data: {
          orderNum: this.data.allDate.orderNum,
          to: this.data.email,
          type: 2
        }
      }
      util.RequestGet(reqObj, null, (res, message) => {
        if (message) {
          wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
        }
        if (res.resCode == '0000') {
          this.setData({
            show: false
          })
          wx.showToast({ title: "发送成功", icon: 'none', duration: 1500 });
          console.log(res);
       
        }
      })
    }else{
      // this.setData({
      //   show: false
      // })
      wx.showToast({ title: "请输入正确的邮箱地址", icon: 'none', duration: 1500 });
      return false
    }

 
  },
  sending:function(){
    if (this.data.allDate.invoiceStatus == 2) {
      Toast('暂无发票，不能发送');
    } else{
      this.setData({
        show: true
      })
    }
    

  },
  fp_xiangqing(){
    let token = wx.getStorageSync('myxzToken');
    let reqObj = {
      url: '/api/myOrderInfo/invoiceDetail? auth-token=' + token,
      data: {
        orderId: this.data.id,
      }
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
      }
      if (res.resCode == '0000') {
        console.log(res);
        this.setData({
          allDate: res.data,
          invoiceTime: this.formatDate(new Date(res.data.orderTime))
        })
      }
    })
  },
  formatDate(now) { //时间戳转化为具体的日期
    var year = now.getFullYear();
    var month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
    var date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    var hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
    var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
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