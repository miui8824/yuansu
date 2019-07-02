// pages/maiya/maiya.js
const app = getApp()
var util = require('../../utils/util.js');
var apiUrl = require('../../static/js/url.js');
Page({
  tapName: function () {
    // console.log('sadsa');

    // this.setData({
    //   hidden: false
    // });
    // 弹出框
    // wx.showModal({
    //   content: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
    //   showCancel: false,
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     }
    //   }
    // });

    // wx.showActionSheet({
    //   itemList: ['商品无货', '发货时间有问题', '不想要了','商品信息填写错误'],
    //   success: function (res) {
    //     console.log(res.tapIndex)
    //   },
    //   fail: function (res) {
    //     console.log(res.errMsg)
    //   }
    // })
  },

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: false,//引入的自定义导航左边返回按钮
    title: '麦芽页面',
    painting: {}, //canvas画图的变量
    shareImage2: '',//canvas画图的变量
    painting1: {}, //canvas画图的变量
    shareImage1: '',//canvas画图的变量
    nickName: "",
    avatarUrl: "",
    src: "https://file.maiyatown.com/images/maiya/banner_maiya.png",
    la: "https://file.maiyatown.com/images/maiya/after_sale_icon_more.svg",
    xiala: "https://file.maiyatown.com/images/maiya/after_sale_icon_spread.svg",
    hidden: true,
    nocancel: false,
    tabbar:{},
    Todayearnings: '',
    today_earn: "",
    Total_revenue: "",
    Earnings_week: "",
    Earnings_month: "",
    jiesuan: '',
    funsCount: "",
    todayFuns: "",
    yesterdayFuns: "",
    inviterTime: "",
    inviterNickName: "",
    inviterHeadImg: "",
    inviter_show: true,
    litteraye: true ,
    line: false,
    hasInviter:false,
    resultList: [

    ],
    inviterUserNum:0,//还差邀请好友数
    funsCount:"",
    userId:null,
    groupTimeData: [],
    appointmentTimeData: [],
    copywriting:"",//动态生成的canvas文案
    imgUrl:"",//动态生成的canvas图片
    ed2:1,
    editem:"",
    url:"",
    userid_weweima:"",
    bannerList:''
  },
  // canvas画图分享的发放 （保存图片，绘制分享图）
  eventDraw2(res) {
    // title
    console.log('这个是');
    //回到顶部
    wx.pageScrollTo({
      scrollTop: 0
    })

    console.log(res.currentTarget.dataset.item.goodImg);
    console.log(res);
    this.setData({
      GetImage1: true,
      ed2:2,
      shareImage2:null,
      shareImage1: null,
      painting:{},
      painting1: {},
      editem:res,

      url: res.currentTarget.dataset.item.goodImg
    })
    let title = res.currentTarget.dataset.item.title
    let price = Number(res.currentTarget.dataset.item.price).toFixed(2)
    let url = res.currentTarget.dataset.item.goodImg
    
    let goodid = res.currentTarget.dataset.item && res.currentTarget.dataset.item.id ? res.target.dataset.item.id : '';
    let activityid = res.currentTarget.dataset.item && res.currentTarget.dataset.item.id ? res.currentTarget.dataset.item.activityId : '';
    let userid = this.data.userId
    parseInt(activityid).toString(32)
    let ptid = ""
    let left = true
    let reqObj = {
      url: '/api/generate/code',
      data: {
        "autoColor": true,
        "page": "pages/goodsDetails1/goodsDetails1",
        "scene": parseInt(userid).toString(32) + "#" + parseInt(goodid).toString(32) + '#' + parseInt(activityid).toString(32) + '#' + ptid + '#' + left,
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
        console.log(res);

        // this.setData({
        //   copywriting: res.data.copywriting,
        //   imgUrl: res.data.imgUrl
        // })
        wx.showLoading({
          title: '绘制分享图片中',
          mask: true
        })
        this.setData({
          painting1: {
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
                url:app.globalData.wechatheadImageUrl,
                top: 12,
                left: 32.5,
                width: 35,
                height: 35
              },
              {
                type: 'text',
                content: app.globalData.wechatnickName,
                fontSize: 15,
                color: '#402D16',
                textAlign: 'left',
                top: 18,
                left: 79.5,
                bolder: true
              },
              // 中间的图 this.data.imgUrl
              {
                type: 'image',
                url: url,
                top: 60,
                left: 32.5,
                width: 310,
                height: 350
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
              // 二维码下面的字
              {
                type: 'text',
                content: "长按识别小程序码",
                fontSize: 12,
                color: '#999999',
                textAlign: 'left',
                top: 510,
                left: 240,
                lineHeight: 20,
                width: 155,
                bolder: true
              },
              // 动态生成的字
              {
                type: 'text',
                content: title,
                fontSize: 14,
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
              // 商品价格
              {
                type: 'text',
                content: "￥" + price,
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


            ]
          }
        })
      }
    })
    // console.log(this.data.url)
  
      //成功数据
      // wx.showToast({
      //   title: '添加成功!',
      //   icon: 'success',
      //   duration: 1500
      // })



      // console.log(this.data.copywriting, this.data.imgUrl)

    console.log(this.data.url);


  },
  // canvas画图分享的发放 （保存图片，绘制分享图）
  eventDraw() {
    this.setData({
      GetImage: true,
      shareImage2:"",
      painting: {}
    })
    let reqObj = {
      url: '/api/mainShare/homeShare',
      data: { }
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
        this.setData({
          copywriting: res.data.copywriting,
          imgUrl: res.data.imgUrl
        })
        let userid = parseInt(this.data.userId).toString(32)
        let reqObj = {
          url: '/api/generate/code',
          data: {
            "autoColor": true,
            "page": "pages/home/home",
            "scene": userid + "#" + '0' + '#' + 0 + '#' + 0,
            "width": 280
          }
        }
        util.RequestPost(reqObj, null, (data, message) => {
          console.log(data.data)
          this.setData({
            userid_weweima: data.data
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

                url: 'http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621165146153.png',
                top: 12,
                left: 99,
                width: 35,
                height: 35
              },

              {
                type: 'text',
                content: '元素城堡',
                fontSize: 16,
                color: '#402D16',
                textAlign: 'left',
                top: 25,
                left:146,
                bolder: true
              },
              // 中间的图 this.data.imgUrl
              {
                type: 'image',
                url: this.data.imgUrl , 
                top: 60,
                left: 32.5,
                width: 310,
                height: 350
              },
              // 二维码图片
              {
                type: 'image',
                url: this.data.userid_weweima,
                top: 420,
                left: 250,
                width: 88,
                height: 88
              },
              // 动态生成的字
              {
                type: 'text',
                content: this.data.copywriting,
                fontSize: 14,
                color: '#101010',
                textAlign: 'left',
                top: 440,
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
                top: 510,
                left: 240,
                lineHeight: 20,
                width: 155,
                bolder: true
              },
            ]
          }
        })
      })
      }
    })


  },
  // 保存图片的方法
  eventSave1() {
    console.log('aaa')
    var that = this
    console.log(this.data.shareImage1);
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage1,
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
  eventSave() {
    console.log('aaa')
    var that = this
    console.log(this.data.shareImage2);
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage2,
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
  eventGetImage1(event) {
    console.log(event)
    wx.hideLoading()
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage1: "",
        painting: [],
        shareImage1: tempFilePath
      })
    }
  },
  eventGetImage(event) {
    console.log(event)
    wx.hideLoading()
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage2:"",
        shareImage2: tempFilePath
      })
    }
  },



  confirm: function () {
    this.setData({//动态改变
      hidden: false
    });
  },
  cancel: function () {
    this.setData({
      hidden: true
    });
  },
  onPullDownRefresh: function (e) {
    // this.show_hide2();
    console.log('dadad')
    this.getmoney();
    wx.stopPullDownRefresh()
  },
  come_text(){
    console.log('这是初始化数据')
    let eyeFlag = wx.getStorageSync('litteraye')
    console.log('eyeFlag-1:', eyeFlag);
    if (!eyeFlag || eyeFlag == '1') { //显示数据
      this.setData({ litteraye: true})

      
    } else { //隐藏数据
      this.setData({
        litteraye:false ,
        today_earn: '****',
        Earnings_week: '****',
        Earnings_month: '****',
        jiesuan: '****',
        Total_revenue: "****"

      })
    }
  },
  share_hide:function(){
    this.setData({
      GetImage:false,
      GetImage1: false
    })
    console.log('222')
    this.onLoad();
  },
  show_hide: function () {//打开关闭 eye
    // const a = '1';
    let eyeFlag = wx.getStorageSync('litteraye')
    console.log('eyeFlag-1:', eyeFlag);
    if(!eyeFlag || eyeFlag=='1'){ //显示数据->关闭
      this.setData({
        litteraye:false,
        today_earn: '****',
        Earnings_week: '****',
        Earnings_month: '****',
        jiesuan: '****',
        Total_revenue: "****"

      })
    
      wx.setStorageSync('litteraye', '2')


    }else{ //打开
      this.getmoney();
      wx.setStorageSync('litteraye', '1')
    }

    console.log('eyeFlag-2:', wx.getStorageSync('litteraye'));
    // console.log(this.data.today_earn)
    // console.log();

    // if (wx.getStorageSync('litteraye')==false){
    //   this.setData({
    //     litteraye: false,
    //     today_earn: '****',
    //     Earnings_week: '****',
    //     Earnings_month: '****',
    //     jiesuan: '****',
    //     Total_revenue: "****"

    //   })
      // wx.setStorageSync('litteraye', this.data.litteraye)
    // }else{
    //   this.getmoney();
    //   this.setData({
    //     litteraye: true,
    //   })
    //   wx.setStorageSync('litteraye', this.data.litteraye)
    //   // wx.setStorageSync('litteraye', this.data.litteraye)
    // }

  },
  myfensi() {
    wx.navigateTo({
      url: '/pages/myFans/myFans?fansNum=' + this.data.funsCount
    })
  },

  show_inviter() {
    console.log(this.data.inviter_show);
    if (this.data.inviter_show == true && this.data.inviterTime!='') {
      // return false
      this.setData({
        inviter_show: false,
        line: true
      })
    } else {
      this.setData({
        inviter_show: true,
        line: false
      })
    }
  },
  //普通用户权益banner跳转
  quanyigo(option){
    console.log(option.currentTarget.dataset.item)
    let url = option.currentTarget.dataset.item
    if(url!=''){
      wx.navigateTo({
        url: url
      })
    }else{
      // 点了也没用
    }

  },
  onReady() {

    
    this.getmoney();
    this.share();
    // this.show_hide2();

  },
  onLoad:function(){
  },
  getmoney: function () {
    let that = this
    let token = wx.getStorageSync('myxzToken');
    let url = apiUrl.API_URL+'/api/my/commission';
    if (token) {
      // let header = Object.assign({ 'auth-token': token }, headerData);
      wx.request({
        url: url,
        data: {}, // 仅为示例，并非真实的接口地址
        header: {
          'auth-token': token
        },
        success(res) {
          console.log(res.data)
          if (res.data.data.userFunAndInviter.inviterNickName != null) {
            that.setData({
              hasInviter: true
            })
          }
          wx.hideLoading();

          that.setData({
            Total_revenue: Number(res.data.data.totalCommission).toFixed(2),
            Earnings_week: Number(res.data.data.weekCommission).toFixed(2),
            Earnings_month: Number(res.data.data.monthCommission).toFixed(2),
            jiesuan: Number(res.data.data.unPayCommission).toFixed(2),
            today_earn: Number(res.data.data.todayCommission).toFixed(2),
            inviterHeadImg: res.data.data.userFunAndInviter.inviterHeadImg,
            inviterNickName: res.data.data.userFunAndInviter.inviterNickName,
            inviterTime: res.data.data.userFunAndInviter.inviterTime,
            todayFuns: '\n' + res.data.data.userFunAndInviter.todayFuns,
            yesterdayFuns: '\n' + res.data.data.userFunAndInviter.yesterdayFuns,
            funsCount: '\n' + res.data.data.userFunAndInviter.funsCount,
            bannerList: res.data.data.bannerList,
            inviterUserNum:res.data.data.userInterestsRes.inviteUserNum,
            orderNum: res.data.data.userInterestsRes.orderNum
          });
          console.log(that.data.bannerList);
          that.come_text()
          if (that.data.inviterNickName == null) {
            that.setData({
              inviterNickName: ''
            })
          }
          if (that.data.inviterTime == null) {
            that.setData({
              inviterTime: ''
            })
          }
          if (that.data.inviterHeadImg == null) {
            that.setData({
              inviterHeadImg: ''
            })
          }

        }
      })
    } else {
      console.log('跳转授权页面');
      wx.navigateTo({
        url: "/pages/init/init"
      })
    }
  },
  share: function () {
    let that = this
    let token = wx.getStorageSync('myxzToken');
    let url = apiUrl.API_URL +'/api/goods/shareGoodList';
    if (token) {
      // let header = Object.assign({ 'auth-token': token }, headerData);
      wx.request({
        url: url,
        data: { pageSize: '3' }, // 仅为示例，并非真实的接口地址
        header: {
          'auth-token': token
        },
        success(res) {
          console.log(res.data.resultList)
          for (let i of res.data.resultList) {
            i.price = Number(i.price).toFixed(2);
            i.retailPrice = Number(i.retailPrice).toFixed(2);
          }
          wx.hideLoading();

          that.setData({
            resultList: res.data.resultList,

          });
        }
      })
    } else {
      console.log('跳转授权页面');
      wx.navigateTo({
        url: "/pages/init/init"
      })
    }
  },
  onHide:function(){
    this.setData({
      GetImage: false,
      GetImage1:false
    })
  },
  onShow: function (options) {
    wx.setNavigationBarTitle({
      title: "麦芽"//页面标题为路由参数  
    })
    if (wx.getStorageSync('myxzToken')) {
      this.getmoney();
      this.share();
      //..userId
      util.getNowUserId((userId) => {
        this.setData({
          userId
        })
      })
    }
    console.log(wx.getStorageSync('myxzToken'));
    // console.log(hidden);
    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, '', '');
    
  },
  onShareAppMessage: function (res) {
    this.setData({
      GetImage: false
    })
    // console.log(res, ed2);
    var that = this
    var  res = that.data.editem
    if (that.data.ed2==2){
      
      let goodId = res.target.dataset.item && res.target.dataset.item.id ? res.target.dataset.item.id : '';
      let activityId = res.target.dataset.item && res.target.dataset.item.id ? res.target.dataset.item.activityId : '';
      let goodImg = res.target.dataset.item && res.target.dataset.item.id ? res.target.dataset.item.goodImg : '';
      let shareImageArr = wx.getStorageSync('shareImage');
      let shareImage = ''
      let numberText = Math.floor(Math.random() * 4);
      util.mdFun(this, res.target.dataset.item.activityId + '_' + res.target.dataset.item.id, '', '商品分享');

      //let userId = wx.getStorageSync('myxzUserId');
      if (shareImageArr && shareImageArr.length > 0) {
        shareImage = shareImageArr[Math.floor(Math.random() * shareImageArr.length)].bannerUrl;
      }
      let reqObj = {
        url: '/api/sharing/addShareLog',
        data: {
          type: res.target.id == 'share' ? 0 : 2,
          shareUserId: this.data.userId
        }
      }
      util.RequestPost(reqObj, null, (res, message) => {
        if (res.resCode == '0000') {
          //成功数据
        }
      })
      if (res.target.id == 'share') {
        return {
          title: util.commonText1[numberText],
          imageUrl: shareImage,
          path: '/pages/home/home?userId=' + this.data.userId
        }
      } else {
        return {
          title: util.commonText1[numberText],
          imageUrl: goodImg,
          path: '/pages/goodsDetails1/goodsDetails1?userId=' + this.data.userId + '&id=' + goodId + '&activityId=' + activityId + '&left=true&path=goodsDetails' + '&path=goodsDetails'
        }
      }
    }else{
      console.log('这个是麦分享')
      // let shareImageArr = wx.getStorageSync('shareImage');
      // let shareImage = '';
      // console.log(shareImageArr);
      // let numberText = Math.floor(Math.random() * 4);
      // if (shareImageArr && shareImageArr.length > 0) {
      //   shareImage = shareImageArr[Math.floor(Math.random() * shareImageArr.length)].bannerUrl;
      // }
      console.log(this.data.userId);
      // 转发成功之后的回调
      let reqObj = {
        url: '/api/sharing/addShareLog',
        data: {
          type: 0,
          shareUserId: this.data.userId
        }
      }
      util.RequestPost(reqObj, null, (res, message) => {
        if (res.resCode == '0000') {
          //成功数据
        }
      })

      return {
        title: this.data.copywriting,
        imageUrl: this.data.imgUrl,
        path: '/pages/home/home?userId=' + this.data.userId
      }
    }

  },
  goDetails(){
    wx.navigateTo({
      url: '/pages/maiyaBalanceDetail/maiyaBalanceDetail',
    })
  }
  // onPullDownRefresh: function () {
  //   this.getmoney();
  //   this.share();
  //   wx.stopPullDownRefresh()
  // }
})