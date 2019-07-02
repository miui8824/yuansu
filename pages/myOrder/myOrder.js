// pages/myorder/myorder.js
const app = getApp();
var util = require('../../utils/util.js');
var apiUrl = require('../../static/js/url.js');
import Toast from '../../dist/toast/toast';
var apiUrl = require('../../static/js/url.js');
import dialogShare from '../../dist/dialog/dialogShare';
import Dialog from '../../dist/dialog/dialog';
import dialogDraw from '../../dist/dialog/dialogDraw';
Page({
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title: "我的订单",
    painting: {}, //canvas画图的变量
    shareImage: '',//canvas画图的变量
    navActive: 0,
    showNoOrder:false,
    orderList: [],
    navNames: ['全部', '待付款', '待收货', '已完成', '已取消'],
    scrollTop:0,
    goTopShow:false,
    page:1,
    pageSize:8,
    orderType:999,
    orderActiveType:999,
    isShowDraw:false,
    loadMoreType:true, //全部加载完 
    loadMoreTip:false,//加载数据更多状态
    height:0, //动态高度
    activityId:"",
    goodsId:"",
    img:"",
    img_word:"",
    groupBuyingId:"",
    newText:'',//新的文案
    userId: null,
    //红包邀请人Id
    // upUserId: null,
    erweima:""
  },

  // canvas画图分享的发放 （保存图片，绘制分享图）
  eventDraw(data) {
    console.log(data);
    this.setData({
      goodsId: data.currentTarget.dataset.item.orderGoods[0].goodId,
      activityId: data.currentTarget.dataset.item.orderGoods[0].activityId,
      img: data.currentTarget.dataset.item.orderGoods[0].goodImg,
      img_word: data.currentTarget.dataset.item.orderGoods[0].goodName,
      groupBuyingId: data.currentTarget.dataset.item.groupBuyingId,
      price: data.currentTarget.dataset.item.orderGoods[0].goodPrices,
      GetImage: true,
      shareImage: ""
    })
    console.log(this.data.activityId, this.data.goodsId)
    //  this.data.goodsId   this.data.activityId  this.data.groupBuyingId this.data.userId 
    // 用户id #商品id#活动id#拼团id
    let userid = parseInt(this.data.userId).toString(32)
    let goodid = parseInt(this.data.goodsId ).toString(32)
    let activityid = parseInt(this.data.activityId).toString(32)
    let ptid = parseInt(this.data.groupBuyingId).toString(32)
    let reqObj = {
      url: '/api/generate/code',
      data: {
        "autoColor": true,
        "page": "pages/myRegimentDetails1/myRegimentDetails1",
        "scene": userid + "#" + goodid + '#' + activityid + '#' + ptid,
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
      
        // console.log(res.data.copywriting, res.data.imgUrl, this.data.img);
        //成功数据
        // wx.showToast({
        //   title: '添加成功!',
        //   icon: 'success',
        //   duration: 1500
        // })
        // this.setData({
        //   copywriting: res.data.copywriting,
        //   imgUrl: res.data.imgUrl
        // })
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
          erweima: res.data,
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
                width: 450,
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
              // 中间的图 this.data.imgUrl
              {
                type: 'image',
                url: this.data.img,
                top: 60,
                left: 32.5,
                width: 310,
                height: 350
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
              // 商品价格  .toFixed(2)
              {
                type: 'text',
                content: "￥" + Number(this.data.price).toFixed(2),
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
              // 二维码图片"https://file.maiyatown.com/images/v1.2/home_share_img3.png"
              {
                type: 'image',
                url: res.data,
                top: 420,
                left: 250,
                width: 88,
                height: 88
              },
              // 动态生成的字
              {
                type: 'text',
                content: this.data.img_word,
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
    var that = this
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


  onShow: function (options) {
    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, '', '');
    let pages = getCurrentPages()
    console.log(pages)
    //..userId
    util.getNowUserId((userId) => {
      this.setData({
        userId
      })
    })
    wx.setNavigationBarTitle({
      title: "我的订单"//页面标题为路由参数  
    })
    // console.log(wx.getStorageSync('myxzToken'));
    // console.log(hidden);
    console.log(this.data.orderType, this.data.page);
    if (this.data.orderType == 999) {
      this.setData({ page: this.data.page }),this.getOrderList(1);
    } else {
      this.setData({ page: this.data.page }),this.getOtherList(1);
    }
  },
  onHide() {
    this.setData({
      GetImage: false
    })
  },
  onLoad(option){
    let _this=this;
    //0 - 待支付 1 - 待收货 3 - 已完成 4 - 已取消
    console.log(option)
    if (option.navActive == 0) {
      this.setData({ orderType: 0, navActive: 1 }, function () {
        this.getOtherList();
      })
    } else if (option.navActive == 1) {
      this.setData({ orderType: 1, navActive: 2 }, function () {
        this.setData({ page: 1 }), this.getOtherList();
      })
    } else {
      this.setData({ page: 1 }), this.getOrderList();
    }
    //计算下拉框的 高度
    wx.getSystemInfo({
      success:(res)=> {
        console.log(res)
        wx.createSelectorQuery().select('.van_tabs_me').boundingClientRect(function (rect) {
          console.log(rect)
          var is_1_height = Number(rect.height) // 节点的宽度
          _this.setData({
            height: Number(res.windowHeight) - is_1_height
          });
        }).exec();
      }
    });
  },

  onShareAppMessage(data) {
    // this.setData({
    //   GetImage: false
    // })
    console.log(data)
    console.log(this.data.activityId, this.data.goodsId, this.data.groupBuyingId)
    // let numberText = Math.floor(Math.random() * 5);
    // let reqObj = {
    //   url: '/api/sharing/addShareLog',
    //   data: {
    //     type: 2,
    //     shareUserId: this.data.userId
    //   }
    // }
    // util.RequestPost(reqObj, null, (res, message) => {
    //   if (res.resCode == '0000') {
    //     //成功数据
    //   }
    // })
    //..要加个 用户ID
    // img: "",
    // img_word: ""  this.data.goodsId   this.data.activityId  this.data.groupBuyingId this.data.userId 

    let out_show = true;
    return {
      title: this.data.img_word,
      path: '/pages/myRegimentDetails1/myRegimentDetails1?id=' + this.data.goodsId + '&activityId=' + this.data.activityId + '&groupBuyingId=' + this.data.groupBuyingId + '&order_show=true' +'&userId='+this.data.userId  ,
      imageUrl: this.data.img
    }
  },
  //获取新的文案
  getNewText(type) {
    let _type = type == 3 ? 1 : 0;
    let reqObj = {
      url: '/api/config/getOrderConfirmMessage?type=' + _type,
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
        this.setData({
          newText: res.data
        }, () => {
          //生成弹框
          if (type == 3) {
            this.dialogDraw('去了解');
          } else {
            this.dialogDraw();
          }
          this.setData({
            isShowDraw: true
          })
        })
      }
    })
  },
  goHome(){
    this.onUnload = function () { };
    wx.switchTab({ url: '/pages/home/home' });

  },


  tabChange(event){  //点击 切换 tab栏
    //切换tab 初始化所有数据
    console.log(event);
    this.setData({ 
      navActive: event.detail.index,
      page:1,
      orderList:[],
      loadMoreType:true,
      showNoOrder:false
    })
    //0 - 待支付 1 - 待收货 3 - 已完成 4 - 已取消
    switch (event.detail.index){
      case 0:
        this.getOrderList();
        this.setData({ orderType: 999 })
        break;
        
      case 1:
        this.setData({ orderType:0})
        this.getOtherList();
        break;  
      case 2:
        this.setData({ orderType: 1 })
        this.getOtherList();
        break;  
      case 3:
        this.setData({ orderType: 3 })
        this.getOtherList();
        break;  
      case 4:
        this.setData({ orderType: 4 })
        this.getOtherList();
        break;  
    }
  },

  loadMore(){
    if(!this.data.loadMoreType){
      return false;
    }
    console.log(this.data.page)
    this.setData({ page: this.data.page + 1, loadMoreTip:true});
    if(this.data.navActive==0){
      console.log(this.data.page);
      this.getOrderList(this.data.page);
    }else{
      this.getOtherList(this.data.page);
    }
  },
  //确认收货
  Confirm_receipt(option) {
    Dialog.confirm({
      title: "请确认您已经收到货了哦，订单交易完成。如有售后问题再申请售后",
      message: '  '
    }).then(() => {
      console.log(option);
      console.log(option.currentTarget);
      console.log(option.currentTarget.dataset.orderid);
      let that = this
      let token = wx.getStorageSync('myxzToken');
      let url = apiUrl.API_URL + '/api/myOrder/confirmReceipt?subOrderId=' + option.currentTarget.dataset.orderid;
      if (token) {
        // let header = Object.assign({ 'auth-token': token }, headerData);
        wx.request({
          url: url,
          method: "POST",
          data: {}, // 仅为示例，并非真实的接口地址
          header: {
            'auth-token': token
          },
          success(res) {
            console.log(res);
            if (res.data.resCode == '0000') {
              Toast.success('收货成功');

              if (that.data.orderType == 999) {
                that.setData({ page: 1 }, that.getOrderList(1));
              } else {
                that.setData({ page: 1 }, that.getOtherList(1));
              }
              // that.setData({ page: 1 }, that.getOrderList);
              console.log('成功')
            } else {
              console.log('失败')
              Toast.fail(res.data.resDesc);
            }

          }
        })
      } else {
        console.log('跳转授权页面');
        wx.navigateTo({
          url: "/pages/init/init"
        })
      }

    }).catch(() => {
      // on cancel
    });


  },
  
  //得到全部订单列表
  getOrderList(pageNumber){
    console.log(this.data.pageNumber, this.data.page);
    let _this=this;
    let reqObj = {
      url: '/api/myOrder/findAllOrderByUser',
      data: { iPage: this.data.page, pageSize:this.data.pageSize }
    }
    util.RequestGet(reqObj, '',(res,message)=> {
      console.log(message, res);
      if (message) {
        wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
      }
      for(let i of res.resultList){
        i.expAmt = Number(i.expAmt).toFixed(2);
        for(let j of i.orderGoods){
          j.goodPrices = Number(j.goodPrices).toFixed(2);
        }
      }
      this.setData({loadMoreTip: false });
      //第一次发请求
      if (_this.data.page == 1) {
        if (res.resultList.length == 0) {
          _this.setData({ showNoOrder: true });
          return false;
        } else {
          _this.setData({ orderList: res.resultList })
        }
      } else {
        if (res.resultList.length == 0) {
          //保持数据不变
          //到底部了
          _this.setData({ loadMoreType: false });
        } else {
          let allData = _this.data.orderList.concat(res.resultList);
          _this.setData({ orderList: allData });
        }
      }
    })
  },
  //得到其他状态的订单
  getOtherList(pageNumber) {
    let _this=this;
    let reqObj = {
      url: '/api/myOrder/findOrderByUser',
      data: { iPage:this.data.page, pageSize: this.data.pageSize, status:this.data.orderType }
    }
    util.RequestGet(reqObj, '', (res, message)=> {
      if (message) {
        wx.showToast({             title: res.resDesc,             icon: 'none',             duration: 1500           });
      }
      this.setData({ loadMoreTip: false });
      //第一次发请求
      if(_this.data.page==1){
        if (res.resultList.length == 0){
          _this.setData({ showNoOrder: true });
          return false;
        }else{
          for (let i of res.resultList) {
            i.expAmt = Number(i.expAmt).toFixed(2);
            for (let j of i.orderGoods) {
              j.goodPrices = Number(j.goodPrices).toFixed(2);
            }
          }
          _this.setData({ orderList: res.resultList })
        }
      }else{
        if (res.resultList.length == 0) {
          //保持数据不变
          //到底部了
          _this.setData({ loadMoreType: false });
        } else {
          for (let i of res.resultList) {
            i.expAmt = Number(i.expAmt).toFixed(2);
            for (let j of i.orderGoods) {
              j.goodPrices = Number(j.goodPrices).toFixed(2);
            }
          }
          let allData = _this.data.orderList.concat(res.resultList);
          // for(let i of allData){
            // let fixAmt = 0.00
            // fixAmt = this.toFixed(i.expAmt)
            // i.expAmt=fixAmt
            // console.log(i.expAmt)
          // }
          _this.setData({ orderList: allData });
        }
      }
    })
  },
  //订单操作
  delOrder(event){
    Dialog.confirm({
      title:"确认要删除该订单吗？",
      message: '  '
    }).then(() => {
      let reqObj = {
        url: '/api/myOrder/delOrder',
        data: {
          orderId: event.currentTarget.dataset.orderid,
          subOrderId: event.currentTarget.dataset.suborderid || '',
          status: event.currentTarget.dataset.status
        }
      }
      util.RequestPostHeader(reqObj, null, (res, message) => {
        if (message) {
          wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
          return false
        }else{
          if (this.data.orderType == 999) {
            this.setData({ page: 1 }), this.getOrderList(1);
          } else {
            this.setData({ page: 1 }), this.getOtherList(1);
          }
        }

      })

    }).catch(() => {
      // on cancel
    });

  },


  //查看物流
  View_Logistics(event){
    console.log(event);
    // console.log(event.currentTarget.dataset.orderid.orderNo);
    let id = event.currentTarget.dataset.orderid.id
    let subId = event.currentTarget.dataset.orderid.subId
    let status = event.currentTarget.dataset.orderid.orderStatus
    wx.navigateTo({
      url: '/pages/logisticsDetail/logisticsDetail?orderNumber=' + subId
    })
  },
  //申请售后
  apply_sale(event){
    console.log(event)
    if (event.currentTarget.dataset.orderid.crossBorder==1){
      wx.showToast({ title: "亲，因为是跨境商品，售后问题请咨询在线客服", icon: 'none', duration: 1500 });
      return false;
    }else{
      console.log(event.currentTarget.dataset.orderid.orderNo)
      let orderGoods = event.currentTarget.dataset.orderid.orderGoods;
      if (orderGoods.length == 0) {
        //没有要退款的商品
        wx.showToast({ title: "没有要退款的商品", icon: 'none', duration: 1500 });
      } else {
        wx.navigateTo({
          // url: '/pages/afterSale_listEnter/afterSale_listEnter?orderNo=' + event.currentTarget.dataset.orderid.orderNo + '&orderNum=' + event.currentTarget.dataset.orderid.orderNum

          url: '/pages/afterSale_listEnter/afterSale_listEnter?orderNo=' + event.currentTarget.dataset.orderid.orderNo + '&orderNum=' + event.currentTarget.dataset.orderid.orderNum + '&isSubOrder=' + event.currentTarget.dataset.orderid.isSubOrder + '&orderStatus=' + event.currentTarget.dataset.orderid.orderStatus + '&orderType=' + event.currentTarget.dataset.orderid.orderType

        })
      }

    }

  },
  sale_xq(event){
    console.log(event)
    wx.navigateTo({
      // +'status'+

      url: '/pages/afterSale_list/afterSale_list?navActive=' + event.currentTarget.dataset.orderid.id + '&orderNo=' + event.currentTarget.dataset.orderid.orderNo
    //   url: '/pages/Refund_details/Refund_details?id=' +event.currentTarget.dataset.orderid.id
    })
  },
  //取消订单
  offOrder(event){
      let reqObj = {
        url: '/api/myOrder/canelOrder',
        data: {
          orderId: event.currentTarget.dataset.orderid,
          cancalReason: ''
        }
      }
      util.RequestPostHeader(reqObj, null, (res, message) => {
        if (message) {
          wx.showToast({title: res.resDesc,icon: 'none',duration: 1500});
        }
        if (this.data.orderType == 999) {
          this.setData({ page: 1 }, this.getOrderList(1));
        } else {
          this.setData({ page: 1 }, this.getOtherList(1));
        }
      })
   
    
  },
  //立即支付
  right_pay(event){
    //得到支付的商品类型
    let item = event.currentTarget.dataset.orderid;
    if (item && item.orderType){
      this.setData({
        orderActiveType: item.orderType
      })
    }
var _this=this;
    let reqObj = {
      url: '/api/order/payOrder',
      data: {
        orderMainId: event.currentTarget.dataset.orderid.id,
        payPlatform: 1,
       
      }
    }
    util.RequestPost(reqObj, null, (res, message) => {
      var flag=res.flage;
      if (message && res.resCode != '30041' && res.resCode != '30040') {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 1500
        })
      }
      if (res.resCode == '30041') {
        Dialog.alert({
          message: '很抱歉，您正在参加“一起拼”，新人专享特惠价只开放给未购买过的新人享受',
          confirmButtonText: "知道了，返回首页",
          zIndex: 102
        }).then(() => {
          this.goHome()
        });
      }

      if (res.resCode == '30040') {
        Dialog.alert({
          message: '很抱歉，您已经购物过1次啦，不算新人哦。新人专享特惠价只开放给未购买过的新人享受。',
          confirmButtonText: "知道了，返回首页",
          zIndex: 102
        }).then(() => {
          this.goHome()
        });
      }

      if (res.resCode == '0000') {
        let data = res.data;
        if (!data) {
          if (flag == '1') {
            _this.getNewText();
          } else if (flag == '3') {
            _this.getNewText(3);
          }else{
          wx.redirectTo({
            url: '/pages/myOrder/myOrder?navActive=1' //立马跳转到 购物车
          })};
          return false;
        }
        //成功数据
        wx.requestPayment({
          timeStamp: data.timestamp || '',
          nonceStr: data.noncestr || '',
          package: data.packages || '',
          signType: data.signType || '',
          paySign: data.paySign || '',
          success: function (res) {
            if (flag == '1') {
              _this.getNewText();
            } else if (flag == '3') {
              _this.getNewText(3);
            } else {
            //直接跳等待发货页面
            wx.redirectTo({
              url: '/pages/myOrder/myOrder?navActive=999'
            })}
          },
          fail: function (res) {
            //直接跳等待发货页面
            // wx.redirectTo({
            //   url: '/pages/myOrder/myOrder?navActive=0'
            // })
          }
        })
      }
    })
  },
  dialogDraw(ButtonText) {
    dialogDraw.confirm({
      // title:'',
      message: this.data.newText,
      confirmButtonText: ButtonText ? "去了解" : "去抽奖"
    })
  },
  onGoDraw() {
    this.onUnload = function () { };
    wx.navigateTo({
      url: "/pages/orderDraw/orderDraw"
    })
  },
  onGoOrder() {
    if (this.data.orderActiveType && this.data.orderActiveType == 5) {
      wx.navigateTo({
        url: '/pages/myOrder/myOrder?navActive=999'
      })
    } else {
      wx.navigateTo({
        url: '/pages/myOrder/myOrder?navActive=1'
      })
    }
  },
  //跳转订单详情
  goOrderAbout(event){
    //结果的状态
    let status;
    //所有数据
    console.log(event);
    let dataObj = event.currentTarget.dataset.item;
    let id = dataObj.id;
    let subId = dataObj.subId;
    let orderNum = dataObj.orderNum
    //是在全部页面点击的详情
    if(this.data.orderType==999){
      let isSubOrder = dataObj.isSubOrder;
      let orderStatus = dataObj.orderStatus;      
      console.log(orderStatus);
      // <!--订单状态 2 - 0 - 待支付 1 - 2 - 待收货 1 - 3 - 已完成 2 - 2 - 已取消  1-1 待发货   1 - 4 交易关闭-- >
      let theStatus=''+isSubOrder+'-'+orderStatus;
      console.log(theStatus);
      //0 - 待支付 1 - 待收货 3 - 已完成 4 - 已取消  5 待发货 6     7交易关闭（客服关闭）8待分享
      switch (theStatus) {
        case '2-0':
          status=0;
          break;
        case '1-2':
          status = 1;
          break;
        case '1-3':
          status = 3;
          break;
        case '2-2':
          status = 4;
          break;
          case '1-1':
          status = 5;
          break;
          case '1-4':
          status = 6;
          case '1-5':
          status = 7;
          case '1-6':
          status = 8;
      }
    }else{
      status = this.data.orderType;
    }
    console.log(id,status,subId);
    // console.log(this.data.orderNo)
    // console.log(this.data.orderNo, this.data.orderNum);
    wx.navigateTo({
      url: '/pages/orderAbout/orderAbout?orderId=' + id + '&status=' + status + '&subOrderId=' + subId + '&orderType=' + this.data.orderType + '&orderNum=' + orderNum 
    })
  },

  // 保留两位小数
  toFixed(num, d){
    console.log("dsa")
    if(Math.round(num) === num){
    var f = Math.round(num * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
    }else {
      num *= Math.pow(10, d);
      num = Math.round(num);
      return num / (Math.pow(10, d))
    }
   
  },
  goHome() {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  }

})