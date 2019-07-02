// pages/maiyaBalanceDetail/maiyaBalanceDetail.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title: '明细',
    navActive: 0,
    navNames: ['本周收益', '本月收益', '待结余额'],
    mode: 'scaleToFill',
    list:[],
    hasMore: true,
    isLoading: true,
    iPage:0,
    pageSize: 10,
    statusBarHeight: 40
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.showLoading({
      title: '加载中',
      success:function(){
        that.getList()
      }
    })
    wx.getSystemInfo({
      success: (res) => {
        console.log(res.statusBarHeight)
        let statusBarHeight = res.statusBarHeight * 2
        console.log(statusBarHeight)
        this.setData({
          statusBarHeight
        })
      }
    });
  },
  getList() { 
    let { list, pageSize,navActive,iPage } = this.data
    let that = this
    console.log("navactive",navActive)
    iPage++
    let reqObj = {
      url: `/api/my/weekly/commission/detail?iPage=${iPage}&pageSize=10`
    }
    if(navActive==1){
      reqObj = {
        url: `/api/my/month/commission/detail?iPage=${iPage}&pageSize=10`
      }
    }else if(navActive==2){
      reqObj = {
        url: `/api/my/pendCommission/detail?iPage=${iPage}&pageSize=10`
      }
    }


    util.RequestGet(reqObj, null, (res, message) => {
      console.log(res)
      let hasMore = iPage < Math.ceil(res.resultCount / pageSize) ? true : false;
      that.setData({
        hasMore,
        isLoading: false,
        iPage,
        list: [...list, ...res.resultList]
      })
      wx.hideLoading();
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  tabChange(event) {
    console.log(event)
    this.setData({
      navActive: event.detail.index,
      list:[],
      iPage:0,
      hasMore: true,
      isLoading: true,
    },()=>{
      let that = this
      wx.showLoading({
        title: '加载中',
        success: function () {
          that.getList()
        }
      })
    });
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
    let that = this
    if (this.data.isLoading == true || this.data.hasMore == false) {
      return
    }

    that.setData({
      isLoading: true
    })
    that.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})