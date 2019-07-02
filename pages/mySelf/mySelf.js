const app = getApp()
var util = require('../../utils/util.js');
var apiUrl = require('../../static/js/url.js');
var apiUrl = require('../../static/js/url.js');
import Toast from '../../dist/toast/toast';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showIcon: false,//引入的自定义导航左边返回按钮
    title:'我的',
    // 我是一个小逗比
    painting: {},  //这个是 用canvas画图用的 变量
    shareImage: '',  //这个是 用canvas画图用的 变量
    GetImage:false,
    icon_down: 'https://file.maiyatown.com/images/mySelf/kuozhan.svg',
    my_Inviter:false,
    tabbar:{},
    fansCount: "",
    todayFans: "",
    yesterdayFans: "",
    avlBal:"",//账户余额
    couponSum:"",//优惠券
    frtCommission:"",//待遇余额
    headImageUrl:"",//用户头像
    integral:"积分",//积分
    isBdPhone: "1",//是否绑定手机
    isBdWX:"1",//是否绑定微信
    isBdInviter:'',//是否绑定邀请码
    nickName: "",//用户昵称
    userLevel:"",//是否为普通用户
    integral:"",//积分
    funsCount:"",//总的粉丝人
    inviterHeadImg:"",//邀请人头像
    inviterNickName:"",//邀请人昵称像
    inviterTime: "",//邀请时间
    todayFuns:"",
    yesterdayFuns:"",
    wechat_num:"",
    inviterOk:false,//邀请人详情
    hasInviter:false,

    userId:null,
    daifk_num:'',
    daish_num:'',

    groupTimeData:[],
    appointmentTimeData:[],
    userid_weweima:""
  },
  // canvas画图分享的发放 （保存图片，绘制分享图）
  eventDraw() {
    this.setData({
      GetImage: true,
      shareImage: "",
      painting: {}
    })
    let reqObj = {
      url: '/api/mainShare/homeShare',
      data: {}
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
                top: 20,
                left: 146,
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
  onLoad(){

  },
  onReady(){
    
    // this.getFans();
    this.maself_info();
    this.getCouponsList();
    this.myOrderCountInfo();
  },
  onShow: function (options) {
    wx.setNavigationBarTitle({
      title: "我的"//页面标题为路由参数  
    })
    if (wx.getStorageSync('myxzToken')) {
      this.maself_info();
      this.getCouponsList();
      //..userId
      util.getNowUserId((userId) => {
        this.setData({
          userId
        })
      })
    }
    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, '', '');
    this.myOrderCountInfo();
    app.finduser_info()
  },
  onHide: function () {
    this.setData({
      GetImage: false,
    })
  },
  // 获取我的订单待付款和待收货订单数量
  myOrderCountInfo(){
    let token = wx.getStorageSync('myxzToken');
    let reqObj = {
      url: '/api/my/myOrderCountInfo? auth-token=' + token,
      data: {}
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
      }
      if (res.resCode == '0000') {
        // wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
        console.log(res.data);
        this.setData({
          daifk_num: res.data.waitPayment,
          daish_num: res.data.waitReceiveGood
        })
      }
    })
  },

  show_Inviter(){
    // const that = this;
    // if (this.data.my_Inviter ==false){
    //   this.setData({
    //     icon_down: '/images/mySelf/down.svg',
    //     my_Inviter: true
    //   })
    // }else{
    //   this.setData({
    //     icon_down: '/images/mySelf/kuozhan.svg',
    //     my_Inviter: false
    //   })
    // }
    wx.navigateTo({
      url: '/pages/addressManagement/addressManagement',
    })
  },
  //埋点点击客服
  mdClick() {
    util.mdFun(this, '点击客服', '');
  },
  maself_info(){
    let that = this
    let token = wx.getStorageSync('myxzToken');
    let url = apiUrl.API_URL +'/api/my/acct';
  
    if (token) {
      // let header = Object.assign({ 'auth-token': token }, headerData);
      wx.request({
        url: url,
        data: {}, // 仅为示例，并非真实的接口地址
        header: {
          'auth-token': token
        },
        success(res) {
          console.log(res);
          // if(res.data.data.userFunAndInviter.inviterNickName!=null){
          //   that.setData({
          //     hasInviter:true
          //   })
          // }
          wx.hideLoading();
          that.setData({
            nickName: res.data.data.nickName,
            isBdWX: res.data.data.isBdWX,
            isBdPhone: res.data.data.isBdPhone,
            isBdInviter: res.data.data.isBdInviter,
            headImageUrl: res.data.data.headImageUrl || 'https://file.maiyatown.com/images/v1.4/common_img_default_head.png',
            bdInviterCode: res.data.data.bdInviterCode,
            userLevel: res.data.data.userLevel,
            frtCommission: Number(res.data.data.frtCommission).toFixed(2),
            integral: res.data.data.integral,
            // couponSum: res.data.data.couponSum,
            avlBal: Number(res.data.data.avlBal).toFixed(2),
            wechat_num:res.data.data.wxNum,
          });
        }
      })
    } else {
     
      wx.navigateTo({
        url: "/pages/init/init"
      })
    }
  },

  getCouponsList() {
    let reqObj = {
      url: '/api/user/getPrizeGrant',
      data: {
        couponType:  1
      }
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 1500
        })
      }
      if (res.resCode == '0000') {
        //设置标题
     
        this.setData({
          couponSum:res.resultCount
        })
        
      }
    })
  },
  //点击我的邀请人详情
  inviterDetails(){
    // if (!inviterOk) {
    //   return false
    // }
    let inviterOk = this.data.inviterOk?false:true;  
    this.setData({
      inviterOk
    })
  },
  bindwechat(option){
    console.log(option)
    let isbdinviter = option.currentTarget.dataset.isbdinviter
    let bdInviterCode = option.currentTarget.dataset.bdinvitercode
    // v1.4修改绑定码
    wx.navigateTo({
      url: '/pages/bindInviteCode/bindInviteCode?isbdinviter=' + isbdinviter + '&bdInviterCode=' + bdInviterCode,
    })
  },
  bindphone(e){
   
    if (this.data.isBdPhone == 1){
      // Toast.fail('不能修改已绑手机号');
      // console.log('daa')
      // wx.showToast({
      //   title: '已绑定，不能进行修改',
      //   // icon: 'succes',
      //   duration: 1000,
      //   mask: true
      // })
    }else{
      wx.navigateTo({
        url: '/pages/bindPhone/bindPhone',
      })
    }
  },
  Cash_withdrawal(){
    // Toast('提现功能即将上线，请耐心期待！');
    
    if (this.data.isBdPhone==1){
      wx.navigateTo({
        url: '/pages/extractCash/extractCash?user_leval=' + this.data.userLevel,
      })
    }else{
      Toast('请输入正确的手机号');
    }

  },
  Detailed(){
    wx.navigateTo({
      url: '/pages/balanceDetail/balanceDetail',
    })
  },
  //去卷包
  coupons(){
    wx.navigateTo({
      url: '/pages/coupons/coupons'
    })
  },
  // 去积分
  integral(){
    wx.navigateTo({
      url: '/pages/myIntegral/myIntegral'
    })
  },
  //我的粉丝
  myfans(){
    wx.navigateTo({
      url: '/pages/myFans/myFans?fansNum=' + this.data.funsCount
    })
  },
  //去全部订单
  goToMyOrder(){
    wx.navigateTo({
      url:'/pages/myOrder/myOrder'
    })
  },
  orderJump(event){
    wx.navigateTo({
      url: '/pages/myOrder/myOrder?navActive=' + event.currentTarget.dataset.index
    })
  },
  order_sale(event){
    wx.navigateTo({
      url: '/pages/afterSale_list/afterSale_list?navActive=' + event.currentTarget.dataset.index
    })
    
  },
  //获取粉丝
  // getFans(){
  //   let reqObj = {
  //     url: '/api/user/myFans'
  //   }
  //   util.RequestGet(reqObj, null, (res, message) => {
  //     if (message) {
  //       wx.showToast({             title: res.resDesc,             icon: 'none',             duration: 1500           });
  //     }
  //     if (res.resCode == '0000') {
  //       //成功数据
  //       this.setData({
  //         fansCount: res.data.fansCount,
  //         todayFans: res.data.todayFans,
  //         yesterdayFans: res.data.yesterdayFans
  //       })
  //     }
  //   })
  // }
 
  onShareAppMessage: function (res) {
    // this.setData({
    //   GetImage: false
    // })
    let shareImageArr = wx.getStorageSync('shareImage');
    let shareImage='';
    let numberText = Math.floor(Math.random() * 4);
    //let userId = wx.getStorageSync('myxzUserId');
    if (shareImageArr&&shareImageArr.length>0){
      shareImage = shareImageArr[Math.floor(Math.random() * shareImageArr.length)].bannerUrl;
    }
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
      title: util.commonText1[numberText],
      imageUrl: shareImage,
      path: '/pages/home/home?userId=' + this.data.userId
    }
  },

  onPullDownRefresh(){
    this.maself_info();
    this.getCouponsList();
    this.myOrderCountInfo();
    wx.stopPullDownRefresh()
  },
  //点击进入我的拼团
  my_Regiment(){
    wx.navigateTo({
      url: '/pages/myRegiment/myRegiment' 
    })
  },
  //待结算余额明细
  preBalance(){
    wx.navigateTo({
      url: "/pages/preBalanceDetail/preBalanceDetail"
    })
  }
})