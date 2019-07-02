// pages/groupDetails/groupDetails.js
const app = getApp()
var apiUrl = require('../../static/js/url.js');
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
import Dialog from '../../dist/dialog/dialog';
Page({
  data: {  
    showIcon: true,//引入的自定义导航左边返回按钮
    aa: true,
    title:'拼团商品详情',
    scrollTop:0,//组件距离顶部的距离
    tapActive:2,//当前选中那个菜单
    
    showVideo:false,//显示视频播放页面 
    showVideoNav:false,//显示视频这个导航
    swiperActive:1,//轮播图计数器
    toTop:false,//是否显示 回到顶部
    actionSheetShow:false,


    // sku用到的参数
    specList: [], //商品参数
    skuList: [],//SKU列表
    SKUResult: {}, //根据sku列表生成的所有能选的列表
    activeSkuItem: {},//最后选中的SKu
    haveChangedId:'',//当前选择规格 选中了几项
    specListLength: 0,//可选商品规格总项数
    skuId:'',//最终选择的sku 的id


    groupNumber:1,//默认购买数量

    activityId:'', //活动id
    goodsId:'', //商品ID
    activityStatus: 1,//活动状态 1：正在疯抢 2：即将开始

    riqi:'',//距离活动开始 时间
    shijian:'',
    fenzhong:'',
    hhhh: '00',
    mmmm: '00',
    ssss: '00',

    openTips:999,//是否预约提醒 2,未设置 1,设置了提醒

    //参加拼团的列表
    groupList:[],
    partCount:99,//拼团总人数
    groupId:'',//参加拼图时的拼图id

    //拼团列表点击拼团进来，直接参团
    openSpellType:false,
    nowTimes:new Date().getTime(),//当前时间防止重复点击
    userId: null,
    //红包邀请人Id
    upUserId: null,
    //拆红包新用户
    newUser: false,
    //是否帮拆
    isHelpRed: false,
    //..help
    userWhiteList:false,//当前用户是否是白名单
    helpRedShow: false, //帮拆红包
    helpRedOnShow: false, //帮开红包已打开
    inviteeValue: 0,
    inviterValue: 0,
    redUp: 0,
    isEnd: false,//当前用户活动时间是否结束
    isDismantle: false, //红包是否拆完
    redTotalOver: false, //所有红包是否发完
    strDouble: null,//领取X倍红包
    isInvite:true,
    // out_show:false
    shareImage:""
  },

  // canvas生成的图片点击消失
  share_hide: function () {
    this.setData({
      GetImage: false
    })
  },

  onLoad: function (options) {
    if (options.out_show || options.out_showinvite || options.order_show){
      console.log('saada')
      this.setData({
        showIcon:false
      })
    }else{
      console.log('000');
      this.setData({
        showIcon: true
      })
    }
    console.log(options);
    this.setData({
      activityId: options.activityId,
      id: options.goodsId,
      
    })
    if(options.userId){
      util.bindfriend(options.userId)//绑定好友关系
    }
    console.log(options);
    if (options.upUserId) {
      app.globalData.upUserId = options.upUserId;
      console.log(options.upUserId)
    }
    if(options.isInvite){
      this.userHavePlay()
    }
    if (options.goodsId){
      this.setData({
        activityId: options.activityId,
        goodsId: options.goodsId,
        groupId: options.groupId||'',
        openSpellType: options.groupId ? true : false
      }, () => {
        this.getGroupDetails();
      });
    }
    //开启预约提醒
    util.groupPlayFun()
    // 通过二维码扫进来的
    if (options.scene){
      // this.data.userId  this.data.goodsId  this.data.activityId
      console.log('通过二维码扫进来的');
      let scene = decodeURIComponent(options.scene);
      console.log(scene);
      let sceneArr = scene.split('#');
      console.log(sceneArr);
      let activityId = parseInt(sceneArr[2], 32);//将32进制的转化为10进制的
      let id= parseInt(sceneArr[1], 32);//将32进制的转化为10进制的 goodId
      // let activityId = sceneArr[2]
      // let goodId = sceneArr[1]
        this.setData({
          activityId: activityId,
          id:id,
          goodsId:id,
          showIcon: false
        })
      app.globalData.upUserId = parseInt(sceneArr[0], 32);
      util.bindfriend(parseInt(sceneArr[0], 32))//绑定好友关系
      this.getGroupDetails();
    }

  },
  onShow(){
    //埋点函数 页面操作事件 下一个页面地址
    let mdData = '' + this.data.activityId + '_' + this.data.goodsId;
    util.mdFun(this, mdData, '');
    util.getNowUserId((userId) => {
      this.setData({
        userId
      })
    })
  }, 
  onHide(){
    //干掉定时器
    clearInterval(this._setInter);
    this.setData({
      GetImage:false
    })
  },
  onReady(){
    this.videoContext = wx.createVideoContext('my_video');
  },
  //分享函数
  onShareAppMessage() {
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
    console.log(this.data.goodId, this.data.activityId, this.data.gdInfo);
    //..要加个 用户ID  this.data.userId  this.data.goodsId  this.data.activityId
    return {
      title: util.commonText2[numberText], 
      path: '/pages/groupDetails/groupDetails?userId=' + this.data.userId + '&goodsId=' + this.data.goodsId + '&activityId=' + this.data.activityId + '&left=' + this.data.left  + '&isInvite=' + this.data.isInvite +'&out_show=true',
      imageUrl: this.data.gdInfo.goodImg
    }
  },
  //获取商品详情信息
  getGroupDetails(){
    // activityId,goodsId
    let reqObj = {
      url: '/api/goods/group/goodDetail?activityId=' + this.data.activityId + '&goodsId=' + this.data.id
    }
    util.RequestGet(reqObj, null, (res, message) => {

      if (res.resCode == '21000') {
        wx.showToast({
          title: '活动不存在或已失效',
          icon: 'none',
          duration: 1500
        })
        setTimeout(()=> {
          wx.switchTab({
            url: '/pages/home/home',
          })
        }, 1500);
      }
      if (res.resCode == '21001') {
        wx.showToast({
          title: '商品不存在或已下架',
          icon: 'none',
          duration: 1500
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/home/home',
          })
        }, 1500);
      }
      if (res.resCode == '0000') {
        res.data.gdInfo.retailPrice=Number(res.data.gdInfo.retailPrice).toFixed(2)
        res.data.gdInfo.price=Number(res.data.gdInfo.price).toFixed(2)
        //拼团状态
        let activityStatus = res.data.gdActivityInfo.activityStatus;
        let beginTime =res.data.gdActivityInfo.beginTime;
        let nowTime = res.data.gdActivityInfo.nowTime;

        //SKU SPEC
        let specList = res.data.specList;
        let skuList = {};

        //skuList 的key进行升序排列
        let temp = res.data.valueSkuMap;
        for (let key in temp){
          let value = temp[key]
          let attres = key.split(";")
          attres.sort((obj1, obj2)=>{
              return Number(obj1)-Number(obj2)
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
        //活动开始时间转换
        if (activityStatus==2){
          let _nowTime = (new Date(nowTime)).toDateString();
          let outTime = this.formatDateTime(new Date(beginTime));
          let riqi, shijian, fenzhong;
          //判断是不是今天
          if ((new Date(beginTime)).toDateString() == _nowTime){
            riqi='今日';
            shijian = outTime[1];
            fenzhong = '00分' == outTime[2] ? '' : outTime[2]
          } else if ((new Date(beginTime - 86400000)).toDateString() == _nowTime){
            //明天
            riqi = '明天';
            shijian = outTime[1];
            fenzhong = '00分' == outTime[2] ? '' : outTime[2]
          }else{
            //明天以后
            riqi = '';
            shijian = outTime[0];
            fenzhong = '00分' == outTime[2] ? '' : outTime[2]
          }
          this.setData({
            riqi, shijian, fenzhong
          })
        }
        //拼团列表时间转换
        let nowGroupList= res.data.gdActivityInfo.parts;
        
        setInterval(()=>{
          for (let iii of nowGroupList) {
            iii.remainderTime = iii.remainderTime-1000;
            iii.remainderTimeData = this.countTime1(iii.remainderTime);
          }
          this.setData({
            groupList: nowGroupList
          })
        },1000)
        this.setData({
          gdInfo: res.data.gdInfo, //商铺数据
          gdActivityInfo: res.data.gdActivityInfo,
          specList: _spectList, //商品参数
          skuList: skuList,
          activityStatus: activityStatus,
          specListLength: _spectList.length,
          openTips: res.data.gdActivityInfo.appoint,
          partCount: res.data.gdActivityInfo.partCount,
          
        }, () => {
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
          }, 500)
          //获取图文介绍
          this.getGoodDesc(this.data.goodsId);
          //倒计时计时器
          let ii = 0;
          if (this.data.gdActivityInfo.activityStatus==1){
            this._setInter=setInterval(() => {
              //开始时间-当前时间
              this.countTime(this.data.gdActivityInfo.endTime, this.data.gdActivityInfo.nowTime + ii * 1000 )
              ii = ii + 1;
            }, 1000)
          }
          //如果需要进来就参团
          if (this.data.openSpellType){
            this.spellClick();
          }
        })
      }
    })
  },
  //参加拼团
  goToSpell(event){
    //点击参团的 拼图id
    this.setData({
      groupId : event.currentTarget.dataset.groupid
    },function(){
      this.spellClick();
    })
  },
  // canvas画图分享的发放 （保存图片，绘制分享图）
  eventDraw() {
    this.setData({
      GetImage: true,
      shareImage: ""
    })
    console.log(this.data.userId, this.data.goodsId, this.data.activityId);
    console.log(this.data.gdInfo);
    let userid = parseInt(this.data.userId).toString(32)
    let goodid = parseInt(this.data.goodsId).toString(32)
    let activityid = parseInt(this.data.activityId).toString(32)
    let ptid = 0
    let left = true
    // this.data.userId + '&id=' + this.data.goodId + '&activityId=' + this.data.activityId +
    let reqObj = {
      url: '/api/generate/code',
      data: {
        // this.data.userId  this.data.goodsId  this.data.activityId
        "autoColor": true,
        "page": "pages/groupDetails/groupDetails",
        "scene": userid + "#" + goodid + '#' + activityid + '#' + ptid+'#'+left,
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
        console.log(res.data);
        // console.log(res.data.copywriting, res.data.imgUrl);
        //成功数据

        // this.setData({
          // 请求接口随机的图片
        //   copywriting: res.data.copywriting,
        //   imgUrl: res.data.imgUrl
        // })
        wx.showLoading({
          title: '绘制分享图片中',
          mask: true
        })
        // console.log(this.data.copywriting, this.data.gdInfo.goodImg)
        console.log(this.data.gdInfo);
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
                content: app.globalData.wechatnickName,
                fontSize: 16,
                color: '#402D16',
                textAlign: 'left',
                top: 20,
                left: 79.5,
                bolder: true
              },
              // 中间的图    this.data.imgUrl
              {
                type: 'image',
                url: this.data.gdInfo.goodImg,
                top: 60,
                left: 32.5,
                width: 310,
                height: 350
              },
              //价格 Number(this.data.gdInfo.price).toFixed(2)
              {
                type: 'text',
                content: "￥" + Number(this.data.gdInfo.price).toFixed(2) ,
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
              // 二维码图片res.data   "https://file.maiyatown.com/images/v1.2/home_share_img3.png"
              {
                type: 'image',
                url:res.data,
                top: 420,
                left: 250,
                width: 88,
                height: 88
              },
              // 矩形
              {
                type: 'rect',
                background: 'red',
                top: 425,
                left: 170,
                width: 45,
                height: 20
              },
              // 拼团状态
              {
                type: 'text',
                content: "拼团中",
                fontSize: 12,
                color: '#FFFFFF',
                textAlign: 'left',
                top: 427,
                left: 175,
                lineHeight: 20,
                MaxLineNumber: 2,
                breakWord: true,
                width: 155,
                bolder: true
              },
              // 动态生成的字   
              {
                type: 'text',
                content: this.data.gdInfo.title,
                fontSize: 15,
                color: '#101010',
                textAlign: 'left',
                top: 460,
                left: 32.5,
                lineHeight: 20,
                MaxLineNumber: 2,
                breakWord: true,
                width: 172,
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
  // canvas画图分享的发放 （保存图片，绘制分享图）
  eventDraw1() {
    this.setData({
      GetImage: true,
      shareImage: ""
    })
    console.log(this.data.userId, this.data.goodsId, this.data.activityId);
    console.log(this.data.gdInfo);
    let userid = parseInt(this.data.userId).toString(32)
    let goodid = parseInt(this.data.goodsId).toString(32)
    let activityid = parseInt(this.data.activityId).toString(32)
    let ptid = 0
    let left = true
    // this.data.userId + '&id=' + this.data.goodId + '&activityId=' + this.data.activityId +
    let reqObj = {
      url: '/api/generate/code',
      data: {
        // this.data.userId  this.data.goodsId  this.data.activityId
        "autoColor": true,
        "page": "pages/groupDetails/groupDetails",
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
        console.log(res.data);
        // console.log(res.data.copywriting, res.data.imgUrl);
        //成功数据

        // this.setData({
        // 请求接口随机的图片
        //   copywriting: res.data.copywriting,
        //   imgUrl: res.data.imgUrl
        // })
        wx.showLoading({
          title: '绘制分享图片中',
          mask: true
        })
        // console.log(this.data.copywriting, this.data.gdInfo.goodImg)
        console.log(this.data.gdInfo);
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
                left: 99,
                width: 35,
                height: 35
              },

              {
                type: 'text',
                content: app.globalData.wechatnickName,
                fontSize: 16,
                color: '#402D16',
                textAlign: 'left',
                top: 20,
                left: 146,
                bolder: true
              },
              // 中间的图    this.data.imgUrl
              {
                type: 'image',
                url: this.data.gdInfo.goodImg,
                top: 60,
                left: 32.5,
                width: 310,
                height: 350
              },
              //价格 Number(this.data.gdInfo.price).toFixed(2)
              {
                type: 'text',
                content: "￥" + Number(this.data.gdInfo.price).toFixed(2),
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
              // 二维码图片res.data   "https://file.maiyatown.com/images/v1.2/home_share_img3.png"
              {
                type: 'image',
                url: res.data,
                top: 420,
                left: 250,
                width: 88,
                height: 88
              },
              // 矩形
              // {
              //   type: 'rect',
              //   background: 'red',
              //   top: 425,
              //   left: 170,
              //   width: 45,
              //   height: 20
              // },
              // 拼团状态
              // {
              //   type: 'text',
              //   content: "拼团中",
              //   fontSize: 12,
              //   color: '#FFFFFF',
              //   textAlign: 'left',
              //   top: 427,
              //   left: 175,
              //   lineHeight: 20,
              //   MaxLineNumber: 2,
              //   breakWord: true,
              //   width: 155,
              //   bolder: true
              // },
              // 动态生成的字   
              {
                type: 'text',
                content: this.data.gdInfo.title,
                fontSize: 15,
                color: '#101010',
                textAlign: 'left',
                top: 460,
                left: 32.5,
                lineHeight: 20,
                MaxLineNumber: 2,
                breakWord: true,
                width: 172,
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
        shareImage: tempFilePath,
        // share1: 
      })
       console.log(this.data.shareImage);
    }
    
  },

  //跳转到商品拼团列表
  goGroupList(){
    //要带上商品信息 价格 主图等
    wx.navigateTo({
      url: '/pages/groupList/groupList?activityId=' + this.data.activityId + '&goodsId=' + this.data.goodsId +'&goodImg='+
        this.data.gdInfo.goodImg + '&price=' + this.data.gdInfo.price + '&title=' + this.data.gdInfo.title
    })
  },
  //没有拼团弹出提示
  goGroupListTip() {
    Dialog.alert({
      message: '来晚了，前面的拼团都满了，来自己开团！'
    }).then(() => {
      // on close
    });
  },
  //预约拼团提醒
  openTipsFun(){
    let reqObj = {
      url: '/api/goods/group/appoint',
      data: {
        activityId : this.data.activityId,
        goodsId : this.data.goodsId
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
        //预约成功
        //开启预约提醒
        util.groupPlayFun()
        //成功数据
        this.setData({
          openTips: 1
        })
        Dialog.confirm({
          title: '设置成功',
          message: '将在3分钟前提醒，既然喜欢， 就分享给好友吧！',
          confirmButtonText: '立即分享',
        }).then(() => {
          // on confirm
          this.eventDraw1();
        }).catch(() => {
          // on cancel
        });
      }
    })
  },
  //商品确认按钮
  selectSizeSuccess(){
    let _nowtimes = new Date().getTime();
    if (_nowtimes-this.data.nowTimes>1000){
      this.setData({
        nowTimes: _nowtimes
      })
    }else{
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
      this.setData({
        skuId: this.data.activeSkuItem.id,
      },()=>{
        this.spellGroup();
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
  //修改商品数量
  onChange(event){
    this.setData({
      groupNumber: event.detail
    })
  },
  //点击发起拼团
  spellClick1() {
    this.setData({
      groupId: ''
    }, () => {
      this.spellClick();
    })
  },
  //参与拼团
  spellClick(){
    //未绑定手机号
    let userInfo = wx.getStorageSync('myxzUserInfo');
    if (!userInfo.mobile) {
      Dialog.confirm({
        title: "请先绑定手机号",
        message: '      ',
        zIndex: 102
      }).then(() => {
        // on confirm
        wx.navigateTo({
          url: '/pages/bindPhone/bindPhone?from=groupDetails'
        })
      }).catch(() => {
        // on cancel
      });
      return false;
    }
    this.setData({
      actionSheetShow: true
    })
    
  },
  //发起拼团 和参加拼团
  spellGroup(){
    this.setData({
      actionSheetShow:false
    })
    let reqObj = {
      url: '/api/goods/group/buying',
      data: {
        activityId: this.data.activityId,
        goodsId: this.data.goodsId,
        goodsNumber: this.data.groupNumber,
        groupId: this.data.groupId||'',
        groupOperationType: this.data.groupId ? 2 : 1, //拼团操作类型 1：发起拼团 2：参团
        groupType: this.data.gdActivityInfo.groupType,
        skuId: this.data.skuId
      }
    }
    util.RequestPost(reqObj, null, (res, message) => {
      if (res.resCode == '0000') {
        //成功数据 传入本地
        app.globalData.goodsDetails = res;
        wx.navigateTo({
          url: '/pages/confirmOrder/confirmOrder?activityId=' + this.data.activityId + '&goodId=' + this.data.goodId + '&groupOrder=1'
        })
      }else{
        Dialog.alert({
          message: res.resDesc
        }).then(() => {
          // on close
        });
      }
    })
  },
  //倒计时方法
  countTime(newDate, oldDate) {
    //获取当前时间
    var olddate = new Date(oldDate);
    var old = olddate.getTime();
    //设置截止时间

    var endDate = new Date(newDate);
    var end = endDate.getTime();

    //时间差
    var leftTime = end - old;
    if (leftTime < 0) {
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
      hh = _hh < 10 ? '0' + _hh : _hh;
    }
    this.setData({
      hhhh: hh,
      mmmm: m,
      ssss: s
    })
  },
  //时间差转成时分秒
  countTime1(timeDiff) {
    var leftTime = timeDiff;
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
      hh = _hh < 10 ? '0' + _hh : _hh;
    }
    return '' + hh + ':' + m + ':' + s ;
  },
  //毫秒转换成
  formatDateTime(theDate) {
    var _hour = theDate.getHours();
    var _minute = theDate.getMinutes();
    var _second = theDate.getSeconds();
    var _year = theDate.getFullYear()
    var _month = theDate.getMonth();
    var _date = theDate.getDate();
    if (_hour < 10) {
      _hour = "0" + _hour;
    }
    if (_minute < 10) {
      _minute = "0" + _minute;
    }
    if (_second < 10) {
      _second = "0" + _second
    }
    _month = _month + 1;
    if (_month < 10) {
      _month = "0" + _month;
    }
    if (_date < 10) {
      _date = "0" + _date
    }
    return [_month + "月" + _date + "日" + _hour + "点", _hour + "点", _minute + "分"];
  },
  //关闭下拉框
  onClose() {
    this.setData({
      actionSheetShow: false,
    });
  },
  //点击菜单切换
  navClick(event){
    let navIndex = event.currentTarget.dataset.types;
    this.setData({
      tapActive: navIndex,
      showVideo:false
    },()=>{
      if (navIndex==3){
        this.setData({
          toView: 'wxparse'
        })
      }else{
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
  //获取商品描述
  getGoodDesc(goodId) {
    let _this=this;
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
          WxParse.wxParse('article', 'html', res.data.description, _this, 0);
        }
      }
    })
  },
  //轮播图切换 修改当前是几号图
  swiperChange(event){
    this.setData({
      swiperActive: event.detail.current
    })
  },
  //客服埋点
  mdClick() {
    util.mdFun(this, '点击客服', '');
  },
  //监听滚动事件
  scroll(event) {
    this.setData({
      toTop: event.detail.scrollTop > 1000 ? true : false
    })
  },
  //去顶部的方法
  toTopFun() {
    this.setData({
      scrollTop: 0
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
          this.data.skuList['' + _haveChangedId].price = Number(this.data.skuList['' + _haveChangedId].price).toFixed(2);
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
  //判断用户是否参与过活动
  userHavePlay() {
    let that = this
    let upUserId = app.globalData.userIdPro
    let reqObj = {
      url: '/api/user/userRedActivityIsNo'
    }
    util.RequestPost(reqObj, null, (res, message) => {
      console.log("是否参加", res)
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
          that.setData({
            newUser: true
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
            isHelp: true
          })
        } else {
          that.setData({
            isHelp: false
          })
        }
        //未参加
        if (res.data.userWhiteList == 2 && res.data.isTake != 1 && res.data.isTotalDismantle != 1) {
          that.setData({
            isHelpRed: false,
            helpRedShow: true,
            redUp: res.data.redUp
          })
        }

        if (res.data.newUser == 1 && res.data.isTake != 1 && res.data.isTotalDismantle != 1) {
          that.setData({
            isHelpRed: false,
            helpRedShow: true,
            redUp: res.data.redUp
          })
        }
        if (res.data.isEnd == 1) {
          that.setData({
            isEnd: true
          })
        }
        if (res.data.isDismantle == 1 && res.data.isTotalDismantle != 1) {
          that.setData({
            helpRedShow: true,
            redUp: res.data.redUp,
            isDismantle: true
          })
        }
        if (res.data.isTotalDismantle == 1) {
          that.setData({
            redTotalOver: true
          })
        }
      }
    })
  },
  //打开帮拆红包
  openHelpRed() {
    //发送请求
    let that = this
    let reqObj = {
      url: '/api/activity/userRedActivity'
    }
    util.RequestPost(reqObj, null, (res, message) => {
      console.log(res, message)
      if (message) {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              that.setData({
                helpRedShow: false,
                helpRedOnShow: false
              })
              that.userHavePlay()
            }, 2000)
          }
        })
      }
      if (res.resCode == '0000') {
        //成功且获取到金额数据
        if (res.data.isHelp == 0) {
          if (res.data.isPrize == 1) {
            this.setData({
              helpRedShow: false,
              helpRedOnShow: false
            })
            wx.navigateTo({
              url: '/pages/helpRed/helpRed'
            })
          }
          console.log("接口返回是否帮拆0", res.data.isHelp)
          this.setData({
            isHelpRed: false,
            inviteeValue: Number(res.data.inviteeValue).toFixed(2),
            inviterValue: Number(res.data.inviterValue).toFixed(2),
            redUp: res.data.redUp,
            isTake: true
          })
        } else {
          console.log("接口返回是否帮拆1", res.data.isHelp)
          this.setData({
            isHelpRed: true,
            helpRedOnShow: true,
            inviteeValue: Number(res.data.inviteeValue).toFixed(2),
            inviterValue: Number(res.data.inviterValue).toFixed(2),
            redUp: res.data.redUp,
            strDouble: res.data.strDouble,
            isTake: true
          })
        }
        that.setData({
          helpRedOnShow: true
        })
      }
    })
  },
  //跳转红包活动
  goRedPlay() {
    let { newUser, isTake } = this.data
    let that = this
    if (newUser && !isTake) {
      that.setData({
        helpRedShow: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/helpRed/helpRed',
      })
      that.setData({
        helpRedShow: false,
        helpRedOnShow: false
      })
    }

  },
  //帮拆红包关闭
  helpRedClose() {
    this.setData({
      helpRedShow: false,
      helpRedOnShow: false
    })
  },
  goHome() {
    app.globalData.isFromDetail1 = true
    wx.reLaunch({
      url: '/pages/home/home',
    })
  }
})