// pages/maiya/maiya.js
const app = getApp()
var util = require('../../utils/util.js');
var apiUrl = require('../../static/js/url.js');
import Toast from '../../dist/toast/toast';
Page({


  /**
   * 页面的初始数据
   */
  data: {
    // 我的工具
    my_gongju:[
      {
        src: 'https://file.maiyatown.com/images/v1.4/member_icon_balance.png',
        text: "提现"
      },
      {
     src: 'https://file.maiyatown.com/images/v1.4/member_icon_management.png',
        text: "客户管理"
      },
      {
        src: 'https://file.maiyatown.com/images/v1.4/member_icon_customer_service.png',
        text: "商务账簿"
      }, 
      {
        src: 'https://file.maiyatown.com/images/v1.4/member_icon_policy.png',
        text: "售后政策"
      } 
    ],
    imgUrls1 : [
      {
        array: [
          { title: "商品11", money: 88.88, image: "https://file.maiyatown.com/images/v1.4/shuju.png" },
          { title: "商品22", money: 88.87, image: "https://file.maiyatown.com/images/v1.4/shuju.png" },
          { title: "商品33", money: 88.86, image: "https://file.maiyatown.com/images/v1.4/shuju.png" },
        ]
      },
      {
        array: [
          { title: "商品44", money: 88.88, image: "https://file.maiyatown.com/images/v1.4/shuju.png" },
          { title: "商品55", money: 88.87, image: "https://file.maiyatown.com/images/v1.4/shuju.png" },
          { title: "商品66", money: 88.86, image: "https://file.maiyatown.com/images/v1.4/shuju.png" },
        ]
      },
      {
        array: [
          { title: "商品77", money: 88.88, image: "https://file.maiyatown.com/images/v1.4/shuju.png" },
          { title: "商品88", money: 88.87, image: "https://file.maiyatown.com/images/v1.4/shuju.png" },
          { title: "商品99", money: 88.86, image: "https://file.maiyatown.com/images/v1.4/shuju.png" },
        ]
      }

    ],
    array: [
      { title: "商品11", money: 88.88, image: "https://file.maiyatown.com/images/v1.4/shuju.png" },
      { title: "商品22", money: 88.87, image: "https://file.maiyatown.com/images/v1.4/shuju.png" },
      { title: "商品33", money: 88.86, image: "https://file.maiyatown.com/images/v1.4/shuju.png" },
    ],
    tag: 35,
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    // tabbar: {},
    // navDatas: [],
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
    tabbar: {},
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
    litteraye: true,
    line: false,
    hasInviter: false,
    resultList: [

    ],
    guessresultList:[],//猜你喜欢数组
    guess_list:[],
    funsCount: "",
    userId: null,
    groupTimeData: [],
    appointmentTimeData: [],
    copywriting: "",//动态生成的canvas文案
    imgUrl: "",//动态生成的canvas图片
    ed2: 1,
    editem: "",
    url: "",
    alldata:"",
    more_text:"点击展开更多",
    renwu:[
    ],
    painting: {}, //canvas画图的变量
    shareImage: '',//canvas画图的变量
    GetImage: false,
    current:0, //轮播图点点
    panudanguess:"",
    vippackage_isshow:"", //能否进入会员礼包
    userid_weweima:"",
    jiazaimore:""
  },

  // 判断会员礼包是否有数据  ，如果没有的话  不显示那张图 
  vip_haslist() {
    let _iPage = 1
    let pageSize = 10
    let reqObj = {
      url: '/api/goods/membeGiftBag/list?iPage=' + _iPage + '&pageSize=' + pageSize
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
        if (res.resultCount != 0) {
          this.setData({
            vippackage_isshow: true
          })
        }else{
          this.setData({
            vippackage_isshow: false
          })
        }

      }
    })
  },
  // 今日主推
  today_push(option){
    console.log(option.currentTarget.dataset.item.redirectUrl);
    wx.navigateTo({
      url: option.currentTarget.dataset.item.redirectUrl 
    })
  },
// 复制
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  // 任务中心商品列表
  recomendGoodList(pageSize) {
    let token = wx.getStorageSync('myxzToken');
    let reqObj = {
      url: '/api/goods/recomendGoodList?auth-token=' + token,
      data: {
        pageSize: pageSize
      }
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (res.resCode == '0000') {
        //成功数据
        console.log(res.resultList);
        this.setData({
          renwu: res.resultList
        })

      }
    })
  },
  // 任务中心商品列表第一次加载
  recomendGoodList2(pageSize){
    let token = wx.getStorageSync('myxzToken');
    let reqObj = {
      url: '/api/goods/recomendGoodList?auth-token='+token,
      data: {
        pageSize: pageSize
      }
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (res.resCode == '0000') {
        //成功数据
        if (res.resultList.length > 2) {
          console.log('dsds')
          this.setData({
            renwu: res.resultList.slice(0, 2),
            jiazaimore: true
          })
          console.log(this.data.jiazaimore);
        } else {
          this.setData({
            renwu: res.resultList,
            jiazaimore: false
          })
          console.log(this.data.jiazaimore);
        }
        console.log(res.resultList);
        // this.setData({
        //   renwu: res.resultList
        // })

      }
    })
  },
  share_hide: function () {
    this.setData({
      GetImage: false
    })
  },
  // 点击加载更多
  click_more: function () {
    if(this.data.more_text=='点击展开更多'){
      this.recomendGoodList(6)
      this.setData({
        more_text:'点击收起',
        // renwu: this.data.renwu.concat(this.data.renwu2)
      })
    }else{
      this.recomendGoodList(2)
      this.setData({
        more_text: '点击展开更多',
        // renwu: this.data.renwu2
      })
      
    }

    console.log(this.data.renwu)
  },
  // canvas画图分享的发放 （保存图片，绘制分享图）
  eventDraw(option) {
    console.log(option);
    if (option.currentTarget.dataset.mai){
      console.log('这是大麦分享')
      this.setData({
        GetImage: true,
        shareImage: "",
        painting: {},
        ed2:2
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
                  // 中间的图 this.data.imgUrl
                  {
                    type: "image",
                    url: this.data.imgUrl,
                    top: 60,
                    left: 32.5,
                    width: 310,
                    height: 350
                  },
                  // 二维码图片
                  {
                    type: "image",
                    url: this.data.userid_weweima,
                    top: 420,
                    left: 250,
                    width: 88,
                    height: 88
                  },
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
                  },
                  // 二维码下面的字
                  {
                    type: "text",
                    content: "长按识别小程序码",
                    fontSize: 12,
                    color: "#999999",
                    textAlign: "left",
                    top: 510,
                    left: 240,
                    lineHeight: 20,
                    width: 155,
                    bolder: true
                  }
                ]
              }
            });
          })
        }
      })

    }else{
      console.log('这是商品的分享')
    this.setData({
      GetImage: true,
      shareImage: "",
      editem:option
    })
    console.log(option.currentTarget.dataset.item);
    var  item = option.currentTarget.dataset.item
    console.log(this.data.userId, item.id, item.activityId)
    let userid = parseInt(this.data.userId).toString(32)
    let goodid = parseInt(item.id).toString(32)
    let activityid = parseInt(item.activityId).toString(32)
    let ptid = 0
    let left = true
    // console.log(userid, goodid, activityid)
    // this.data.userId + '&id=' + this.data.goodId + '&activityId=' + this.data.activityId +
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
        console.log(res);
        //回到顶部
        wx.pageScrollTo({
          scrollTop: 0
        })
        // console.log(res.data.copywriting, res.data.imgUrl);
        //成功数据

        // this.setData({
        //   copywriting: res.data.copywriting,
        //   imgUrl: res.data.imgUrl
        // })
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
                top: 20,
                left: 79.5,
                bolder: true
              },
              // 中间的图    this.data.imgUrl     res.data.img
              {
                type: 'image',
                url: item.goodImg,
                top: 60,
                left: 32.5,
                width: 310,
                height: 350
              },
              // 二维码图片  res.data  'https://file.maiyatown.com/images/v1.2/home_share_img3.png'
              {
                type: 'image',
                url: res.data,
                top: 420,
                left: 250,
                width: 88,
                height: 88
              },
              // 动态生成的字    this.data.copywriting
              {
                type: 'text',
                content: item.title ,
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

              // 商品价格
              {
                type: 'text',
                content: "￥" + Number(item.price).toFixed(2),
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

    }
  },
  // 保存图片的方法
  eventSave() {
    var that = this;
    // this.setData({
    //   GetImage: false
    // })
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

  //我的工具
  Mytools:function(option){
    console.log(option);
    if (option.currentTarget.dataset.item.text=='提现'){
      wx.navigateTo({
        url: '/pages/extractCash/extractCash',
      })
    } else if (option.currentTarget.dataset.item.text == '客户管理'){
      wx.navigateTo({
        url: "/pages/customersManagement/customersManagement",
      })
     
    } else if (option.currentTarget.dataset.item.text == '商务账簿'){
      let token = wx.getStorageSync('myxzToken');
      let reqObj = {
        url: '/api/businessAccount/updateSalesRevenue?auth-token='+token,
        data: {}
      }
      util.RequestPostHeader(reqObj, null, (res, message) => {
        if (res.resCode == '0000') {

        } 

      })
      wx.navigateTo({
        url: "/pages/businessBooks/businessBooks",
      })
    } else if (option.currentTarget.dataset.item.text == '售后政策'){
      wx.navigateTo({
        url: "/pages/aftersaleRuleDetail/aftersaleRuleDetail",
      })
    }
  },
  // 研究院
  research:function(option){
    console.log(option.currentTarget.dataset.item.id);
    console.log(option.currentTarget.dataset.item.catName);
    console.log(option.currentTarget.dataset.item.showImage);
    console.log(option.currentTarget.dataset.item.sort);
    if(option.currentTarget.dataset.item.id==1){
      wx.navigateTo({
        url: "/pages/advancedTraining/advancedTraining",
      })
    } else if (option.currentTarget.dataset.item.id == 2){
      wx.navigateTo({
        url: "/pages/researchInstituteList/researchInstituteList?id=2&&catname=麦芽风采&&parentId=2",
      })
    } else if (option.currentTarget.dataset.item.id == 3){
      wx.navigateTo({
        url: "/pages/researchInstituteList/researchInstituteList?id=3&&catname=大咖分享&&parentId=3",
      })
    } else if (option.currentTarget.dataset.item.id == 4){
      wx.navigateTo({
        url: "/pages/momentsMaterial/momentMaterial?id=4",
      })
    }
    
  },
  // 点击加载更多
  click_more: function () {
    if (this.data.more_text =='点击展开更多'){
      this.recomendGoodList(6)
      this.setData({
        more_text:'点击收起',
        // renwu: this.data.renwu.concat(this.data.renwu2)
      })
    }else{
      this.recomendGoodList(2)
      this.setData({
        more_text: '点击展开更多',
        // renwu: this.data.renwu2
      })
      
    }

    console.log(this.data.renwu)
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
  come_text() {
    console.log('这是初始化数据')
    let eyeFlag = wx.getStorageSync('litteraye')
    console.log('eyeFlag-1:', eyeFlag);
    if (!eyeFlag || eyeFlag == '1') { //显示数据
      this.setData({ litteraye: true })
    } else { //隐藏数据
      this.setData({
        litteraye: false,
        today_earn: '****',
        Earnings_week: '****',
        Earnings_month: '****',
        jiesuan: '****',
        Total_revenue: "****",
        todayCommission:"****",
        weekCommission:"****",
        monthCommission:"****",
        unPayCommission:"****"

      })
    }
  },

  show_hide: function () {//打开关闭 eye
    // const a = '1';
    let eyeFlag = wx.getStorageSync('litteraye')
    console.log('eyeFlag-1:', eyeFlag);
    if (!eyeFlag || eyeFlag == '1') { //显示数据->关闭
      this.setData({
        litteraye: false,
        today_earn: '****',
        Earnings_week: '****',
        Earnings_month: '****',
        jiesuan: '****',
        Total_revenue: "****",
        todayCommission: "****",
        weekCommission: "****",
        monthCommission: "****",
        unPayCommission: "****"

      })

      wx.setStorageSync('litteraye', '2')


    } else { //打开
      this.getmoney();
      wx.setStorageSync('litteraye', '1')
    }

    console.log('eyeFlag-2:', wx.getStorageSync('litteraye'));


  },


  show_inviter() {
    console.log(this.data.inviter_show);
    if (this.data.inviter_show == true && this.data.alldata.userFunAndInviter.inviterHeadImg != null ) {
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
  onReady() {
    //初始化代码 影藏tabbar
    app.hidetabbar();

    this.getmoney();
    this.share();
    // this.show_hide2();

  },
  onLoad: function () {

    //初始化代码
    app.editTabbar();
    app.hidetabbar();
    this.recomendGoodList2(6);
    this.vip_haslist();
  },

  getmoney: function () {
    let that = this
    let token = wx.getStorageSync('myxzToken');
    let url = apiUrl.API_URL + '/api/my/commission';
    if (token) {
      wx.request({
        url: url,
        data: {}, // 仅为示例，并非真实的接口地址
        header: {
          'auth-token': token
        },
        success(res) {
          console.log(res.data)
          let alldata = res.data.data
          // if (res.data.data.userFunAndInviter.inviterNickName != null) {
          if (!alldata.userInfo.headImageUrl){
            alldata.userInfo.headImageUrl = 'https://file.maiyatown.com/images/v1.4/common_img_default_head.png'
          }
            that.setData({
              alldata,
              tag: res.data.data.userInfo.growthValue,
              Total_revenue: Number(res.data.data.commissionInfo.totalCommission).toFixed(2),
              todayCommission: Number(res.data.data.commissionInfo.todayCommission).toFixed(2),
              weekCommission: Number(res.data.data.commissionInfo.weekCommission).toFixed(2),
              monthCommission: Number(res.data.data.commissionInfo.monthCommission).toFixed(2), 
              unPayCommission: Number(res.data.data.commissionInfo.unPayCommission).toFixed(2)
            })
           
          // }

          wx.hideLoading();
          // console.log(that.data.alldata);
          that.setData({
            // Total_revenue: Number(res.data.data.totalCommission).toFixed(2),
            // Earnings_week: Number(res.data.data.weekCommission).toFixed(2),
            // Earnings_month: Number(res.data.data.monthCommission).toFixed(2),
            // jiesuan: Number(res.data.data.unPayCommission).toFixed(2),
            // today_earn: Number(res.data.data.todayCommission).toFixed(2),
            // inviterHeadImg: res.data.data.userFunAndInviter.inviterHeadImg,
            // inviterNickName: res.data.data.userFunAndInviter.inviterNickName,
            // inviterTime: res.data.data.userFunAndInviter.inviterTime,
            // todayFuns: '\n' + res.data.data.userFunAndInviter.todayFuns,
            // yesterdayFuns: '\n' + res.data.data.userFunAndInviter.yesterdayFuns,
            // funsCount: '\n' + res.data.data.userFunAndInviter.funsCount,
          });
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
  // 跳转会员礼包
  govip(){
    if (this.data.vip_haslist==false){
      Toast('活动已下架');
    }else{
      wx.navigateTo({
        url: '/pages/bagList/bagList'
      })
    }

  },
  // 猜你喜欢进入详情页
  vipguess: function (event){
    console.log(event);
    if (event.currentTarget.dataset.id){
      wx.navigateTo({
        url: '/pages/goodsDetails/goodsDetails?id=' + event.currentTarget.dataset.id + '&activityId='
          + event.currentTarget.dataset.activityid + '&left=' + event.currentTarget.dataset.left
      })
    }else{
      return false
    }

  },
  // 任务中心进入商品详情
  renwu_godetails(event){
    console.log(event);
    wx.navigateTo({
      url: '/pages/goodsDetails/goodsDetails?id=' + event.currentTarget.dataset.id + '&activityId='
        + event.currentTarget.dataset.activityid + '&left=' + event.currentTarget.dataset.left
    })
  },
  share: function () {
    let that = this
    let token = wx.getStorageSync('myxzToken');
    let url = apiUrl.API_URL + '/api/goods/shareGoodList';
    if (token) {
      // let header = Object.assign({ 'auth-token': token }, headerData);
      wx.request({
        url: url,
        data: { pageSize: '9' }, // 仅为示例，并非真实的接口地址
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

         
          let newArray = []
          let resultlist2 = res.data.resultList 
          let resultList = res.data.resultList.slice(0, Math.floor(res.data.resultList.length / 3) * 3)
          console.log(res.data.resultList);
          console.log(resultList)
          console.log((res.data.resultList.length / 3) * 3)
          // console.log(resultList1.slice(0, (resultList.length % 3) * 3))
          // let resultlist = resultList1.slice(0, (resultList1.length % 3) * 3)
          resultList.map((el, index) => {
            let newobj = {};
            if (index % 3 == 0) {
              newobj.array = [resultList[index], resultList[index + 1], resultList[index + 2]]
              newArray.push(newobj)
            }
          })
          console.log(newArray)
          that.setData({
            panudanguess: resultList,
            guessresultList: newArray,
            guess_list: resultlist2
          });
          // console.log(newArray, this.data.guessresultList);
        }
      })
    } else {
      console.log('跳转授权页面');
      wx.navigateTo({
        url: "/pages/init/init"
      })
    }
  },
  onHide: function () {
    this.setData({
      GetImage: false,
    })
  },
  onShow: function (options) {
    this.recomendGoodList2(6)
    this.vip_haslist();
    this.setData({
      more_text: '点击展开更多',
      current: 0
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
    app.finduser_info()
    // console.log(hidden);
    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, '', '');

  },
  onShareAppMessage: function (res) {
    if(this.data.ed2==2){
      console.log('这个是麦分享')
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
          console.log(res)
        }
      })
      console.log(this.data.userId,this.data.imgUrl,this.data.copywriting);
      return {
        title: this.data.copywriting,
        imageUrl: this.data.imgUrl,
        path: '/pages/home/home?userId=' + this.data.userId
      }
    }else{
    // console.log(res, ed2);
    var that = this
    var res = that.data.editem
    // if (that.data.ed2 == 2) {
      console.log(res);
    let goodId = res.currentTarget.dataset.item && res.currentTarget.dataset.item.id ? res.currentTarget.dataset.item.id : '';
    let activityId = res.currentTarget.dataset.item && res.currentTarget.dataset.item.id ? res.currentTarget.dataset.item.activityId : '';
    let goodImg = res.currentTarget.dataset.item && res.currentTarget.dataset.item.id ? res.currentTarget.dataset.item.goodImg : '';
      let shareImageArr = wx.getStorageSync('shareImage');
      let shareImage = ''
      let numberText = Math.floor(Math.random() * 4);
    util.mdFun(this, res.currentTarget.dataset.item.activityId + '_' + res.currentTarget.dataset.item.id, '', '商品分享');

    return {
      title: res.currentTarget.dataset.item.title,
      imageUrl: goodImg,
      path: '/pages/goodsDetails1/goodsDetails1?userId=' + this.data.userId + '&id=' + goodId + '&activityId=' + activityId + '&left=true&path=goodsDetails' + '&path=goodsDetails'
    }
     
  }
  },
  goDetails() {
    wx.navigateTo({
      url: '/pages/maiyaBalanceDetail/maiyaBalanceDetail',
    })
  },

  // 跳转会员礼包
  govip() {
    wx.navigateTo({
      url: '/pages/bagList/bagList'

    })
  },
  // onPullDownRefresh: function () {
  //   this.getmoney();
  //   this.share();
  //   wx.stopPullDownRefresh()
  // }
})