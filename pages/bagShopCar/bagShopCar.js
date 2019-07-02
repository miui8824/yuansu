// pages/shopCar/shopCar.js
const app = getApp();
var util = require('../../utils/util.js');
import Dialog from '../../dist/dialog/dialog';
import shopCarListData from './data.js'
Page({
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title: '购物车',
    tabbar: {},//公共下标
    noShopCar: false,
    allSelect: false, //全选按钮
    shop_money: '1000',
    shop_num: "2",
    shopCarList: [],
    offShopList: [],//商品下架类表
    isCustomer:999,//是否是会员 

    switchList: [], //开关列表
    reqList: [], //购物车id 列表

    selectGoodsDialog: false,
    selectGoodsType: "1",

    allSumNumber: 0 + ".00", //总金额
    allNumberText: '', //结算文字
    residueBagsPrice: '0.00',//普通想升级的价格 会员优惠标准

    outseaGoodsNum: null,//海外商品数量
    domainGoodsNum: null, //国内商品数量

    userId: null,
    groupTimeData: [],
    appointmentTimeData: [],
    userid_weweima: "",
    eidtButtonClick:true,//当用户点击删除的时候 shopCarList 重新渲染数据

    combinedPrice:'0.00',//组合礼包的 购买标准
    disAmt:'0.00', //购买的优惠价格
    disAmtShow:false,//显示优惠价格

    delta:1,
    nowTimes: new Date().getTime(),//当前时间防止重复点击
  },
  // canvas画图分享的发放 （保存图片，绘制分享图）
  eventDraw() {
    this.setData({
      GetImage: true,
      shareImage: ""
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
                  top: 20,
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
          });
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
  onLoad(options) {

    console.log({
      combinedPrice: Number(options.combinedPrice).toFixed(2),
      disAmt: Number(options.disAmt).toFixed(2)
    })
    this.setData({
      combinedPrice: Number(options.combinedPrice).toFixed(2),
      upgradePrice: Number(options.upgradePrice).toFixed(2),
      disAmt: Number(options.disAmt).toFixed(2),
      delta: options.delta||1
    })
  },
  onHide: function () {
    this.setData({
      GetImage: false,
    })
  },
  onShow() {

    this.setData({
      allNumberText: '结算',
      allSumNumber: '0.00'
    }, () => {
      if (wx.getStorageSync('myxzToken')) {
        this.shopcarList();
      }
      var allNumber = 0;
      for (let i = 0; i < this.data.switchList.length; i++) {
        if (this.data.switchList[i]) {
          allNumber += this.data.shopCarList[i].goodsNumber
          this.setData({
            allNumber,
            allNumberText: '结算',
            allSumNumber: '0.00',
            selectGoodsDialog: false
          })
        }
      }
      //埋点函数 页面操作事件 下一个页面地址
      util.mdFun(this, '', '');
      //..userId
      util.getNowUserId((userId) => {
        this.setData({
          userId
        })
      })
    })
  },
  onReady() {
  },
  // 解决返回上一层没有数据的问题
  shopcarList() { 
    let reqObj = {
      url: '/api/tempshopCar/tempGoodList',
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (res.resCode == '0000') {
        //成功数据
        let shopCarList = res.resultList;
        let noShopCar =false;
        if (shopCarList.length>0){
          for (let ii of shopCarList){
            ii.price = Number(ii.price).toFixed(2)
          }
        }else{
          noShopCar = true;
        }
        console.log(shopCarList);
        this.setData({
          shopCarList,
          noShopCar,
          isCustomer: app.globalData.isCustomer,
          residueBagsPrice: app.globalData.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice
        }, () => {
          //控制选中的开关
          let switchList = [];
          for (var ii of this.data.shopCarList) {
            switchList.push(false);
          }
          //控制选中的开关
          this.setData({
            switchList,
            allSelect: false
          })
        })
      }
    })

  },
  //全选按钮
  allchoice() {
    let switchType = !this.data.allSelect;
    let switchList = [];
    for (let i of this.data.switchList) {
      switchList.push(switchType);
    }
    let allNumber = 0;
    if (switchType) {
      for (let i of this.data.shopCarList) {
        allNumber = allNumber + i.goodsNumber
      }
    }
    if (allNumber == 0) {
      this.setData({
        allNumberText: '结算'
      })
    } else {
      this.setData({
        allNumberText: '结算(' + allNumber + ')'
      })
    }
    this.setData({
      allSelect: !this.data.allSelect,
      switchList: switchList
    })
    this.allSumMoney();
  },
  //跳转商品详情
  goShopDetail(event) {

    wx.navigateTo({
      url: '/pages/goodsDetails/goodsDetails?id=' + event.currentTarget.dataset.goodsid + '&activityId=0&left=true'
    })
  },
  clearShopItem(event) {
    let _this = this;
    let index = event.currentTarget.dataset.index;
    Dialog.confirm({
      title: '确定要删除该商品吗?',
      message: "  ",
      cancelButtonText: '再考虑一下',
      confirmButtonText: '确定'
    }).then(() => {
      let _this = this;
      _this.eidtShopCar(0, index);
      //当前选择数组也处理一下
      let oldSwitchList = _this.data.switchList;
      oldSwitchList.splice(index, 1);
      _this.setData({
        switchList: oldSwitchList
      })
      if (this.data.shopCarList.length == 0 && this.data.offShopList.length == 0) {
        //清除当前国内国外的限制。
        app.globalData.crossBorder = '';

        this.setData({
          noShopCar: true
        })
      }
      var allNumber = 0;
      for (let i = 0; i < this.data.switchList.length; i++) {
        if (this.data.switchList[i]) {
          allNumber += this.data.shopCarList[i].goodsNumber
          console.log(allNumber)
          if (allNumber == 0) {
            _this.setData({
              allNumberText: '结算'
            })
          } else {
            _this.setData({
              allNumberText: '结算(' + allNumber + ')'
            })
          }

        } else {
          _this.setData({
            allNumberText: '结算'
          })
        }
      }
      this.allSumMoney()
    }).catch(() => {
      // on cancel
    });
  },
  clearShopItem1(event) {
    let _this = this;
    let index = event.currentTarget.dataset.index;
    Dialog.confirm({
      title: '确定要删除该商品吗?',
      cancelButtonText: '再考虑一下',
      confirmButtonText: '确定'
    }).then(() => {
      let oldObj = JSON.parse(JSON.stringify(this.data.offShopList));
      _this.eidtShopCar(0, index);
      oldObj.splice(index, 1);
      _this.setData({
        offShopList: oldObj
      })
      if (this.data.shopCarList.length == 0 && this.data.offShopList.length == 0) {
        this.setData({
          noShopCar: true
        })
      }
      var allNumber = 0;
      for (let i = 0; i < this.data.switchList.length; i++) {
        if (this.data.switchList[i]) {
          // allNumber = allNumber + this.data.shopCarList[j].goodsNumber;
          allNumber += this.data.shopCarList[i].goodsNumber
          console.log(allNumber)
          if (allNumber == 0) {
            _this.setData({
              allNumberText: '结算'
            })
          } else {
            _this.setData({
              allNumberText: '结算(' + allNumber + ')'
            })
          }
        }
      }
      this.allSumMoney()
    }).catch(() => {
      // on cancel
    });
  },
  //计算总金额 通用方法
  allSumMoney() {
    //计算当前总价
    let switchList = this.data.switchList;
    let shopCarList = this.data.shopCarList;
    let allSumNumber = 0;
    for (let j = 0; j < shopCarList.length; j++) {
      if (switchList[j]) {
        allSumNumber = (allSumNumber*100 + ((shopCarList[j].price * shopCarList[j].goodsNumber * 100) / 100)*100)/100;
      }
    }
    //做个判断区分会员和非会员的具体展示
    let disAmtShow = false;
    let residueBagsPrice=0;
    if (Number(this.data.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) - allSumNumber <= 0) {
      //如果满足价格
      residueBagsPrice = '-999';
      disAmtShow = true;
      //会员的话减去优惠的金额
      if (this.data.isCustomer == 1){
        allSumNumber = Number((allSumNumber*100 - this.data.disAmt*100)/100);
      }
    } else {
      residueBagsPrice = Number(Math.floor((this.data.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) * 100 - allSumNumber * 100) / 100).toFixed(2);
      disAmtShow = false;
    }
    allSumNumber = Number(allSumNumber).toFixed(2);

    this.setData({
      residueBagsPrice,
      disAmtShow,
      allSumNumber
    })
  },
  //单一选择
  itemOnChange(event) {
    let index = event.currentTarget.dataset.index;
    let newObj = JSON.parse(JSON.stringify(this.data.switchList));

    newObj[index] = !newObj[index];
    let allSelect = true;
    let allSumNumber = 0;//全部金额
    let allNumber = 0; //全部数量

    for (let i of newObj) {
      if (!i) {
        allSelect = false;
      }
    }
    //计算当前总价
    for (let j = 0; j < this.data.shopCarList.length; j++) {
      if (newObj[j]) {
        allSumNumber = allSumNumber + (this.data.shopCarList[j].price * this.data.shopCarList[j].goodsNumber * 100) / 100;
        allNumber = allNumber + this.data.shopCarList[j].goodsNumber;
      }
    }
    let disAmtShow = false;
    let residueBagsPrice = 0;
    if (Number(this.data.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) - allSumNumber <= 0) {
      //如果满足价格
      residueBagsPrice = '-999';
      disAmtShow = true;
      //会员的话减去优惠的金额
      if (this.data.isCustomer == 1) {
        allSumNumber = Number((allSumNumber * 100 - this.data.disAmt * 100) / 100);
      }
    } else {
      residueBagsPrice = Number(Math.floor((this.data.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) * 100 - allSumNumber * 100) / 100).toFixed(2);
      disAmtShow = false;
    }
    allSumNumber = Number(allSumNumber).toFixed(2);
    if (allNumber == 0) {
      this.setData({
        allNumberText: '结算'
      })
    } else {
      this.setData({
        allNumberText: '结算(' + allNumber + ')'
      })
    }
    this.setData({
      residueBagsPrice,
      disAmtShow,
      switchList: newObj,
      allSelect: allSelect,
      allSumNumber
    })
  },
  //修改商品
  onChange(event) {
    let index = event.currentTarget.dataset.index;
    let goodNumber = parseInt(event.detail);
    //超过库存
    if (goodNumber > this.data.shopCarList[index].dummyStock) {
      wx.showToast({
        title: '商品库存不足,已修改为当前最大数量',
        icon: 'none',
        duration: 1500
      })
      //当前处理方案 获取页面初始化的库存
      this.data.shopCarList[index].goodsNumber = this.data.shopCarList[index].dummyStock;
      this.setData({
        shopCarList: this.data.shopCarList
      })
      return false;
    }
    this.data.shopCarList[index].goodsNumber = goodNumber;
    this.setData({
      shopCarList: this.data.shopCarList
    })
    this.eidtShopCar(goodNumber, index, () => {
      var allNumber = 0;
      let _this = this;
      for (let i = 0; i < this.data.switchList.length; i++) {
        if (this.data.switchList[i]) {
          // allNumber = allNumber + this.data.shopCarList[j].goodsNumber;
          allNumber += this.data.shopCarList[i].goodsNumber
          if (allNumber == 0) {
            _this.setData({
              allNumberText: '结算'
            })
          } else {
            _this.setData({
              allNumberText: '结算(' + allNumber + ')'
            })
          }
        }
      }
      //计算总金额
      this.allSumMoney();
    });
  },
  //修改删除商品接口
  eidtShopCar(numberNumber, goodIndex, callBack) {
    let shopCarList = JSON.parse(JSON.stringify(this.data.shopCarList));
    //v1.4.1 修改商品数量发送请求
    let reqObj = {
      url: '/api/tempshopCar/addTempShopCar',
      data: {
        activityId: shopCarList[goodIndex].activityId,
        goodList: [{
          goodsId: shopCarList[goodIndex].goodsId,
          goodsNumber: numberNumber,
          skuId: shopCarList[goodIndex].skuId
        }],
        invterUserId: app.globalData.userIdPro
      }
    }
    util.RequestPost(reqObj, null, (res, message) => {
      if (res.resCode == '21032') {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 1000
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/home/home',
          })
        }, 1000)
      }
    })
    if (numberNumber==0){
      shopCarList.splice(goodIndex, 1);
      this.setData({
        eidtButtonClick:false
      },()=>{
        this.setData({
          eidtButtonClick: true
        })
      })
    }else{
      shopCarList[goodIndex].goodNumber = goodIndex;
    }
    this.setData({
      shopCarList
    }, () => {
      if (callBack) {
        callBack()
      }
    })
  },
  //结算
  goPay() {
    //防抖
    let _nowtimes = new Date().getTime();
    if (_nowtimes - this.data.nowTimes > 1000) {
      this.setData({
        nowTimes: _nowtimes
      })
    } else {
      return false;
    }
    let haveGoodPay = false;
    for (let ii of this.data.switchList) {
      if (ii) {
        haveGoodPay = true;
      }
    }
    //没有结算商品
    if (!haveGoodPay) {
      wx.showToast({
        title: '请选择需要购买的商品',
        icon: 'none',
        duration: 1500
      })
      return false;
    }

    let reqList = [];
    let switchList = this.data.switchList;
    //存储超过库存的数据
    let _shopCarList = this.data.shopCarList;
    for (let i = 0; i < _shopCarList.length; i++) {
      if (switchList[i]) {
        reqList.push(_shopCarList[i].id);
      }
      if (_shopCarList[i].goodsNumber > _shopCarList[i].dummyStock) {
        let message = '您选择的' + _shopCarList[i].title.substring(0, 8) + (_shopCarList[i].title.length > 8 ? '...' : '') + '库存仅剩' + _shopCarList[i].dummyStock + '件，请重新选择。';
        Dialog.confirm({
          message: message
        }).then(() => {
          // on confirm
        }).catch(() => {
          // on cancel
        });
        return false;
      }
    }
    if (reqList.length == 0) {
      Dialog.confirm({
        message: '请选择结算商品~'
      }).then(() => {
        // on confirm
      }).catch(() => {
        // on cancel
      });
      return false;
    }
    this.countGoodsType()
    this.shopCarSubmit(3, reqList, () => {
      this.setData({
        selectGoodsDialog: true,
        reqList: reqList
      })
    })
  },
  //选择商品后 支付 
  //选择国内国外商品
  goPayOk() {
    let reqList = [];
    let outReqList = []
    for (let i of this.data.shopCarList) {
      if (i.crossBorder == 1) {
        outReqList.push(i.id);
      } else {
        reqList.push(i.id);
      }
    }
    this.shopCarSubmit(this.data.selectGoodsType, this.data.selectGoodsType == 1 ? outReqList : reqList);
  },
  //购买提交 发送请求
  shopCarSubmit(type, reqList, callBack) {
    let shopCarList = this.data.shopCarList;
    let reqObj = {
      url: '/api/shopCar/customerPurchase',
      data: {
        activityId: shopCarList[0].activityId,
        goodList: shopCarList,
        invterUserId: app.globalData.userIdPro
      }
    }
    util.RequestPost(reqObj, null, (res, message) => {
      if (res.resCode == '21032') {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 1500
        })
        setTimeout(() => {
          app.globalData.userIdPro='';
          wx.reLaunch({
            url: '/pages/home/home',
          })
        }, 1000)
      }
      if (res.resCode == '9003') {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 1500
        })
        setTimeout(() => {
          app.globalData.userIdPro = '';
          wx.reLaunch({
            url: '/pages/home/home',
          })
        }, 1000)
      }
      if (res.resCode == '21004') {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 1500
        })
      }
      if (res.resCode == '21008') {
        Dialog.confirm({
          title: "请先绑定手机号",
          message: '   '
        }).then(() => {
          // on confirm
          wx.navigateTo({
            url: '/pages/bindPhone/bindPhone?from=goodsDetails'
          })
        }).catch(() => {
          // on cancel
        });
      }
      if (res.resCode == '21005') {
        callBack();
      }
      if (res.resCode == '0000') {
        //成功数据
        app.globalData.goodsDetails = res;
        wx.navigateTo({
          url: '/pages/confirmOrder/confirmOrder',
        })
      }
    })
  },
  onDialogClose() {
    this.setData({
      selectGoodsDialog: false
    })
  },
  //选择海外 国内商品
  selectGoodsTypeFun(event) {
    this.setData({
      selectGoodsType: event.detail
    })
  },
  goHome() {
    if (this.data.delta==1){
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.navigateBack({
        delta: 2
      })
    }
    // wx.reLaunch({ url: '/pages/bagsList/bagsList?gift_package=true' });
  },
  onShareAppMessage: function (res) {
    // this.setData({
    //   GetImage: false
    // })
    // let shareImageArr = wx.getStorageSync('shareImage');
    // let shareImage = '';
    // console.log(shareImageArr);
    // let numberText = Math.floor(Math.random() * 4);
    // if (shareImageArr && shareImageArr.length > 0) {
    //   shareImage = shareImageArr[Math.floor(Math.random() * shareImageArr.length)].bannerUrl;
    // }

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
  },

  // 分类计算商品数量
  countGoodsType() {
    let { switchList, shopCarList } = this.data
    let domainGoodsNum = 0
    let outseaGoodsNum = 0
    for (let i = 0; i < switchList.length; i++) {
      if (switchList[i] && shopCarList[i].crossBorder == 2) {
        domainGoodsNum += shopCarList[i].goodsNumber
      }
      if (switchList[i] && shopCarList[i].crossBorder == 1) {
        outseaGoodsNum += shopCarList[i].goodsNumber
      }
    }
    this.setData({
      domainGoodsNum,
      outseaGoodsNum
    })
  },
  onPullDownRefresh: function () {
    this.shopcarList();
    this.setData({
      allNumberText: "结算",
      allSumNumber: '0.00'
    })
    wx.stopPullDownRefresh()
  }
})