// pages/myRegimentDetails/myRegimentDetails.js
const app = getApp()
var apiUrl = require('../../static/js/url.js');
var util = require('../../utils/util.js');
import Toast from '../../dist/toast/toast';
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"拼团详情",
    showIcon: true,
    orderList: [{}, {}, {}],
    article: '', //富文本内容
    all_data:"",
    items: [],
    groupBuyingId:"",
    orderGoods:"",//订单商品信息  拼团详情
    status:"",
    usercount:"",
    time:"",
    day:"",//天
    hour:"",//小时
    minute:"",//分钟
    second:"",//秒数
    pintuan_js:'',//拼团结束相差的时间戳
    painting: {}, //canvas画图的变量
    shareImage: '',//canvas画图的变量
    userId:"",
    //红包邀请人Id
    upUserId: null,
  },
  //返回首页
  goHome() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  // 逛逛其他拼团
  goElespintuan(){
    wx.navigateTo({
      url: '/pages/groupHome/groupHome'
    })
  },
  //转发邀请好友
  invite_friend(){
    this.eventDraw();
  },
  
  // canvas画图分享的发放 （保存图片，绘制分享图）
  eventDraw() {
    this.setData({
      GetImage: true,
      shareImage: ""
    })
    
    // this.data.userId  this.data.all_data.goodsId  this.data.all_data.activityId
    // this.data.all_data.activityId
    let userid = parseInt(this.data.userId).toString(32)
    let goodid = parseInt(this.data.all_data.goodsId).toString(32)
    let activityid = parseInt(this.data.all_data.activityId).toString(32)
    let ptid = parseInt(this.data.all_data.id).toString(32)
    console.log(userid, goodid, activityid)
    // this.data.userId + '&id=' + this.data.goodId + '&activityId=' + this.data.activityId +
    let reqObj = {
      url: '/api/generate/code',
      data: {
        "autoColor": true,
        "page": "pages/myRegimentDetails1/myRegimentDetails1",
        "scene": userid + "#" + goodid + '#' + activityid + '#' + ptid,
        "width": 280
      }
    }
    util.RequestPost(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({
          title: "生成失败",
          icon: 'none',
          duration: 1500
        })
      }
      if (res.resCode == '0000') {
        console.log(res.data.copywriting, res.data.imgUrl);
        //成功数据
        // wx.showToast({
        //   title: '添加成功!',
        //   icon: 'success',
        //   duration: 1500
        // })
        //回到顶部
        wx.pageScrollTo({
          scrollTop: 0
        })
        wx.showLoading({
          title: '绘制分享图片中',
          mask: true
        })
       
        this.setData({
          painting: {
            width: 375,
            height: 555,
            clear: true,
            views: [
              // 背景白图
              {
                type: 'image',
                url: 'https://file.maiyatown.com/images/v1.2/home_bg.png',
                top: 0,
                left: 0,
                width: 375,
                height: 555
              },
              // 最上面的小麦
              {
                type: 'image',

                url: app.globalData.wechatheadImageUrl,
                top: 12,
                left: 32.5,
                width: 35,
                height: 35
              },

              {
                type: 'text',
                content: app.globalData.wechatnickName,
                fontSize: 16,
                color: '#402D16',
                textAlign: 'left',
                top: 20,
                left: 79.5,
                bolder: true
              },
              // 中间的图 this.data.imgUrl
              {
                type: 'image',
                url: this.data.all_data.orderGoods[0].goodImg,
                top: 60,
                left: 32.5,
                width: 310,
                height: 350
              },
              // 矩形
              {
                type: 'rect',
                background: 'red',
                top: 425,
                left: 170,
                width: 45,
                height: 20
              },
              // 拼团状态
              {
                type: 'text',
                content: "拼团中",
                fontSize: 12,
                color: '#FFFFFF',
                textAlign: 'left',
                top: 427,
                left: 175,
                lineHeight: 20,
                MaxLineNumber: 2,
                breakWord: true,
                width: 155,
                bolder: true
              },
              // 商品价格
              {
                type: 'text',
                content: "￥" + Number(this.data.all_data.orderGoods[0].goodPrices).toFixed(2),
                fontSize: 24,
                color: '#FF262C',
                textAlign: 'left',
                top: 420,
                left: 32.5,
                lineHeight: 20,
                MaxLineNumber: 2,
                breakWord: true,
                width: 155,
                bolder: true
              },
              // 二维码图片
              {
                type: 'image',
                url: res.data,
                top: 420,
                left: 250,
                width: 88,
                height: 88
              },
              // 动态生成的字
              {
                type: 'text',
                content: this.data.all_data.orderGoods[0].goodName,
                fontSize: 16,
                color: '#101010',
                textAlign: 'left',
                top: 460,
                left: 32.5,
                lineHeight: 20,
                MaxLineNumber: 2,
                breakWord: true,
                width: 155,
                bolder: true
              },
              // 二维码下面的字
              {
                type: 'text',
                content: "长按识别小程序码",
                fontSize: 12, 
                color: '#999999',
                textAlign: 'left',
                top: 520,
                left: 240,
                lineHeight: 20,
                // MaxLineNumber: 2,
                // breakWord: true,
                width: 155,
                bolder: true
              }
            ]
          }
        })
      }
    })


  },
  // 保存图片的方法
  eventSave() {
    // this.setData({
    //   GetImage: false
    // })
    var that = this
    console.log('aaa')
    console.log(this.data.shareImage);
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        console.log(res);
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        console.log(res)
        if (res.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || res.errMsg === "saveImageToPhotosAlbum:fail auth deny" || res.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
          console.log("打开设置窗口");
          that.imageRrrorAuth();
        }
      }
    })
  },
  share_hide: function () {
    this.setData({
      GetImage: false
    })
  },
  // 微信改版弹框授权
  imageRrrorAuth() {
    wx.showModal({
      title: '提示',
      content: '需要您授权保存相册',
      showCancel: false,
      success: modalSuccess => {
        wx.openSetting({
          success(settingdata) {
            console.log("settingdata", settingdata)
            if (settingdata.authSetting['scope.writePhotosAlbum']) {
              wx.showModal({
                title: '提示',
                content: '获取权限成功,再次保存图片即可',
                showCancel: false,
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '获取权限失败，将无法保存到相册',
                showCancel: false,
              })
            }
          },
          fail(failData) {
            console.log("failData", failData)
          },
          complete(finishData) {
            console.log("finishData", finishData)
          }
        })
      }
    })
  },

  // 获得图片的路径
  eventGetImage(event) {
    console.log(event)
    wx.hideLoading()
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath
      })
    }
  },


  // 进入拼团详情
  myGroupInfo() {
    let that = this;
    let token = wx.getStorageSync('myxzToken');
    //  token = "t_1_1_eeabc2c9-939b-4026-acdc-590eb1fb7067"
    let reqObj = {
      url: '/api/myGroup/myGroupInfo?auth-token=' + token,
      data: {
        groupBuyingId: this.data.groupBuyingId
      }
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
      }
      if (res.resCode == '0000') {
        for (let i of res.data.orderGoods){
          i.goodPrices=Number(i.goodPrices).toFixed(2);
        }
        if(res.data.assembleSetting != null){
          WxParse.wxParse('article', 'html', res.data.assembleSetting, this, 0);
        }
        this.setData({
          orderGoods: res.data.orderGoods,
          items:res.data.groupBuyingPartInfo,
          status: res.data.status,
          usercount: res.data.userLimit - res.data.userCount,
          pintuan_js: res.data.deadline - res.data.sysTime
        })
        this.pintuan_time();
        // this.diffTime()
        console.log(res);

        let datas = res.data.groupBuyingPartInfo
        for (let i = 0; i < datas.length;i++){
          datas[i].createTime = this.formatDate(new Date(datas[i].createTime));
        }
        this.setData({
          items: datas,
          all_data:res.data
        })
        // this.formatDate(new Date(res.data));
      }
    })
  },
  //去我的订单里的相应的订单详情
  Go_shareOrder(){
    console.log('Go_shareOrder')
    console.log(this.data.all_data);
    console.log(this.data.all_data.subId, this.data.all_data.id);
    wx.redirectTo({
      url: '/pages/orderAbout/orderAbout?orderId=' + this.data.all_data.id + '&subOrderId=' + this.data.all_data.subId
    })
  },
  // 根据时间戳计算相差时分秒
  diffTime(startDate, endDate) {
    var diff = this.data.pintuan_js ;//时间差的毫秒数  

    //计算出相差天数  
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
    console.log(days,hours,minutes,seconds)
    var returnStr = seconds + "秒";
    if (minutes > 0) {
      returnStr = minutes + "分" + returnStr;
    }
    if (hours > 0) {
      returnStr = hours + "小时" + returnStr;
    }
    if (days > 0) {
      returnStr = days + "天" + returnStr;
    }
    return returnStr;
  },
  // 计算时分秒
  pintuan_time(){
    let that = this
    var diff = this.data.pintuan_js;
    that.setData({
      // intervalControll: false,
     
      time: setInterval(function () {

        if (diff <= 0) {
          clearInterval(that.data.time);
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
            day:days,
            hour: hours < 10 ? '0' + hours:hours,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    // options.id    348
    if (options.upUserId) {
      app.globalData.upUserId = options.upUserId;
      console.log(options.upUserId)
    }
    this.setData({
      groupBuyingId: options.groupBuyingId 
    });
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
    clearInterval(this.data.time);
 
    this.myGroupInfo();
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
    clearInterval(this.data.time);
      this.setData({
        GetImage: false
      })
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.time);
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
    // this.setData({
    //   GetImage: false
    // })
    console.log(this.data.all_data);
    console.log(this.data.all_data.goodsId);
    console.log(this.data.all_data.activityId);
    console.log(this.data.all_data.id);

    return {
      title: this.data.all_data.orderGoods[0].goodName,
      path: '/pages/myRegimentDetails1/myRegimentDetails1?id=' + this.data.all_data.goodsId + '&activityId=' + this.data.all_data.activityId + '&groupBuyingId=' + this.data.all_data.id + '&userId=' + this.data.userId + '&order_show=true',
      imageUrl: this.data.all_data.orderGoods[0].goodImg
    }
  }
})