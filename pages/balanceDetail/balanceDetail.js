// pages/balanceDetail/balanceDetail.js
var util = require('../../utils/util.js');
var apiUrl = require('../../static/js/url.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:'余额明细',
    src: 'https://file.maiyatown.com/images/afterSale_none/sale_empty.png',
    money_more:true,
    balanceDetail: [],
    hasMore: true,
    isLoading: true,
    iPage:0,
    pageSize:10
  },
  goto_detail(option){
  const type =   option.currentTarget.dataset.item
      if(type=='1'){
        //订单退款
      }else if(type=='2'){
        // 订单支付
      } else if (type == '3') {
        // 余额提现
      } else if (type == '4') {
        // 售后退款
      } else if (type == '5') {
        // 佣金到账
      }
  },
  detail(){
    let { hasMore, isLoading, iPage, pageSize, balanceDetail}=this.data
    
    let that = this
    let token = wx.getStorageSync('myxzToken');
    let url = apiUrl.API_URL +'/api/my/detail';
    if (token) {
      iPage++;
      // let header = Object.assign({ 'auth-token': token }, headerData);
      wx.request({
        url: url+"?iPage="+iPage+"&pageSize="+pageSize,
        header: {
          'auth-token': token
        },
        success(res) {

          for (let i of res.data.resultList){
            i.amt = Number(i.amt).toFixed(2);
          }
          wx.hideLoading();
          let hasMore = iPage < Math.ceil(res.data.resultCount / 10) ? true : false;
          if (res.data.resultList.length ==0){
            that.setData({
              money_more:false
            })
          } 
            that.setData({
              // balanceDetail: res.data.resultList
              balanceDetail: [...balanceDetail, ...res.data.resultList],
              isLoading: false,
              hasMore,
              iPage
            })
          // that.setData({
          //   Total_revenue: res.data.data.totalCommission,
          //   Earnings_week: res.data.data.monthCommission,
          //   Earnings_month: res.data.data.monthCommission,
          //   jiesuan: res.data.data.unPayCommission,
          //   today_earn: res.data.data.todayCommission,
          //   inviterHeadImg: res.data.data.userFunAndInviter.inviterHeadImg,
          //   inviterNickName: res.data.data.userFunAndInviter.inviterNickName,
          //   inviterTime: res.data.data.userFunAndInviter.inviterTime,
          //   todayFuns: '\n' + res.data.data.userFunAndInviter.todayFuns,
          //   yesterdayFuns: '\n' + res.data.data.userFunAndInviter.yesterdayFuns,
          //   funsCount: '\n' + res.data.data.userFunAndInviter.funsCount,
          // });
        }
      })
    } else {
      wx.navigateTo({
        url: "/pages/init/init"
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.detail();
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
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onReachBottom() {

    if (this.data.isLoading == true || this.data.hasMore == false) {
      return
    }
    this.setData({
      isLoading: true
    })
    this.detail()
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})