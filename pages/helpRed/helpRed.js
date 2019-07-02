// pages/helpRed/helpRed.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title: '红包拆拆拆',
    inviteTimes:0,//邀请次数
    scrollWidth:0, //横向滚动条的宽度
    showRedMask:false, //显示活动规则
    inviterLists:[],
    dismantledRed:0.00,//已拆红包金额
    redUp: 50,//奖品最高上限
    stillHaveRed:50,
    redStep: 13.25 / 50 * 492,
    activityRule: "",
    inviteNum:0, //邀请数量
    isEnd:0, //当前用户活动是否结束
    doubleRed:0,//金额翻倍位数
    endTime:0,//当前用户活动结束时间
    hour:0,
    minute:0,
    second:0,
    timer:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let inviteTimesGlobal = app.globalData.inviteTimes;
    this.setData({
      inviteTimes: inviteTimesGlobal||0
    })
    let _this=this;
    //发送请求
    // let reqObj = {
    //   url: '/api/activity/userRedActivityDetail'
    // }
    // util.RequestPost(reqObj, null, (res, message) => {
    //   console.log(res, message)
    //   if (message) {
    //     wx.showToast({
    //       title: res.resDesc,
    //       icon: 'none',
    //       duration: 1500
    //     })
    //   }
    //   if (res.resCode == '0000') {
    //     this.setData({
    //       doubleRed: res.data.doubleRed
    //     })
    //     for(let i of res.data.inviterLists){
    //       // if((res.data.inviterLists.indexOf(i)+1) % this.data.doubleRed==0){
    //       //   i.inviteMoney = i.inviteMoney*2
    //       // }
    //       i.inviteMoney = Number(i.inviteMoney).toFixed(2)
    //     }
    //     //成功数据
    //     this.setData({
    //       activityRule:res.data.activityRule, 
    //       inviterLists:res.data.inviterLists, 
    //       dismantledRed:Number(res.data.dismantledRed).toFixed(2)||Number(0).toFixed(2), 
    //       redUp: Number(res.data.redUp).toFixed(2), 
    //       inviteNum:res.data.inviteNum,
    //       redStep: (res.data.dismantledRed / res.data.redUp)*492,
    //       endTime: res.data.startTime + 86400000,
    //       doubleRed: res.data.doubleRed
    //     })
    //     var timestampNow = (new Date()).getTime();
    //     // console.log(timestampNow)
    //     let { activityRule, inviterLists, dismantledRed, redUp, inviteNum,doubleRed, endTime } = this.data
    //     let leftTime = endTime-timestampNow
    //     leftTime=leftTime/1000
    //     this.activityCountDown(leftTime)
    //   }
    // })
    //计算横向滚动的宽度
    wx.getSystemInfo({
      success: function (res) {
        wx.createSelectorQuery().select('.mian_main1').boundingClientRect(function (rect) {
          _this.setData({
            scrollWidth: Number(rect.width) // 节点的宽度
          });
        }).exec();
      },
    });
  },

  //倒计时函数
  activityCountDown:function(leftTime){
    let { timer } = this.data
    let that = this
    that.setData({
      timer: setInterval(function () {
        let day = 0,
          hour = 0,
          minute = 0,
          second = 0;//时间默认值
        if (leftTime > 0) {
          day = Math.floor(leftTime / (60 * 60 * 24));
          hour = Math.floor(leftTime / (60 * 60)) - (day * 24);
          minute = Math.floor(leftTime / (60)) - (day * 24 * 60) - (hour * 60);
          second = Math.floor(leftTime) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (day <= 9) day = '0' + day;
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        //
        console.log(hour + "小时：" + minute + "分钟：" + second + "秒");
        that.setData({
          hour,
          minute,
          second
        })
        if (leftTime <= 0) {
          that.setData({
            isEnd: 1,
            title: "活动页面"
          }, () => {
            // console.log("isEnd", that.data.isEnd)
          })
          clearInterval(that.data.timer);
        }
        leftTime--;
      }, 1000)
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  showRules:function(){
    this.setData({
      showRedMask:true
    })
  },
  closeRules:function(){
    this.setData({
      showRedMask: false
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //发送请求
    let reqObj = {
      url: '/api/activity/userRedActivityDetail'
    }
    util.RequestPost(reqObj, null, (res, message) => {
      console.log(res, message)
      if (message) {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 1500
        })
      }
      if (res.resCode == '0000') {
        this.setData({
          doubleRed: res.data.doubleRed
        })
        for (let i of res.data.inviterLists) {
          // if((res.data.inviterLists.indexOf(i)+1) % this.data.doubleRed==0){
          //   i.inviteMoney = i.inviteMoney*2
          // }
          i.inviteMoney = Number(i.inviteMoney).toFixed(2)
        }
        //成功数据
        this.setData({
          activityRule:res.data.activityRule,
          inviterLists: res.data.inviterLists,
          dismantledRed: Number(res.data.dismantledRed).toFixed(2) || Number(0).toFixed(2),
          redUp: Number(res.data.redUp).toFixed(2),
          stillHaveRed: Number(res.data.redUp - res.data.dismantledRed).toFixed(2),
          inviteNum: res.data.inviteNum,
          redStep: (res.data.dismantledRed / res.data.redUp) * 492,
          endTime: res.data.startTime + 86400000,
          doubleRed: res.data.doubleRed
        })
        var timestampNow = res.data.newTime;
        // console.log(timestampNow)
        let {inviterLists, dismantledRed, redUp, inviteNum,doubleRed, endTime } = this.data
        let leftTime = endTime-timestampNow
        leftTime=leftTime/1000
        this.activityCountDown(leftTime)
      }
    })
    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, '', '');
    if (wx.getStorageSync('myxzToken')) {
      //..userId
      util.getNowUserId((userId) => {
        app.globalData.userIdPro=userId
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
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
  onShareAppMessage: function (res) {
    let that = this;
    //邀请人ID和帮拆邀请人ID取同一个
    let upUserId = app.globalData.userIdPro;
    let { inviteTimes } = that.data
    // console.log(inviteTimes)
    inviteTimes++
    app.globalData.inviteTimes=inviteTimes;
    that.setData({
      inviteTimes
    })
    return {
      title:"快来帮我拆红包，一起免费领现金！",
      imageUrl:"https://file.maiyatown.com/images/utils/red_envelope_img_share1.png",
      path: "/pages/home/home?upUserId=" + upUserId + '&userId=' + upUserId
    }
  }
})