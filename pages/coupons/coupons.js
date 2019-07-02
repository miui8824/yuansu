// pages/coupons/coupons.js

var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:'优惠券',
    navActive: 0,
    navNames: ['未使用(0)', '已使用(0)', '已过期(0)'],
    couponsList:[],
    noCouponsArr:[false,false,false],//当前页面暂无数据
    page:1,
    pageSize:10,
    scrollTop:0,
    couponsNew: null,
    couponsActive: null,
    couponsOld:null,

    investMoneyType:'',//使用场景
  },
  onLoad() {
    this.getCouponsList()
  },
  onShow(){
    this.getCouponsList()
    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, '', '');
  },
  getCouponsList(){
    let reqObj = {
      url: '/api/user/getPrizeGrant',
      data:{
        couponType:this.data.navActive+1
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
        //设置标题
  
        let navNames = [];
        navNames.push('未使用(' + res.map.couponsNew + ')');
        navNames.push('已使用(' + res.map.couponsActive + ')');
        navNames.push('已过期(' + res.map.couponsOld+')');
        this.setData({
          navNames: navNames
        })
        // let objName = 'navNames[' + this.data.navActive + ']';
        // let objValue = navNames[this.data.navActive] + res.resultList.length + ')';

        //成功数据
        if (res.resultList.length<1){
          let objName ='noCouponsArr['+this.data.navActive+']';
          this.setData({
            [objName]:true,
            couponsList: []
          })
        }else{
          this.setData({
            couponsList: []
          })
          let resultList=res.resultList
          for (let i of resultList){
            let startTimeValue = i.startTimeValue
            let endTimeValue = i.endTimeValue

            if (i.startTimeValue != null) { 
              i.startTimeValue = i.startTimeValue.replace(/-/g, ".")
            }
            if (i.endTimeValue != null) { 
              i.endTimeValue = i.endTimeValue.replace(/-/g, ".")
            }
            
            switch (i.investMoneyType) {
              case 1:
                i.investMoneyType = '全场通用';
                break;
              case 2:
                i.investMoneyType = '最多投用';
                break;
              case 3:
                i.investMoneyType = '投资满用';
                break;
              case 4:
                i.investMoneyType = '消费满多少可用';
                break;
            }
          }
          this.setData({
            couponsList:resultList
          })
        }
      }
    })
  },
  //跳转首页
  goHome(){
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  goExchange(event){
    let couponid = event.currentTarget.dataset.couponid;
    wx.navigateTo({
      url: '/pages/addressManagement/addressManagement?couponid=' + couponid
    })
  },
  //查询更多
  tabChange(event){
 
    this.setData({
      navActive:event.detail.index
    },()=>{
      this.getCouponsList();
    });
  },
  loadMore(){
    
  },
  // relunch() {
  //   wx.reLaunch({
  //     url: '/pages/mySelf/mySelf',
  //   })
  // },
  // onUnload() {
  //   this.relunch()
  // }
})