// pages/bagDetails/bagDetails.js
const app = getApp()
var apiUrl = require('../../static/js/url.js');
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
import Dialog from '../../dist/dialog/dialog';
Page({
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:'商品详细',
    bagDetail:1, //区别 1是会员礼包详情 2是组合礼包详情
    tapActive:2,
    showVideo:false,
    toTop:false,
    actionSheetShow:false,
    swiperActive:0,
    showVideoNav: false,
    nowTimes: new Date().getTime(),//当前时间防止重复点击
    addBagClicked:false,//判断按钮是否点击过
    valueSkuMapOne:'',//当前规格只有一个的情况

    iPage: 1,
    pageSize: 10,
    bagsList:[],//弹框组合列表
    isLoadMore : true, //是否能加载更多
    isLoadMore1: true, //是否能加载更多


    activityId:'',
    goodId:'',
    activeGoodsNumber: 1,//当前点击的商品数量
    activeGoodsIndex: 0,//当前点击的商品下标



    shopCarList: [], //购物车的数据,金额
    _shopCarList:[],//除当前详情数据，其余的购物车数据
    _shopCarListType:false, //其余购物车数据修改数量状态
    itemPrice:'',//其他商品的选择时候的价格


    combinedPrice: 0,//礼包需要购买的金额
    upgradePrice:'0.00',//普通会员的升级金额
    nowBagsPrice: '0.00', //当前已经购买的价格
    residueBagsPrice: '0.00', //剩余多少钱

    // sku用到的参数
    specList: [], //商品参数
    skuList: [],//SKU列表
    SKUResult: {}, //根据sku列表生成的所有能选的列表
    activeSkuItem: {},//最后选中的SKu
    haveChangedId: '',//当前选择规格 选中了几项
    specListLength: 0,//可选商品规格总项数
    skuId: '',//最终选择的sku 的id

    skuItemName:'',//最后选中的规格文字
    mainTitle:'', //商品详情的title
    spellSizeClickType:true, //用户选取商品规格变成false  都要跳选规格 
    resultCount:'',//组合礼包数量
  },
  onLoad: function (options) {
    console.log()
    this.setData({
      bagDetail: options.bagDetail||999,
      activityId: options.activityId,
      goodId: options.goodId,
      upgradePrice: options.upgradePrice||0
    },()=>{
      this.getBagDetails();
    })
  },
  onShow(){
    //埋点
    util.mdFun(this, ''+this.data.activityId + '_' + this.data.goodId);
  },
  onReady() {
    this.videoContext = wx.createVideoContext('my_video');
  },
  onShareAppMessage: function () {

  },
  //获取购物总金额
  getAllMoney(){
    //v1.4.1 计算金额最新数据
    let nowBagsPrice = Number(app.globalData.nowBagsPrice);
    let residueBagsPrice = 0;
    // for (let ii of res.resultList) {
    //   nowBagsPrice += ii.goodsNumber * ii.price;
    // }

    if (Number(this.data.gdActivityInfo.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) - nowBagsPrice <= 0) {
      //如果满足价格
      residueBagsPrice = '-999';
    } else {
      residueBagsPrice = Number(Math.floor((this.data.gdActivityInfo.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) * 100 - nowBagsPrice * 100) / 100).toFixed(2);
    }
    nowBagsPrice = Number(nowBagsPrice).toFixed(2)

    this.setData({
      nowBagsPrice,
      residueBagsPrice
    })
  },
  //获取商品详情数据
  getBagDetails(){
    let reqObj = {
      url: '/api/goods/goodDetail?activityId=' + this.data.activityId + '&goodId=' + this.data.goodId
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
        //成功数据
        res.data.gdInfo.retailPrice = Number(res.data.gdInfo.retailPrice).toFixed(2)
        res.data.gdInfo.price = Number(res.data.gdInfo.price).toFixed(2)
        
        //组合礼包 的会员优惠
        res.data.gdActivityInfo.disAmtVip = Number(res.data.gdActivityInfo.disAmt).toFixed(2)
        //会员列表 会员价
        res.data.gdActivityInfo.disAmt = Number((res.data.gdInfo.price * 100 - res.data.gdActivityInfo.disAmt * 100)/100).toFixed(2)

        //SKU SPEC
        let specList = res.data.specList;
        let skuList = {};

        //如果当前只有一个规格的时候
        let valueSkuMapArr=Object.keys(res.data.valueSkuMap)
        if (valueSkuMapArr.length == 1){
          this.setData({
            valueSkuMapOne: res.data.valueSkuMap[valueSkuMapArr[0]]
          })
        }
        

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

        //判断有没有视频
        if (res.data.gdInfo.videoList.length > 0) {
          this.setData({
            tapActive: 1,
            showVideo: false,
            showVideoNav: true
          })
        }
        //v1.4.1 初始化金额 剩余金额
        let combinedPrice =0;
        if (res.data.gdActivityInfo && res.data.gdActivityInfo.combinedPrice){
          combinedPrice = Number(res.data.gdActivityInfo.combinedPrice).toFixed(2);//礼包需要购买的金额
        }
        let nowBagsPrice = '0.00';
        
        this.setData({
          residueBagsPrice: '' + combinedPrice,
          nowBagsPrice,
          combinedPrice,
          gdInfo: res.data.gdInfo,
          mainTitle: res.data.gdInfo.title,
          gdActivityInfo: res.data.gdActivityInfo,
          specList: _spectList, //商品参数
          specListLength: _spectList.length,
          skuList: skuList,
        },()=>{
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
            this.tabInfoChange('', reqObj);

            //v1.4.1 如果上列表页选择了当前的商品
            // if (app.globalData.specListItem){
            //   //直接把上一个页面的speclist 拷贝到当前的页面
            //   let specListItem = app.globalData.specListItem;
            //   let specListArr=[];//列表页面 选中的所有的下标
              
            //   for (var ii = 0; ii < specListItem.length;ii++){
            //     for (var jj = 0; jj < specListItem[ii].value.length; jj++){
            //       if (specListItem[ii].value[jj].isActiveC){
            //         let reqObj = {
            //           index: ii,
            //           cindex: jj,
            //           cid: this.data.specList[ii].value[jj].id,
            //           isActiveC: false,
            //           citemnoclick: false
            //         }
            //         specListArr.push(reqObj)
            //       }
            //     }
            //   }

            //   //获取到了下标  模拟点击走一波
            //   for (let kk of specListArr){
            //     this.tabInfoChange('', kk);
            //   }
            //   //获取当前的商品数量
            //   this.setData({
            //     activeGoodsNumber: app.globalData.bagDetailItemsNumber
            //   },()=>{
            //     //重新计算价格
            //     let item = this.data.activeSkuItem;
            //     //计算金额
            //     let nowBagsPrice = 0;
            //     let residueBagsPrice = 0;
            //     nowBagsPrice += Number(item.price) * this.data.activeGoodsNumber;

            //     if (this.data.combinedPrice - nowBagsPrice <= 0) {
            //       //如果满足价格
            //       residueBagsPrice = '-999';
            //     } else {
            //       residueBagsPrice = Number(Math.floor(this.data.combinedPrice * 100 - nowBagsPrice * 100) / 100).toFixed(2);
            //     }
            //     nowBagsPrice = Number(nowBagsPrice).toFixed(2);

            //     this.setData({
            //       nowBagsPrice,
            //       residueBagsPrice,
            //     })
            //   })
            // }else{
            //   //当前商品是单一规格的情况(特殊)
            //   if(app.globalData.bagDetailItemsNumber){
            //     this.tabInfoChange('', reqObj)
            //     //获取当前的商品数量
            //   this.setData({
            //     activeGoodsNumber: app.globalData.bagDetailItemsNumber
            //   },()=>{
            //     //重新计算价格
            //     let item = this.data.activeSkuItem;
            //     //计算金额
            //     let nowBagsPrice = 0;
            //     let residueBagsPrice = 0;
            //     nowBagsPrice += Number(item.price) * this.data.activeGoodsNumber;

            //     if (this.data.combinedPrice - nowBagsPrice <= 0) {
            //       //如果满足价格
            //       residueBagsPrice = '-999';
            //     } else {
            //       residueBagsPrice = Number(Math.floor(this.data.combinedPrice * 100 - nowBagsPrice * 100) / 100).toFixed(2);
            //     }
            //     nowBagsPrice = Number(nowBagsPrice).toFixed(2);

            //     this.setData({
            //       nowBagsPrice,
            //       residueBagsPrice,
            //     })
            //   })
            //   }else{
            //     this.tabInfoChange('', reqObj)
            //   } 
            // }
          }, 300)
          
          //获取图文介绍
          this.getGoodDesc(this.data.goodId);
          //获取总金额
          this.getAllMoney();
        })
      }
    })
  },
  //去除当前列表数据
  clearNowList(){
    let bagsList = [];
    let _shopCarList = [];

    for (let i of this.data.bagsList) {
      if (i.id!=this.data.goodId){
        _shopCarList.push({
          activityId: 0,
          goodsId: 0,
          goodsNumber: 0,
          skuId: '',
          price: 0,
          goodImg:'',
          title:i.title
        })
        bagsList.push(i);
      }
    }
    this.setData({
      _shopCarList,
      bagsList
    })
  },
  //监听滚动事件
  scroll(event) {
    this.setData({
      toTop: event.detail.scrollTop > 1000 ? true : false
    })
  },
  //点击菜单切换
  navClick(event) {
    let navIndex = event.currentTarget.dataset.types;
    this.setData({
      tapActive: navIndex,
      showVideo: false
    }, () => {
      if (navIndex == 3) {
        this.setData({
          toView: 'wxparse'
        })
      } else {
        this.setData({
          scrollTop: 0
        })
      }
    })
  },
  //点击视频播放
  videoClick() {
    this.setData({
      showVideo: true
    })
    this.videoContext.play();
  },
  //规格点击
  spellSizeClick(){
    this.setData({
      actionSheetShow:true
    })
  },
  //立即加购
  spellClick(){
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
    if (this.data.gdInfo&&this.data.gdInfo.dummyStock==0) {
      wx.showToast({
        title: '商品库存不足',
        image: "../../static/toastImage/tishi_icon.png",
        duration: 1500
      })
      return false;
    }
    //第一次加购 设置跨境还是不跨境
    if (!app.globalData.crossBorder) {
      app.globalData.crossBorder = this.data.gdInfo.crossBorder;
    } else if (app.globalData.crossBorder != this.data.gdInfo.crossBorder) {
      wx.showToast({
        title: '国内商品和跨境商品不能同时加购哦~',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    //只有一个规格 点击 默认数量1 保存数据，弹出弹框
    let valueSkuMapOne = this.data.valueSkuMapOne; 
    //通过选规格 点击确定就算点过一次
    if (valueSkuMapOne) {
      let shopCarList = [{
        activityId: this.data.activityId,
        goodsId: this.data.goodId,
        goodsNumber: Number(this.data.shopCarList[0] && this.data.shopCarList[0].goodsNumber||0)+1,
        skuId: valueSkuMapOne.id,
        price: valueSkuMapOne.price,
        goodImg: this.data.gdInfo.goodImg,
        specValueDesc: valueSkuMapOne.specValueDesc,
        dummyStock: valueSkuMapOne.dummyStock,
        title: this.data.mainTitle
      }]
      //v1.4.1 修改商品数量发送请求
      if (this.data.gdActivityInfo && this.data.gdActivityInfo.activityType == 7) {
        let reqObj = {
          url: '/api/tempshopCar/addGood',
          data: {
            activityId: this.data.activityId,
            goodList: [{
              goodsId: this.data.goodId,
              goodsNumber: 1,
              skuId: valueSkuMapOne.id
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
      }

      //埋点
      util.mdFun(this, '');

      //如果只有一个规格 且库存为0
      if (valueSkuMapOne.dummyStock == 0) {
        wx.showToast({
          title: '当前商品库存不足。',
          icon: 'none',
          duration: 1500
        })
      }
      //计算当前金额
      let nowBagsPrice = Number(app.globalData.nowBagsPrice);
      let residueBagsPrice = 0;
      for (let ii of shopCarList) {
        nowBagsPrice += ii.goodsNumber * ii.price;
      }
      if (Number(this.data.gdActivityInfo.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) - nowBagsPrice <= 0) {
        residueBagsPrice = '-999';
      } else {
        residueBagsPrice = Number(Math.floor((this.data.gdActivityInfo.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) * 100 - nowBagsPrice * 100) / 100).toFixed(2);
      }
      //只有一个规格 选择的规格
      let skuItemName = '';
      for (let ii of valueSkuMapOne.specValueList) {
        skuItemName += ii + ';';
      }

      wx.showToast({
        title: "加购成功",
        duration: 1000
      })

      this.setData({
        nowBagsPrice: Number(nowBagsPrice).toFixed(2),
        residueBagsPrice,
        addBagClicked: true,
        shopCarList,
        // valueSkuMapOne:'',
        skuItemName,
        spellSizeClickType: true
      })
      return false;
    }
    this.setData({
      actionSheetShow: true,
      addBagClicked: true
    })  
  },
  //会员礼包点击
  spellClick1(){
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
    let valueSkuMapOne = this.data.valueSkuMapOne;
    
    if (valueSkuMapOne && this.data.spellSizeClickType) {
      console.log(this.data.valueSkuMapOne);
      let shopCarList = [{
        activityId: this.data.activityId,
        goodsId: this.data.goodId,
        goodsNumber: 1,
        skuId: valueSkuMapOne.id,
        price: valueSkuMapOne.price,
        goodImg: this.data.gdInfo.goodImg
      }]

      //埋点
      util.mdFun(this, '' + this.data.activityId + '_' + this.data.goodId);

      //计算当前金额
      let nowBagsPrice = 0;
      let residueBagsPrice = 0;
      for (let ii of shopCarList) {
        nowBagsPrice += ii.goodsNumber * ii.price;
      }
      if (Number(this.data.gdActivityInfo.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) - nowBagsPrice <= 0) {
        residueBagsPrice = '-999';
      } else {
        residueBagsPrice = Number(Math.floor((this.data.gdActivityInfo.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) * 100 - nowBagsPrice * 100) / 100).toFixed(2);
      }

      this.setData({
        nowBagsPrice: Number(nowBagsPrice).toFixed(2),
        residueBagsPrice,
        shopCarList,
        valueSkuMapOne: '',
        spellSizeClickType:true
      },()=>{
        //发送立即购买接口
        let reqObj = {
          url: '/api/shopCar/immediatePurchase',
          data: {
            activityId: Number(this.data.activityId),
            goodsId: this.data.goodId,
            goodsNumber: 1,
            skuId: valueSkuMapOne.id,
            invitedId: app.globalData.userIdPro
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
          if (res.resCode == '0000') {
            //成功数据 传入本地
            app.globalData.goodsDetails = res;
            wx.navigateTo({
              url: '/pages/confirmOrder/confirmOrder?activityId=' + this.data.activityId + '&goodId=' + this.data.goodId
            })
          }
          return false;
        })
      })
    }else{
      this.setData({
        actionSheetShow: true
      })
    }
  },
  //选完规格之后弹出加购
  addBagClick() {
    this.setData({
      actionSheetShow:false,
    })
  },
  //关闭选规格弹出框
  onClose(){
    this.setData({
      actionSheetShow: false,
    })
  },
  onClose1() {
  },
  //banner 切换
  swiperChange(event) {
    this.setData({
      swiperActive: event.detail.current
    })
  },
  //获取商品描述
  getGoodDesc(goodId) {
    let _this = this;
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
        if (res.data.description != null) {
          WxParse.wxParse('article', 'html', res.data.description, _this, 0);
          this.setData({
            isLoadMore1:false
          })
        }
      }
    })
  },
  //修改商品数量
  onChange(event) {
    if (this.data._shopCarListType){
      let _shopCarList = JSON.parse(JSON.stringify(this.data._shopCarList));
      _shopCarList[this.data.activeGoodsIndex].goodsNumber = event.detail;
      this.setData({
        _shopCarList
      })
    }else{
      this.setData({
        activeGoodsNumber: event.detail
      })
    }
  },
  //商品确认按钮
  selectSizeSuccess() {
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
      let skuItemNameKey = this.data.skuItemNameKey;
      let skuItemNameValue = this.data.skuItemNameValue;
      
      //选择规格名称
      let skuItemName='';
      for (let ii of this.data.activeSkuItem.specValueList) {
        skuItemName += ii + ';';
      }

      let activeSkuItem = this.data.activeSkuItem;//最后选中的sku
      let shopCarList = JSON.parse(JSON.stringify(this.data.shopCarList));
      let _shopCarList = JSON.parse(JSON.stringify(this.data._shopCarList));

      let _index = '';//匹配到数据的下标 9999未匹配，push到最后
      let _indexTrue = false;//是否匹配数据
      shopCarList.forEach((item,index)=>{
        if (item.skuId == activeSkuItem.id) {
          _index=index;
          _indexTrue = true;
        }
      })
      if (_indexTrue){
        if (this.data.activeGoodsNumber > activeSkuItem.dummyStock){
          wx.showToast({
            title: '当前商品库存不足。',
            icon: 'none',
            duration: 1500
          })
          return false;
        }
        shopCarList[_index] = {
          activityId: this.data.activityId,
          goodsId: this.data.goodId,//优先选择 弹框选中的 goodsid
          goodsNumber: Number(shopCarList[_index].goodsNumber) + this.data.activeGoodsNumber,
          skuId: activeSkuItem.id,
          price: activeSkuItem.price,
          goodImg: this.data.gdInfo.goodImg,
          specValueDesc: activeSkuItem.specValueDesc,
          dummyStock: activeSkuItem.dummyStock,
          title: this.data.mainTitle
        }
      }else{
        if (this.data.activeGoodsNumber > activeSkuItem.dummyStock) {
          wx.showToast({
            title: '当前商品库存不足。',
            icon: 'none',
            duration: 1500
          })
          return false;
        }
        shopCarList.push({
          activityId: this.data.activityId,
          goodsId: this.data.goodId,//优先选择 弹框选中的 goodsid
          goodsNumber: this.data.activeGoodsNumber,
          skuId: activeSkuItem.id,
          price: activeSkuItem.price,
          goodImg: this.data.gdInfo.goodImg,
          specValueDesc: activeSkuItem.specValueDesc,
          dummyStock: activeSkuItem.dummyStock,
          title: this.data.mainTitle
        })
      }
      if (_index == '') {
        _index = 9999;
      }

      //v1.4.1 修改商品数量发送请求
      if(this.data.gdActivityInfo && this.data.gdActivityInfo.activityType==7){
        let reqObj = {
          url: '/api/tempshopCar/addGood',
          data: {
            activityId: this.data.activityId,
            goodList: [{
              goodsId: this.data.goodId,
              goodsNumber: this.data.activeGoodsNumber,
              skuId: activeSkuItem.id
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
      }

      //计算金额 显示到底部
      let nowBagsPrice = Number(app.globalData.nowBagsPrice);
      let residueBagsPrice = 0;
      for (let ii of shopCarList) {
        nowBagsPrice += ii.goodsNumber * ii.price;
      }

      if (Number(this.data.gdActivityInfo.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) - nowBagsPrice <= 0) {
        residueBagsPrice = '-999';
      } else {
        residueBagsPrice = Number(Math.floor((this.data.gdActivityInfo.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) * 100 - nowBagsPrice * 100) / 100).toFixed(2);
      }

      wx.showToast({
        title: "加购成功",
        duration: 1000
      })

      this.setData({
        skuId: activeSkuItem.id,
        nowBagsPrice: Number(nowBagsPrice).toFixed(2),
        residueBagsPrice,
        shopCarList,
        _shopCarList,
        skuItemName,
        _shopCarListType: false,
        addBagClicked:true
      }, () => {
        if (this.data.bagDetail==1){
          this.nowGoBuy();
        }else{
          //当进来点击立即购买
          if (this.data.spellSizeClickType) {
            if (this.data.residueBagsPrice == '-999') {
              this.setData({
                addBagClicked: true,
                actionSheetShow: false
              })
            } else {
              this.addBagClick();
            }
          } else {
            //当用户是点击选取规格
            //当用户选择规格 且 钱足够时候
            if (!(!this.data.spellSizeClickType && this.data.residueBagsPrice == '-999')) {
              this.addBagClick();
            } else {
              this.setData({
                addBagClicked: true,
                actionSheetShow: false
              })
            }
          }
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
  nowGoBuy(){
    //会员礼包
    let reqObj = {
      url: '/api/shopCar/immediatePurchase',
      data: {
        activityId: Number(this.data.activityId),
        goodsId: this.data.goodId,
        goodsNumber: this.data.activeGoodsNumber,
        skuId: this.data.skuId,
        invitedId: app.globalData.userIdPro
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
        setTimeout(()=>{
          app.globalData.userIdPro='';
          wx.reLaunch({
            url: '/pages/home/home',
          })
        },1000)
      }
      if (res.resCode == '0000') {
        //成功数据 传入本地
        app.globalData.goodsDetails = res;
        wx.navigateTo({
          url: '/pages/confirmOrder/confirmOrder?activityId=' + this.data.activityId + '&goodId=' + this.data.goodId
        })
        
      }
    })
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
  