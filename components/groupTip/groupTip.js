// components/appointmentTip/appointmentTip.js
const app = getApp()
var apiUrl = require('../../static/js/url.js');
var util = require('../../utils/util.js');
Component({
  properties: {
    testdata: {
      type: Number,
      value: 0
    }
  },
  lifetimes: {
    attached() {
      //初始化全局的 定时器
      this.theTimer = null;
      let _this = this;
      _this.setData({
        groupTimeData: app.globalData.groupTimeData
      })
      app.watch$('groupTimeData', (n, o) => {
        if (n.length > 0) {
          //清掉计时器
          clearInterval(this.theTimer);
          //第一次触发定时器
          n.forEach((item, index) => {
            item.remainderTime = item.remainderTime - 1000;
            //倒计时转换 为 时分秒
            let timeArr = _this.countTime1(item.remainderTime);
            item.hhhh = timeArr[0]
            item.mmmm = timeArr[1]
            item.ssss = timeArr[2]
          })
          _this.setData({
            groupTimeData: n,
            tipShow: app.globalData.openGroupTip
          }, () => {
            this.theTimer = setInterval(() => {
              n.forEach((item, index) => {
                item.remainderTime = item.remainderTime - 1000;
                //倒计时转换 为 时分秒
                let timeArr = _this.countTime1(item.remainderTime);
                item.hhhh = timeArr[0]
                item.mmmm = timeArr[1]
                item.ssss = timeArr[2]
              })
              _this.setData({
                groupTimeData: n
              })
            }, 1000)
          })
        }
      })
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  data: {
    //拼团数据
    appointmentTimeData: [],
    hhhh: '00',
    mmmm: '00',
    ssss: '00',
    //蹦出弹出款
    tipShow: false,
    userId: "",
    copywriting: "",
    imgUrl: "",
    goodImg: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 隐藏canvas画的图
    share_hide: function () {
      this.setData({
        GetImage: false
      })
    },
    // canvas画图分享的发放 （保存图片，绘制分享图）
    eventDraw() {
      this.setData({
        GetImage: true
      })
      let reqObj = {
        url: '/api/generate/code',
        data: {
          "autoColor": true,
          "page": "pages/goodsDetails1/goodsDetails1",
          "scene": userid + "#" + goodid + '#' + activityid + '#' + ptid + '#' + left,
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
          this.setData({
            copywriting: res.data.copywriting,
            imgUrl: res.data.imgUrl
          })
          //回到顶部
          wx.pageScrollTo({
            scrollTop: 0
          })
          wx.showLoading({
            title: '绘制分享图片中',
            mask: true
          })
          console.log(this.data.copywriting, this.data.imgUrl)
          this.setData({
            painting: {
              width: 375,
              height: 555,
              clear: true,
              views: [
                // 背景白图
                {
                  type: "image",
                  url:
                    "https://file.maiyatown.com/images/v1.2/home_bg.png",
                  top: 0,
                  left: 0,
                  width: 375,
                  height: 555
                },
                // 最上面的小麦
                {
                  type: "image",
                  url:
                    "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621165146153.png",
                  top: 12,
                  left: 99,
                  width: 35,
                  height: 35
                },
                {
                  type: "text",
                  content: "元素城堡",
                  fontSize: 16,
                  color: "#402D16",
                  textAlign: "left",
                  top: 25,
                  left: 146,
                  bolder: true
                },
                // 中间的图 this.data.imgUrl   "https://file.maiyatown.com/images/v1.2/home_share_img1.png"
                {
                  type: "image",
                  url:
                    "https://file.maiyatown.com/images/v1.2/home_share_img1.png",
                  top: 60,
                  left: 32.5,
                  width: 310,
                  height: 350
                },
                // 二维码图片
                // {
                //   type: 'image',
                //   url: 'https://file.maiyatown.com/images/v1.2/home_share_img3.png',
                //   top: 420,
                //   left: 250,
                //   width: 88,
                //   height: 88
                // },
                // 动态生成的字
                {
                  type: "text",
                  content: this.data.copywriting,
                  fontSize: 14,
                  color: "#101010",
                  textAlign: "left",
                  top: 440,
                  left: 32.5,
                  lineHeight: 20,
                  MaxLineNumber: 2,
                  breakWord: true,
                  width: 155,
                  bolder: true
                }
              ]
            }
          });
        }
      })
    },
    // 保存图片的方法
    eventSave() {
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
    goToSpell(event) {
      console.log(event.currentTarget.dataset.item.activityId, event.currentTarget.dataset.item.goodsId, event.currentTarget.dataset.item.groupId)
      wx.navigateTo({
        url: '/pages/myRegimentDetails/myRegimentDetails?activityId=' + event.currentTarget.dataset.item.activityId + '&goodsId=' + event.currentTarget.dataset.item.goodsId + '&groupBuyingId=' + event.currentTarget.dataset.item.groupId
      })
    },
    closeTip() {
      app.globalData.openGroupTip=false;
      this.setData({
        tipShow: false
      })
    },
    //时间差转成时分秒
    countTime1(timeDiff) {
      var leftTime = timeDiff;
      //定义变量 d,h,m,s保存倒计时的时间
      var d, h, m, s;
      if (leftTime >= 0) {
        d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
        m = Math.floor((leftTime / 1000 / 60) % 60);
        s = Math.floor((leftTime / 1000) % 60);
        if (d < 10) { d = '0' + d }
        if (h < 10) { h = '0' + h }
        if (m < 10) { m = '0' + m }
        if (s < 10) { s = '0' + s }
      } else {
        return ['00', '00', '00'];
      }
      //将倒计时赋值到div中
      // console.log(d*24+parseInt(h) + "时", m + "分", s + "秒");
      let hh = 0;
      if ((d * 24) + parseInt(h) > 99) {
        hh = 99;
      } else {
        let _hh = (d * 24) + parseInt(h);
        hh = _hh < 10 ? '0' + _hh : _hh;
      }
      return [hh, m, s]
    }
  },
  onLoad(options) {
    util.getNowUserId((userId) => {
      this.setData({
        userId
      })
    })
    console.log(userId);
  },
  //分享函数
  onShareAppMessage() {
    // console.log()
    // let numberText = Math.floor(Math.random() * 5);
    // let reqObj = {
    //   url: '/api/sharing/addShareLog',
    //   data: {
    //     type: 2,
    //     shareUserId: this.data.userId
    //   }
    // }
    // util.RequestPost(reqObj, null, (res, message) => {
    //   if (res.resCode == '0000') {
    //     //成功数据
    //   }
    // })
    //..要加个 用户ID

    return {
      title: util.commonText2[numberText],
      // ?userId=' + this.data.userId + '&id=' + this.data.goodId + '&activityId=' + this.data.activityId + '&path=myRegimentDetails',
      path: '/pages/myRegimentDetails1/myRegimentDetails1',
      imageUrl: this.data.goodImg
    }
  },
})