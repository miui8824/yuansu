// pages/customersManagement/customersManagement.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title: '客户管理',
    showNomore:true,//是否显示底线
    navActive: 0,
    navNames: ['普通会员', '麦芽会员', '麦苗会员', '麦穗会员'],
    list:[
    ],
    hasMore: true,
    isLoading: true,
    iPage: 0,
    pageSize: 10,
    mode: 'scaleToFill',
    statusBarHeight:40
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //计算下拉框的 高度
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
    let that = this
    this.showMore()
    wx.showLoading({
      title: '加载中',
      success: function () {
        that.getList()
      }
    })
  },


//监听页面高度判断是否展示底线
  showMore(){
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        let screenHeight = res.screenHeight
        if(that.data.list.length!=0){
          wx.createSelectorQuery().select('#btLine').boundingClientRect().exec(function (res) {
            console.log(res)
            if (res[0].top + 64 > screenHeight) {
              that.setData({
                showNomore: true
              })
            } else {
              that.setData({
                showNomore: false
              })
            }
          })
        }

      },
    })
  },

  getList() {
    let { iPage, pageSize, list ,navActive} = this.data
    let that = this
    iPage++
    console.log(iPage)
    var reqObj = {
      url: `/api/user/manager?pageNum=${iPage}&&pageSize=${pageSize}&&type=${navActive+1}`
    }
    console.log(reqObj)
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
      }
      if (res.resCode == '0000') {
        console.log(res)
        let resultList = res.resultList
        if (resultList == null) {
          resultList = []
        }
        for (let i of resultList) {
          i.createTime = that.formatDate(new Date(i.createTime))
          i.amt = Number(i.amt).toFixed(2)
        }
        let hasMore = iPage < Math.ceil(res.resultCount / pageSize) ? true : false;
        that.setData({
          hasMore,
          isLoading: false,
          iPage,
          list: [...list, ...resultList]
        }, () => {
          that.showMore()
        })
      }
      wx.hideLoading();
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  tabChange(event) {
    console.log(event)
    this.setData({
      navActive: event.detail.index,
      list: [],
      iPage: 0,
      hasMore: true,
      isLoading: true,
      showNomore:true
    }, () => {
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