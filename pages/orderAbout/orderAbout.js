// pages/orderabout/orderabout.js
// import Dialog from '../../dist/dialog/dialog';
var util = require('../../utils/util.js');
var apiUrl = require('../../static/js/url.js');
const app = getApp();
var util = require('../../utils/util.js');
import Toast from '../../dist/toast/toast';
var apiUrl = require('../../static/js/url.js');
import dialogShare from '../../dist/dialog/dialogShare';
import Dialog from '../../dist/dialog/dialog';
Page({
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    time: "",
    usedTime_zt: '',
    usedTime1: "",
    // usedTime1:"",
    baoguo_sta: "",//进入包裹的详情页
    crossBorder: "",
    dei: "",
    deliveryTime: "",
    isAllRefund: "",
    isRefund: "",
    Str: "",
    dd_time: "",//
    dd_time1: "",
    baoguo_num: "",
    totalTax: "",
    title: '订单详情',
    painting: {}, //canvas画图的变量
    shareImage: '',//canvas画图的变量
    mingxi: true,
    all_data: "",
    orderId: '',//主订单
    subOrderId: '',//子订单
    status: '',//订单状态
    timeLeft: "",//剩余时间 （待收货 待付款）
    resultList: [],//订单数据
    // good_status:''
    orderNum: "",//主订单编号
    orderNo: "",
    totalAmout: "",//订单 金额
    expAmt: "",//应付实付金额
    disAmt: "",//优惠金额
    orderFreight: "",//运费
    goodAttrDese: "",
    rebateAmt: "",
    shareDis: "",
    cashAmt: "",
    payPlatform: "",
    orderTime: "",
    payTime: "",
    send_goodTime: false,//控制显示 发货时间
    send_goodTimeText: "",
    receivePhone: "",
    receiveAddress: "",
    receiver: "",
    order_state: "", //0 - 待支付 1 - 待收货 3 - 已完成 4 - 已取消
    order_stu: "", //订单要显示的 状态
    creat_time: true,
    querensh: true,
    peisong: "true",
    shouhou_show: "",
    dingdansx: "",
    isSubOrder: "",
    orderStatus: "",
    deliveryTime: "",
    pay_sta: true,//实付还是 代付
    isRefund: "",
    subId: "",
    orderType: "",//返回订单主页的时候用于判断
    isshouhou: "",
    intervalControll:true,
    items:'',//拼团人员
    orderType:"",
    groupDisAmt:"",
    time: "",
    day: "",//天
    hour: "",//小时
    minute: "",//分钟
    second: "",//秒数
    pintuan_js: '',//拼团结束相差的时间戳
    usercount:"", //拼团人数
    userId:""
  },

  // canvas画图分享的发放 （保存图片，绘制分享图）
  eventDraw(data) {
    console.log(data);
    this.setData({
      goodsId: data.currentTarget.dataset.item.orderGoods[0].goodId,
      activityId: data.currentTarget.dataset.item.orderGoods[0].activityId,
      img: data.currentTarget.dataset.item.orderGoods[0].goodImg,
      img_word: data.currentTarget.dataset.item.orderGoods[0].goodName,
      groupBuyingId: data.currentTarget.dataset.item.groupBuying.id,
      price: data.currentTarget.dataset.item.orderGoods[0].goodPrices,
      GetImage: true,
      shareImage: ""
    })
    //  this.data.userId this.data.all_data.orderGoods[0].goodId
// this.data.all_data.orderGoods[0].activityId  this.data.all_data.groupBuying.id
    console.log(this.data.activityId, this.data.goodsId)
    let userid = parseInt(this.data.userId).toString(32)
    let goodid = parseInt(this.data.all_data.orderGoods[0].goodId).toString(32)
    let activityid = parseInt(this.data.all_data.orderGoods[0].activityId).toString(32)
    let ptid = parseInt(this.data.all_data.groupBuying.id).toString(32)
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
        // console.log(res.data.copywriting, res.data.imgUrl);
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
              // 中间的图 this.data.imgUrl
              {
                type: 'image',
                url: this.data.img,
                top: 60,
                left: 32.5,
                width: 310,
                height: 350
              },
              //价格 .toFixed(2)
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
              // 二维码图片
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



  onShow() {
    console.log(this.data.orderId, this.data.status, this.data.subOrderId);
    // let option = {
    //   orderId: this.data.orderId,
    //   status: this.data.status,
    //   subOrderId: this.data.subOrderId}
    // this.onLoad(option);
    util.getNowUserId((userId) => {
      this.setData({
        userId
      })
    })
    this.onReady();
    console.log('diaouomg')
    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, '', '');
    this.setData({
      intervalControll:true
    })
  },
  onShareAppMessage(data) {
    // this.setData({
    //   GetImage: false
    // })
    console.log(this.data.all_data.groupBuying.id)   //拼团id
    console.log(this.data.all_data.orderGoods[0].goodId)  //商品id
    console.log(this.data.all_data.orderGoods[0].activityId)
    let out_show = true
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
    //   img_word: ""
//  this.data.userId this.data.all_data.orderGoods[0].goodId
// this.data.all_data.orderGoods[0].activityId  this.data.all_data.groupBuying.id
    return {
      title: this.data.all_data.orderGoods[0].goodName,
      path: '/pages/myRegimentDetails1/myRegimentDetails1?id=' + this.data.all_data.orderGoods[0].goodId + '&activityId=' + this.data.all_data.orderGoods[0].activityId + '&groupBuyingId=' + this.data.all_data.groupBuying.id + '&upUserId=' + this.data.upUserId + '&order_show=true' + '&userId=' + this.data.userId,
      imageUrl: this.data.all_data.orderGoods[0].goodImg
    }
  },
  // 根据时间戳计算相差时分秒
  diffTime(startDate, endDate) {
    var diff = this.data.pintuan_js;//时间差的毫秒数  

    //计算出相差天数  
    var days = Math.floor(diff / (24 * 3600 * 1000));

    //计算出小时数  
    var leave1 = diff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数  
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数  
    var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数  
    var minutes = Math.floor(leave2 / (60 * 1000));

    //计算相差秒数  
    var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数  
    var seconds = Math.round(leave3 / 1000);
    console.log(days, hours, minutes, seconds)
    var returnStr = seconds + "秒";
    if (minutes > 0) {
      returnStr = minutes + "分" + returnStr;
    }
    if (hours > 0) {
      returnStr = hours + "小时" + returnStr;
    }
    if (days > 0) {
      returnStr = days + "天" + returnStr;
    }
    return returnStr;
  },
  onLoad(option) {
    wx.setNavigationBarTitle({
      title: "订单详情"//页面标题为路由参数  
    })
    let _this = this;
    console.log(option);
    this.setData({
      orderId: option.orderId,
      status: option.status,
      subOrderId: option.subOrderId == "null" ? " " : option.subOrderId,
      orderType: option.orderType
    });
    if (this.data.status == 0) {
      this.setData({
        order_state: "等待付款",
        peisong: false
      })
    } else if (this.data.status == 1 || this.data.status == 2) {
      this.setData({
        order_state: "等待收货",
      })
    } else if (this.data.status == 3) {
      this.setData({
        order_state: "交易完成",
        querensh: false,

      })
    } else if (this.data.status == 4) {
      this.setData({
        order_state: "交易关闭",
        peisong: false,
        querensh: false
      })
    }else if(this.data.status==8){
      console.log('待分享');
      this.setData({
        peisong: false
      })
    }else if(this.data.status==7){
      console.log("客服关闭")
      this.setData({
        peisong: false,
        // order_state:"拼团中，待分享"
      })
    }
    // wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });//弹处框
    // 查询物流信息
    // this.time();
    // this.find_wuliu();
    // this.time()
  },
  diffTime(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();//时间差的毫秒数  

    //计算出相差天数  
    var days = Math.floor(diff / (24 * 3600 * 1000));

    //计算出小时数  
    var leave1 = diff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数  
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数  
    var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数  
    var minutes = Math.floor(leave2 / (60 * 1000));

    //计算相差秒数  
    var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数  
    var seconds = Math.round(leave3 / 1000);

    var returnStr = seconds + "秒";
    if (minutes > 0) {
      returnStr = minutes + "分" + returnStr;
    }
    if (hours > 0) {
      returnStr = hours + "小时" + returnStr;
    }
    if (days > 0) {
      returnStr = days + "天" + returnStr;
    }
    return returnStr;
  },
  // 查看物流 
  find_wuliu(subId) {
    console.log('daa')
    let reqObj = {
      url: '/api/orderLogistics/findMyOrderLogisticsInfo',
      data: {
        subId: subId
      }
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });

      }
      if (res.resCode == '0000') {
        // wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
        // console.log("wuliu")
        console.log(this.data.status)
        console.log(res.resultList.length);
        this.setData({
          baoguo_num: res.resultList.length
        })
        console.log(res.resultList.length)

      } else {
        wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
      }
    })
  },
  //去拼团订单订单详情
  Go_pintuanOrder(){
    wx.redirectTo({
      url: '/pages/myRegimentDetails/myRegimentDetails?groupBuyingId=' + this.data.all_data.groupBuying.id 
    })
  },
  //删除订单
  delOrder(event) {

    Dialog.confirm({
      message: '您将删除该订单，确定继续吗？'
    }).then(() => {
      let reqObj = {
        url: '/api/myOrder/delOrder',
        data: {
          orderId: this.data.orderId,
          subOrderId: this.data.subOrderId == "null" ? '' : this.data.subOrderId,
          status: this.data.status
        }
      }
      util.RequestPostHeader(reqObj, null, (res, message) => {
        if (message) {
          wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
        } else {
          if (res.resCode == '0000') {

            wx.navigateBack({
              delta: 1
            })

          } else {
            wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
          }
        }

      })

    }).catch(() => {
      // on cancel
    });

  },
  //取消订单
  offOrder() {

    // Dialog.confirm({
    //   title: '订单确认?',
    //   message: '确定取消订单？'
    // }).then(() => {

    // }).catch(() => {
    //   // on cancel
    // });
    let reqObj = {
      url: '/api/myOrder/canelOrder',
      data: {
        orderId: this.data.all_data.id,
        cancalReason: ''
      }
    }
    util.RequestPostHeader(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
      }
      wx.navigateTo({
        url: '/pages/myOrder/myOrder'
      })
    })
  },
  //申请售后
  apply_sale(event) {
    console.log(event)
    console.log(this.data.all_data)
    // console.log(event.currentTarget.dataset.orderid.orderNo)
    if (this.data.all_data.crossBorder == 1) {
      wx.showToast({ title: "亲，因为是跨境商品，售后问题请咨询在线客服", icon: 'none', duration: 1500 });
    } else {
      wx.navigateTo({
        url: '/pages/afterSale_listEnter/afterSale_listEnter?orderNo=' + this.data.all_data.orderNo + '&orderNum=' + this.data.all_data.orderNum + '&isSubOrder=' + this.data.all_data.isSubOrder + "&orderStatus=" + this.data.all_data.orderStatus + '&orderType=' + this.data.orderType
      })
    }

  },
  right_pay() {
    console.log(this.data.all_data);
    let reqObj = {
      url: '/api/order/payOrder',
      data: {
        orderMainId: this.data.all_data.id,
        payPlatform: 1,

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
          wx.navigateTo({
            url: '/pages/myOrder/myOrder?navActive=1' //立马跳转到 购物车
          })
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
            //直接跳等待发货页面
            wx.navigateTo({
              url: '/pages/myOrder/myOrder?navActive=1'
            })
          },
          fail: function (res) {
            //直接跳等待发货页面
            wx.navigateTo({
              url: '/pages/myOrder/myOrder?navActive=0'
            })
          }
        })
      }
    })
  },
  //售后详情
  shouhou_xq() {
    wx.navigateTo({
      url: '/pages/afterSale_list/afterSale_list?navActive=' + this.data.all_data.id + '&orderNo=' + this.data.all_data.orderNo
    })
  },
  //返回首页
  goHome() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  Confirm_receipt(option) {
    Dialog.confirm({
      title: "请确认您已经收到货了哦，订单交易完成。如有售后问题再申请售后",
      message: '  '
    }).then(() => {

      let that = this
      console.log(that.data.all_data.subId)
      // console.log(option.currentTarget.dataset.orderid.subId);
      // let that = this
      let token = wx.getStorageSync('myxzToken');
      let url = apiUrl.API_URL + '/api/myOrder/confirmReceipt?subOrderId=' + that.data.all_data.subId
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
              wx.navigateTo({
                url: "/pages/myOrder/myOrder"
              })
              // that.setData({ page: 1 }, that.getOrderList(1));
              console.log('成功')
            } else {
              console.log('失败')
              Toast.fail('收货失败');
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

  time_set() {
    var that = this
    let usedTime1 = that.data.usedTime1
    if(this.data.intervalControll){
      that.setData({
        intervalControll:false,
        time: setInterval(function () {

          if (usedTime1 <= 0) {
            clearInterval(that.data.time);
            that.setData({
              day:0,
              hour:0,
              minute:0,
              second:0
            })
            return false;
          } else {
            usedTime1 = usedTime1 - 1000;
            var day = parseInt(usedTime1 / 1000 / 3600 / 24);
            //获取还剩多少小时
            var hour = parseInt(usedTime1 / 1000 / 3600 % 24);
            //获取还剩多少分钟
            var minute = parseInt(usedTime1 / 1000 / 60 % 60);
            //获取还剩多少秒
            var second = usedTime1 / 1000 % 60;
            console.log('aaa', usedTime1)

            that.setData({
              day:day,
              hour:hour,
              minute: minute,
              second: second,
              dingdansx: '还剩' + hour + '时'+ minute + '分' + second + '秒',
              pintuansx: hour+':'+minute+':'+second
            })
          }
        }, 1000)
      })
    }
  },
  onReady() {
    this.order_look();
    // this.time_jian();
    // clearInterval(this.data.time);
  },
  onUnload() {
    clearInterval(this.data.time);
  },
  onHide() {
    clearInterval(this.data.time);
      this.setData({
        GetImage: false
      })

    
  },

  go_ordertracking() {
    if (this.data.baoguo_num == 0) {
      // wx.showToast({ title: "暂时没有物流信息", icon: 'none', duration: 1500 });
      this.setData({
        baoguo_sta: false
      })
      return false;
    } else {
      console.log(this.data.subOrderId);
      wx.navigateTo({
        url: '/pages/logisticsDetail/logisticsDetail?orderNumber=' + this.data.subOrderId
      })
    }

  },
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  // 订单发票查看详情
  go_fapiao:function(){
    
    wx.navigateTo({
      url: '/pages/invoice_details_zi/invoice_details_zi?id=' + this.data.all_data.id 
    })
  },
  formatDate(now) { //时间戳转化为具体的日期
    var year = now.getFullYear();
    var month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
    var date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    var hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
    var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
  },
  //时间戳计算
  // countDown(){
  //   // let that = this
  //     if(this.data.dd_time1 == 0){
  //       clearTimeout(timer);

  //     }
  //     var timer = setTimeout(function(){
  //       this.setData({
  //         dd_time1: dd_time1 - 1
  //       })
  //     },1000)
  // },



  //查看物流
  View_Logistics(event) {
    console.log(event);
    // console.log(event.currentTarget.dataset.orderid.orderNo);
    let id = event.currentTarget.dataset.orderid.id
    let subId = event.currentTarget.dataset.orderid.subId
    let status = event.currentTarget.dataset.orderid.orderStatus
    wx.navigateTo({
      url: '/pages/orderAbout/orderAbout?orderId=' + id + '&status=' + status + '&subOrderId=' + subId
    })
  },
  // 拼团取消订单的提示
  pintuanoff:function(){
    console.log('dadsad')
          Dialog.alert({
            message: ' 发起拼团24小时后，若未拼团成功将自动取消订单并退款！',
           confirmButtonText: "知道了"
      }).then(() => {
        // that.goHome()
      });
    // Toast('发起拼团24小时后，若未拼团成功将自动取消订单并退款')
  },
  order_look: function () {
    let that = this
    let token = wx.getStorageSync('myxzToken');
    console.log(token);
    let url = apiUrl.API_URL +'/api/myOrderInfo/orderInfo?orderId=' + this.data.orderId + '&status=0'
    if (token) {
      // let header = Object.assign({ 'auth-token': token }, headerData);
      wx.request({
        url: url,
        data: {
          subOrderId: that.data.subOrderId == "null" ? "" : that.data.subOrderId
        }, // 仅为示例，并非真实的接口地址
        header: {
          'auth-token': token
        },
        success(res) {
          console.log(res.data.data)
          //转化为 两位小数
          res.data.data.cashAmt = Number(res.data.data.cashAmt).toFixed(2);
          res.data.data.totalAmout = Number(res.data.data.totalAmout).toFixed(2);
          res.data.data.orderFreight = Number(res.data.data.orderFreight).toFixed(2);
          res.data.data.disAmt = Number(res.data.data.disAmt).toFixed(2);
          res.data.data.rebateAmt = Number(res.data.data.rebateAmt).toFixed(2);
          res.data.data.shareDis = Number(res.data.data.shareDis).toFixed(2);
          res.data.data.expAmt = Number(res.data.data.expAmt).toFixed(2);
          res.data.data.totalTax = Number(res.data.data.totalTax).toFixed(2);
          res.data.data.groupDisAmt = Number(res.data.data.groupDisAmt).toFixed(2);
          that.setData({
            status: res.data.data.orderStatus
          })
          for (let i of res.data.data.orderGoods) {
            i.goodPrices = Number(i.goodPrices).toFixed(2);
            i.activityId = i.activityId||0;
          }
          if (res.data.data.payTime != null) {

            that.setData({
              creat_time: true,
              payTime: that.formatDate(new Date(res.data.data.payTime)),
              isAllRefund: res.data.data.isAllRefund,
              isRefund: res.data.data.isRefund,
              deliveryTime: res.data.data.deliveryTime,
              dei: res.data.data.deliveryTime,
              isshouhou: (res.data.data.refundEndTime == null ? 0 : res.data.data.refundEndTime) > res.data.data.sysTime
            })
            console.log(that.data.isshouhou, res.data.data.refundEndTime)
          } else {
            that.setData({
              creat_time: false,

            })
          }
          if (res.data.data.deliveryTime != null) {
            console.log(res.data.data.deliveryTime)
            that.setData({
              send_goodTime: true,
              send_goodTimeText: that.formatDate(new Date(res.data.data.deliveryTime)),
              subId: res.data.data.subId
            })

          } else {
            that.setData({
              send_goodTime: false
            })

            console.log(res)
            res.data.data.cashAmt = Number(res.data.data.cashAmt).toFixed(2);
            res.data.data.totalAmout = Number(res.data.data.totalAmout).toFixed(2);
            res.data.data.orderFreight = Number(res.data.data.orderFreight).toFixed(2);
            res.data.data.disAmt = Number(res.data.data.disAmt).toFixed(2);
            res.data.data.rebateAmt = Number(res.data.data.rebateAmt).toFixed(2);
            res.data.data.totalTax = Number(res.data.data.totalTax).toFixed(2);
            res.data.data.shareDis = Number(res.data.data.shareDis).toFixed(2);
            res.data.data.expAmt = Number(res.data.data.expAmt).toFixed(2);
            for (let i of res.data.data.orderGoods) {
              i.goodPrices = Number(i.goodPrices).toFixed(2);
            }
          }
          that.setData({
            isRefund: res.data.data.isRefund,
            subId: res.data.data.subId
          });
          if (that.data.subId) {
            that.find_wuliu(that.data.subId);
          }

          if (res.data.data.subId == null) {

            that.setData({
              pay_sta: false
            })
          } else {
            that.setData({
              pay_sta: true
            })

          }
          
          that.setData({
            all_data: res.data.data   //把所有的值都给到all_data
          })
          if (that.data.all_data.orderType==5){
            that.setData({
              title:'拼团订单详情'
            })
          }
          console.log(res.data.data);
          if (res.data.data.isSubOrder == 1) {
            //等于一的话就证明是子订单 ，也就有四种状态    1，代发货 2待收货 3 已完成 4 交易关闭
            if (res.data.data.orderStatus == 1) {
              if (res.data.data.orderOutTime == !null || res.data.data.orderOutTime > 0) {
                that.setData({
                  // dingdansx: res.data.data.orderOutTime
                })
              } else {
                that.setData({
                  dingdansx: ''
                })
              }
              that.setData({
                order_stu: '等待发货'
              })
            } else if (res.data.data.orderStatus == 2) {
              console.log((((res.data.data.orderEndTime / 1000) / 60) / 60) / 24);
              console.log();
              //   天数
              let time = parseInt((((res.data.data.orderEndTime / 1000) / 60) / 60) / 24)
              //  小时
              let hour = parseInt(res.data.data.orderEndTime / 1000 / 3600 % 24);
              //取整获得 失效时间
              console.log(time, hour);
              if (res.data.data.orderEndTime != null) {
                // 订单还有 不到一天的时候 显示一天
                if (time > 0) {
                  that.setData({
                    order_stu: '等待收货',
                    dingdansx: "订单还有" + time + '天' + hour + '小时' + '自动收货'
                  })
                } else if (time == 0 && hour >= 1) {
                  that.setData({
                    order_stu: '等待收货',
                    dingdansx: "订单还有" + hour + '小时' + '自动收货'
                  })
                } else {
                  if (hour < 1) {
                    that.setData({
                      order_stu: '等待收货',
                      dingdansx: "订单还有1小时自动收货"
                    })
                  }

                }
              }

            } else if (res.data.data.orderStatus == 3) {
              that.setData({
                order_stu: '交易完成'
              })
            }else if(res.data.data.orderStatus==6){
              console.log('这个是拼团订单')
              // console.log(this.data.all_data.orderOutTime);
              that.setData({
                usedTime1: Date.parse(new Date(res.data.data.groupBuying.deadline)) - Date.parse(new Date(res.data.data.sysTime)),
                usercount: res.data.data.groupBuying.userLimit - res.data.data.groupBuying.partCount
              })
              console.log(that.data.usedTime1);
              if (that.data.usedTime1 < 0) {
                //订单已经失效
                that.setData({
                  usedTime1:0
                })
                that.time_set()
              } else {
                that.time_set()
              }
              // that.time_set()
              console.log(that.data.usedTime1)
              that.setData({
                order_stu: '拼团中，待分享',
                dingdansx:"",
                peisong: false

              })
            } else if (res.data.data.orderStatus == 5){
              that.setData({
                order_stu: '交易关闭',
                dingdansx: "",
                peisong: false

              })
            }  else if (res.data.data.orderStatus == 4) {
              that.setData({
                order_stu: '已退款，交易关闭',
                peisong: false
              })
            } else if (res.data.data.orderStatus == 0) {
              that.setData({
                order_stu: '已支付'
              })
            }
          } else {
            //它是主订单
            if (res.data.data.orderStatus == 1) {
              that.setData({
                order_stu: '已支付'
              })
            } else if (res.data.data.orderStatus == 2) {
              that.setData({
                order_stu: '交易关闭'
              })
            } else if (res.data.data.orderStatus == 0) {
              console.log((((res.data.data.orderOutTime / 1000) / 60) / 60) / 24);
              console.log(res.data.data.orderOutTime);
              console.log(res.data.data.orderOutTime - res.data.data.sysTime)
              let time = res.data.data.orderOutTime;
              if(res.data.data.groupBuying!=null){
                that.setData({
                  dd_time: that.formatDate(new Date(time)),
                  usercount: res.data.data.groupBuying.userLimit - res.data.data.groupBuying.partCount
                })
              }else{
                that.setData({
                  dd_time: that.formatDate(new Date(time))
                })
              }
              

              // console.log() 1547446059781   1547455312023
              that.setData({

              })
              var stime = Date.parse(new Date(1547446059781));
              var etime = Date.parse(new Date(1547455312023));
              var usedTime = etime - stime;
              console.log(usedTime) //两个时间戳相差的毫秒数
              var days = Math.floor(usedTime / (24 * 3600 * 1000));
              //计算出小时数
              var leave1 = usedTime % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
              var hours = Math.floor(leave1 / (3600 * 1000));
              //计算相差分钟数
              var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
              var minutes = Math.floor(leave2 / (60 * 1000));
              //计算相差秒数
              var leave3 = leave2 % (60 * 1000);
              var secont = Math.floor(leave2 / (60 * 1000))
              // days + "天" +
              that.setData({
                dd_time: hours + "时" + minutes + "分",
                dd_time1: usedTime / 1000
              })
              setTimeout(function () {
                that.setData({
                  dd_time: hours + "时" + minutes + "分" + secont + '秒',
                  dd_time1: usedTime / 1000
                })
              })
              // console.log(dd_time)
              var day = parseInt(usedTime / 1000 / 3600 / 24);
              //获取还剩多少小时
              var hour = parseInt(usedTime / 1000 / 3600 % 24);
              //获取还剩多少分钟
              var minute = parseInt(usedTime / 1000 / 60 % 60);
              //获取还剩多少秒
              var second = usedTime / 1000 % 60;
              // console.log(day + '天' + hour + '小时' + minute + '分' + second + '秒');

              // usedTime1
              // res.data.data.sysTime    系统时间
              console.log(res.data.data.sysTime)
              console.log(res.data.data.orderOutTime)
              console.log(res.data.data)
              // orderOutTime  groupBuying.deadline
              if (res.data.data.groupBuying){
                that.setData({
                  usedTime1: Date.parse(new Date(res.data.data.orderOutTime)) - Date.parse(new Date(res.data.data.sysTime))
                })
              }else{
                that.setData({
                  usedTime1: Date.parse(new Date(res.data.data.orderOutTime)) - Date.parse(new Date(res.data.data.sysTime))
                })
              }
       
              if (that.data.usedTime1 < 0) {
                //订单已经失效
                return false;
              } else {
                that.time_set()
              }
              //取整获得 失效时间
              if ( that.data.usedTime1> 0) {
                that.setData({
                  order_stu: '等待付款',
                  // dingdansx: "还剩" + that.data.usedTime_zt+'失效，请您尽快付款哦'
                })
              } else if (res.data.data.orderOutTime - res.data.data.sysTime < 0) {
                that.setData({
                  order_stu: '等待付款',
                  dingdansx: "订单已失效"
                })
              }
            }
          }
          //判断订单是否失效

          wx.hideLoading();

          that.setData({
            orderStatus: res.data.data.orderStatus,
            isSubOrder: res.data.data.isSubOrder,
            resultList: res.data.data.orderGoods,
            orderNum: res.data.data.orderNum,
            orderNo: res.data.data.orderNo,
            totalAmout: res.data.data.totalAmout,
            expAmt: res.data.data.expAmt,
            orderFreight: res.data.data.orderFreight,
            disAmt: res.data.data.disAmt,
            rebateAmt: res.data.data.rebateAmt,
            totalTax: res.data.data.totalTax,
            crossBorder: res.data.data.crossBorder,
            shareDis: res.data.data.shareDis,
            cashAmt: res.data.data.cashAmt,
            payPlatform: res.data.data.payPlatform,
            orderTime: res.data.data.orderTime,
            payTime: res.data.data.payTime,
            deliveryTime: res.data.data.deliveryTime,
            receiver: res.data.data.orderAdress.receiver,
            orderType: res.data.data.orderType,
            groupDisAmt: res.data.data.groupDisAmt,
            receiveAddress: res.data.data.orderAdress.receiveAddress,
            receivePhone: res.data.data.orderAdress.receivePhone.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")

            // goodAttrDese:res.data.

          });
          console.log(that.data.receiver);
          console.log(that.data.all_data);
          that.setData({
            orderTime: (that.formatDate(new Date(that.data.orderTime))).replace(/-/g, '/')
          })
          that.setData({//将付款的时间戳转化为时间
            payTime: that.formatDate(new Date(that.data.payTime)),
            orderTime: that.formatDate(new Date(that.data.orderTime)),
            deliveryTime: that.formatDate(new Date(that.data.deliveryTime))
          })

          // console.log(that.data.orderTime);
          if (that.data.payPlatform == 1) {
            that.setData({
              payPlatform: "微信"
            })
          } else if (that.data.payPlatform == 2) {
            that.setData({
              payPlatform: "支付宝"
            })
          } else if (that.data.payPlatform == 3) {
            console.log(that.data.payPlatform)
            that.setData({
              payPlatform: "余额"
            })
            console.log(that.data.payPlatform)
          } else {
            that.setData({
              payPlatform: "其他"
            })
          }
          console.log(that.data.resultList)
          for (var i = 0; i < that.data.resultList; i++) {
            if (that.data.resultList[i].goodStatus == 3 || that.data.resultList[i].goodStatus == 2) {
              that.setData({
                shouhou_show: true
              })
            } else {
              return;
            }
          }
        }

      })
    } else {
      console.log('跳转授权页面');
      wx.navigateTo({
        url: "/pages/init/init"
      })
    }
  },
  goHome() {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },
  goDetail(event){
    console.log(event)
    let { orderType } = this.data
    let url = '/pages/goodsDetails/goodsDetails?id=' + event.currentTarget.dataset.goodid + '&activityId='
      + event.currentTarget.dataset.activityid + '&left='+true
    if(orderType==4){
        url = '/pages/goodsDetails/goodsDetails?id=' + event.currentTarget.dataset.goodid + '&activityId='
      + event.currentTarget.dataset.activityid + '&left=' + true +'&isRookieExclusive='+true
    }
    if(orderType==5){
      url = '/pages/groupDetails/groupDetails?activityId=' + event.currentTarget.dataset.activityid + '&goodsId=' + event.currentTarget.dataset.goodid
    }
    //跳转到会员礼包
    if (orderType == 6 ){
      url = '/pages/bagDetails/bagDetails?activityId=' + event.currentTarget.dataset.activityid + '&goodId=' + event.currentTarget.dataset.goodid + '&bagDetail=1'
    }
    //跳转到组合礼包
    if (orderType == 7){
      url = '/pages/bagDetails/bagDetails?activityId=' + event.currentTarget.dataset.activityid + '&goodId=' + event.currentTarget.dataset.goodid + '&bagDetail=2'
     
    }
    wx.redirectTo({
      url,
    })
  }
  
})