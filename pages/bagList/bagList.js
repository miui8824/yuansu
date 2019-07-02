// pages/bagList/bagList.js
const app = getApp()
var apiUrl = require('../../static/js/url.js');
var util = require('../../utils/util.js');
import Dialog from '../../dist/dialog/dialog';
Page({
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:'会员礼包',
    iPage: 1,
    pageSize: 10,
    bagsList:[],
    bannerList:[],
    swiperActive: 0,
    levelUpOne:null,
    isLoadMore: true,//判断是否底部还有商品
    // painting: {}, //canvas画图的变量
    // shareImage: '',//canvas画图的变量
    // GetImage: false,
    userId:"",
    noZuheGift:true,
    nowTimes: new Date().getTime(),//当前时间防止重复点击
    activeGoodsNumber: 1,//当前点击的商品数量
    activeGoodsIndex: 0,//当前点击的商品下标

    // sku用到的参数
    specList: [], //商品参数
    skuList: [],//SKU列表
    SKUResult: {}, //根据sku列表生成的所有能选的列表
    activeSkuItem: {},//最后选中的SKu
    haveChangedId: '',//当前选择规格 选中了几项
    specListLength: 0,//可选商品规格总项数
    skuId: '',//最终选择的sku 的id
    userId: "",
    nowTimes: new Date().getTime(),//当前时间防止重复点击
    userid_weweima:"",
    combinationBanner:''//组合礼包的图片
  },
  // canvas生成的图片点击消失
  share_hide: function () {
    this.setData({
      GetImage: false
    })
  },
  // canvas画图分享的发放 （保存图片，绘制分享图）
  eventDraw(option) {
    this.setData({
      GetImage: true,
      shareImage: ""
    })
    let userid = parseInt(this.data.userId).toString(32)
    let reqObj = {
      url: '/api/generate/code',
      data: {
        "autoColor": true,
        "page": "pages/bagList/bagList",
        "scene": userid + "#" + '0' + '#' + 0 + '#' + 0,
        "width": 280
      }
    }
    util.RequestPost(reqObj, null, (data, message) => {
      console.log(data.data)
      this.setData({
        userid_weweima: data.data
      })
      // if (res.resCode == '0000') {
      //   console.log(res);
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
              // 最上面的小麦  app.globalData.wechatheadImageUrl
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
                content:  app.globalData.wechatnickName,
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
                url: "https://file.maiyatown.com/images/v1.4/huiyuan_pic.jpg",
                top: 60,
                left: 32.5,
                width: 310,
                height: 350
              },
              // 二维码图片  res.data  'https://file.maiyatown.com/images/v1.2/home_share_img3.png'
              {
                type: 'image',
                url: this.data.userid_weweima,
                top: 420,
                left: 250,
                width: 88,
                height: 88
              },
              // 动态生成的字    this.data.copywriting
              {
                type: 'text',
                content:"任选一款成为会员，买得多，省得更多!",
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
              // {
              //   type: 'text',
              //   content: "￥" + Number(item.price).toFixed(2),
              //   fontSize: 24,
              //   color: '#FF262C',
              //   textAlign: 'left',
              //   top: 420,
              //   left: 32.5,
              //   lineHeight: 20,
              //   MaxLineNumber: 2,
              //   breakWord: true,
              //   width: 155,
              //   bolder: true
              // },
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
      // }
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

  onLoad: function (options) {
    // app.globalData.upUserId = parseInt(sceneArr[0], 32);
    console.log(app.globalData.wechatheadImageUrl);
    if (options.gift_package){
      app.globalData.userIdPro = options.userId;
      util.bindfriend(options.userId)//绑定好友关系
      this.setData({
        showIcon:false
      })
    }
    if (options.userId){
      app.globalData.userIdPro = options.userId;
    }
    this.getBagsList();
    this.getBagsList1();
    util.getNowUserId((userId) => {
      this.setData({
        userId
      })
    })   
    //扫码进来的 都带有scene的参数
    if (options.scene){
      let scene = decodeURIComponent(options.scene);
      console.log(scene);
      let sceneArr = scene.split('#');
      let userId = parseInt(sceneArr[0], 32);//将32进制的转化为10进制的
      util.bindfriend(options.userId)//绑定好友关系
      this.setData({
        showIcon: false
      })
    }
  },
  onShow(){
    //头部的高度
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      titleBarHeight: app.globalData.titleBarHeight
    });
  },
  //加载更多数据
  loadMore() {
    this.getBagsList();
  },
  //获取组合列表
  getBagsList() {
    //进来就自增
    let _iPage = this.data.iPage;
    this.setData({
      iPage: _iPage + 1
    })
    //如果没有数据 就不发请求了
    if (!this.data.isLoadMore) {
      return false;
    }
    let reqObj = {
      url: '/api/goods/membeGiftBag/list?iPage=' + _iPage + '&pageSize=' + this.data.pageSize
    }
    util.RequestGet(reqObj, null, (res, message) => {
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
        return false;
      }
      if (res.resCode == '0000') {
        
        //加小数点
        for (var i of res.resultList) {
          i.price = Number(i.price).toFixed(2);
          i.retailPrice = Number(i.retailPrice).toFixed(2);
          i.memberPrice = Number(i.memberPrice).toFixed(2);
        }
        let bagsInfo = JSON.parse(JSON.stringify(res.data));
        
        //banner列表
        this.setData({
          bagsInfo
        })
        //成功数据
        if (_iPage == 1) {
          //数据少于10条 ,直接替换 ，不让请求了
          if (res.resultList.length < 10) {
            this.setData({
              isLoadMore: false
            })
          }
          //处理数据是整条的时候
          bagsInfo.disAmt = Number(bagsInfo.disAmt).toFixed(2)
          this.setData({
            bagsInfo,
            bannerList: res.data.topBannerUrl,
            levelUpOne: Number(res.data.levelUpOne).toFixed(2),
            bagsList: res.resultList,
            combinationBanner: res.data.combinationBanner
          })
        } else {
          //数据少于10条 ,直接拼接 ，不让请求了
          let oldList = this.data.bagsList;
          let newList;
          if (res.resultList.length < 10) {
            this.setData({
              isLoadMore: false
            })
          }
          newList = oldList.concat(res.resultList);
          this.setData({
            bagsList: newList
          })
        }
      }
    })
  },

  goBagsList(){
    wx.navigateTo({
      url: '/pages/bagsList/bagsList',
    })
  },

  getBagsList1() {	
    let reqObj = {
      url: '/api/goods/customerGoodList?iPage=1&pageSize=10'
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
          console.log(res)
          if (res.resultList.length == 0) {
            this.setData({
            noZuheGift: false
            })
          }
        }
      })
  },  
  //banner 切换
  swiperChange(event) {
    this.setData({
      swiperActive: event.detail.current
    })
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
      title: '任选一款成为会员，买得多，省得更多！',
      path: 'pages/bagList/bagList?userId=' + this.data.userId +'&gift_package=true',
      imageUrl:'https://file.maiyatown.com/images/v1.4/huiyuan_pic.jpg'
    }
  },
  //跳转到购买详情
  goBagDetails(event){
    let item = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/bagDetails/bagDetails?activityId=' + item.activityId + '&goodId=' + item.id +'&bagDetail=1'
    })
  },
  buyNow(event){
    let _nowtimes = new Date().getTime();
    if (_nowtimes - this.data.nowTimes > 1000) {
      this.setData({
        nowTimes: _nowtimes
      })
    } else {
      return false;
    }
    let item = event.currentTarget.dataset.item;
    let index = event.currentTarget.dataset.index;

    let userInfo = wx.getStorageSync('myxzUserInfo');
    if (!userInfo.mobile) {
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
      return false;
    }

    //只有一个规格 点击 默认数量1 保存数据，弹出弹框
    let valueSkuMapOne;

    let valueSkuMapArr = Object.keys(item.valueSkuMap)
    if (valueSkuMapArr.length == 1) {
      valueSkuMapOne= item.valueSkuMap[valueSkuMapArr[0]]
    }

  
    //得到sku 并存到数据的数组里面去
    if (valueSkuMapOne) {
      //如果只有一个规格 且库存为0
      if (valueSkuMapOne.dummyStock == 0) {
        wx.showToast({
          title: '当前商品库存不足。',
          icon: 'none',
          duration: 1500
        })
      }
      console.log(valueSkuMapOne)
      console.log(valueSkuMapOne)
      console.log(valueSkuMapOne)
      let reqObj = {
        url: '/api/shopCar/immediatePurchase',
        data: {
          activityId: item.activityId,
          goodsId: item.id,
          goodsNumber: 1,
          skuId: valueSkuMapOne.id,
          invitedId: app.globalData.userIdPro||''
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
        if (res.resCode == '21032') {
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
        if (res.resCode == '0000') {
          //埋点
          util.mdFun(this, '' + item.activityId +'_' + item.id);
          //成功数据 传入本地
          app.globalData.goodsDetails = res;
          wx.navigateTo({
            url: '/pages/confirmOrder/confirmOrder?activityId=' + this.data.activityId + '&goodId=' + this.data.goodId
          })

        }
      })
      return false;
    }

    //点击得到对应的sku specList 开始写sku了
    let specList = item.specList;
    let skuList = {};

    //skuList 的key进行升序排列
    let temp = item.valueSkuMap;
    for (let key in temp) {
      let value = temp[key]
      let attres = key.split(";")
      attres.sort((obj1, obj2) => {
        return Number(obj1) - Number(obj2)
      })
      let newKey = attres.join(";")
      skuList[newKey] = value
    }

    //处理 specList 数据
    let _spectList = [];
    specList.forEach((item, index) => {
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
      _spectList.push(pushObj);
    })
    this.setData({
      specList: _spectList, //商品参数
      skuList: skuList,
      specListLength: _spectList.length,
      actionSheetShow: true,
      activeGoodsNumber: this.data.activeGoodsNumber ||1,
      activeGoodsIndex: index
    })
    //调用sku方法
    this.queryDGoodsById();
    //v1.3
    setTimeout(() => {
      let reqObj = {
        index: 0,
        cindex: 0,
        cid: this.data.specList[0].value[0].id,
        isActiveC: false,
        citemnoclick: false
      }
      this.tabInfoChange('', reqObj)
    }, 300);
  },
  onClose(){
    this.setData({
      actionSheetShow: false
    })
  },
  onChange(event){
    this.setData({
      activeGoodsNumber:event.detail
    })
  },
  //点击选择规格的
  selectSizeSuccess() {
    //防抖
    let _nowtimes = new Date().getTime();
    if (_nowtimes - this.data.nowTimes > 1000) {
      this.setData({
        nowTimes: _nowtimes
      })
    } else {
      return false;
    }

    if (this.data.activeSkuItem && this.data.activeSkuItem.dummyStock == 0) {
      wx.showToast({
        title: '商品库存不足',
        image: "../../static/toastImage/tishi_icon.png",
        duration: 1500
      })
      return false;
    }

    //如果 当前选择规格 长度
    if (this.data.haveChangedId.length == this.data.specListLength) {
      //结算
      let bagsList = this.data.bagsList;
      let activeGoodsIndex = this.data.activeGoodsIndex;
      console.log(this.data.activeSkuItem);
      let reqObj = {
        url: '/api/shopCar/immediatePurchase',
        data: {
          activityId: bagsList[0].activityId,
          goodsId: bagsList[activeGoodsIndex].id,
          goodsNumber: this.data.activeGoodsNumber,
          skuId: this.data.activeSkuItem.id,
          invitedId: app.globalData.userIdPro||''
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
        if (res.resCode == '0000') {
          //埋点
          util.mdFun(this, '' + bagsList[activeGoodsIndex].activityId + '_' + bagsList[activeGoodsIndex].id);
          //成功数据 传入本地
          app.globalData.goodsDetails = res;
          wx.navigateTo({
            url: '/pages/confirmOrder/confirmOrder?activityId=' + this.data.activityId + '&goodId=' + this.data.goodId
          })

        }
      })
    } else {
      wx.showToast({
        title: '请选择规格',
        image: "../../static/toastImage/tishi_icon.png",
        duration: 1500
      })
      return false;
    }
  },




  /*--------------------------Sku相关代码-------------------------*/
  // skuList数据格式
  // let skuList={
  //   "1": {
  //     "id": 100005,
  //     "specValueList": ["500ml"],
  //     "retailPrice": 100.00,
  //     "price": 599.00,
  //     "dummySales": "3749",
  //     "dummyStock": "9996276",
  //     "count": 1
  //   }
  // }

  //spectList 数据格式
  // let spectList={ 
  //   name: "净含量", 
  //   isActive: true, 
  //   value: [{ id: 1, cname: "500ml", isActiveC: false, notClick: false }]
  // }


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
  tabInfoChange(event, reqObj) {
    //思路 
    //根据 index的值 对当前已经选中的sku id进行处理
    //当选择上排的时候 清空haveChangedId 下一排选择 和之后的值

    //v1.3
    let index, cindex, cid, isActiveC, citemnoclick;
    if (reqObj) {
      index = reqObj.index
      cindex = reqObj.cindex
      cid = reqObj.cid
      isActiveC = reqObj.isActiveC
      citemnoclick = reqObj.citemnoclick
    } else {
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
        if (this.data.skuList.hasOwnProperty(_haveChangedId)) {
          //.. 选中的SKU列表
          this.data.skuList['' + _haveChangedId].price = Number(this.data.skuList['' + _haveChangedId].price).toFixed(2);
          this.data.skuList['' + _haveChangedId].memberPrice = Number(this.data.skuList['' + _haveChangedId].memberPrice).toFixed(2);
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
  }
})