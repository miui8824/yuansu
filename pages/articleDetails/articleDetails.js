// pages/articleDetails/articleDetails.js
const app = getApp();
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title: '文章详情',
    showNomore:true,
    isImg:true,
    info:{},
    article: '',//富文本
    vid:null,
    userId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    //..userId
    util.getNowUserId((userId) => {
      that.setData({
        userId
      },()=>{
        console.log(that.data.userId)
      })
    })
    if (options.isArticalShare){
      app.globalData.userIdPro = options.userId;
      this.setData({
        id: options.id,
        showIcon: false
      }, () => {
        that.getInfo()
      })
    }else{
      console.log(options)
      this.setData({
        id: options.id,
      }, () => {
        that.getInfo()
      })
    }


  },
  error(e){
    console.log(e)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  showMore() {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        let screenHeight = res.screenHeight
        wx.createSelectorQuery().select('#btLine').boundingClientRect().exec(function (res) {
          console.log(res)
          if (res[0].top + 64 > screenHeight-49) {
            that.setData({
              showNomore: true
            })
          } else {
            that.setData({
              showNomore: false
            })
          }
        })

      },
    })
  },

  getInfo() {
    let { id } = this.data
    let that = this
    var reqObj = {
      url: `/api/research/articleDetail?id=${id}`
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
      }
      if (res.resCode == '0000') {
        console.log(res)
        // 富文本
        if (res.data.content != null) {
          WxParse.wxParse('article', 'html', res.data.content, this, 0);
        }
        res.data.createTime = that.formatDate(new Date(res.data.createTime))
        let vid = res.data.videoUrl.substr(-16,11)
        // console.log('vid',vid)
        
        if (res.data.videoUrl != "") {
          that.setData({
            isImg: false
          })
        } else if (res.data.videoUrl == "") {
          that.setData({
            isImg: true
          })
        }


        this.setData({
          info:res.data,
          vid
        }, () => {
          that.showMore()
        })
      }
    })
  },

  formatDate(now) { //时间戳转化为具体的日期
    var year = now.getFullYear();
    var month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
    var date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    var hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
    var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
    return year + "-" + month + "-" + date;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let { id, info, userId} = this.data
    console.log(res)
    return{
      title:info.title,
      path: `pages/articleDetails/articleDetails?id=${id}&&isArticalShare=true&&userId=${userId}`
    }
  }
})