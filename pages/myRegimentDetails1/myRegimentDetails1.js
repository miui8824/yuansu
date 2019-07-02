// pages/myRegimentDetails/myRegimentDetails.js
const app = getApp()
var apiUrl = require('../../static/js/url.js');
var util = require('../../utils/util.js');
import Toast from '../../dist/toast/toast';
var WxParse = require('../../wxParse/wxParse.js');
import Dialog from '../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"麦芽小镇-拼团",
    showIcon: false,
    orderList: [{}, {}, {}],
    items: [],
    groupBuyingId: "",
    activityId:"",
    goodsId:"",
    userId:null,
    //拆红包新用户
    newUser: false,
    //是否帮拆
    isHelpRed: false,
    //..help
    userWhiteList: false,//当前用户是否是白名单
    helpRedShow: false, //帮拆红包
    helpRedOnShow: false, //帮开红包已打开
    inviteeValue: 0,
    inviterValue: 0,
    redUp: 0,
    isEnd: false,//当前用户活动时间是否结束
    isDismantle: false, //红包是否拆完
    redTotalOver: false, //所有红包是否发完
    strDouble: null,//领取X倍红包
  },
  //返回首页
  goHome() {
    app.globalData.isFromDetail1 = true
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  // 计算时分秒
  pintuan_time() {
    let that = this
    var diff = this.data.pintuan_js;
    that.setData({
      // intervalControll: false,

      time: setInterval(function () {

        if (diff <= 0) {
          
          clearInterval(that.data.time);
          that.setData({
            hour:0,
            minute:0,
            second:0
          })
          return false;
        } else {
          diff = diff - 1000;
          var days = Math.floor(diff / (24 * 3600 * 1000));

          //计算出小时数  
          var leave1 = diff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数  
          var hours = Math.floor(leave1 / (3600 * 1000));
          //计算相差分钟数  
          var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数  
          var minutes = Math.floor(leave2 / (60 * 1000));

          //计算相差秒数  
          var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数  
          var seconds = Math.round(leave3 / 1000);
          // console.log('aaa', diff)

          that.setData({
            day: days<=0?0:days,
            hour: hours < 10 ? '0' + hours : hours,
            minute: minutes < 10 ? '0' + minutes : minutes,
            second: seconds < 10 ? '0' + seconds : seconds,

          })
          // console.log(days+"天"+hours+"小时"+minutes+"分"+seconds+"秒")
        }
      }, 1000)
    })
  },
  formatDate(now) { //时间戳转化为具体的日期
    var year = now.getFullYear();
    var month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
    var date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    var hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
    var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
    return year + "." + month + "." + date + " " + hour + ":" + minute + ":" + second;
  },
  //跳转到商品详情
  goElespintuan(){
    //未绑定手机号
    let userInfo = wx.getStorageSync('myxzUserInfo');
    if (!userInfo.mobile) {
      Dialog.confirm({
        title: "请先绑定手机号",
        message: '      ',
        zIndex: 102
      }).then(() => {
        // on confirm
        wx.navigateTo({
          url: '/pages/bindPhone/bindPhone?groupId=' + this.data.groupBuyingId + '&activityId=' + this.data.activityId + '&goodsId=' + this.data.goodsId + '&out_showinvite=true'
        })
      }).catch(() => {
        // on cancel
      });
      return false;
    }
    console.log(this.data.goodsId);
    wx.redirectTo({
      url: '/pages/groupDetails/groupDetails?groupId=' + this.data.groupBuyingId + '&activityId=' + this.data.activityId + '&goodsId=' + this.data.goodsId +'&out_showinvite=true',
    })
  },
  // 进入拼团详情
  myGroupInfo() {
    let that = this;
    let token = wx.getStorageSync('myxzToken');
    //  token = "t_1_1_eeabc2c9-939b-4026-acdc-590eb1fb7067"
    let reqObj = {
      url: '/api/myGroup/toGroupInfo?auth-token=' + token,
      data: {
        groupBuyingId: this.data.groupBuyingId
      }
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
      }
      if (res.resCode == '0000') {
        for (let i of res.data.orderGoods) {
          i.goodPrices = Number(i.goodPrices).toFixed(2);
        }
        if(res.data.assembleSetting != null){
          WxParse.wxParse('article', 'html', res.data.assembleSetting, this, 0);
        }
        this.setData({
          orderGoods: res.data.orderGoods,
          items: res.data.groupBuyingPartInfo,
          status: res.data.status,
          usercount: res.data.userLimit - res.data.userCount,
          pintuan_js: res.data.deadline - res.data.sysTime
        })
        console.log(this.data.orderGoods);
        this.pintuan_time();
        // this.diffTime()
        console.log(res);

        let datas = res.data.groupBuyingPartInfo
        for (let i = 0; i < datas.length; i++) {
          datas[i].createTime = this.formatDate(new Date(datas[i].createTime));
        }
        this.setData({
          items: datas,
          all_data: res.data
        })
        // this.formatDate(new Date(res.data));
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.scene){
      console.log('通过二维码扫进来的');
      let scene = decodeURIComponent(options.scene);
      console.log(scene);
      let sceneArr = scene.split('#');
      console.log(sceneArr);
      this.setData({
        activityId: parseInt(sceneArr[2], 32),
        goodsId: parseInt(sceneArr[1], 32),
        groupBuyingId: parseInt(sceneArr[3], 32)
      })
      console.log(this.data.activityId, this.data.goodsId, this.data.groupBuyingId);
      this.myGroupInfo();
      app.globalData.upUserId = parseInt(sceneArr[0], 32);
      util.bindfriend(parseInt(sceneArr[0], 32))//绑定好友关系
      // let activityId = parseInt(sceneArr[2], 32);//将32进制的转化为10进制的
      // let goodsId = parseInt(sceneArr[1], 32);//将32进制的转化为10进制的
      // let groupBuyingId = parseInt(sceneArr[3], 32)
      // let groupBuyingId = parseInt(sceneArr[3], 32)
    }else{
      console.log(options);
      console.log(options);
      if (options.upUserId) {
        app.globalData.upUserId = options.upUserId;

        console.log('邀请人ID', options.upUserId)
      }
      if(options.userId){
        console.log('这个是有userId的');
        util.bindfriend(options.userId)//绑定好友关系
      }
      this.userHavePlay()
      this.setData({
        // 178  options.groupBuyingId348
        groupBuyingId: options.groupBuyingId,
        //  options.activityId
        activityId: options.activityId,
        // options.id
        goodsId: options.id
      });
      this.myGroupInfo();
    }

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
    //..userId
    util.getNowUserId((userId) => {
      this.setData({
        userId
      })
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

  },
  //判断用户是否参与过活动
  userHavePlay() {
    let that = this
    let reqObj = {
      url: '/api/user/userRedActivityIsNo'
    }
    util.RequestPost(reqObj, null, (res, message) => {
      console.log("是否参加", res)
      if (res.resCode == '0000') {
        let that = this
        if (res.data.userWhiteList == 1) {
          that.setData({
            userWhiteList: false
          })
        } else {
          that.setData({
            userWhiteList: true
          })
        }
        if (res.data.newUser == 1) {
          that.setData({
            newUser: true
          })
        }
        if (res.data.newUser == 0) {
          that.setData({
            newUser: false
          })
        }
        if (res.data.isTake == 1) {
          that.setData({
            isTake: true
          })
        } else {
          that.setData({
            isTake: false
          })
        }

        if (res.data.isHelp == 1) {
          that.setData({
            isHelp: true
          })
        } else {
          that.setData({
            isHelp: false
          })
        }
        //未参加
        if (res.data.userWhiteList == 2 && res.data.isTake != 1 && res.data.isTotalDismantle != 1) {
          that.setData({
            isHelpRed: false,
            helpRedShow: true,
            redUp: res.data.redUp
          })
        }

        if (res.data.newUser == 1 && res.data.isTake != 1 && res.data.isTotalDismantle != 1) {
          that.setData({
            isHelpRed: false,
            helpRedShow: true,
            redUp: res.data.redUp
          })
        }

        
        if (res.data.isEnd == 1) {
          that.setData({
            isEnd: true
          })
        }
        if (res.data.isDismantle == 1 && res.data.isTotalDismantle != 1) {
          that.setData({
            helpRedShow: true,
            redUp: res.data.redUp,
            isDismantle: true
          })
        }
        if (res.data.isTotalDismantle == 1) {
          that.setData({
            redTotalOver: true
          })
        }
      }
    })
  },
  //打开帮拆红包
  openHelpRed() {
    //发送请求
    let that = this
    let reqObj = {
      url: '/api/activity/userRedActivity'
    }
    util.RequestPost(reqObj, null, (res, message) => {
      console.log(res, message)
      if (message) {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              that.setData({
                helpRedShow: false,
                helpRedOnShow: false
              })
              that.userHavePlay()
            }, 2000)
          }
        })
      }
      if (res.resCode == '0000') {
        //成功且获取到金额数据
        if (res.data.isHelp == 0) {
          if (res.data.isPrize == 1) {
            this.setData({
              helpRedShow: false,
              helpRedOnShow: false
            })
            wx.navigateTo({
              url: '/pages/helpRed/helpRed'
            })
          }
          console.log("接口返回是否帮拆0", res.data.isHelp)
          this.setData({
            isHelpRed: false,
            inviteeValue: Number(res.data.inviteeValue).toFixed(2),
            inviterValue: Number(res.data.inviterValue).toFixed(2),
            redUp: res.data.redUp,
            isTake: true
          })
        } else {
          console.log("接口返回是否帮拆1", res.data.isHelp)
          this.setData({
            isHelpRed: true,
            helpRedOnShow: true,
            inviteeValue: Number(res.data.inviteeValue).toFixed(2),
            inviterValue: Number(res.data.inviterValue).toFixed(2),
            redUp: res.data.redUp,
            strDouble: res.data.strDouble,
            isTake: true
          })
        }
        that.setData({
          helpRedOnShow: true
        })
      }
    })

  },
  //跳转红包活动
  goRedPlay() {
    let { newUser, isTake } = this.data
    let that = this
    if (newUser && !isTake) {
      that.setData({
        helpRedShow: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/helpRed/helpRed',
      })
      that.setData({
        helpRedShow: false,
        helpRedOnShow: false
      })
    }

  },
  //帮拆红包关闭
  helpRedClose() {
    this.setData({
      helpRedShow: false,
      helpRedOnShow: false
    })
  }
})