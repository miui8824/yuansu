// pages/businessBooks/businessBooks.js
const app = getApp();
var apiUrl = require('../../static/js/url.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title: '商务账簿',
    showNomore:true,
    navActive: 0,
    navNames: ['销售收益', '我的会员'],
    saleProceedsList:[
    ],
    myMembershipList:[
    ],
    totalNum:0,
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
        let statusBarHeight = res.statusBarHeight*2
        console.log(statusBarHeight)
        this.setData({
          statusBarHeight
        })
      }
    });
    let that = this
    that.showMore1()
    wx.showLoading({
      title: '加载中',
      success: function () {
        that.getList()
      }
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  getList() {
    let { iPage, pageSize, navActive, saleProceedsList , myMembershipList} = this.data
    let that = this
    iPage++
    var reqObj = {
      url: `/api/businessAccount/mySalesRevenue?iPage=${iPage}&&pageSize=${pageSize}`
    }
    if (navActive==1){
      reqObj={
        url: `/api/businessAccount/myFixedFansList?iPage=${iPage}&&pageSize=${pageSize}`
      }
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
      }
      if (res.resCode == '0000') {
        console.log(res)
        let resultList = res.resultList
        if (resultList==null){
          resultList=[]
        }
        for(let i of resultList){
          i.orderTime = that.formatDate(new Date(i.orderTime))
        }
        if (navActive == 1){
          for (let i of resultList) {
            if (i.receivePhone!=null) {
              i.receivePhone = i.receivePhone.substr(0, 3) + "****" + i.receivePhone.substr(7)
            }
          }
        }else{
          for (let i of resultList) {
            i.expCommissionAmt = Number(i.expCommissionAmt).toFixed(2)
            i.realPayAmout = Number(i.realPayAmout).toFixed(2)
          }
        }


        if (navActive==0){
            let hasMore = iPage < Math.ceil(res.resultCount / pageSize) ? true : false;
            that.setData({
              hasMore,
              isLoading: false,
              iPage,
              saleProceedsList: [...saleProceedsList, ...resultList]
            }, () => { 
              that.showMore1()
            })

        } else if (navActive==1){
            let hasMore = iPage < Math.ceil(res.resultCount / pageSize) ? true : false;
            that.setData({
              hasMore,
              isLoading: false,
              iPage,
              myMembershipList: [...myMembershipList, ...resultList],
              totalNum:res.data
            },()=>{
              that.showMore2()
            })
        }
      }
      wx.hideLoading();
    })
    
  },

  //监听页面高度判断是否展示底线
  showMore1() {
    console.log("执行了1")
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        let screenHeight = res.screenHeight
        console.log(screenHeight)
        that.setData({
          showNomore:false
        })
        if (that.data.saleProceedsList.length != 0) {
          that.setData({
            showNomore: true
          })
          console.log("111111111")
          wx.createSelectorQuery().select('#btLine').boundingClientRect().exec(function (res) {
            console.log(res)
            if (res[0].top + 64 > screenHeight && that.data.saleProceedsList.length != 0) {
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

  showMore2() {
    console.log("执行了2")
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        let screenHeight = res.screenHeight
        that.setData({
          showNomore: false
        })
        if (that.data.myMembershipList.length != 0) {
          console.log("22222222222")
          that.setData({
            showNomore: true
          })
          wx.createSelectorQuery().select('#btLine').boundingClientRect().exec(function (res) {
            console.log(res)
            if (res[0].top + 64 > screenHeight && that.data.myMembershipList.length != 0) {
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

  tabChange(event) {
    let that = this
    console.log(event)
    this.setData({
      navActive: event.detail.index,
      iPage: 0,
      hasMore: true,
      isLoading: true,
      showNomore:true
    }, () => {
      let that = this
      if (that.data.navActive == 0) {
        that.setData({
          saleProceedsList: []
        },()=>{
          that.getList()
        })
      } else {
        that.setData({
          myMembershipList: []
        },()=>{
          that.getList()
        })
      }
      wx.showLoading({
        title: '加载中'
      })

    });
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