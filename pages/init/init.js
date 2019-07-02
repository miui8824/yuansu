// pages/init/init.js
var util = require('../../utils/util.js');
var apiUrl = require('../../static/js/url.js')
import Toast from '../../dist/toast/toast';
var util = require('../../utils/util.js');
const app = getApp()

Page({
  data: {
    showIcon: false,
    // title:"MAIYA TOWN"
    inverter:true,
    isnew:"",
    userInputnum:"",
    statusBarHeight: 0,
    titleBarHeight: 0
  },
  onLoad(){
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        if (!app.globalData) {
          app.globalData = {}
        }
        if (res.model.indexOf('iPhone') !== -1) {
          app.globalData.titleBarHeight = 44
        } else {
          app.globalData.titleBarHeight = 48
        }
        app.globalData.statusBarHeight = res.statusBarHeight
        that.setData({
          statusBarHeight: app.globalData.statusBarHeight,
          titleBarHeight: app.globalData.titleBarHeight
        });
      },
      failure() {
        that.setData({
          statusBarHeight: 0,
          titleBarHeight: 0
        });
      }
    })
  },
  onReady() {
  },
  onShow() {
    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, '', '');
  },
  //为了解决 现授权再获取用户资料的异步行为，调取getuserInfo 进一步初始化tabbar
  getUserInfo(e) {
    var that = this;
    wx.login({
      success(res) {
        //得到code
        if (res.code) {
          var _data = res.code;
          console.log(res);
          //得到用户数据
          wx.getUserInfo({
            success: function (res) {
              console.log(res);

              //得到用户信息
              let userId = app.globalData.userIdPro;
              console.log(userId);
              var userLoginParam = {}//最外层的对象
              var miniAuthParam = {}//登录用的小程序参数
              // 1.4版本修改登录接口，新增输入邀请码页面
              var loginType = 3
              // var userId =""
              miniAuthParam.code = _data;
              miniAuthParam.encryptedData = res.encryptedData;
              miniAuthParam.iv = res.iv;
              miniAuthParam.rawData = res.rawData;
              miniAuthParam.signature = res.signature;
              userLoginParam = {
                miniAuthParam: miniAuthParam,
                loginType: loginType,
                userId: app.globalData.userIdPro
              }

              console.log(userLoginParam);
              var userInfo = res.userInfo;
              //得到邀请人id
              //let userId = wx.getStorageSync('myxzUserIdPro');

              let header = Object.assign({ 'client': 1 });
              //发送请求数据 得到token什么的
              wx.request({
                method: 'POST',
                url: apiUrl.API_URL + '/api/user/login',
                header: header,
                data: userLoginParam,
                success(res) {
                  console.log('登录成功回调状态',res)

                  console.log('在这里搞')
                  let data = res.data;
                  that.setData({
                    isnew: data.data.iSNew
                  })
                  if (data.resCode == '0000' && res.data.data.forceBindInviter ==2
                  ) {

                    //保存用户数据到本地缓存
                    let oldData = wx.getStorageSync('myxzUserInfo');
                    if (oldData) {
                      let newData = Object.assign(oldData, data.data);
                      wx.setStorageSync('myxzUserInfo', newData);
                      //设置本人userId
                      wx.setStorageSync('myxzUserId', data.data.id);
                    } else {
                      wx.setStorageSync('myxzUserInfo', data.data);
                      //设置本人userId
                      wx.setStorageSync('myxzUserId', data.data.id);
                    }

                    //返回数据
                    let dataList = data.data;
                    //吧openId 存到本地
                    wx.setStorageSync('myxzOpenId', dataList.openId);
                    wx.setStorageSync('myxzToken', dataList.token);
                    util.bindfriend(app.globalData.userIdPro);
                    let token = dataList.token
                    let url = apiUrl.API_URL + '/api/my/acct';
                    if (token) {
                      // let header = Object.assign({ 'auth-token': token }, headerData);
                      wx.request({
                        url: url,
                        data: {}, // 仅为示例，并非真实的接口地址
                        header: {
                          'auth-token': token
                        },
                        success(res) {
                          console.log('获取微信的头像')
                          console.log(res)
                          app.globalData.wechatheadImageUrl = res.data.data.headImageUrl
                          app.globalData.wechatnickName = res.data.data.nickName

                          console.log(app.globalData.wechatheadImageUrl);
                        }
                      })
                    } else {

                      wx.navigateTo({
                        url: "/pages/init/init"
                      })
                    }
                    setTimeout(() => {
                      // var that = this;
                      console.log('this=', this, 'that=', that);
                      console.log(wx.getStorageSync('myxzToken'))
                      console.log(app.globalData.tabBar);
                      let token = wx.getStorageSync('myxzToken');
                      let reqObj = {
                        url: '/api/user/myInfo?auth-token=' + token
                      }
                      util.RequestGet(reqObj, null, (res, message) => {
                        if (res.resCode == '0000') {
                          //成功数据
                          console.log(res, res.data.inviteSwitch, 'dccdc')
                          if (res.data.userLevel == 1) {
                            // console.log('先判断是否是会员')
                            if (res.data.inviteSwitch == 1) {
                              // 普通用户
                              let tabBar = {
                                color: "#ffffff",
                                selectedColor:
                                  "#DD232F",
                                list: [
                                  {
                                    pagePath:
                                      "/pages/home/home",
                                    iconPath:
                                      "https://file.maiyatown.com/images/v1.4/icon/shouye_m.svg",
                                    selectedIconPath:
                                      "https://file.maiyatown.com/images/v1.4/icon/shouye_x.svg",
                                    text: "首页"
                                  },
                                  {
                                    pagePath:
                                      "/pages/maiya2/maiya2",
                                    iconPath:
                                      "https://file.maiyatown.com/images/v1.4/icon/quanyi_m.svg",
                                    selectedIconPath:
                                      "https://file.maiyatown.com/images/v1.4/icon/quanyi_x.svg",
                                    text: "权益"
                                  },
                                  {
                                    pagePath:
                                      "/pages/shopCar/shopCar",
                                    iconPath:
                                      "https://file.maiyatown.com/images/v1.4/icon/gouwuche_m.svg",
                                    selectedIconPath:
                                      "http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190618215748490.png",
                                    text: "购物车"
                                  },
                                  {
                                    pagePath:
                                      "/pages/mySelf/mySelf",
                                    iconPath:
                                      "https://file.maiyatown.com/images/v1.4/icon/wode_m.svg",
                                    selectedIconPath:
                                      "https://file.maiyatown.com/images/v1.4/icon/wode_x.svg",
                                    text: "我的"
                                  }
                                ]
                              };
                              app.globalData.tabBar = tabBar
                              console.log(app.globalData.tabBar)
                              that.editTabbar();
                            } else {
                              let tabBar = {
                                "color": "#ffffff",
                                "selectedColor": "#DD232F",
                                "list": [{
                                  "pagePath": "/pages/home/home",
                                  "iconPath": "https://file.maiyatown.com/images/v1.4/icon/shouye_m.svg",
                                  "selectedIconPath": "https://file.maiyatown.com/images/v1.4/icon/shouye_x.svg",
                                  "text": "首页"
                                },
                                {
                                  "pagePath": "/pages/shopCar/shopCar",
                                  "iconPath": "https://file.maiyatown.com/images/v1.4/icon/gouwuche_m.svg",
                                  "selectedIconPath": "https://file.maiyatown.com/images/v1.4/icon/gouwuche_x.svg",
                                  "text": "购物车"
                                },
                                {
                                  "pagePath": "/pages/mySelf/mySelf",
                                  "iconPath": "https://file.maiyatown.com/images/v1.4/icon/wode_m.svg",
                                  "selectedIconPath": "https://file.maiyatown.com/images/v1.4/icon/wode_x.svg",
                                  "text": "我的"
                                }]
                              }
                              app.globalData.tabBar = tabBar
                              that.editTabbar();
                            }

                          } else {
                            console.log('2222222222')

                            let tabBar = {
                              "color": "#ffffff",
                              "selectedColor": "#DD232F",
                              "list": [{
                                "pagePath": "/pages/home/home",
                                "iconPath": "https://file.maiyatown.com/images/v1.4/icon/shouye_m.svg",
                                "selectedIconPath": "https://file.maiyatown.com/images/v1.4/icon/shouye_x.svg",
                                "text": "首页"
                              },
                              {
                                "pagePath": "/pages/maiya/maiya",
                                "iconPath": "https://file.maiyatown.com/images/v1.4/icon/maiya_m.svg",
                                "selectedIconPath": "https://file.maiyatown.com/images/v1.4/icon/maiya_x.svg",
                                "text": "会员"
                              },
                              {
                                "pagePath": "/pages/shopCar/shopCar",
                                "iconPath": "https://file.maiyatown.com/images/v1.4/icon/gouwuche_m.svg",
                                "selectedIconPath": "https://file.maiyatown.com/images/v1.4/icon/gouwuche_x.svg",
                                "text": "购物车"
                              },
                              {
                                "pagePath": "/pages/mySelf/mySelf",
                                "iconPath": "https://file.maiyatown.com/images/v1.4/icon/wode_m.svg",
                                "selectedIconPath": "https://file.maiyatown.com/images/v1.4/icon/wode_x.svg",
                                "text": "我的"
                              }]
                            }
                            app.globalData.tabBar = tabBar
                            that.editTabbar();
                          }

                        }
                      })
                      if (wx.getStorageSync('gift_package')) {
                        
                        wx.reLaunch({
                          url: '/' + wx.getStorageSync('gift_packagepath') + '?userId=' + wx.getStorageSync('gift_packageid') + '&gift_package=true'
                        });
                      } else if (wx.getStorageSync('isArticalShare')) {
                        wx.reLaunch({
                          url: '/pages/articleDetails/articleDetails' + '?id=' + wx.getStorageSync('artical_id') + '&isArticalShare=' + wx.getStorageSync('isArticalShare') + '&userId=' + wx.getStorageSync('artical_userid')
                        });
                      } else if (wx.getStorageSync('scene')) {
                        console.log(wx.getStorageSync('scenePath'));
                        let scenepath = wx.getStorageSync('scenePath')
                        // if (scenepath == "pages/goodsDetails1/goodsDetails1"){
                        wx.reLaunch({
                          url: '/' + wx.getStorageSync('scenePath') + '?&scene=' + wx.getStorageSync('scene'),
                        })

                      } else if (wx.getStorageSync('order_show')) {
                        console.log('init传参：', wx.getStorageSync('order_groupBuyingId'));
                        wx.reLaunch({
                          url: '/pages/myRegimentDetails1/myRegimentDetails1' + '?isnew=' + data.data.iSNew + '&groupBuyingId=' + wx.getStorageSync('order_groupBuyingId') + '&activityId=' + wx.getStorageSync('order_activityId') + '&id=' + wx.getStorageSync('order_id') + '&order_show=true'
                        });
                      } else if (wx.getStorageSync('out_show')) {
                        console.log('我获取到了路径')
                        wx.reLaunch({
                          // '&goodsId=' + this.data.goodsId +     +'&out_show=true'
                          url: '/pages/groupDetails/groupDetails' + '?isnew=' + data.data.iSNew + '&goodsId=' + wx.getStorageSync('out_id') + '&activityId=' + wx.getStorageSync('out_activity') + '&id=' + wx.getStorageSync('out_groupid') + '&out_show=true' + '&isInvite=' + wx.getStorageSync("out_isInvite")
                        });
                      } else if (wx.getStorageSync('myxzPath')) {
                        console.log(wx.getStorageSync('myxzPath'));
                        wx.reLaunch({
                          url: '/pages/goodsDetails1/goodsDetails1' + '?isnew=' + data.data.iSNew + "&totalCoupon=" + data.data.totalCoupon + '&left=' + wx.getStorageSync('myxzLeft') + '& activityId=' + wx.getStorageSync('myxzActivityId') + '&id=' + wx.getStorageSync('myxzGoodId')
                        });
                      } else {
                        console.log('xyz;;')
                        wx.reLaunch({
                          url: '/pages/home/home' + '?isnew=' + data.data.iSNew + "&totalCoupon=" + data.data.totalCoupon
                        });
                      }
                    }, 100)
                  }else{

                    //保存用户数据到本地缓存
                    let oldData = wx.getStorageSync('myxzUserInfo');
                    if (oldData) {
                      let newData = Object.assign(oldData, data.data);
                      wx.setStorageSync('myxzUserInfo', newData);
                      //设置本人userId
                      wx.setStorageSync('myxzUserId', data.data.id);
                    } else {
                      wx.setStorageSync('myxzUserInfo', data.data);
                      //设置本人userId
                      wx.setStorageSync('myxzUserId', data.data.id);
                    }

                    //返回数据
                    let dataList = data.data;
                    //吧openId 存到本地
                    wx.setStorageSync('myxzOpenId', dataList.openId);
                    wx.setStorageSync('myxzToken', dataList.token);
                    that.setData({
                      inverter: false
                    })


                  }
                },
                fail(res) {

                }
              })
            }
          });
        } else {
          console.log('授权失败')
        }
      }
    })
  },
  //跳过绑定邀请码
  skip(){
      var that = this;
      console.log('this=', this, 'that=', that);
      console.log(wx.getStorageSync('myxzToken'))
      // console.log(app.globalData.tabBar);
      // let token = wx.getStorageSync('myxzToken');
      // let reqObj = {
      //   url: '/api/user/myInfo?auth-token=' + token
      // }
      // util.RequestGet(reqObj, null, (res, message) => {
      //   if (res.resCode == '0000') {
      //     //成功数据
      //     console.log(res, res.data.inviteSwitch, 'dccdc')
      //     if (res.data.userLevel == 1) {
      //       // console.log('先判断是否是会员')
      //       if (res.data.inviteSwitch == 1) {
      //         // 普通用户
      //         let tabBar = {
      //           "color": "#ffffff",
      //           "selectedColor": "#DD232F",
      //           "list": [{
      //             "pagePath": "/pages/home/home",
      //             "iconPath": "https://file.maiyatown.com/images/v1.4/icon/shouye_m.svg",
      //             "selectedIconPath": "https://file.maiyatown.com/images/v1.4/icon/shouye_x.svg",
      //             "text": "首页"
      //           },
      //           {
      //             "pagePath": "/pages/maiya2/maiya2",
      //             "iconPath": "https://file.maiyatown.com/images/v1.4/icon/quanyi_m.svg",
      //             "selectedIconPath": "https://file.maiyatown.com/images/v1.4/icon/quanyi_x.svg",
      //             "text": "权益"
      //           },
      //           {
      //             "pagePath": "/pages/shopCar/shopCar",
      //             "iconPath": "https://file.maiyatown.com/images/v1.4/icon/gouwuche_m.svg",
      //             "selectedIconPath": "https://file.maiyatown.com/images/v1.4/icon/gouwuche_x.svg",
      //             "text": "购物车"
      //           },
      //           {
      //             "pagePath": "/pages/mySelf/mySelf",
      //             "iconPath": "https://file.maiyatown.com/images/v1.4/icon/wode_m.svg",
      //             "selectedIconPath": "https://file.maiyatown.com/images/v1.4/icon/wode_x.svg",
      //             "text": "我的"
      //           }]
      //         }
      //         app.globalData.tabBar = tabBar
      //         console.log(app.globalData.tabBar)
      //         that.editTabbar();
      //       } else {
      //         let tabBar = {
      //           "color": "#ffffff",
      //           "selectedColor": "#DD232F",
      //           "list": [{
      //             "pagePath": "/pages/home/home",
      //             "iconPath": "https://file.maiyatown.com/images/v1.4/icon/shouye_m.svg",
      //             "selectedIconPath": "https://file.maiyatown.com/images/v1.4/icon/shouye_x.svg",
      //             "text": "首页"
      //           },
      //           {
      //             "pagePath": "/pages/shopCar/shopCar",
      //             "iconPath": "https://file.maiyatown.com/images/v1.4/icon/gouwuche_m.svg",
      //             "selectedIconPath": "https://file.maiyatown.com/images/v1.4/icon/gouwuche_x.svg",
      //             "text": "购物车"
      //           },
      //           {
      //             "pagePath": "/pages/mySelf/mySelf",
      //             "iconPath": "https://file.maiyatown.com/images/v1.4/icon/wode_m.svg",
      //             "selectedIconPath": "https://file.maiyatown.com/images/v1.4/icon/wode_x.svg",
      //             "text": "我的"
      //           }]
      //         }
      //         app.globalData.tabBar = tabBar
      //         that.editTabbar();
      //       }

      //     } else {
      //       console.log('2222222222')

      //       let tabBar = {
      //         "color": "#ffffff",
      //         "selectedColor": "#DD232F",
      //         "list": [{
      //           "pagePath": "/pages/home/home",
      //           "iconPath": "https://file.maiyatown.com/images/v1.4/icon/shouye_m.svg",
      //           "selectedIconPath": "https://file.maiyatown.com/images/v1.4/icon/shouye_x.svg",
      //           "text": "首页"
      //         },
      //         {
      //           "pagePath": "/pages/maiya/maiya",
      //           "iconPath": "https://file.maiyatown.com/images/v1.4/icon/maiya_m.svg",
      //           "selectedIconPath": "https://file.maiyatown.com/images/v1.4/icon/maiya_x.svg",
      //           "text": "会员"
      //         },
      //         {
      //           "pagePath": "/pages/shopCar/shopCar",
      //           "iconPath": "https://file.maiyatown.com/images/v1.4/icon/gouwuche_m.svg",
      //           "selectedIconPath": "https://file.maiyatown.com/images/v1.4/icon/gouwuche_x.svg",
      //           "text": "购物车"
      //         },
      //         {
      //           "pagePath": "/pages/mySelf/mySelf",
      //           "iconPath": "https://file.maiyatown.com/images/v1.4/icon/wode_m.svg",
      //           "selectedIconPath": "https://file.maiyatown.com/images/v1.4/icon/wode_x.svg",
      //           "text": "我的"
      //         }]
      //       }
      //       app.globalData.tabBar = tabBar
      //       that.editTabbar();
      //     }

      //   }
      // })
      if (wx.getStorageSync('gift_package')) {
        console.log('gift'+wx.getStorageSync('gift_packagepath'));
        wx.reLaunch({
          url: '/' + wx.getStorageSync('gift_packagepath') + '?userId=' + wx.getStorageSync('gift_packageid') + '&gift_package=true'
        });
      } else if (wx.getStorageSync('isArticalShare')) {
        wx.reLaunch({
          url: '/pages/articleDetails/articleDetails' + '?id=' + wx.getStorageSync('artical_id') + '&isArticalShare=' + wx.getStorageSync('isArticalShare') + '&userId=' + wx.getStorageSync('artical_userid')
        });
      } else if (wx.getStorageSync('scene')) {
        console.log(wx.getStorageSync('scenePath'));
        let scenepath = wx.getStorageSync('scenePath')
        // if (scenepath == "pages/goodsDetails1/goodsDetails1"){
        wx.reLaunch({
          url: '/' + wx.getStorageSync('scenePath') + '?&scene=' + wx.getStorageSync('scene'),
        })

      } else if (wx.getStorageSync('order_show')) {
        console.log('init传参：', wx.getStorageSync('order_groupBuyingId'));
        wx.reLaunch({
          url: '/pages/myRegimentDetails1/myRegimentDetails1' + '?isnew=' + that.data.iSNew + '&groupBuyingId=' + wx.getStorageSync('order_groupBuyingId') + '&activityId=' + wx.getStorageSync('order_activityId') + '&id=' + wx.getStorageSync('order_id') + '&order_show=true'
        });
      } else if (wx.getStorageSync('out_show')) {
        console.log('我获取到了路径')
        wx.reLaunch({
          // '&goodsId=' + this.data.goodsId +     +'&out_show=true'
          url: '/pages/groupDetails/groupDetails' + '?isnew=' + that.data.iSNew + '&goodsId=' + wx.getStorageSync('out_id') + '&activityId=' + wx.getStorageSync('out_activity') + '&id=' + wx.getStorageSync('out_groupid') + '&out_show=true' + '&isInvite=' + wx.getStorageSync("out_isInvite")
        });
      } else if (wx.getStorageSync('myxzPath')) {
        console.log(wx.getStorageSync('myxzPath'));
        wx.reLaunch({
          url: '/pages/goodsDetails1/goodsDetails1' + '?isnew=' + that.data.iSNew + "&totalCoupon=" + that.data.totalCoupon + '&left=' + wx.getStorageSync('myxzLeft') + '& activityId=' + wx.getStorageSync('myxzActivityId') + '&id=' + wx.getStorageSync('myxzGoodId')
        });
      } else {
        
        wx.reLaunch({
          url: '/pages/home/home' + '?isnew=' + that.data.iSNew + "&totalCoupon=" + that.data.totalCoupon
        });
      }
  },
  inviter_true(){
    if (this.data.userInputnum==''){
      console.log(this.data.userInputnum)
      Toast('请输入正确的邀请码');
    }else{
      console.log(this.data.userInputnum)
      let bindInviter  = {}
      bindInviter.code = this.data.userInputnum
      let token = wx.getStorageSync('myxzToken');
      let reqObj = {
        url: '/api/user/bindInviter?auth-token='+token,
        data: bindInviter
      }
      util.RequestPost(reqObj, null, (res, message) => {
        if (message) {
          console.log(message);
          Toast(res.resDesc);
        }
        if (res.resCode == '0000') {
          //成功数据
          Toast("绑定成功")
          wx.reLaunch({
            url: '/pages/home/home' + '?isnew=' + this.data.iSNew + "&totalCoupon=" + this.data.totalCoupon
          });
        }
      })
    }
    
  },
  userInputnum(e){
    console.log(e.detail.value);
    this.setData({
      userInputnum: e.detail.value
    })
  },
  //初始化tabbar
  editTabbar: function () {
    console.log('editTabbar执行了')
    let tabbar = app.globalData.tabBar;
    console.log('editTabbar', tabbar)
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;

    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);


    // if(pagePath.indexOf('/') != 0){
    //   pagePath = '/' + pagePath;
    // } 

    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    app.globalData.tabBar = tabbar
    console.log('editTabbar', tabbar)
    _this.setData({
      tabbar: tabbar
    });
  },
})