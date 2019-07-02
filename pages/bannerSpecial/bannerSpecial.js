// pages/bannerSpecial/bannerSpecial.js

var apiUrl = require('../../static/js/url.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    activityName:"banner专场",
    bottomBannerUrl:"",
    topBannerUrl:"",
    bannerSpecialList:[],
    gdInfo:{},
    activityId:null,
    iPage:0,
    pageSize:10,
    actionSheetShow:false,//上拉菜单
    actionSheetType:1, //加入购物车
    specList: [], //商品参数
    specListLength: 0,
    skuList: [],//SKU列表
    skuItemName: '', //商品规格
    haveChangedId:[],
    SKUResult: {}, //根据sku列表生成的所有能选的列表
    skuItemNameKey: [],
    skuItemNameValue: [],
    isSelectSize: false,
    activeSkuItem: {},//最后选中的SKu
    goodsNumber: 1,
    skuId: '',
    hasMore: true,
    isLoading: true,
    hasBannerActivity: true,
    showNomore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showMore()
    this.setData({
      activityId:Number(options.activityId)
    })
    if(this.data.activityId){
      this.getBannerSpecialList()
    }else{
      this.setData({
        activityName: "活动页面",
        hasBannerActivity:false
      })
    }
    
  },

  //监听页面高度判断是否展示底线
  showMore() {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        let screenHeight = res.screenHeight
        if (that.data.bannerSpecialList.length != 0) {
          wx.createSelectorQuery().select('#btLine').boundingClientRect().exec(function (res) {
            console.log(res)
            if (res[0].top > screenHeight) {
              that.setData({
                showNomore: true
              })
            } else {
              that.setData({
                showNomore: false
              })
            }
          })
        }

      },
    })
  },

  getBannerSpecialList(){
    let { activityId, iPage, pageSize, bannerSpecialList } = this.data
    let that = this
    iPage++
    var reqObj = {
      url: `/api/goods/goodActivityList?iPage=${iPage}&&pageSize=${pageSize}&&activityId=${activityId}`
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
        wx.setNavigationBarTitle({
          title: "活动页面"
        })
        this.setData({
          activityName:"活动页面",
          hasBannerActivity: false
        })
      }
      if (res.resCode == '0000') {
        console.log(res)
        for (let i of res.resultList){
          i.price = Number(i.price).toFixed(2)
          i.reducePrice = Number(i.reducePrice).toFixed(2)
          i.retailPrice = Number(i.retailPrice).toFixed(2)
        }
        let hasMore = iPage < Math.ceil(res.resultCount / pageSize) ? true : false;
        that.setData({
          hasMore,
          isLoading:false,
          iPage,
          bannerSpecialList:[...bannerSpecialList , ...res.resultList],
          activityName:res.map.activityName,
          bottomBannerUrl:res.map.bottomBannerUrl,
          topBannerUrl:res.map.topBannerUrl
        },()=>{
          that.showMore()
        })
        wx.setNavigationBarTitle({
          title: res.map.activityName
        })
      }
    })
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
    // if (!activeSkuItem.id) {
    //   wx.showToast({
    //     title: '请选择规格',
    //     icon: 'loading',
    //     duration: 1500
    //   })
    //   this.setData({
    //     isSelectSize: false
    //   })
    // } else {
    //   let skuItemName='';
    //   let skuItemNameKey = this.data.skuItemNameKey;
    //   let skuItemNameValue = this.data.skuItemNameValue;
    //   for (let ii = 0; ii < this.data.skuItemNameKey.length;ii++){
    //     skuItemName += skuItemNameKey[ii] + ':' + this.data.activeSkuItem.specValueList[ii]+';';
    //   }
    //   console.log(skuItemName);
    //   this.setData({
    //     skuId: activeSkuItem.id,
    //     isSelectSize: true,
    //     skuItemName: skuItemName,
    //   })
    // }
    //如果 当前选择规格 长度
    if (this.data.haveChangedId.length == this.data.specListLength) {
      console.log(this.data.haveChangedId, this.data.specListLength)
      // let skuItemName = '';
      let skuItemNameKey = this.data.skuItemNameKey;
      let skuItemNameValue = this.data.skuItemNameValue;
      // for (let ii = 0; ii < this.data.skuItemNameKey.length; ii++) {
      //   skuItemName += skuItemNameKey[ii] + ':' + this.data.activeSkuItem.specValueList[ii] + ';';
      // }
      console.log("this.data.activeSkuItem.id",this.data.activeSkuItem.id)
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
    this.addShopCarRequest();
    this.setData({
      actionSheetShow: false
    })
  },


  //跳转商品详情
  goShopDetail(event) {
    wx.navigateTo({
      url: '/pages/goodsDetails/goodsDetails?id=' + event.currentTarget.dataset.id + '&activityId='
        + event.currentTarget.dataset.activityid + '&left=' + event.currentTarget.dataset.left
    })
  },

  //购物车打开弹窗
  addShopCar(event){
    console.log(event)
    this.setData({
      actionSheetShow: true,
      gdInfo:{
        dummystock: event.currentTarget.dataset.dummystock,
        price: Number(event.currentTarget.dataset.price).toFixed(2),
        goodimg: event.currentTarget.dataset.goodimg,
        dummysales: event.currentTarget.dataset.dummysales,
        id: event.currentTarget.dataset.id,
        speclist: event.currentTarget.dataset.speclist,
        valueskumap: event.currentTarget.dataset.valueskumap,
      }
    })
    util.mdFun(this, event.currentTarget.dataset.activityid + '_' + event.currentTarget.dataset.id, '', 'banner专场');
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
    
    // for (let k in this.data.gdInfo.valueskumap){
    //   let attrValueList = []
    //   for (let i of k.split(";")){   
    //     let obj = {}
    //     for (let l of this.data.gdInfo.speclist[k.split(";").indexOf(i)].specValue){
    //       if (l.id == Number(i)){
    //         obj["attrValue"]=l.valueName
    //         obj["id"] = l.id
    //       }
    //     }
    //     obj["attrKey"] = this.data.gdInfo.speclist[k.split(";").indexOf(i)].specName
    //     attrValueList.push(obj)
    //   }  
    //   console.log(attrValueList)
    // }
    // console.log(this.data.gdInfo.valueskumap)
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
          title: res.resDesc,
          icon: 'loading',
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
          haveChangedId:[]
        })
      }
    })
  },

  getSpecInfo(){
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


  //关闭弹窗
  onClose() {
    this.setData({
      actionSheetShow: false
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoading == true || this.data.hasMore == false) {
      return
    }

    this.setData({
      isLoading: true
    })
    this.getBannerSpecialList()
  },



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
        console.log("this.data.skuList", this.data.skuList)
        console.log("_haveChangedId", _haveChangedId)
        if (this.data.skuList.hasOwnProperty(_haveChangedId)) {
          //.. 选中的SKU列表
          console.log("this.data.skuList",this.data.skuList)
          console.log("_haveChangedId",_haveChangedId)
          this.data.skuList['' + _haveChangedId].price = Number(this.data.skuList['' + _haveChangedId].price).toFixed(2)
          this.setData({
            activeSkuItem: this.data.skuList['' + _haveChangedId]
          })
        }else{
          
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
  stopPageScroll() {
    return
  }
})