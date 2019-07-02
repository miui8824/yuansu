// pages/preBalanceDetail/preBalanceDetail.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title: '待结算余额明细',
    pendCommissionList:[
      // {
      //   acctAmtValue:"+0.91",
      //   acctDateValue:"2019-03-11 13:45:04",
      //   acctTransType:8,
      //   dcType:"C",
      //   headImageUrl:"https://file.maiyatown.com/images/orderPayment/dingwei.png",
      //   id:1,
      //   nickName:'tzgznb'
      // }
    ],
    isOver: false,
    iPage: 0,
    pageSize: 10,
    hasMore: true,
    isLoading: true,
    mode: 'scaleToFill',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPendCommission()
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  getPendCommission(){
    let { iPage, pendCommissionList, pageSize } = this.data
    let that = this
    iPage++
    let reqObj = {
      url: `/api/my/pendCommission/detail?iPage=${iPage}&pageSize=10`
    }

    util.RequestGet(reqObj, null, (res, message) => {
      console.log(res)
      let hasMore = iPage < Math.ceil(res.resultCount / pageSize) ? true : false;
      for (let i of res.resultList) {

      }
      that.setData({
        hasMore,
        isLoading: false,
        iPage,
        pendCommissionList: [...pendCommissionList, ...res.resultList]
      })
    })
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
    this.getPendCommission()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})