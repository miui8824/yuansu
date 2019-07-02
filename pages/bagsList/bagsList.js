const app = getApp()
var apiUrl = require('../../static/js/url.js');
var util = require('../../utils/util.js');
Page({
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:'组合礼包',
    iPage:1,
    pageSize:10,
    isLoadMore:true, //判断是否底部还有商品
    bagsInfo:'',
    bagsList:[],
    bannerList:[],
    shopCarList:[], //组合列表的数据,金额
    _shopCarList:[],//购物中间页面 返回的数据
    nowTimes: new Date().getTime(),//当前时间防止重复点击

    allMoney:'0.00',//合计
    activeGoodsNumber: 1,//当前点击的商品数量
    activeGoodsIndex: 0,//当前点击的商品下标

    goBuyOk:false, //是否能去结算
    actionSheetShow:false,
    combinedPrice: 0,//当用户是会员 那个购买的基准值就是组合价格，普通会员是 升级金额
    upgradePrice:0,//普通想升级的价格
    disAmt: 0,//礼包的优惠价格
    nowBagsPrice:'0.00', //当前已经购买的价格
    residueBagsPrice:0, //剩余多少钱
    crossBorder:'',//第一个加购商品 是跨境还是不跨境
    allNumber:0,//所有的数量

    // sku用到的参数
    specList: [], //商品参数
    skuList: [],//SKU列表
    SKUResult: {}, //根据sku列表生成的所有能选的列表
    activeSkuItem: {},//最后选中的SKu
    haveChangedId: '',//当前选择规格 选中了几项
    specListLength: 0,//可选商品规格总项数
    skuId: '',//最终选择的sku 的id
    userId:"",
    userid_weweima:"",
    //点击跳转到详情页 选中的specList
    specListItem:"",
    itemPrice:'', //加购时候商品带的价格
    vipDiscount:0,//会员满金额的优惠金额
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
        "page": "pages/bagsList/bagsList",
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

          {
            type: 'text',
            content:app.globalData.wechatnickName,
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
            url: "https://file.maiyatown.com/images/v1.4/zuhepic.jpg",
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
            content: "邀你开启麦芽之旅，多款商品，随意组合！",
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
    if (options.gift_package) {
      app.globalData.userIdPro = options.userId;
      util.bindfriend(options.userId)//绑定好友关系
      this.setData({
        showIcon: false
      })
    }
    if (options.userId) {
      app.globalData.userIdPro = options.userId;
    }
    //清除当前国内国外的限制。
    app.globalData.crossBorder='';

    this.getBagsList();
    util.getNowUserId((userId) => {
      this.setData({
        userId
      })
    }) 
    //扫码进来的 都带有scene的参数
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log(scene);
      let sceneArr = scene.split('#');
      let userId = parseInt(sceneArr[0], 32);//将32进制的转化为10进制的
      util.bindfriend(options.userId)//绑定好友关系
      this.setData({
        showIcon: false
      })
    }
    //v1.4.1
    //获取临时编号 
    //每次加载这个页面视为再次进来
    let reqObj = {
      url: '/api/tempshopCar/getTempNo'
    }
    this.setData({
      shopCarList:[],
      _shopCarList:[]
    },()=>{
      util.RequestGet(reqObj, null, (res, message) => {
        if (res.resCode == '0000') {
          //成功数据
        }
      })
    })
  },
  onReady: function () {

  },
  onShow: function () {
    console.log('呦呦呦');
    console.log(app.globalData.statusBarHeight+'_____'+ app.globalData.titleBarHeight);
    //头部的高度
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      titleBarHeight: app.globalData.titleBarHeight
    });
    this.concatList();
  },
  //合并列表数据和购物车中间页数据
  concatList(){
    //v1.4.1 发送一个请求 获取最新的购物车数据
    let reqObj = {
      url: '/api/tempshopCar/tempGoodList',
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
        //v1.4.1 获取的购物车数据和当前购物车数据合并去重
        var newData = res.resultList;//新数据 购物车查询的数据
        var oldData = this.data._shopCarList;//旧数据
        var _arr = new Array();

        if (newData.length>0){

          for (var i = 0; i < newData.length; i++) {
            _arr.push(newData[i]);
          }
          for (var i = 0; i < oldData.length; i++) {
            var flag = true;
            for (var j = 0; j < newData.length; j++) {
              if (oldData[i].name == newData[j].name) {
                flag = false;
                break;
              }
            }
            if (flag) {
              _arr.push(oldData[i]);
            }
          }
        }else{
          //购物车没数据 说明真的没数据 清空列表页面
          for(let ii of oldData){
            ii.goodsNumber=0;
          }
          _arr = oldData;
        }

        this.setData({
          _shopCarList: _arr
        }, () => {
          //核心点是 请求的购物车数据 本来就包括全部数据 我为什么要和列表数据合并
          let shopCarList = this.data.shopCarList;//组合列表的数据
          let _shopCarList = this.data._shopCarList;//购物车的数据
          if (_shopCarList.length > 0) {
            for (let ii of _shopCarList) {
              ii.specValueDesc = ii.specValue;
            }
            //处理一个商品选择多个规格的数量问题
            for (let iii = 0; iii < shopCarList.length; iii++) {
              let kkk = 0;//初始化计数器
              for (let jjj = 0; jjj < _shopCarList.length; jjj++) {
                if (shopCarList[iii].goodsId == _shopCarList[jjj].goodsId) {
                  kkk += _shopCarList[jjj].goodsNumber;
                }
              }
              shopCarList[iii].goodsNumber = kkk;
            }
            //计算金额
            let nowBagsPrice = 0;
            let residueBagsPrice = 0;
            let allNumber=0;
            for (let ii of _shopCarList) {
              nowBagsPrice += ii.goodsNumber * ii.price;
              allNumber += ii.goodsNumber;
            }

            console.log(nowBagsPrice)
            let goBuyOk = false;

            if (Number(this.data.bagsInfo.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) - nowBagsPrice <= 0) {
              //如果满足价格
              residueBagsPrice = '-999';
              goBuyOk = true;
            } else {
              residueBagsPrice = Number(Math.floor((this.data.bagsInfo.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) * 100 - nowBagsPrice * 100) / 100).toFixed(2);
              goBuyOk = false;
            }
            nowBagsPrice = Number(nowBagsPrice).toFixed(2)

            this.setData({
              shopCarList,
              nowBagsPrice,
              residueBagsPrice,
              goBuyOk,
              allNumber
            })
          }
        })
      }
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
      title: '邀你开启麦芽之旅，多款商品，随意组合！',
      path: 'pages/bagsList/bagsList?userId=' + this.data.userId +'&gift_package=true',
      imageUrl: 'https://file.maiyatown.com/images/v1.4/zuhepic.jpg'
    }
  },
  //加载更多数据
  loadMore(){
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
      url: '/api/goods/customerGoodList?iPage=' + _iPage + '&pageSize=' + this.data.pageSize
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
        // if (res.resultList.length == 0) {
        //   wx.showToast({
        //     title: '活动已下架',
        //     icon: 'none',
        //     duration: 1000
        //   })
        //   setTimeout(() => {
        //     wx.reLaunch({
        //       url: '/pages/home/home',
        //     })
        //   }, 1000)
        // }
        
        //加小数点
        for (var i of res.resultList){
          i.price = Number(i.price).toFixed(2);
          i.retailPrice = Number(i.retailPrice).toFixed(2);
        }
        let bagsInfo = JSON.parse(JSON.stringify(res.data));
        //bagsInfo.disAmt = Number(bagsInfo.disAmt).toFixed(2)
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
          this.setData({
            //v1.4.2 当商品条数正好10条的时候
            disAmt: bagsInfo.disAmt,
            bannerList: res.data.topBannerUrl,
            vipDiscount: Number(bagsInfo.disAmt).toFixed(2),
            bagsList: res.resultList
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
        //生成一个数组专门存购物车的数据金额
        let shopCarList = [];
        for (let i of this.data.bagsList){
          shopCarList.push({
            activityId: i.activityId,
            goodsId: i.id,
            goodsNumber: 0,
            skuId: '',
            price:0
          })
        }
        this.setData({
          shopCarList
        },()=>{
          //v1.4.1 下拉刷新。就不初始化下面的价格了
          if(_iPage>1){
            //v1.4.1 下拉刷新数据合并
            //核心点是 请求的购物车数据 本来就包括全部数据 我为什么要和列表数据合并
            let shopCarList = this.data.shopCarList;//组合列表的数据
            let _shopCarList = this.data._shopCarList;//购物车的数据
            if (_shopCarList.length > 0) {
              for (let ii of _shopCarList) {
                ii.specValueDesc = ii.specValue;
              }
              //处理一个商品选择多个规格的数量问题
              for (let iii = 0; iii < shopCarList.length; iii++) {
                let kkk = 0;//初始化计数器
                for (let jjj = 0; jjj < _shopCarList.length; jjj++) {
                  if (shopCarList[iii].goodsId == _shopCarList[jjj].goodsId) {
                    kkk += _shopCarList[jjj].goodsNumber;
                  }
                }
                shopCarList[iii].goodsNumber = kkk;
              }
              //计算金额
              let nowBagsPrice = 0;
              let residueBagsPrice = 0;
              let allNumber = 0;
              for (let ii of _shopCarList) {
                nowBagsPrice += ii.goodsNumber * ii.price;
                allNumber += ii.goodsNumber;
              }

              console.log(nowBagsPrice)
              let goBuyOk = false;

              if (Number(this.data.bagsInfo.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) - nowBagsPrice <= 0) {
                //如果满足价格
                residueBagsPrice = '-999';
                goBuyOk = true;
              } else {
                residueBagsPrice = Number(Math.floor((this.data.bagsInfo.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) * 100 - nowBagsPrice * 100) / 100).toFixed(2);
                goBuyOk = false;
              }
              nowBagsPrice = Number(nowBagsPrice).toFixed(2)

              this.setData({
                shopCarList,
                nowBagsPrice,
                residueBagsPrice,
                goBuyOk,
                allNumber
              })
            }
          }else{
            //底部价格处理
            let combinedPrice = Number(this.data.bagsInfo.isCustomer == 1 ? this.data.bagsInfo.combinedPrice : this.data.bagsInfo.upgradePrice).toFixed(2);
            let upgradePrice = Number(this.data.bagsInfo.upgradePrice).toFixed(2);
            let nowBagsPrice = '0.00';
            this.setData({
              combinedPrice: this.data.bagsInfo.isCustomer == 1 ? combinedPrice : upgradePrice,//当用户是会员 那个购买的基准值就是组合价格，普通会员是 升级金额
              upgradePrice,
              nowBagsPrice,
              residueBagsPrice: '' + combinedPrice
            })
          }
        })
      }
    })
  },
  //添加组合礼包
  addBagsGood(event){
    let item = event.currentTarget.dataset.item;
    let index = event.currentTarget.dataset.index;
    let shopCarList = JSON.parse(JSON.stringify(this.data.shopCarList));
    let _shopCarList =JSON.parse(JSON.stringify(this.data._shopCarList));

    //第一次加购 设置跨境还是不跨境
    if (!app.globalData.crossBorder){
      app.globalData.crossBorder = item.crossBorder
    } else if (app.globalData.crossBorder != item.crossBorder) {
      wx.showToast({
        title: '国内商品和跨境商品不能同时加购哦~',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    
    //如果发现其他商品的规格就一个
    let valueSkuMapArr = Object.keys(item.valueSkuMap);
    if (valueSkuMapArr.length == 1) {
      let valueSkuMapOne = item.valueSkuMap[valueSkuMapArr[0]]
      //如果只有一个规格 且库存为0
      if (valueSkuMapOne.dummyStock == 0) {
        wx.showToast({
          title: '商品库存不足',
          icon: 'none',
          duration: 1500
        })
      } else {
        let goodsNumber=0;
        if (valueSkuMapOne.dummyStock <= shopCarList[index].goodsNumber){
          goodsNumber = valueSkuMapOne.dummyStock;
          wx.showToast({
            title: '商品库存不足',
            image: "../../static/toastImage/tishi_icon.png",
            duration: 1000
          })
          return false;
        }else{
          //v1.4.2 如果能加购成功
          wx.showToast({
            title: "加购成功",
            duration: 1000
          })
          goodsNumber = shopCarList[index].goodsNumber + 1 || 1;
        }
        //v1.4.1 取出之前的数量商品数量
        shopCarList[index] = {
          activityId: item.activityId,
          goodsId: item.id,
          goodsNumber,
          skuId: valueSkuMapOne.id,
          price: item.price,
          goodImg: item.goodImg,
          specValueDesc: valueSkuMapOne.specValueDesc,
          dummyStock: valueSkuMapOne.dummyStock,
          title: item.title
        }
        //v1.4.1 然后在购物车这个对象 上面新增数据
        let haveSku=false;//当前 购物车数据有当前的sku
        for (var ii of _shopCarList){
          if (ii.skuId == valueSkuMapOne.id){
            haveSku=true;
            ii.goodsNumber+=1;
          }
        }
        if (!haveSku){
          _shopCarList.push({
            activityId: item.activityId,
            goodsId: item.id,
            goodsNumber: goodsNumber,
            skuId: valueSkuMapOne.id,
            price: item.price,
            goodImg: item.goodImg,
            specValueDesc: valueSkuMapOne.specValueDesc,
            dummyStock: valueSkuMapOne.dummyStock,
            title: item.title
          })
        }

        //v1.4.1 修改商品数量发送请求
        // let reqObj = {
        //   url: '/api/tempshopCar/addTempShopCar',
        //   data: {
        //     activityId: item.activityId,
        //     goodList: [{
        //       goodsId: item.id,
        //       goodsNumber: goodsNumber,
        //       skuId: valueSkuMapOne.id
        //     }],
        //     invterUserId: app.globalData.userIdPro
        //   }
        // }
        // util.RequestPost(reqObj, null, (res, message) => {
        //   if (res.resCode == '21032') {
        //     wx.showToast({
        //       title: res.resDesc,
        //       icon: 'none',
        //       duration: 1000
        //     })
        //     setTimeout(() => {
        //       wx.reLaunch({
        //         url: '/pages/home/home',
        //       })
        //     }, 1000)
        //   }
        // })

        //埋点
        util.mdFun(this, '' + item.activityId +'_'+ item.id)

        //计算金额
        let nowBagsPrice = 0;
        let residueBagsPrice = 0;
        let allNumber=0;
        for (let ii of _shopCarList) {
          nowBagsPrice += ii.goodsNumber * ii.price;
          allNumber+=ii.goodsNumber;
        }
        
        console.log(nowBagsPrice)
        let goBuyOk=false;

        if (Number(this.data.bagsInfo.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) - nowBagsPrice <= 0) {
          //如果满足价格
          residueBagsPrice = '-999';
          goBuyOk = true;
        } else {
          residueBagsPrice = Number(Math.floor((this.data.bagsInfo.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice)* 100 - nowBagsPrice * 100) / 100).toFixed(2);
          goBuyOk = false;
        }
        nowBagsPrice = Number(nowBagsPrice).toFixed(2)


        this.setData({
          nowBagsPrice,
          residueBagsPrice,
          shopCarList,
          _shopCarList,
          goBuyOk,
          allNumber
        })
      }
      return false;
    }else{
      shopCarList[index] = {
        activityId: item.activityId,
        goodsId: item.id,
        goodsNumber: shopCarList[index].goodsNumber,
        skuId: '',
        price: 0,
        title:item.title,
        goodImg: item.goodImg,
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
        itemPrice:item.price,
        shopCarList,
        specList: _spectList, //商品参数
        skuList: skuList,
        specListLength: _spectList.length,
        actionSheetShow: true,
        // activeGoodsNumber: shopCarList[index].goodsNumber == 0 ? 1 : shopCarList[index].goodsNumber,
        activeGoodsNumber:1,//默认点开选择规格都是1开始
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
    }
  },
  //关闭选规格弹出框
  onClose() {
    this.setData({
      actionSheetShow: false
    })
    // let shopCarList = JSON.parse(JSON.stringify(this.data.shopCarList));
    // shopCarList[this.data.activeGoodsIndex].goodsNumber = 0;
    // this.setData({
    //   shopCarList,
    //   actionSheetShow: false
    // },()=>{
    //   //重新计算当前的价格
    //   let nowBagsPrice = 0;
    //   let residueBagsPrice = 0;
    //   let goBuyOk = false;
    //   for (let ii of this.data.shopCarList) {
    //     nowBagsPrice += ii.goodsNumber * ii.price;
    //   }
    //   if (Number(this.data.bagsInfo.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) - nowBagsPrice <= 0) {
    //     residueBagsPrice = '-999';
    //     goBuyOk = true;
    //   } else {
    //     residueBagsPrice = Number(Math.floor((this.data.bagsInfo.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) * 100 - nowBagsPrice * 100) / 100).toFixed(2);
    //     console.log(residueBagsPrice)
    //     console.log(residueBagsPrice)
    //     console.log(residueBagsPrice)
    //     goBuyOk = false;
    //   }

    //   //v1.4.1 修改商品数量发送请求
    //   let _activeSkuItem = shopCarList[this.data.activeGoodsIndex]
    //   let reqObj = {
    //     url: '/api/tempshopCar/addTempShopCar',
    //     data: {
    //       activityId: _activeSkuItem.activityId,
    //       goodList: [{
    //         goodsId: _activeSkuItem.goodsId,
    //         goodsNumber: 0,
    //         skuId: _activeSkuItem.skuId
    //       }],
    //       invterUserId: app.globalData.userIdPro
    //     }
    //   }
    //   util.RequestPost(reqObj, null, (res, message) => {
    //     if (res.resCode == '21032') {
    //       wx.showToast({
    //         title: res.resDesc,
    //         icon: 'none',
    //         duration: 1000
    //       })
    //       setTimeout(() => {
    //         wx.reLaunch({
    //           url: '/pages/home/home',
    //         })
    //       }, 1000)
    //     }
    //   })
    //   this.setData({
    //     nowBagsPrice: Number(nowBagsPrice).toFixed(2),
    //     residueBagsPrice,
    //     goBuyOk
    //   })
    // })
  },
  //修改商品数量 现在要修改 shopCarList 了
  onChange(event) {
    let shopCarList = JSON.parse(JSON.stringify(this.data.shopCarList));
    //v1.4.1
    //shopCarList[this.data.activeGoodsIndex].goodsNumber = event.detail;
    
    this.setData({
      activeGoodsNumber: event.detail
    })
  },
  //点击选择规格的
  selectSizeSuccess(){
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
      let shopCarList = JSON.parse(JSON.stringify(this.data.shopCarList));
      shopCarList[this.data.activeGoodsIndex].goodsNumber = 0;
      this.setData({
        shopCarList
      })
      return false;
    }

    //如果 当前选择规格 长度
    if (this.data.haveChangedId.length == this.data.specListLength) {
      //要得到 skuId
      let shopCarList = JSON.parse(JSON.stringify(this.data.shopCarList));
      let _shopCarList = JSON.parse(JSON.stringify(this.data._shopCarList));
      shopCarList[this.data.activeGoodsIndex].skuId = this.data.activeSkuItem.id;
      shopCarList[this.data.activeGoodsIndex].price = this.data.activeSkuItem.price;
      shopCarList[this.data.activeGoodsIndex].specValueDesc = this.data.activeSkuItem.specValueDesc;
      shopCarList[this.data.activeGoodsIndex].dummyStock = this.data.activeSkuItem.dummyStock;
      shopCarList[this.data.activeGoodsIndex].goodsNumber += this.data.activeGoodsNumber;

      //v1.4.1 然后在购物车这个对象 上面新增数据
      let haveSku = false;//当前 购物车数据有当前的sku
      for (var ii of _shopCarList) {
        if (ii.skuId == this.data.activeSkuItem.id) {
          haveSku = true;
          ii.goodsNumber += this.data.activeGoodsNumber;
        }
      }
      //需要创建一个新的sku
      let newItem = JSON.parse(JSON.stringify(shopCarList[this.data.activeGoodsIndex]));
      newItem.goodsNumber = this.data.activeGoodsNumber;
      if (!haveSku) {
        _shopCarList.push(newItem)
      }
      // //v1.4.1 获取当前选择的specList
      // shopCarList[this.data.activeGoodsIndex].specListItem = this.data.specList;

      // let _activeSkuItem = shopCarList[this.data.activeGoodsIndex];
      // //v1.4.1 修改商品数量发送请求
      // let reqObj = {
      //   url: '/api/tempshopCar/addTempShopCar',
      //   data: {
      //     activityId: _activeSkuItem.activityId,
      //     goodList: [{
      //       goodsId: _activeSkuItem.goodsId,
      //       goodsNumber: _activeSkuItem.goodsNumber,
      //       skuId: _activeSkuItem.skuId
      //     }],
      //     invterUserId: app.globalData.userIdPro
      //   }
      // }
      // util.RequestPost(reqObj, null, (res, message) => {
      //   if (res.resCode == '21032') {
      //     wx.showToast({
      //       title: res.resDesc,
      //       icon: 'none',
      //       duration: 1000
      //     })
      //     setTimeout(() => {
      //       wx.reLaunch({
      //         url: '/pages/home/home',
      //       })
      //     }, 1000)
      //   }
      // })

      //埋点
      util.mdFun(this, '' + shopCarList[this.data.activeGoodsIndex].activityId +'_'+ shopCarList[this.data.activeGoodsIndex].goodsId)
      
      wx.showToast({
        title: "加购成功",
        duration: 1000
      })

      this.setData({
        shopCarList,
        _shopCarList,
        actionSheetShow: false
      },()=>{
        //重新计算当前的价格
        let nowBagsPrice = 0;
        let residueBagsPrice = 0;
        let goBuyOk=false;
        let allNumber=0;
        for (let ii of this.data._shopCarList) {
          nowBagsPrice += ii.goodsNumber * ii.price;
          allNumber+=ii.goodsNumber;
        }
        if (Number(this.data.bagsInfo.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) - nowBagsPrice <= 0) {
          residueBagsPrice = '-999';
          goBuyOk=true;
        } else {
          residueBagsPrice = Number(Math.floor((this.data.bagsInfo.isCustomer == 1 ? this.data.combinedPrice : this.data.upgradePrice) * 100 - nowBagsPrice * 100) / 100).toFixed(2);
          goBuyOk = false; 
        }
        this.setData({
          nowBagsPrice: Number(nowBagsPrice).toFixed(2),
          residueBagsPrice,
          goBuyOk,
          allNumber
        })
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
  //立即加购
  nowGoBuy(){
    //防抖
    let _nowtimes = new Date().getTime();
    if (_nowtimes - this.data.nowTimes > 1000) {
      this.setData({
        nowTimes: _nowtimes
      })
    } else {
      return false;
    }
    //立即结算
    let shopCarList = this.data.shopCarList;
    let _shopCarList = this.data._shopCarList;
    let nowBagsPrice=0;
    let outShopCarList=[];

    for (let ii of _shopCarList) {
      nowBagsPrice += ii.goodsNumber * ii.price;
      if(ii.goodsNumber!=0){
        outShopCarList.push(ii);
      }
    }
    app.globalData.isCustomer = this.data.bagsInfo.isCustomer;//是否是会员

    //v1.4.1
    //创建临时购物车列表
    let reqObj = {
      url: '/api/tempshopCar/addTempShopCar',
      data: {
        activityId: this.data.bagsList[0].activityId,
        goodList: outShopCarList,
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
        return false;
      }
      if (message) {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 1500
        })
      }
      if (res.resCode == '0000') {
        //跳转的时候 要带上  组合价格 和 优惠价格
        // this.data.combinedPrice   this.data.bagsInfo.disAmt
        wx.navigateTo({
          url: '/pages/bagShopCar/bagShopCar?combinedPrice=' + this.data.combinedPrice + '&disAmt=' + this.data.bagsInfo.disAmt + '&delta=1&upgradePrice=' + this.data.upgradePrice
        })
      }
    })
  },
  //跳转到购买详情
  goBagDetails(event) {
    //防抖
    let _nowtimes = new Date().getTime();
    if (_nowtimes - this.data.nowTimes > 1000) {
      this.setData({
        nowTimes: _nowtimes
      })
    } else {
      return false;
    }
    //v1.4.1 提交临时购物车列表
    //立即结算
    let shopCarList = this.data.shopCarList;
    let _shopCarList = this.data._shopCarList;
    let nowBagsPrice = 0;
    let outShopCarList = [];

    for (let ii of _shopCarList) {
      nowBagsPrice += ii.goodsNumber * ii.price;
      if (ii.goodsNumber != 0) {
        outShopCarList.push(ii);
      }
    }
    app.globalData.isCustomer = this.data.bagsInfo.isCustomer;//是否是会员

    //v1.4.1
    //创建临时购物车列表
    let reqObj = {
      url: '/api/tempshopCar/addTempShopCar',
      data: {
        activityId: this.data.bagsList[0].activityId,
        goodList: outShopCarList,
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
        return false;
      }
      if (message) {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 1500
        })
      }
      if (res.resCode == '0000') {
        let item = event.currentTarget.dataset.item;
        let index = event.currentTarget.dataset.index;
        //app.globalData.bagDetailItemsNumber = this.data.shopCarList[index].goodsNumber;
        //app.globalData.specListItem = this.data.shopCarList[index].specListItem || '';
        app.globalData.nowBagsPrice = this.data.nowBagsPrice;
        wx.navigateTo({
          url: '/pages/bagDetails/bagDetails?activityId=' + item.activityId + '&goodId=' + item.id + '&bagDetail=2&upgradePrice=' + this.data.upgradePrice
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
          this.setData({
            _haveChangedId: _haveChangedId,
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