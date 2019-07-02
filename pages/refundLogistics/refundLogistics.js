// pages/refundLogistics/refundLogistics.js
import Toast from '../../dist/toast/toast';
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title: '填写退货物流',
    columns: {
      province_list: {}
    },
    expressCodeObj:{},
    show:false,
    logisticNum:null,
    companyName:null,
    companyId:null,
    orderNum:null, 
    orderNo:null, 
    refundId:null
  },

  onConfirm(event) {
    console.log(event)
    let { expressCode, expressCodeObj} = this.data
    expressCode = expressCodeObj[Number(event.detail.detail.code)]
    this.setData({
      companyName: event.detail.values[0].name,
      companyId: event.detail.values[0].code,
      show:false,
      expressCode
    })
  },

  onCancel() {
    Toast('取消');
    this.setData({
      show:false
    })
  },

  onClose() {
    this.setData({ show: false });
  },

  inputLogisticNum(event){
    this.setData({
      logisticNum: event.detail
    })
  },

  chooseCompany(){
    this.setData({
      show:true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderNo: options.orderNo,
      orderNum: options.orderNum,
      refundId: options.refundId
    })
    this.getCompany()
  },

  getCompany(){
    let reqObj = {
      url: '/api/orderRefund/express/list'
    }
    let {columns,expressCodeObj} = this.data
    util.RequestGet(reqObj, null, (res, message) => {
      console.log(res)
      for(let i of res.resultList){
        columns.province_list[i.id] = i.expressName
        expressCodeObj[i.id] = i.expressCode
      }
      this.setData({
        columns
      })
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

  },

  submit: function () {
    let { companyId, companyName, orderNum, orderNo, refundId, logisticNum, expressCode } = this.data
    if (logisticNum==null){
      wx.showToast({
        title: '请输入快递单号',
        icon:'none'
      })
      return false
    }
    if (companyName == null) {
      wx.showToast({
        title: '请选择物流公司',
        icon: 'none'
      })
      return false
    }
    let expressReq = {
      courierNum: logisticNum,
      express: companyName,
      expressCode,
      orderNum,
      orderNo,
      refundId
    }
    let reqObj = {
      url: '/api/orderRefund/saveExpress',
      data:expressReq
    }
    util.RequestPost(reqObj, null, (res, message) => {
      console.log(res)
      if (message) {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 1500
        })
      }
      if (res.resCode == '0000') {
        wx.navigateBack({
          delta: 1
        })
      }
    })
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