// pages/shopCar/shopCar.js
var util = require('../../utils/util.js');
// import Dialog from '../../dist/dialog/dialog';
Page({
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:'申请售后',
    orderNo:"",
    orderNum:"",
    noShopCar: false,
    allSelect: false, //全选按钮
    orderList: [{
      name: '米皇秋冬新品高领套头羊绒 衫女加厚提花纯羊绒毛衣',
      select:false
    }],
    switchArr:[],
    selectedList:[],
    refundType:1,
    orderStatus:undefined,
    isSubOrder:undefined,
    isRefundLog:false,//是否有过售后记录
    orderType:null
  },

  onLoad: function (options) {
    console.log(options)
    if (options.orderStatus && options.isSubOrder){
      this.setData({
        orderStatus: options.orderStatus,
        isSubOrder: options.isSubOrder
      })
    }

    if(options.orderType){
      this.setData({
        orderType:options.orderType
      })
    }
    this.setData({
      orderNo:options.orderNo,
      orderNum:options.orderNum
    })
    wx.setNavigationBarTitle({
      title: "申请售后"//页面标题为路由参数  
    })
    this.getOrderList();
    
  },
  onShow: function () {
    util.mdFun(this, '', '')
  },

  getOrderList(){
    let reqObj = {
      url: '/api/orderRefund/noRefund/new/list',
      data: {
        orderNum: this.data.orderNum,
        orderNo: this.data.orderNo
      }
    }

    if (this.data.orderType == 6 || this.data.orderType == 7){
      reqObj={
        url: '/api/orderRefund/noRefund/memberGiftBag/list',
        data: {
          orderNum: this.data.orderNum
        }
      }
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
        //成功数据
        if (res.model.isRefundLog==1){
          this.setData({
            isRefundLog:true
          })
        }
        if (res.model.isRefundLog == 0) {
          this.setData({
            isRefundLog: false
          })
        }
        console.log(res)
        let switchArr=[];
        let orderList=[]
        for (let i of res.model.canRefundGoodList){
          if(i.residualQuantity!=0){
            switchArr.push(true);
            orderList.push(i)
          }
        }

        for (let i of orderList) {
          i.refundNum = i.residualQuantity
        }
        this.setData({
          orderList,
          switchArr
        })
      }
    })
  },

  //单选
  onSelect(event){
    let index = event.currentTarget.dataset.index;
    let { switchArr, selectedList, orderList} = this.data;
    if (switchArr[index]){
      switchArr[index] = false;
      
    }else{
      switchArr[index] = true;
    }
    this.setData({
      switchArr: switchArr
    })
  },
  //全选
  allSelect(event){
    let index =event.currentTarget.dataset.index;
    let switchArr=[]
    for (let i of this.data.switchArr){
      if(index==1){
        switchArr.push(true)
      }else{
        switchArr.push(false)
      }
    }
    this.setData({
      switchArr: switchArr
    })
  },

  // 退货退款
  applyAftersale0(e){
    let { switchArr,  orderList } = this.data;
    let selectedList=[]
    for (let i = 0; i < switchArr.length;i++){
      if (switchArr[i]){
        selectedList.push(orderList[i])
      }
    }
    this.setData({
      refundType:2,
      selectedList
    })
    if(selectedList.length<=0){
      wx.showToast({
        icon: 'none',
        title: "请您选择商品，否则无法申请售后",
      })
      return false
    }else{
      wx.setStorage({
        key: "myxzAftersaleSelectedList",
        data: this.data.selectedList
      })
      wx.setStorage({
        key: "myxzDisposeWay",
        data: this.data.refundType
      })
      wx.setStorage({
        key: "myxzOrderType",
        data: this.data.orderType
      })
      wx.redirectTo({
        url: '/pages/Upload_credenti/logs'
      })
    }
  },

  //仅退款
  applyAftersale1(e) {
    let { switchArr, orderList, isRefundLog, orderStatus } = this.data;
    if (isRefundLog && orderStatus==2) {
      wx.showToast({
        title: '很抱歉，您只能申请退货退款。',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    let selectedList = []
    for (let i = 0; i < switchArr.length; i++) {
      if (switchArr[i]) {
        selectedList.push(orderList[i])
      }
    }
    this.setData({
      refundType: 1,
      selectedList
    })

    if (selectedList.length <= 0) {
      wx.showToast({
        icon: 'none',
        title: "请您选择商品，否则无法申请售后",
      })
      return false
    } else {
      wx.setStorage({
        key: "myxzAftersaleSelectedList",
        data: this.data.selectedList
      })
      wx.setStorage({
        key: "myxzDisposeWay",
        data: this.data.refundType
      })
      wx.setStorage({
        key: "myxzOrderType",
        data: this.data.orderType
      })
      wx.redirectTo({
        url: '/pages/Upload_credenti/logs?orderStatus=' + this.data.orderStatus + "&isSubOrder=" + this.data.isSubOrder
      })
    }
  },

  onChange(event){
    console.log(event)
    let { switchArr, orderList } = this.data;
    orderList[event.currentTarget.dataset.index].refundNum = event.detail
    this.setData({
      orderList
    })
  },
  // 跳转售后规则详情
  goAftersaleService(){
    wx.navigateTo({
      url: "/pages/aftersaleRuleDetail/aftersaleRuleDetail"
    })
  }
  
})