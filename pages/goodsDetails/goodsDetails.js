// pages/goodsDetails/goodsDetails.js
const app = getApp();
var util = require('../../utils/util.js');
var apiUrl = require('../../static/js/url.js');
import Dialog from '../../dist/dialog/dialog';
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title: '商品详情',
    scrollTop: 0,
    navActive: 1,
    swiperActive: 0,//当前banner 下标
    haveVideoType: false,
    actionSheetShow: false, //显示上拉菜单
    actionSheetType: 0,   //上拉菜单的状态  0 直接点击选择尺寸 1 点击加入购物车 2立即购买
    gdActivityInfo: {},//商品活动
    gdInfo: {}, //商铺数据
    specList: [], //商品参数
    specListLength: 0,
    skuList: [],//SKU列表
    SKUResult: {}, //根据sku列表生成的所有能选的列表
    skuItemName: '', //商品规格
    skuItemNameKey: [],
    skuItemNameValue: [],
    activityId: '',
    goodId: '',
    left: false,
    article: '', //富文本内容
    showVideo: 999,
    videoSwitchImage: true, //显示视频的第一帧
    isSelectSize: false, //是否点击选择尺寸
    playCountdown: 0, //活动倒计时

    activeSkuItem: {},//最后选中的SKu
    goodsId: '',
    goodsNumber: 1,
    skuId: '',

    hhhh: '00',
    mmmm: '00',
    ssss: '00',

    allItemSelect: false,

    haveChangedId: [], //

    isnew: 9999,//新用户
    redOpenNum: 0,//
    isShade: false,
    isOpen: false,
    close_red: 'close-red-0',
    isOpened: false,

    toTop: false, //跳到顶部
    scroll: "",

    userId: null,
    //红包邀请人Id
    upUserId:null,
    //是否新人专享
    isRookieExclusive:false,
    //防止重复点击
    controller:true,
    img:"",
    price_pic:""
  },
  // canvas生成的图片点击消失
  share_hide: function () {
    this.setData({
      GetImage: false
    })
  },
  // canvas画图分享的发放 （保存图片，绘制分享图）
  eventDraw() {
    this.setData({
      GetImage: true,
      shareImage: ""
    })
    console.log(this.data.userId, this.data.goodId, this.data.activityId)
    let userid = parseInt(this.data.userId).toString(32)
    let goodid = parseInt(this.data.goodId).toString(32)
    let activityid = parseInt(this.data.activityId).toString(32)
    let ptid = 0
    let left = true
    console.log(userid,goodid,activityid)
    console.log('微信头像和名字', app.globalData.wechatnickName, app.globalData.wechatheadImageUrl);
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

                url: app.globalData.wechatheadImageUrl,
                top: 12,
                left: 32.5,
                width: 35,
                height: 35
              },
              // MaxLineNumber:1, width: 170,breakWord: true,
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
                url: this.data.img,
                top: 60,
                left: 32.5,
                width: 310,
                height: 350
              },
              // 二维码图片  res.data  'https://file.maiyatown.com/images/v1.2/home_share_img3.png'
              {
                type: 'image',
                url:res.data,
                top: 420,
                left: 250,
                width: 88,
                height: 88
              },
              // 动态生成的字    this.data.copywriting
              {
                type: 'text',
                content: this.data.title,
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
                content: "￥" + Number(this.data.price_pic).toFixed(2),
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



  onLoad(options) {
   
    // var a = '5&9&257&0'
    // console.log(a.split('&'));
    console.log(options)
    //用户通过二维码 扫码
    let scene = decodeURIComponent(options.scene);
    console.log(scene);
    let sceneArr = scene.split('#');
    console.log(sceneArr);
    let activityId = parseInt(sceneArr[2], 32);
    let goodId = parseInt(sceneArr[1], 32);
    console.log(goodId,activityId);
    if (sceneArr.length>1) {
      
      this.goodDetail(activityId, goodId, true);
      app.globalData.upUserId = parseInt(sceneArr[0], 32);
      return false;
    }
    
    if(options.isRookieExclusive){
      this.setData({
        isRookieExclusive:true
      })
    }
    //分享进来 而且之前进来过 不会走app.js 设置要跳的路径
    // if (options.path) {
    //   wx.setStorageSync('myxzPath', options.path);
    //   wx.setStorageSync('myxzGoodId', options.id);
    //   wx.setStorageSync('myxzActivityId', options.activityId);
    //   wx.setStorageSync('myxzLeft', options.left);
    // }
    //是下期点进来的
    let isLeft=null;
    if (options.left == '2') {
      isLeft = false;
    } else {
      if (JSON.parse(options.left)) {
        isLeft = true;
      } else {
        isLeft = false;
      }
    }
    //.. userId
    if (options.userId) {
      app.globalData.userIdPro = options.userId;
      util.bindfriend(options.userId)//绑定好友关系
      console.log(options.userId)
      console.log(options.userId)
      console.log('商品详情' + options.userId)
      console.log(options.userId)
    }

    if (options.upUserId) {
      app.globalData.upUserId = options.upUserId;
      console.log(options.upUserId)
    }
    this.setData({
      activityId: options.activityId || wx.getStorageSync('myxzActivityId'),
      goodId: options.id || wx.getStorageSync('myxzGoodId'),
      isnew: options.isnew || 2,
      redOpenNum: options.totalCoupon || 0,
      left: isLeft,
    })
    this.goodDetail(options.activityId || wx.getStorageSync('myxzActivityId'), options.id || wx.getStorageSync('myxzGoodId'),
      isLeft);
  
  },
  onShow() {
    wx.setNavigationBarTitle({
      title: "商品详情"//页面标题为路由参数  
    })
    //每次进来都不能 直接去支付
    this.setData({
      isSelectSize: false,
      actionSheetType: 0,
      actionSheetShow: false,
      controller:true
    })
    //埋点函数 页面操作事件 下一个页面地址
    let mdData = '' + this.data.activityId + '_' + this.data.goodId;
    util.mdFun(this, mdData, '');
    //..userId
    util.getNowUserId((userId) => {
      this.setData({
        userId
      })
    })
  },
  onHide(){
    this.setData({
      GetImage: false
    })
  },
  //切换banner
  swiperChange(event) {
    this.setData({
      swiperActive: event.detail.current
    })
  },
  mdClick(){
    util.mdFun(this, '点击客服', '');
  },
  goodDetail(activityId, goodId, isLeft) {
    var _this = this;
    let reqObj = {
      url: '/api/goods/goodDetail',
      data: {
        activityId: activityId||0,
        goodId: goodId,
        // activityId: 2 || options.activityId,goodId: 32 || options.id
      }
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 1500
        })
        //商品已下架 跳首页
        if (res.resCode == '21001') {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/home/home',
            })
          }, 1500);
        }
      }
      if (res.resCode == '0000') {
        console.log(res)
        this.setData({
          // gdInfo: res.data.gdInfo,
          img: res.data.gdInfo.goodImg,
          price_pic: res.data.gdInfo.price,
          title: res.data.gdInfo.title
        })
        //获取图文描述
        _this.getGoodDesc(goodId,_this);
        //..加小数点
        for (let i in res.data.valueSkuMap) {
          if (res.data.valueSkuMap[i].price == 0) {
          } else {
            res.data.valueSkuMap[i].price = Number(res.data.valueSkuMap[i].price).toFixed(2);
          }
          if (res.data.valueSkuMap[i].retailPrice == 0) {
          } else {
            res.data.valueSkuMap[i].retailPrice = Number(res.data.valueSkuMap[i].retailPrice).toFixed(2);
          }
        }

        //成功数据
        let specList = res.data.specList;
        let skuList = {};

        //skuList 的key进行升序排列
        let temp = res.data.valueSkuMap;
        for (let key in temp) {
          let value = temp[key]
          let attres = key.split(";")
          attres.sort((obj1, obj2) => {
            return Number(obj1) - Number(obj2)
          })
          let newKey = attres.join(";")
          skuList[newKey] = value
        }

        //新的的数据
        let _specList = []
        let skuItemNameKey = [];

        if (res.data.gdInfo.price == 0) {
        } else {
          res.data.gdInfo.price = (res.data.gdInfo.price).toFixed(2);
        }
        if (res.data.gdInfo.retailPrice == 0) {
        } else {
          res.data.gdInfo.retailPrice = (res.data.gdInfo.retailPrice).toFixed(2);
        }

        specList.forEach((item, index) => {
          skuItemNameKey.push(item.specName);
          let pushObj = {
            name: item.specName,
            isActive: index == 0 ? true : false
          }
          let value = [];
          item.specValue.forEach((item1, index1) => {
            value.push({
              id: item1.id,
              cname: item1.valueName,
              isActiveC: false,
              notClick: false
            })
          })
          pushObj.value = value;
          _specList.push(pushObj);
        })

        //判断有没有视频
        if (res.data.gdInfo.videoList.length > 0) {
          this.setData({
            navActive: 0,
            showVideo: 1,
            haveVideoType: true
          })
        }
        //判断是不是本期点进来的
        this.setData({
          gdActivityInfo: res.data.gdActivityInfo,//商品活动
          gdInfo: res.data.gdInfo, //商铺数据
          goodsId: res.data.gdInfo.id, //商品id
          specList: _specList, //商品参数
          left: isLeft,
          skuList: skuList,
          specListLength: specList.length,
          skuItemNameKey: skuItemNameKey,
        }, () => {

          if (this.data.gdActivityInfo && this.data.gdActivityInfo.onlineState == 1) {
            //活动上线是1 在判断是活动开始前 还是活动进行中
            //当前时间< 开始时间
            if (this.data.gdActivityInfo.nowTime < this.data.gdActivityInfo.beginTime) {
              this.setData({
                playCountdown: 1,
              })
              let ii=0;
              setInterval(() => {
                //开始时间-当前时间
                this.countTime(this.data.gdActivityInfo.beginTime, this.data.gdActivityInfo.nowTime+ii*1000)
                ii = ii + 1;
              }, 1000)
            } else if (this.data.gdActivityInfo.nowTime > this.data.gdActivityInfo.beginTime && this.data.gdActivityInfo.nowTime < this.data.gdActivityInfo.endTime) {
              this.setData({
                playCountdown: 2,
              })
              let ii=0;
              setInterval(() => {
                this.countTime(this.data.gdActivityInfo.endTime, this.data.gdActivityInfo.nowTime+ii*1000);
                ii=ii+1;
              }, 1000)
            }
          }
          //.. 初始化函数
          this.queryDGoodsById();

          //v1.3
          setTimeout(()=>{
            let reqObj={
              index:0,
              cindex:0,
              cid: this.data.specList[0].value[0].id, 
              isActiveC:false, 
              citemnoclick:false
            }
            this.tabInfoChange('', reqObj)
          },500)
        })
      }
    })
  },
  onReady() {
    this.videoContext = wx.createVideoContext('my_video');
  },
  //监听滚动事件
  scroll(event) {
    this.setData({
      toTop: event.detail.scrollTop > 1000 ? true : false
    })
  },
  //获取商品描述
  getGoodDesc(goodId,thisObj){
    let reqObj = {
      url: '/api/goods/goodDesc',
      data: {
        goodId: goodId
      }
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 1500
        })
        //商品已下架 跳首页
        if (res.resCode == '21001') {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/home/home',
            })
          }, 1500);
        }
      }
      if (res.resCode == '0000') {
        //初始化富文本
        if(res.data.description != null){
          WxParse.wxParse('article', 'html', res.data.description, thisObj, 0);
        }
      }
    })
  },
  //去顶部的方法
  toTopFun() {
    this.setData({
      scrollTop: 0
    })
  },
  postFormId(event) {
    util.postFormId(event.detail.formId);
  },
  //点击切换图片
  imageSwitch: function (event) {
    var that = this
    let selectTab = event.currentTarget.dataset.showvideo;
    this.setData({
      showVideo: selectTab == 1 ? 1 : selectTab,
      navActive: selectTab - 1,
      videoSwitchImage: selectTab == 1 ? true : false
    })
    if (selectTab == 3) {
      this.setData({
        toView: 'wxparse'
      })
    }else{
      this.setData({
        scrollTop: 0
      })
    }
    if (selectTab == 2) {
   
      that.toTopFun();
      // that.onLoad();
      // if (wx.pageScrollTo){
      //   wx.pageScrollTo({
      //     scrollTop: 0
      //   })
      // }else{
      //   wx.showModal({
      //     title: '提示',
      //     content: '当前微信版本过低，无法使用该功能',
      //   })
      // }

    }
  

  },

  //点击视频播放
  videoSwitch() {
    this.setData({
      videoSwitchImage: false
    })
    this.videoContext.play();
  },
  navChange(event) {
   
  },
  navActiveFun(event) {
    if (event.currentTarget.dataset.index == 0) {
      this.setData({ navActive: 0 })
    } else {
      this.setData({ navActive: 1 })
    }
  },
  //加入购物车
  addShopCar() {
    //正在爆枪进来的
    if (!this.data.left) {
      return false;
    }
    //有库存
    if (this.data.gdInfo.dummyStock < 1) {
      return false;
    }
    //选择了尺寸 提示加入购物车成功
    //..点击 立即购买必须 确认规格
    // if (this.data.isSelectSize) {
    //   this.addShopCarRequest();
    // } else {
    //   this.setData({ actionSheetShow: true, actionSheetType: 1 })
    // }
    this.setData({ actionSheetShow: true, actionSheetType: 1 })
  },
  //加入购物车 发送请求
  addShopCarRequest() {
    let reqObj = {
      url: '/api/shopCar/addShopCar?from=goodsDetails',
      data: {
        goodsId: this.data.goodsId,
        goodsNumber: this.data.goodsNumber,
        skuId: this.data.skuId,
      }
    }
    util.RequestPost(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 1500
        })
      }
      if (res.resCode == '0000') {
        //成功数据
        wx.showToast({
          title: '添加成功!',
          icon: 'success',
          duration: 1500
        })
        this.setData({
          isSelectSize: false,
          goodsNumber: 1
        })
      }
    })
  },
  //立即购买
  buyNow() {
    //关闭播放按钮
    this.setData({
      videoSwitchImage: true
    })
    //正在爆枪进来的
    if (!this.data.left) {
      return false;
    }
    //有库存
    if (this.data.gdInfo.dummyStock < 1) {
      return false;
    }

    let userInfo = wx.getStorageSync('myxzUserInfo');
    if (!userInfo.mobile) {
      Dialog.confirm({
        title: "请先绑定手机号",
        message: '   ',
        zIndex: 102
      }).then(() => {
        // on confirm
        wx.navigateTo({
          url: '/pages/bindPhone/bindPhone?from=goodsDetails'
        })
      }).catch(() => {
        // on cancel
      });
      return false;
    }
    //选择了尺寸 跳转确认订单
    //.. 点击立即购买 还是要出来选择框
    // if (this.data.isSelectSize) {
    //   this.buyNowRequest();
    // } else {
    //   this.setData({ actionSheetShow: true, actionSheetType: 2 })
    // }
    this.setData({ actionSheetShow: true, actionSheetType: 2 })
  },
  buyNowRequest() {
    if (this.data.controller) {
      let reqObj = {
        url: '/api/shopCar/immediatePurchase',
        data: {
          activityId: Number(this.data.activityId),
          goodsId: this.data.goodsId,
          goodsNumber: this.data.goodsNumber,
          skuId: this.data.skuId,
        }
      }
      util.RequestPost(reqObj, null, (res, message) => {
        if (message && res.resCode != '30041' && res.resCode != '30040') {
          wx.showToast({
            title: res.resDesc,
            icon: 'none',
            duration: 1500
          })
        }

        if (res.resCode == '30041') {
          this.setData({
            actionSheetShow: false
          })
          Dialog.alert({
            message: '很抱歉，您正在参加“一起拼”，新人专享特惠价只开放给未购买过的新人享受',
            confirmButtonText: "知道了，返回首页",
            zIndex: 102
          }).then(() => {
            this.goHome()
          });
        }

        if (res.resCode == '30040') {
          this.setData({
            actionSheetShow: false
          })
          Dialog.alert({
            message: '您已经参加新人专享啦，不要贪心哦，每位新人只能享受1次机会',
            confirmButtonText: "知道了，返回首页",
            zIndex: 102
          }).then(() => {
            this.goHome()
          });
        }
        if (res.resCode == '0000') {
          //成功数据 传入本地
          app.globalData.goodsDetails = res;
          if (this.data.isRookieExclusive) {
            wx.navigateTo({
              url: '/pages/confirmOrder/confirmOrder?activityId=' + this.data.activityId + '&goodId=' + this.data.goodId + '&isRookieExclusive=' + true
            })
          } else {
            wx.navigateTo({
              url: '/pages/confirmOrder/confirmOrder?activityId=' + this.data.activityId + '&goodId=' + this.data.goodId
            })
          }
        }
      })


      this.setData({
        controller:false
      })
    }
  },
  //选择尺寸
  selectSize() {
    this.setData({
      actionSheetShow: true,
      videoSwitchImage: true,//不显示视频  显示 视频图片
    })
  },
  //选择尺寸的确认按钮
  selectSizeSuccess() {
    let activeSkuItem = {};
  
    if (this.data.activeSkuItem && this.data.activeSkuItem.dummyStock == 0) {
      wx.showToast({
        title: '商品库存不足',
        image:"../../static/toastImage/tishi_icon.png",
        duration: 1500
      })
      return false;
    }
    //如果 当前选择规格 长度
    if (this.data.haveChangedId.length == this.data.specListLength) {
      let skuItemName = '';
      let skuItemNameKey = this.data.skuItemNameKey;
      let skuItemNameValue = this.data.skuItemNameValue;
      console.log("this.data.activeSkuItem",this.data.activeSkuItem)
      // debugger
      for (let ii = 0; ii < this.data.skuItemNameKey.length; ii++) {
        skuItemName += skuItemNameKey[ii] + ':' + this.data.activeSkuItem.specValueList[ii] + ';';
      }
      this.setData({
        skuItemName: skuItemName,
        skuId: this.data.activeSkuItem.id,
      })
    } else {
      wx.showToast({
        title: '请选择规格',
        image: "../../static/toastImage/tishi_icon.png",
        duration: 1500
      })
      return false;
    }
    //展示到页面
    this.setData({
      actionSheetShow: this.data.actionSheetType != 0 ? true : false
    })
    //如果完整选择尺寸 发送请求
    //.. 选择尺寸不直接判断 不根据 用户的选择判断
    // if (this.data.isSelectSize){
    // }
    if (this.data.actionSheetType == 1) {
      this.addShopCarRequest();
      this.setData({
        actionSheetShow: false
      })
    } else if (this.data.actionSheetType == 2) {
      this.buyNowRequest()
    }
    setTimeout(() => {
      this.setData({
        actionSheetType: 0
      })
    }, 200)
  },
  //修改计数器
  onChange(event) {
    this.setData({
      goodsNumber: event.detail
    })
  },
  //倒计时方法
  countTime(newDate,oldDate) {
    //获取当前时间
    var olddate = new Date(oldDate);
    var old = olddate.getTime();
    //设置截止时间

    var endDate = new Date(newDate);
    var end = endDate.getTime();

    //时间差
    var leftTime = end - old;
    if (leftTime<0){
      this.setData({
        hhhh: '00',
        mmmm: '00',
        ssss: '00'
      })
      return false;
    }
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
    }
    //将倒计时赋值到div中
    // console.log(d*24+parseInt(h) + "时", m + "分", s + "秒");
    let hh = 0;
    if ((d * 24) + parseInt(h) > 99) {
      hh = 99;
    } else {
      let _hh = (d * 24) + parseInt(h);
      hh = _hh<10?'0'+_hh:_hh;
    }
    this.setData({
      hhhh: hh,
      mmmm: m,
      ssss: s
    })
  },
  onClose() {
    this.setData({
      actionSheetShow: false,
      actionSheetType: 0
    });
  },
  //分享函数
  onShareAppMessage() {
    this.setData({
      GetImage: false
    })
    console.log()
    let numberText = Math.floor(Math.random() * 5);
    let reqObj = {
      url: '/api/sharing/addShareLog',
      data: {
        type: 2,
        shareUserId: this.data.userId
      }
    }
    util.RequestPost(reqObj, null, (res, message) => {
      if (res.resCode == '0000') {
        //成功数据
      }
    })
    //..要加个 用户ID
    return {
      title: util.commonText2[numberText],
      path: '/pages/goodsDetails1/goodsDetails1?userId=' + this.data.userId + '&id=' + this.data.goodId + '&activityId=' + this.data.activityId + '&left=' + this.data.left + '&path=goodsDetails',
      imageUrl: this.data.gdInfo.goodImg
    }
  },

  //..
  /*商品详情数据*/
  queryDGoodsById() {
    this.initSKU();//初始化，得到SKUResult
    /*根据SKUResult得到初始化的时候哪些不能点击*/
    for (let i = 0; i < this.data.specList.length; i++) {
      for (let j = 0; j < this.data.specList[i].value.length; j++) {
        if (this.data.SKUResult[this.data.specList[i].value[j].id] == null) {
          this.data.specList[i].value[j].notClick = true;
        }
      }
    }
  },
  //获得对象的key 
  getObjKeys(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj)
      if (Object.prototype.hasOwnProperty.call(obj, key))
        keys[keys.length] = key;
    return keys;
  },

  //把组合的key放入结果集SKUResult
  add2SKUResult(combArrItem, sku) {
    var key = combArrItem.join(";");
    if (this.data.SKUResult[key]) { //SKU信息key属性·
      this.data.SKUResult[key].count += sku.count;
      this.data.SKUResult[key].prices.push(sku.price);
    } else {
      this.data.SKUResult[key] = {
        count: sku.count,
        prices: [sku.price]
      };
    }
  },

  //初始化得到结果集
  initSKU() {
    var i, j, skuKeys = this.getObjKeys(this.data.skuList);
    for (i = 0; i < skuKeys.length; i++) {
      var skuKey = skuKeys[i]; //一条SKU信息key
      var sku = this.data.skuList[skuKey]; //一条SKU信息value
      var skuKeyAttrs = skuKey.split(";"); //SKU信息key属性值数组
      skuKeyAttrs.sort(function (value1, value2) {
        return parseInt(value1) - parseInt(value2);
      });

      //对每个SKU信息key属性值进行拆分组合
      var combArr = this.combInArray(skuKeyAttrs);
      for (j = 0; j < combArr.length; j++) {
        this.add2SKUResult(combArr[j], sku);
      }

      //结果集接放入SKUResult
      this.data.SKUResult[skuKeyAttrs.join(";")] = {
        count: sku.count,
        prices: [sku.price]
      }
    }
  },

  /**
   * 从数组中生成指定长度的组合
   * 方法: 先生成[0,1...]形式的数组, 然后根据0,1从原数组取元素，得到组合数组
   */
  combInArray(aData) {
    if (!aData || !aData.length) {
      return [];
    }

    var len = aData.length;
    var aResult = [];

    for (var n = 1; n < len; n++) {
      var aaFlags = this.getCombFlags(len, n);
      while (aaFlags.length) {
        var aFlag = aaFlags.shift();
        var aComb = [];
        for (var i = 0; i < len; i++) {
          aFlag[i] && aComb.push(aData[i]);
        }
        aResult.push(aComb);
      }
    }

    return aResult;
  },

  /**
   * 得到从 m 元素中取 n 元素的所有组合
   * 结果为[0,1...]形式的数组, 1表示选中，0表示不选
   */
  getCombFlags(m, n) {
    if (!n || n < 1) {
      return [];
    }

    var aResult = [];
    var aFlag = [];
    var bNext = true;
    var i, j, iCnt1;

    for (i = 0; i < m; i++) {
      aFlag[i] = i < n ? 1 : 0;
    }

    aResult.push(aFlag.concat());

    while (bNext) {
      iCnt1 = 0;
      for (i = 0; i < m - 1; i++) {
        if (aFlag[i] == 1 && aFlag[i + 1] == 0) {
          for (j = 0; j < i; j++) {
            aFlag[j] = j < iCnt1 ? 1 : 0;
          }
          aFlag[i] = 0;
          aFlag[i + 1] = 1;
          var aTmp = aFlag.concat();
          aResult.push(aTmp);
          if (aTmp.slice(-n).join("").indexOf('0') == -1) {
            bNext = false;
          }
          break;
        }
        aFlag[i] == 1 && iCnt1++;
      }
    }
    return aResult;
  },
  /*商品条件筛选*/
  tabInfoChange(event,reqObj) {
    //思路 
    //根据 index的值 对当前已经选中的sku id进行处理
    //当选择上排的时候 清空haveChangedId 下一排选择 和之后的值

    //v1.3
    let index, cindex, cid, isActiveC, citemnoclick ;
    if (reqObj){
      index = reqObj.index 
      cindex = reqObj.cindex 
      cid = reqObj.cid 
      isActiveC = reqObj.isActiveC 
      citemnoclick = reqObj.citemnoclick 
    }else{
      index = event.currentTarget.dataset.index;
      cindex = event.currentTarget.dataset.cindex;
      cid = event.currentTarget.dataset.cid;
      isActiveC = event.currentTarget.dataset.isactivec;
      citemnoclick = event.currentTarget.dataset.citemnoclick;
    }
    if (citemnoclick) {
      return false;
    }
    let _specList = this.data.specList;
    let orderInfoChild = _specList[index].value;/*当前点击的规格的所有子属性内容*/
    //选中自己，兄弟节点取消选中
    if (orderInfoChild[cindex].notClick != true) {
      if (orderInfoChild[cindex].isActiveC == true) {
        orderInfoChild[cindex].isActiveC = false;
      } else {
        for (let i = 0; i < orderInfoChild.length; i++) {
          orderInfoChild[i].isActiveC = false;
        }
        orderInfoChild[cindex].isActiveC = true;
      }
    }

    //已经选择的节点
    let haveChangedId = [];

    for (let i = 0; i < _specList.length; i++) {
      for (let j = 0; j < _specList[i].value.length; j++) {
        if (_specList[i].value[j].isActiveC == true) {
          haveChangedId.push(_specList[i].value[j].id);
        }
      }
    }
   
    //如果之前 每个尺寸已经选过一遍
    if (this.data.allItemSelect && haveChangedId.length == this.data.specListLength) {
      if (index + 1 < this.data.specListLength) {
        let specList = this.data.specList;
        let _haveChangedId = [];
        for (let iii = 0; iii < this.data.specListLength; iii++) {
          //如果已经全部 选过一遍，现在是来回切 
          //当前是点第几行  保留当前 这行 和之前的选项
          if (iii <= index) {
            _haveChangedId.push(haveChangedId[iii]);
          } else {
            //他后面行的都全部置灰
            specList[iii].value.forEach((item, index) => {
              item.isActiveC = false;
              item.notClick = false;
            })
          }
        }
        this.setData({
          specList: specList
        })
        haveChangedId = [];
        haveChangedId = _haveChangedId;
      }
    }

    //当选择上排的时候 清空haveChangedId 下一排选择 和之后的值
    //..
    if (haveChangedId.length == this.data.specListLength) {
      this.setData({
        allItemSelect: true
      })
    } else {
      this.setData({
        allItemSelect: false
      })
    }

    if (haveChangedId.length) {
      //获得组合key价格
      haveChangedId.sort(function (value1, value2) {
        return parseInt(value1) - parseInt(value2);
      });

      var len = haveChangedId.length;
      //..判断如果全部选项都选了 就得到最后的SKU
      if (haveChangedId.length == this.data.specListLength) {
        //
        let _haveChangedId = haveChangedId;
        _haveChangedId = _haveChangedId.sort(function (x, y) {
          return x - y;
        });

        if (_haveChangedId.length > 1) {
          _haveChangedId = _haveChangedId.join(';');
        } else {
          _haveChangedId = _haveChangedId[0]
        }
        console.log("this.data.skuList", this.data.skuList)
        console.log("_haveChangedId",_haveChangedId)
        if (this.data.skuList.hasOwnProperty(_haveChangedId)) {
          //.. 选中的SKU列表
          this.setData({
            activeSkuItem: this.data.skuList['' + _haveChangedId]
          })
        }

      } else {
        this.setData({
          activeSkuItem: {}
        })
      }

      //用已选中的节点验证待测试节点 
      let daiceshi = [];//待测试节点
      let daiceshiId = [];


      for (let i = 0; i < _specList.length; i++) {
        for (let j = 0; j < _specList[i].value.length; j++) {
          if (_specList[index].value[cindex].id != _specList[i].value[j].id) {
            daiceshi.push({
              index: i,
              cindex: j,
              id: _specList[i].value[j].id
            });
            daiceshiId.push(_specList[i].value[j].id);
          }
        }
      }
      for (let i = 0; i < haveChangedId.length; i++) {
        var indexs = daiceshiId.indexOf(haveChangedId[i]);
        if (indexs > -1) {
          daiceshi.splice(indexs, 1);
        }
      }
      for (let i = 0; i < daiceshi.length; i++) {
        let testAttrIds = []; //从选中节点中去掉选中的兄弟节点
        let siblingsId = "";
        for (let m = 0; m < _specList[daiceshi[i].index].value.length; m++) {
          if (_specList[daiceshi[i].index].value[m].isActiveC == true) {
            siblingsId = _specList[daiceshi[i].index].value[m].id;
          }
        }
        if (siblingsId != "") {
          for (let j = 0; j < len; j++) {
            (haveChangedId[j] != siblingsId) && testAttrIds.push(haveChangedId[j]);
          }
        } else {
          testAttrIds = haveChangedId.concat();
        }
        testAttrIds = testAttrIds.concat(_specList[daiceshi[i].index].value[daiceshi[i].cindex].id);
        testAttrIds.sort(function (value1, value2) {
          return parseInt(value1) - parseInt(value2);
        });
        if (!this.data.SKUResult[testAttrIds.join(';')]) {
          _specList[daiceshi[i].index].value[daiceshi[i].cindex].notClick = true;
          _specList[daiceshi[i].index].value[daiceshi[i].cindex].isActiveC = false;
        } else {
          _specList[daiceshi[i].index].value[daiceshi[i].cindex].notClick = false;
        }
      }
      this.setData({
        specList: _specList,
        haveChangedId: haveChangedId
      })
    } else {

      //设置属性状态
      for (let i = 0; i < _specList.length; i++) {
        for (let j = 0; j < _specList[i].value.length; j++) {
          if (this.data.SKUResult[_specList[i].value[j].id]) {
            _specList[i].value[j].notClick = false;
          } else {
            _specList[i].value[j].notClick = true;
            _specList[i].value[j].isActiveC = false;
          }
        }
      }
      this.setData({
        specList: _specList,
        haveChangedId: haveChangedId
      })
    }
  },
  isOpenRed: function () {
    this.setData({
      isShade: true,
      isOpen: true,
    })
  },
  openRed() {
    this.setData({
      isShade: true,
      isOpen: false,
      close_red: 'close-red-1',
      isOpened: true
    })
  },
  closeRed: function () {
    this.setData({
      isShade: false,
      isOpen: false,
      close_red: 'close-red-0',
      isOpened: false
    })
  },
  //红包-立即查看
  viewRed() {
    wx.navigateTo({
      url: '/pages/coupons/coupons',
    });
    this.closeRed();
  },
  myCatchTouch() {
  },
  goHome() {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  }
})
