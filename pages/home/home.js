//index.js
//获取应用实例 目测获取全局变量
const app = getApp()
var apiUrl = require('../../static/js/url.js');
var util = require('../../utils/util.js');
import Dialog from '../../dist/dialog/dialog';
Page({
  data: {
    showIcon: false,//引入的自定义导航左边返回按钮
    painting: {}, //canvas画图的变量
    shareImage: '',//canvas画图的变量
    GetImage:false,
    title: '元素城堡',
    swiperData: [],
    hotShopList: [],
    hotShopList1: [],
    indicatorDots: true,
    navLeft: true,
    tabbar: {}, //底部公共导航的下标
    navDatas: [],
    isShade: false,
    isOpen: false,
    close_red: 'close-red-0',
    isOpened: false,
    redOpenNum: 200,
    openTurntable: '',
    turntableStart: '',
    turntableEnd: '',
    prizeList: [],
    pl2hang: false,
    toPrizeList: 'plc-v-0',
    scollEnd: 3,
    vertical: true,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    prizePage: 1,
    activeState: 4,
    getPrizeState: 0,
    xsState3: false,
    prizeListStr: "",
    countDown: ['', '', '', ''],
    di: "",
    //是否新用户
    isNew:false,
    //拆红包新用户
    newUser:true,
    userWhiteList:false,//当前用户是否是白名单
    isHelpRed: false,//是否帮拆
    //..help
    helpRedShow:false, //帮拆红包
    helpRedOnShow:false, //帮开红包已打开
    inviteeValue:0,
    inviterValue:0,
    redUp:0,
    upUserId:"",
    isEnd:false,//当前用户活动时间是否结束
    isDismantle:false, //红包是否拆完
    isTake:true,
    redTotalOver:false, //所有红包是否发完
    strDouble:null,//领取X倍红包
    isHelp:false,   //新加字段isHelp判断红包发完但帮拆已参加问题
    isHelpFirst:false,
    controllUpUserId: false,// onLoad节流阀

    intervalSwitch:true,

    getHotListOk:false,
    blackpoint:false, //已经获取了banner 活动信息
    //..
    _iPage:1, //分页
    _pageSize:10,
    _iPageMore:true, //是否能加载更多

    userId:null, //当前的userId

    intervalSwitch:true,
    hotListData:[],
    swiperData1:[],
    actionSheetShow: false, //显示上拉菜单
    hot_goodImg:"",
    hot_dummyStock:"",//剩余库存
    hot_price:"",
    gdInfo: {},
    actionSheetType: 1, //加入购物车
    specList: [], //商品参数
    specListLength: 0,
    skuList: [],//SKU列表
    SKUResult: {}, //根据sku列表生成的所有能选的列表
    skuItemNameKey: [],
    skuItemNameValue: [],
    activeSkuItem: {},//最后选中的SKu
    goodsNumber: 1,
    skuId: '',
    haveChangedId: [],

    groupDetailsUrl: '',//拼团详情路径
    groupDetailsImgUrl:'',//拼团详情的banner图片
    groupHomeImgUrl:'',//拼团列表banner
    
    rookieExclusiveBanner:'',//新人专享banner
    groupTimeData: [],
    appointmentTimeData: [],

    nowTimes: new Date().getTime(),//当前时间防止重复点击

    specialLists:[], //1.3专场广告位列表

        // v1.4首页爆款变量
    active: 0,
    navNames: ['精选', '母婴', '美食', '女性', '居家', '男性', '奔驰', '宝马', '玩具', '饮食'],
    isnav:'',
    userid_weweima:""
  },
  // 隐藏canvas画的图
  share_hide: function () {
    this.setData({
      GetImage: false,
      shareImage: ""
    })
  },
  // canvas画图分享的发放 （保存图片，绘制分享图）
  eventDraw() {
    this.setData({
      GetImage: true,
      shareImage:"",
      painting:{}
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
                top: 21,
                left: 146,
                bolder: true
              },
              // 中间的图 this.data.imgUrl   "https://file.maiyatown.com/images/v1.2/home_share_img1.png"
              {
                type: 'image',
                url: this.data.imgUrl ,
                top: 55,
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
    console.log('aaa')
    console.log(this.data.shareImage);
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        console.log(res);
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
        this.setData({
          GetImage: false
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




  //跳转拼团页面
  goGroupPage() {
    let _nowtimes = new Date().getTime();
    if (_nowtimes - this.data.nowTimes > 1000) {
      this.setData({
        nowTimes: _nowtimes
      })
    } else {
      return false;
    }
    wx.navigateTo({
      url: '/pages/groupHome/groupHome',
    })
  },
  goGroupPage1() {
    let _nowtimes = new Date().getTime();
    if (_nowtimes - this.data.nowTimes > 1000) {
      this.setData({
        nowTimes: _nowtimes
      })
    } else {
      return false;
    }
    wx.navigateTo({
      url: this.data.groupDetailsUrl
    })
  },
    //加入购物车
    addShopCar(event) {
      console.log();
      this.setData({ 
        actionSheetShow: true, 
        actionSheetType: 1 ,
        hot_goodImg: event.currentTarget.dataset.alldata.goodImg,
        hot_dummyStock: event.currentTarget.dataset.alldata.dummyStock,
        hot_price: event.currentTarget.dataset.alldata.price,
        gdInfo: {
          dummystock: event.currentTarget.dataset.alldata.dummyStock,
          price: event.currentTarget.dataset.alldata.price,
          goodimg: event.currentTarget.dataset.alldata.goodImg,
          dummysales: event.currentTarget.dataset.alldata.dummySales,
          id: event.currentTarget.dataset.alldata.id,
          speclist: event.currentTarget.dataset.alldata.specList,
          valueskumap: event.currentTarget.dataset.alldata.valueSkuMap,
        }
  
        })
      // util.mdFun(this, event.currentTarget.dataset.alldata.activityId + '_' + event.currentTarget.dataset.alldata.id, '', '热卖单品');
      util.mdFun(this, event.currentTarget.dataset.alldata.activityId + '_' + event.currentTarget.dataset.alldata.id, '', '热卖单品');
      this.getSpecInfo()
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
      }, 500)
    },
    onClose() {
      this.setData({
        actionSheetShow: false,
        actionSheetType: 0
      });
    },
  //选择尺寸的确认按钮
  selectSizeSuccess() {
    let activeSkuItem = {};
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
      console.log(this.data.haveChangedId, this.data.specListLength)
      // let skuItemName = '';
      let skuItemNameKey = this.data.skuItemNameKey;
      let skuItemNameValue = this.data.skuItemNameValue;
      this.setData({
        // skuItemName: skuItemName,
        skuId: this.data.activeSkuItem.id,
      })
    } else {
      console.log(this.data.haveChangedId, this.data.specListLength)
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
    if (this.data.actionSheetType == 1) {
      this.addShopCarRequest();
      this.setData({
        actionSheetShow: false
      })
    } else if (this.data.actionSheetType == 2) {
      this.buyNowRequest()
    }

  },
    addShopCarRequest() {
      let reqObj = {
        url: '/api/shopCar/addShopCar?from=goodsDetails',
        data: {
          goodsId: this.data.gdInfo.id,
          goodsNumber: this.data.goodsNumber,
          skuId: this.data.skuId,
        }
      }
      util.RequestPost(reqObj, null, (res, message) => {
        if (message) {
          wx.showToast({
            title: "请选择规格",
            image: "../../static/toastImage/tishi_icon.png",
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
            goodsNumber: 1,
            haveChangedId: []
          })
        }
      })
    },
    getSpecInfo() {
      let { gdInfo } = this.data
      let specList = gdInfo.speclist;

      let skuList = {};
      //skuList 的key进行升序排列
      let temp = gdInfo.valueskumap;
      for (let key in temp) {
        let value = temp[key]
        let attres = key.split(";")
        attres.sort((obj1, obj2) => {
          return Number(obj1) - Number(obj2)
        })
        let newKey = attres.join(";")
        skuList[newKey] = value
      }
      
      let _spectList = []
      console.log(gdInfo,specList)
      let skuItemNameKey = [];
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
        _spectList.push(pushObj);
      })
      this.setData({
        specList: _spectList, //商品参数
        skuList: skuList,
        specListLength: specList.length,
        skuItemNameKey: skuItemNameKey
      })
    },
    // sku
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
    //修改计数器
    onChange(event) {
      this.setData({
        goodsNumber: event.detail
      })
    },
  openTurntable() {
    wx.navigateTo({
      url: "/pages/orderDraw/orderDraw"
    })
  },
  onUnload() {//当小程序进入后台时更新时间
    clearInterval(this.data.di);
  },
  onHide() {
    clearInterval(this.data.di);
    this.setData({
      blackpoint:true,
      GetImage: false //画得的图片消失
    })
  },
  timeFormatData(time) {
    var y = new Date(time).getFullYear() + '';
    var m = new Date(time).getMonth() + 1;
    m = m >= 10 ? (m + '') : ('0' + m);
    var d = new Date(time).getDate();
    d = d >= 10 ? (d + '') : ('0' + d);
    return y + '.' + m + "." + d
  },
  transfTime(time) {
    var s = 1000;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var dd = Math.floor(time / d);
    var ddd, hhh, mmm, sss;
    if ((dd + '').length < 2) {
      ddd = '' + dd
    } else if ((dd + '').length < 3) {
      ddd = '' + dd;
    } else {
      ddd = dd + ''
    };
    var hh = Math.floor((time - dd * d) / h);
    if ((hh + '').length < 2) {
      hhh = '0' + hh
    } else {
      hhh = hh + ''
    };
    var mm = Math.floor((time - dd * d - hh * h) / m);
    if ((mm + '').length < 2) {
      mmm = '0' + mm
    } else {
      mmm = mm + ''
    };
    var ss = Math.floor((time - dd * d - hh * h - mm * m) / s);
    if ((ss + '').length < 2) {
      sss = '0' + ss
    } else {
      sss = ss + ''
    };
    return [ddd, hhh, mmm, sss]
  },
  onLoad(options) {
    //判断是否是新用户 
    //.. help 帮拆红包
    console.log("options",options)
    let that = this
    if (options.upUserId){
      console.log('帮拆红包邀请人id', options.upUserId)
      app.globalData.upUserId = options.upUserId;
      that.setData({
        upUserId: options.upUserId,
        controllUpUserId:true,
        // controllSend:true
      })
    }

    if (!options.upUserId) {
      that.userHavePlay()
    }
      //首页新用户
      //判断是否是新用户
    if (options.isnew == 1) {
      // this.isOpenRed();        //与新人红包是否冲突？？？？？？？？？？？？？？？？？？
      this.setData({
        isNew: true,
        redOpenNum: options.totalCoupon
      })
    }
    //.. userId
    if (options.userId){
      app.globalData.userIdPro = options.userId;
      util.bindfriend(options.userId)//绑定好友关系
      console.log(options.userId)
      console.log(options.userId)
      console.log('首页' + options.userId)
      console.log(options.userId)
    }
    this.getHotShopList('')
    this.hotList();
    
    //开启预约提醒
    util.groupPlayFun()

  },
  onShow() {
    // 修改 爆款分类进来展示第一个标签的内容和标签
    this.setData({
      active: 0
    })
    let that = this
    let upUserId = app.globalData.upUserId
    this.setData({
      upUserId
    },()=>{
      console.log("onshowupuserid",that.data.upUserId)
      this.userHavePlayOnly()
      if (that.data.controllUpUserId) {
        that.userHavePlay()
        that.setData({
          controllUpUserId: false
        })
      }
    })
    // this.userHavePlayOnly()
    if (this.data.blackpoint){
      this.setData({
        blackpoint:false
      })
    }else{
      if (wx.getStorageSync('myxzToken')) {

        this.getHotShopList('');

        //..userId
        util.getNowUserId((userId) => {
          this.setData({
            userId
          })
        })
      }
    }

    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, '', '');
    app.finduser_info()
    this.getBannerList();
    this.getHotShopList('')
    this.setData({
      _iPage:1,
      _pageSize:10
    },()=>{
      this.hotList();
    })
    this.levelUpDialog()
  },
  onReady() {
    // this.userHavePlayOnly()
    //埋点函数 页面操作事件 下一个页面地址
    // if (wx.getStorageSync('myxzUserId')) {
    //   util.mdFun(this, '', '')
    // }
    //初始化代码 影藏tabbar
    let _setInter = setInterval(function () {
    }, 900)
    clearInterval(this.data.di)
    console.log("当页数据",this.data)
  },
  //..
  onReachBottom(){
    let _iPage = this.data._iPage;
    _iPage++;
    this.setData({
      _iPage: _iPage
    },function(){
      console.log(_iPage)
      this.data._iPageMore ? this.hotList(): '';
    })
  },
  //得到活动时间
  getActivityTime() {
    let _this = this;
    let token = wx.getStorageSync('myxzToken');
    var reqObj = {
      url: '/api/activity/luckCycleDetail'
    }
    if (token) {
      let header = {
        'auth-token': token
      };
      wx.request({
        url: apiUrl.API_URL + reqObj.url,
        header: header,
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          console.log(res);
          if (res.data.resCode != '0000') {
            _this.setData({
              activeState: 4
            });
            return
          }
          if (res && res.data) {
            var data = res.data.data;
            var drawStart = data.luckStartTime;
            var drawEnd = data.luckEndTime;
            var activeEnd = data.endTime;
            var activeStart = data.startTime;
            //   var activeStart = 1547049600000;
            //  var  drawStart = 1547287443000;
            //   var drawEnd = 1547541505000;
            // var  activeEnd = 1547305200000;
            var start = _this.timeFormatData(activeStart);
            var end = _this.timeFormatData(activeEnd);
            _this.setData({
              turntableStart: start,
              turntableEnd: end
            });
            if (activeEnd - drawEnd < 86400000) {
              activeEnd = drawEnd + 86400000
            }
            var now = new Date().getTime();
            var activeState;
            var isState = function (now_) {
              if (activeStart > now_) activeState = 0;  //抽奖未开始
              if (activeStart <= now_ && now_ < drawStart) activeState = 1;   // 距离抽奖
              if (drawStart <= now_ && now_ < drawEnd) activeState = 2; // 开始抽奖  
              if (now_ >= drawEnd && now_ < activeEnd) activeState = 3;  //抽奖结束到活动结束 至少保留24小时 
              if (now_ >= activeEnd) activeState = 4;
              var countDown = ['', '', '', ''];
              if (activeState == 2) {
                countDown = [..._this.transfTime(drawEnd - now_)]
              };
              if (activeState == 3) {
                if (_this.data.getPrizeState == 0) {
                  _this.setData({
                    getPrizeState: 1
                  });
                  _this.scrollPrize();
                }
              };
              _this.setData({
                activeState: activeState,
                countDown: countDown
              });
            };
            isState(now);
            console.log(activeState);
            _this.setData({
              di: setInterval(() => {
                now += 1000;
                isState(now);
                if (activeState == 4) clearInterval(di);
              }, 1000)
            })
          }
        },
        fail: function (res) {
          console.log(res);
          _this.setData({
            turntableStart: '加载失败',
          })
        }
      })
    } else {
      wx.navigateTo({
        url: "/pages/init/init"
      })
    }
  },
  hotGood(event) {
    let _nowtimes = new Date().getTime();
    if (_nowtimes - this.data.nowTimes > 1000) {
      this.setData({
        nowTimes: _nowtimes
      })
    } else {
      return false;
    }
    console.log(event);
    wx.navigateTo({
      url: '/pages/goodsDetails/goodsDetails?id=' + event.currentTarget.dataset.id + '&activityId='
        + event.currentTarget.dataset.activityid + '&left=' + event.currentTarget.dataset.left
    })
  },
  //热卖单品列表
  hotList() {
    var _iPage = this.data._iPage;
    var _pageSize = this.data._pageSize;
    let token = wx.getStorageSync('myxzToken');
    let reqObj = {
      url: '/api/goods/hotList?token=' + token,
      data: {
        iPage: _iPage,
        pageSize: _pageSize
      }
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
      }
      // if (res.resCode == '0000') {
      //   console.log(res.resultList);
      //   //成功数据
      //   this.setData({
      //     hotListData: res.resultList
      //   })
      // }
      if (res.resCode == '0000') {
        for (let i of res.resultList) {
          i.price = Number(i.price).toFixed(2);
          i.retailPrice = Number(i.retailPrice).toFixed(2);
        }
        //..最新的数据
        //第一次请求
        if (_iPage == 1) {
          if (res.resultList.length < 10) {
            //没有更多
            this.setData({
              _iPageMore: false
            })
          }
          //成功数据
          this.setData({
            hotListData: res.resultList
          })
        } else {
          if (res.resultList.length < 10) {
            //没有更多
            this.setData({
              _iPageMore: false
            })
          }
          let newData = [...this.data.hotListData, ...res.resultList]
          //成功数据
          this.setData({
            hotListData: newData
          })
        }
      }
    })
  },
  scrollPrize() {
    var prizePage = this.data.prizePage;

  },
  //..help
  //判断用户是否参与过活动
  userHavePlay(){
    let that = this
    let upUserId = app.globalData.upUserId
    let isFromDetail1 = app.globalData.isFromDetail1
    console.log('isfrom',isFromDetail1);
    let reqObj = {
      url: '/api/user/userRedActivityIsNo'
    }
    if (upUserId != "" && upUserId != null && upUserId != "undefined"){
      reqObj = {
        url: '/api/user/userRedActivityIsNo?upCustomerNo=' + upUserId
      }
    }
    util.RequestPost(reqObj, null, (res, message) => {
      console.log("是否参加Play",res)
      if (res.resCode == '0000') {
        let that = this
        if (res.data.userWhiteList==1){
          that.setData({
            userWhiteList:false
          })
        }else{
          that.setData({
            userWhiteList:true
          })
        }
        if(res.data.newUser==1){
          that.setData({
            newUser:true
          })
        }
        if (res.data.newUser == 0) {
          that.setData({
            newUser: false
          })
        }
        if (res.data.isTake == 1) {
          that.setData({
            isTake: true
          })
        } else {
          that.setData({
            isTake: false
          })
        }

        if (res.data.isHelp == 1) {
          that.setData({
            isHelp: true,
            isHelpFirst:true
          })
        } else {
          that.setData({
            isHelp: false,
            isHelpFirst:false
          })
        }
        console.log("upUserId",this.data.upUserId)
        that.setData({
          redUp: res.data.redUp
        })
        //历史上未参加的自拆新用户
        if (res.data.newUser == 1 && res.data.isTake != 1 && res.data.isTotalDismantle != 1 && (that.data.upUserId == "" || that.data.upUserId == "undefined") && isFromDetail1==false){
          that.setData({
            isHelpRed:false,
            helpRedShow: true,
            redUp:res.data.redUp
          },()=>{
            console.log("isHelp自己拆1",that.data.isHelpRed)
          })
          console.log("isHelp自己拆2",that.data.isHelpRed)
          app.globalData.isFromDetail1=false
        }
        //未参加的白名单老用户
        if (res.data.newUser == 0 && res.data.isTake != 1 && res.data.isTotalDismantle != 1 && (that.data.upUserId == "" || that.data.upUserId == "undefined") && isFromDetail1 == false && res.data.userWhiteList == 2) {
          that.setData({
            isHelpRed: false,
            helpRedShow: true,
            redUp: res.data.redUp
          })
          app.globalData.isFromDetail1 = false
        }
        //未参加的帮拆新用户
        if (res.data.newUser == 1 && that.data.upUserId != "" && that.data.upUserId != "undefined" && res.data.isTake != 1 && res.data.isHelp!=1 &&res.data.isDismantle == 0){
          that.openHelpRed()
          that.setData({
            isHelpRed:true,
            helpRedShow: true,
            helpRedOnShow:true
          },()=>{
            console.log("isHelp帮拆1",that.data.isHelpRed)
          })
          console.log("isHelp帮拆2",that.data.isHelpRed)
        }
        //老活动帮拆过但没参加的新用户，参加新活动
        if (res.data.newUser == 1 && res.data.isTake != 1 && res.data.isTotalDismantle != 1 && that.data.upUserId != "" && that.data.upUserId != "undefined" && res.data.isHelp == 1) {
          that.setData({
            isHelpRed: false,
            helpRedShow: true,
            redUp: res.data.redUp
          })
        }
        //未参加的帮拆白名单老用户
        if (res.data.newUser == 0 && res.data.isTake != 1 && that.data.upUserId != "" && that.data.upUserId != "undefined" && res.data.userWhiteList == 2 && res.data.isTotalDismantle != 1) {
          that.setData({
            isHelpRed: false,
            helpRedShow: true,
            redUp: res.data.redUp
          })
          app.globalData.isFromDetail1 = false
        }
        //当前用户活动时间结束
        if (res.data.isEnd == 1) {
          that.setData({
            isEnd: true
          })
        }
        //帮拆情况下已拆完变自拆
        if (res.data.isDismantle == 1 && res.data.isTotalDismantle != 1 && res.data.newUser == 1 && res.data.isTake != 1) {
          that.setData({
            helpRedShow: true,
            redUp: res.data.redUp,
            isDismantle:true
          })
        }

        //白名单老用户帮拆情况下已拆完变自拆
        if (res.data.isDismantle == 1 && res.data.isTotalDismantle != 1 && res.data.newUser == 2 && res.data.isTake != 1 && res.data.userWhiteList == 2) {
          that.setData({
            helpRedShow: true,
            redUp: res.data.redUp,
            isDismantle: true
          })
        }
        //总红包数拆完
        if (res.data.isTotalDismantle == 1) {
          that.setData({
            redTotalOver: true
          })
        }
      }
    })
  },

  //只发判断用户是否参与请求
  userHavePlayOnly() {
    let that = this
    console.log("帮拆Id传参检查", app.globalData.userIdPro)
    let upUserId = app.globalData.upUserId
    let reqObj = {
      url: '/api/user/userRedActivityIsNo'
    }
    if (upUserId != "" && upUserId != null && upUserId != "undefined") {
      reqObj = {
        url: '/api/user/userRedActivityIsNo?upCustomerNo=' + upUserId
      }
    }
    util.RequestPost(reqObj, null, (res, message) => {
      console.log("是否参加PlayOnly", res)
     
      if (res.resCode == '0000') {
        let that = this
        if (res.data.userWhiteList == 1) {
          that.setData({
            userWhiteList: false
          })
        } else {
          that.setData({
            userWhiteList: true
          })
        }
        if (res.data.newUser == 1) {
          console.log(typeof (res.data.newUser))
          that.setData({
            newUser: true
          })
          console.log(this.data.newUser)
        } 
        if (res.data.newUser == 0) {
          console.log(typeof (res.data.newUser))
          that.setData({
            newUser: false
          })
        }
        console.log(this.data.newUser)
        if (res.data.isTake == 1) {
          that.setData({
            isTake: true
          })
        } else {
          that.setData({
            isTake: false
          })
        }
        if (res.data.isHelp == 1) {
          that.setData({
            isHelp: true
          })
        } else {
          that.setData({
            isHelp: false
          })
        }

        console.log("upUserId", this.data.upUserId)
        //未参加
        if (res.data.newUser == 1 && res.data.isTake != 1 && res.data.isTotalDismantle != 1 && that.data.upUserId == "") {
          that.setData({
            isHelpRed: false,
            // helpRedShow: true,
            // redUp: res.data.redUp
          }, () => {
          })
        }
        if (res.data.newUser == 1 && that.data.upUserId != "" && res.data.isTake != 1 && res.data.isDismantle == 0) {
          that.setData({
            isHelpRed: true,
            // helpRedShow: true,
            // helpRedOnShow: true
          })
        }
        if (res.data.isEnd == 1) {
          that.setData({
            isEnd: true
          })
        }
        // if (res.data.isDismantle == 1) {
        //   that.setData({
        //     helpRedShow: true,
        //     redUp: res.data.redUp
        //   })
        // }
        if (res.data.isTotalDismantle == 1) {
          that.setData({
            redTotalOver: true
          })
        }
      }
    })
  },
  //帮拆红包关闭
  helpRedClose(){
    // let { levelUpDialog } = this.data
    this.setData({
      helpRedShow:false,
      helpRedOnShow:false
    },()=>{
      // if (levelUpDialog){
      //   Dialog.alert({
      //     title: "恭喜您，",
      //     message: '您已自动升级为 麦芽会员',
      //     confirmButtonText: "知道了"
      //   }).then(() => {
      //     // on close
      //   });
      // }
    })
  },
  //打开帮拆红包
  openHelpRed(){
    //发送请求
    let that = this
    let reqObj = {
      url: '/api/activity/userRedActivity'
    }
    console.log("邀请人Id",this.data.upUserId)
    if (this.data.upUserId != "" && this.data.upUserId != "undefined" && !this.data.isHelp && this.data.newUser){
      reqObj = {
        url: '/api/activity/userRedActivity?upUserId=' + this.data.upUserId,
      }
    }
    util.RequestPost(reqObj, null, (res, message) => {
      console.log(res,message)
      if (message) {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 2000,
          success:function(){
            setTimeout(function(){
              that.setData({
                helpRedShow: false,
                helpRedOnShow: false
              })
              that.userHavePlayOnly()
            },2000)
          }
        })
      }
      if (res.resCode == '0000') {
        //成功且获取到金额数据
        if(res.data.isHelp==0){
          if(res.data.isPrize==1){
            this.setData({
              helpRedShow:false,
              helpRedOnShow:false
            })
            wx.navigateTo({
              url: '/pages/helpRed/helpRed'
            })
          }
          console.log("接口返回是否帮拆0",res.data.isHelp)
          this.setData({
            isHelpRed:false,
            inviteeValue: Number(res.data.inviteeValue).toFixed(2),
            inviterValue: Number(res.data.inviterValue).toFixed(2),
            redUp: res.data.redUp,
            isTake:true
          })
        }else{
          console.log("接口返回是否帮拆1",res.data.isHelp)
          this.setData({
            isHelpRed:true,
            helpRedOnShow: true,
            inviteeValue: Number(res.data.inviteeValue).toFixed(2),
            inviterValue: Number(res.data.inviterValue).toFixed(2),
            redUp: res.data.redUp,
            strDouble: res.data.strDouble,
            isTake:true
          })
        }
          // this.userHavePlayOnly()
        that.setData({
          helpRedOnShow: true
        })
      }
    })

  },
  //跳转红包活动
  goRedPlay(){
    let { newUser, isTake, userWhiteList} = this.data
    let that = this
    if ((newUser && !isTake) || (userWhiteList && !isTake)){
      that.setData({
        helpRedShow:true
      })
    }else{
      wx.navigateTo({
        url: '/pages/helpRed/helpRed',
      })
      that.setData({
        helpRedShow: false,
        helpRedOnShow: false
      })
    }

  },

  // v1.4首页改版方法
  onChange_querylist(event) {
    console.log(event.detail.title);
    this.getHotShopList(event.detail.title);
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.index + 1}`,
    //   icon: 'none'
    // });
  },
  // 展示首页
  goHome(){
    this.setData({
      helpRedShow:false,
      helpRedOnShow:false
    })
  },
  //得到banner
  getBannerList() {
    let reqObj = {
      url: '/api/banner/bannerList'
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
      }
      if (res.resCode == '0000') {
        //保存到本地存储
        wx.setStorageSync('bannerUrl', res.resultList ? res.resultList[0].bannerUrl : '');

        let groupDetailsUrl = '', groupDetailsImgUrl = '', groupHomeImgUrl='';
        let swiperData=[];//首页banner图片
        let rookieExclusiveBanner = ""
        let specialList = []
        for (let ii of res.resultList){
          if (ii.positionId == 6 || ii.positionId == 7 || ii.positionId == 8 || ii.positionId == 9 || ii.positionId == 10){
            specialList.push(ii)
          }
          specialList.sort(function(a,b){
            return a.positionId-b.positionId
          })
          if (ii.positionId == 1) {
            swiperData.push(ii)
          }
          //拼团详情
          if (ii.positionId==2){
            groupDetailsUrl = ii.redirectUrl;
            groupDetailsImgUrl = ii.bannerUrl
          }
          //拼团列表
          if (ii.positionId == 3) {
            groupHomeImgUrl = ii.bannerUrl
          }
          //新人专享
          if (ii.positionId == 4) {
            rookieExclusiveBanner = ii.bannerUrl
          }
        }
        //成功数据
        this.setData({
          swiperData: swiperData,
          shareImage: swiperData,
          groupDetailsUrl: groupDetailsUrl,
          groupDetailsImgUrl: groupDetailsImgUrl,
          groupHomeImgUrl: groupHomeImgUrl,
          rookieExclusiveBanner,
          specialList
        })

        wx.setStorage({
          key: 'shareImage',
          data: res.resultList
        })
      }
    })
  },
  //获取抽奖的中奖纪录
  getPrizeList(iPage, flag, resultCount) {
    var _this = this;
    var pageSize = resultCount ? resultCount : 10;
    let token = wx.getStorageSync('myxzToken');
    var reqObj = {
      iPage: iPage,
      pageSize: pageSize,
      selectTypes: ['10001', '10002', '10003', '10004', '10005'].join(',')    //设置一二三四五等奖
    }
    if (token) {
      let header = {
        'auth-token': token
      };
      wx.request({
        url: apiUrl.API_URL + '/api/activity/luckCycleRecords',
        header: header,
        data: reqObj,
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          console.log(res);
          if (res && res.data) {
            var resultCount = res.data.resultCount;
            if (resultCount > 0) {
              _this.setData({
                xsState3: true
              });
            }
            if (flag) {
              _this.getPrizeList(1, false, resultCount);
            };
            if (resultCount > 0) {
              var pds = _this.data.prizeList;
              var pdstr = '';
              var rl = res.data.resultList;
              var rlLenght = rl.length;
              for (var i = 0; i < rlLenght; i++) {
                // pds.push({
                //   name: rl[i].nickName,
                //   pro: rl[i].prizeName,
                //   num: rl[i].prizeNum ? rl[i].prizeNum : 1
                // })
                pdstr += '恭喜' + rl[i].nickName + '中奖！' + '获得' + rl[i].prizeName + 'X' + (rl[i].prizeNum ? rl[i].prizeNum : 1) + '； ';
              };
              // var toPrizeList = (iPage - 1) * pageSize;
              _this.setData({
                // prizeList: pds,
                // prizePage: iPage,
                prizeListStr: pdstr
              })
            }

          }
        },
        fail: function (res) {
          console.log(res);
        }
      });
    } else {
      wx.navigateTo({
        url: "/pages/init/init"
      })
    };
  },
  //次函数内的 接口没有做分页
  getHotShopList(type) {
    //..
    console.log(type);
    let token = wx.getStorageSync('myxzToken');
    let reqObj = {
      url: '/api/goods/queryList?auth-token=' + token,
      data: {
        type: type,
        iPage: 1,
        pageSize: 10

      }
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
      }
      if (res.resCode == '0000') {
        for (let i of res.resultList) {
          i.price = Number(i.price).toFixed(2);
          i.retailPrice = Number(i.retailPrice).toFixed(2);
        }
        console.log(res);
        if(res.data!=null){
          this.setData({
            hotShopList: res.resultList,
            navNames: res.data.labelList,
            isnav:res.data==null?false:true
          })
        }else{
          this.setData({
            hotShopList: res.resultList,

            isnav: res.data == null ? false : true
          })
         
        }


        if (!this.data.getHotListOk) {
          this.getBannerList();
          if (this.data.intervalSwitch) {
            // this.getActivityTime();
            this.setData({
              intervalSwitch: false
            })
          }

          //this.getPrizeList();

          var prizePage = this.data.prizePage;
          // this.getPrizeList(prizePage, true);
          this.setData({
            getHotListOk: true
          })
        }
      }
    })
  },
  navClick(event) {
    let type = event.currentTarget.dataset.types == "left" ? true : false;
    //..
    this.setData({ 
      navLeft: type,
      _iPage:1,
      iPage:1,
      _iPageMore:true
    }, () => {
      // this.getHotShopList();
      this.hotList();
    })
  },
  postFormId(event) {
    util.postFormId(event.detail.formId);
  },
  //跳转商品详情
  goShopDetail(event) {
    let _nowtimes = new Date().getTime();
    if (_nowtimes - this.data.nowTimes > 1000) {
      this.setData({
        nowTimes: _nowtimes
      })
    } else {
      return false;
    }
    wx.navigateTo({
      url: '/pages/goodsDetails/goodsDetails?id=' + event.currentTarget.dataset.id + '&activityId='
        + event.currentTarget.dataset.activityid + '&left=' + event.currentTarget.dataset.left
    })
  },
  bannerJump(event) {
    console.log(event)
    let url = event.currentTarget.dataset.redirecturl;
    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, 'banner', url);
    wx.navigateTo({
      url: url
    })
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
  onShareAppMessage: function (res) {
    this.setData({
      GetImage: false
    })


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
    console.log(this.data.imgUrl);
    return {
      title: this.data.copywriting,
      imageUrl: this.data.imgUrl,
      path: '/pages/home/home?userId=' + this.data.userId
    }
  },
  stopPageScroll(){
    return
  },
  onPullDownRefresh: function () {
    //..
    this.setData({
      _iPage:1,
      _iPageMore:true
    })
    this.getBannerList();
    this.getHotShopList('');
    // this.getActivityTime();
    this.hotList();
    wx.stopPullDownRefresh()
  },
  goRookieSpecial() {
    let _nowtimes = new Date().getTime();
    if (_nowtimes - this.data.nowTimes > 1000) {
      this.setData({
        nowTimes: _nowtimes
      })
    } else {
      return false;
    }
    wx.navigateTo({
      url: '/pages/rookieExclusive/rookieExclusive'
    })
  },
  levelUpDialog(){
    let reqObj = {
      url: '/api/my/oldUpLevelInfo'
    }
    util.RequestGet(reqObj, null, (res, message) => {
      let that = this
      if (message) {
        wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
      }
      if (res.resCode == '0000') {
        //  && !helpRedShow如果需要按顺序弹出加上该条件
        if (res.data.isNotice == "2"){
          that.setData({
            levelUpDialog:true
          })
          Dialog.alert({
            title: "恭喜您，",
            message: '您已自动升级为 麦芽会员',
            confirmButtonText: "知道了"
          }).then(() => {
            // on close
          });
        }else{
          that.setData({
            levelUpDialog: false
          })
        }
      }
    })
  }

})
