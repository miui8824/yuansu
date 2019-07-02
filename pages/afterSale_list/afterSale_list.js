// pages/afterSale_list/afterSale_list.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:'售后列表',
    ipage:0,
    resultList:[],
    aftersalenone:false,
    mode: 'scaleToFill',
    src: 'https://file.maiyatown.com/images/afterSale_none/sale_empty.png',
    hasMore: true,
    isLoading: true,
    isorderNo:false,
    orderNo:undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.orderNo){
      this.setData({
        isorderNo:true,
        orderNo: options.orderNo
      })
    }
    
    wx.setNavigationBarTitle({
      title: "退换/售后"//页面标题为路由参数
    })
  },


  getAfterSaleList(){
    let reqObj ={}
    let { ipage, resultList, orderNo, isorderNo } = this.data;
    ipage++
    if (isorderNo){
      reqObj = {
        url: `/api/orderRefund/list?ipage=${ipage}&pageSize=10&orderNo=${orderNo}`
      }
    }else{
      reqObj = {
        url: `/api/orderRefund/list?ipage=${ipage}&pageSize=10`
      }
    }
    
    util.RequestGet(reqObj,null,(res,message)=>{
      console.log(res)
      if(res.resultCount==0){
        this.setData({
          aftersalenone:true
        })
      }else{
        let hasMore = ipage < Math.ceil(res.resultCount / 10) ? true : false;
        this.setData({
          resultList: [...resultList, ...res.resultList],
          isLoading: false,
          ipage,
          hasMore
        })
        this.aftersaleNone()
      }
    })
  },


  aftersaleNone(){
    let { resultList, aftersalenone } = this.data
    let newArr = []
    for (let i of resultList) {
      if (i.refundStatus!=14){
        newArr.push(resultList[i])
      }
    }
    if(newArr.length==0){
      this.setData({
        aftersalenone:true
      })
    }else{
      this.setData({
        aftersalenone: false
      })
    }
    
  },

  afterSaleDetail(e){

    wx.navigateTo({
      url: `/pages/Refund_details/Refund_details?id=${e.currentTarget.dataset.afterid}`,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    let reqObj = {}
    let {resultList, orderNo, isorderNo } = this.data;
    let ipage=1
    if (isorderNo) {
      reqObj = {
        url: `/api/orderRefund/list?ipage=${ipage}&pageSize=10&orderNo=${orderNo}`
      }
    } else {
      reqObj = {
        url: `/api/orderRefund/list?ipage=${ipage}&pageSize=10`
      }
    }

    util.RequestGet(reqObj, null, (res, message) => {
      console.log(res)
      if (res.resultCount == 0) {
        this.setData({
          aftersalenone: true
        })
      } else {
        let hasMore = ipage < Math.ceil(res.resultCount / 10) ? true : false;
        this.setData({
          resultList: res.resultList,
          isLoading: false,
          ipage,
          hasMore
        })
        this.aftersaleNone()
      }
    })
    util.mdFun(this, '', '')
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoading == true || this.data.hasMore == false) {
      return
    }

    this.setData({
      isLoading: true
    })
    this.getAfterSaleList()
  },
  // 跳转售后规则详情
  goAftersaleService() {
    wx.navigateTo({
      url: "/pages/aftersaleRuleDetail/aftersaleRuleDetail"
    })
  }
  
})