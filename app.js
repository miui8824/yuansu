var util = require("/utils/util.js");
var apiUrl = require("/static/js/url.js");
App({
  //小程序初始化      只会执行一次
  onLaunch: function(options) {
    let scene = decodeURIComponent(options.scene);
    console.log(scene);
    // this.data.userId  this.data.goodId  this.data.activityId
    let sceneArr = scene.split("#");
    console.log(sceneArr);
    let activityId = parseInt(sceneArr[2], 32); //将32进制的转化为10进制的
    let goodId = parseInt(sceneArr[1], 32);
    let userId = parseInt(sceneArr[0], 32); //将32进制的转化为10进制的
    console.log(userId);
    // let activityId = sceneArr[2]
    // let goodId = sceneArr[1]
    // if (sceneArr[4]) {
    //   // this.setData({
    //   //   left: true,
    //   //   userId: userId,
    //   //   activityId: activityId,
    //   //   goodId: goodId
    //   // })
    // }
    // this.goodDetail(activityId, goodId);
    // app.globalData.upUserId = parseInt(sceneArr[0], 32);

    if (wx.getStorageSync("out_show")) {
      console.log("out_show");
      wx.removeStorageSync("out_show");
    }
    if (wx.getStorageSync("order_show")) {
      console.log("order_show");
      wx.removeStorageSync("order_show");
    }
    if (wx.getStorageSync("gift_package")) {
      console.log("gift_package");
      wx.removeStorageSync("gift_package");
    }
    if (wx.getStorageSync("myxzPath")) {
      console.log("myxzPath");
      wx.removeStorageSync("myxzPath");
    }
    if (wx.getStorageSync("isArticalShare")) {
      console.log("isArticalShare");
      wx.removeStorageSync("isArticalShare");
    }

    //初始化下方的全局监听函数
    console.log(options);
    this.finduser_info();
    this.init();
    //影藏官方的tabbar
    // wx.hideTabBar();
    //保存邀请人id
    //帮拆红包邀请关系有通用userId字段
    if (options.query.userId) {
      //存userId 到全局
      //wx.setStorageSync('myxzUserIdPro', options.query.userId);
      this.globalData.userIdPro = options.query.userId;
      console.log(options.query.userId);
      console.log(options.query.userId);
      console.log("初始化邀请人" + options.query.userId);
      console.log(options.query.userId);
    }
    //设置 需要指定跳转的路径
    if (options.query.path) {
      wx.setStorageSync("myxzPath", options.query.path);
      wx.setStorageSync("myxzGoodId", options.query.id || "");
      wx.setStorageSync("myxzActivityId", options.query.activityId || "");
      wx.setStorageSync("myxzLeft", options.query.left || false);
    } else if (options.query.out_show) {
      console.log("设置跳转的制定路径");
      wx.setStorageSync("out_show", options.query.out_show);

      wx.setStorageSync("out_id", options.query.goodsId);
      wx.setStorageSync("out_activity", options.query.activityId);
      wx.setStorageSync("out_groupid", options.query.groupBuyingId);
      wx.setStorageSync("out_isInvite", options.query.isInvite);
    } else if (options.query.order_show) {
      wx.setStorageSync("order_show", options.query.order_show);

      wx.setStorageSync("order_id", options.query.id);
      wx.setStorageSync("order_activityId", options.query.activityId);
      wx.setStorageSync("order_groupBuyingId", options.query.groupBuyingId);
    } else if (options.query.isArticalShare) {
      wx.setStorageSync("isArticalShare", options.query.isArticalShare);
      wx.setStorageSync("artical_id", options.query.id);
      wx.setStorageSync("artical_userid", options.query.userId);
    } else if (options.query.gift_package) {
      wx.setStorageSync("gift_package", "gift_package");
      wx.setStorageSync("gift_packagepath", options.path);
      console.log("tong," + options.path);
      wx.setStorageSync("gift_packageid", options.query.userId);
    }

    // 通过二维码扫码进来的
    if (options.query.scene) {
      // 进行解码
      let scene = decodeURIComponent(options.query.scene);
      let sceneArr = scene.split("#");
      this.globalData.userIdPro = parseInt(sceneArr[0], 32);
      wx.setStorageSync("scenePath", options.path);
      wx.setStorageSync("scene", options.query.scene);
    }
    setInterval(function() {
      wx.getStorageSync("myxzUserId");
    }, 1000);

    //设置手机的操作系统
    wx.getSystemInfo({
      success: function(res) {
        if (res.platform == "ios") {
          wx.setStorageSync("myxzSystem", "ios");
        } else if (res.platform == "android") {
          wx.setStorageSync("myxzSystem", "android");
        }
      }
    });
    // 登录成功会返回个token
    // 先校验有没有  没有肯定是第一次进来 获取授权一套走一遍
    // 当前都是掉接口的时候会去判断
    // var token = wx.getStorageSync('myxzToken');
    // if (!token) {
    //   setTimeout(function() {
    //     wx.navigateTo({
    //       url: "/pages/init/init"
    //     })
    //   }, 800);
    //   return false;
    // }
    // wx.getUpdateManager 在 1.9.90 才可用，请注意兼容
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate);
    });

    updateManager.onUpdateReady(function() {
      // wx.showModal({
      //   title: '更新提示',
      //   content: '新版本已经准备好，是否马上重启小程序？',
      //   success: function (res) {
      //     if (res.confirm) {
      //       console.log('强制更新')
      //       // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      //     }
      //   }
      // })
      console.log("or");
      updateManager.applyUpdate();
    });

    updateManager.onUpdateFailed(function() {
      console.log("更新失败");
      // 新的版本下载失败
    });
    // this.finduser_info();
    this.wechatheadImage();
  },
  // 获取用户信息判断是不是会员
  finduser_info() {
    console.log("执行了");
    let token = wx.getStorageSync("myxzToken");
    let reqObj = {
      url: "/api/user/myInfo?auth-token=" + token
    };
    util.RequestGet(reqObj, null, (res, message) => {
      if (res.resCode == "0000") {
        //成功数据
        console.log(res, res.data.inviteSwitch, "dccdc");
        if (res.data.userLevel == 1) {
          // console.log('先判断是否是会员')
          if (res.data.inviteSwitch == 1) {
            // 普通用户
            let tabBar = {
              color: "#ffffff",
              selectedColor: "#DD232F",
              list: [
                {
                  pagePath: "/pages/home/home",
                  iconPath:
                    "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621150844241.png",
                  selectedIconPath:
                    "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621150925471.png",
                  text: "首页"
                },
                {
                  pagePath: "/pages/maiya2/maiya2",
                  iconPath:
                    "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621151053485.png",
                  selectedIconPath:
                    "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621151150395.png",
                  text: "城堡"
                },
                {
                  pagePath: "/pages/shopCar/shopCar",
                  iconPath:
                    "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621151256385.png",
                  selectedIconPath:
                    "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621151352851.png",
                  text: "购物车"
                },
                {
                  pagePath: "/pages/mySelf/mySelf",
                  iconPath:
                    "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621151524863.png",
                  selectedIconPath:
                    "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621151601491.png",
                  text: "我的"
                }
              ]
            };
            this.globalData.tabBar = tabBar;
            this.editTabbar();
          } else {
            let tabBar = {
              color: "#ffffff",
              selectedColor: "#DD232F",
              list: [
                {
                  pagePath: "/pages/home/home",
                  iconPath:
                    "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621150844241.png",
                  selectedIconPath:
                    "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621150925471.png",
                  text: "首页"
                },
                {
                  pagePath: "/pages/shopCar/shopCar",
                  iconPath:
                    "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621151256385.png",
                  selectedIconPath:
                    "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621151352851.png",
                  text: "购物车"
                },
                {
                  pagePath: "/pages/mySelf/mySelf",
                  iconPath:
                    "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621151524863.png",
                  selectedIconPath:
                    "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621151601491.png",
                  text: "我的"
                }
              ]
            };
            this.globalData.tabBar = tabBar;
            this.editTabbar();
          }
        } else {
          console.log("2222222222");

          let tabBar = {
            color: "#ffffff",
            selectedColor: "#DD232F",
            list: [
              {
                pagePath: "/pages/home/home",
                iconPath:
                  "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621150844241.png",
                selectedIconPath:
                  "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621150925471.png",
                text: "首页"
              },
              {
                pagePath: "/pages/maiya2/maiya2",
                iconPath:
                  "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621151053485.png",
                selectedIconPath:
                  "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621151150395.png",
                text: "城堡"
              },
              {
                pagePath: "/pages/shopCar/shopCar",
                iconPath:
                  "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621151256385.png",
                selectedIconPath:
                  "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621151352851.png",
                text: "购物车"
              },
              {
                pagePath: "/pages/mySelf/mySelf",
                iconPath:
                  "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621151524863.png",
                selectedIconPath:
                  "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621151601491.png",
                text: "我的"
              }
            ]
          };
          this.globalData.tabBar = tabBar;
          this.editTabbar();
        }
      }
    });
  },
  wechatheadImage() {
    let that = this;
    let token = wx.getStorageSync("myxzToken");
    let url = apiUrl.API_URL + "/api/my/acct";

    if (token) {
      // let header = Object.assign({ 'auth-token': token }, headerData);
      wx.request({
        url: url,
        data: {}, // 仅为示例，并非真实的接口地址
        header: {
          "auth-token": token
        },
        success(res) {
          console.log("获取微信的头像");
          console.log(res);
          that.globalData.wechatheadImageUrl = res.data.data.headImageUrl;
          that.globalData.wechatnickName = res.data.data.nickName;

          console.log(that.globalData.wechatheadImageUrl);
        }
      });
    } else {
      wx.navigateTo({
        url: "/pages/init/init"
      });
    }
  },
  //初始化tabbar
  editTabbar() {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;

    pagePath.indexOf("/") != 0 && (pagePath = "/" + pagePath);

    // if(pagePath.indexOf('/') != 0){
    //   pagePath = '/' + pagePath;
    // }

    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      tabbar.list[i].pagePath == pagePath && (tabbar.list[i].selected = true);
    }

    _this.setData({
      tabbar: tabbar
    });
  },
  //自己对wx.hideTabBar的一个封装
  // hidetabbar() {
  //   wx.hideTabBar({
  //     fail: function() {
  //       setTimeout(function() {
  //         // 做了个延时重试一次，作为保底。
  //         wx.hideTabBar();
  //       }, 300);
  //     }
  //   });
  // },
  /******************* 监听全局数据变化  *******************/

  /** 监听函数的对象数组 */
  watchCallBack: {},

  /** 监听列表 */
  watchingKeys: [],

  /** 初始化 */
  init: function() {
    // 全局数据
    this.globalData$ = Object.assign({}, this.globalData);
  },

  /** 设置全局数据 */
  setGlobalData: function(obj) {
    Object.keys(obj).map(key => {
      this.globalData[key] = obj[key];
    });
  },
  getGlobalData: function(obj) {
    return this.globalData[obj];
  },
  /** watch函数 */
  watch$(key, cb) {
    console.log(this.globalData$);
    console.log(this.globalData$);
    console.log(this.globalData$);
    console.log(this.globalData$);
    this.watchCallBack = Object.assign({}, this.watchCallBack, {
      [key]: this.watchCallBack[key] || []
    });
    this.watchCallBack[key].push(cb);
    if (!this.watchingKeys.find(x => x === key)) {
      const that = this;
      this.watchingKeys.push(key);
      Object.defineProperty(this.globalData, key, {
        configurable: true,
        enumerable: true,
        set: function(val) {
          const old = that.globalData$[key];
          that.globalData$[key] = val;
          that.watchCallBack[key].map(func => func(val, old));
        },
        get: function() {
          return that.globalData$[key];
        }
      });
    }
  },
  globalData: {
    //触发发起拼团提醒
    openGroupTip: true,
    //我的拼团 提醒数据
    groupTimeData: [],
    //我的预约 提醒数据
    appointmentTimeData: [],
    isCustomer: 999, //是否是会员
    //点击组合礼包到详情 当前商品的数量
    bagDetailItemsNumber: 0,
    //点击组合礼包到详情 当前你的specList
    specListItem: "",
    //带到详情页面的合计金额
    nowBagsPrice: "0.00",
    //组合礼包第一次选择的商品是国内还是国外 1是，2否
    crossBorder: "",
    statusBarHeight: 0,
    titleBarHeight: 0,
    userInfo: null,
    userIdPro: "",
    upUserId: "",
    isFromDetail1: false,
    inviteTimes: 0,
    goodsDetails: {
      resultList: [],
      data: {
        userAddresses: {}
      }
    },
    tabBar: {},
    wechatheadImageUrl: "",
    wechatnickName: ""
    // isHuaWei:false
  }
  //华为适配
  // onShow:function(){
  //   let that = this
  //   wx.getSystemInfo({
  //     success: function(res) {
  //       console.log(res)
  //       let brand = res.brand
  //       if(brand.search('HUAWEI')!=-1){
  //         that.globalData.isHuaWei=true
  //       }
  //     },
  //   })
  // }
  // goodsDetails: { "resCode": "0000", "resDesc": "操作成功", "resultList": [{ "id": null, "confirmNo": "20181225190715979447", "userId": 2, "shopCarId": 0, "goodsId": 77, "skuId": 208, "goodNumber": 1, "title": "跨境122502", "subTitile": "跨境122502跨境122502", "crossBorder": 1, "retailPrice": 500.00, "price": 300.00, "visitFileUrl": "https://file.maiyatown.com/static/goods/2018122519040492112.jpg", "specValueDesc": "11:33", "freight": 0.00, "taxation": 0.00, "reducePrice": 3.84, "totalAmt": 300.00 }], "data": { "confirmNo": "20181225190715979447", "inHomeNum": 0, "outHomeNum": 1, "totalReducePrice": 3.84, "totalPrice": 300.00, "avlBal": 0.00, "userAddresses": { "id": 18, "consigneeName": "何小小", "phoneNum": "18888888888", "province": "山西省", "city": "朔州市", "location": "右玉县", "detailAddress": "人民大会堂1000号", "isCard": 1, "iscardSm": "https://file.maiyatown.com/static/sfzxx2018122211041765117.jpg", "iscardFm": "https://file.maiyatown.com/static/sfzxx2018122211114613426.jpg", "isDefault": 1 } } }
});
