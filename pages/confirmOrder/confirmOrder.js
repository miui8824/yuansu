// pages/confirmOrder/confirmOrder.js
const app = getApp();
var util = require('../../utils/util.js');
import Toast from '../../dist/toast/toast';
var apiUrl = require('../../static/js/url.js');
import dialogDraw from '../../dist/dialog/dialogDraw';
import Dialog from '../../dist/dialog/dialog';
Page({
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title: '确认订单',
    noAdd: false,
    userAddresses: {},//用户地址
    idCardButton: false,
    idCardTipOk: false, //是否显示已上传身份证
    investMoneyType: "",
    isOneDrawShow:true,  
    //是否是跨境
    isCrossBorder: false,
    scrollTop:0,
    orderList: [],
    showInvoice: false, //显示发票
    showSelectCoupons: false,//显示优惠券弹框

    totalReducePrice: 0, //下单立减
    totalReducePriceTrue: true,
    checked: false, //余额抵扣
    avlBal: 0, //账户余额
    shareKnock: 0, //分享立减
    shareKnockType: true,
    //优惠券可以不用 但是状态还是true 值是0
    //跨境不能用优惠券
    couponValue: 0, //优惠券金额
    couponValueTrue: true,
    couponsList: [],
    //v1.2
    groupDisAmtTrue:true,//团长优惠
    groupDisAmt:0,
    //v1.4 组合礼包优惠价格
    userDisAmtTrue:true,
    userDisAmt:0,
    userDisAmtNumber:1,//v1.4会员礼包情况下 购买数量
    couponsListArr: [], //优惠券选中列表
    isShowDraw:false,
    endMoney: 0, //最后的金额
    invoiceReqActive: '',//填写发票后

    //发票信息
    invoiceReq: {
      email: "",
      invoiceTitle: "",
      invoiceTitleType: 1,
      invoiceType: 1,
      taxNum: ''
    },
    addressId: '',//收件id
    balance: '',//使用余额金额
    confirmNo: '',//临时单号
    couponNum: 0,//优惠券
    payPlatform: 1,//支付方式
    phoneIp: '192.168.1.1',
    remark: '',//备注
    isShade: false,
    isShare: false,
    isDrawEnd: false,
    drawCash: 0, //摇奖金额
    drawNum1: '0',
    drawNum2: '0',
    drawNum3: '0',
    drawNum4: '0',
    drawState: 1,
    translatey_1: '',
    translatey_2: '',
    translatey_3: '',
    translatey_4: '',
    shareCash: 0,
    isInvalid: false,
    chanceNum: 0,
    chanceTotal: 3,     //获取可抽奖次数
    sd: 1,
    sharePicNo: 0,
    goodId: 0,
    isDrawOne: true,    //是否第一次到抽奖页面
    userId:null,

    groupOrder:2, //是否是拼团订单 1 是 2不是
    //是否新人专享订单
    isRookieExclusive:false,
    newText:'',//新的文案
  },
  onShareConfirm() {
    var _this = this;
    this.shareDraw();
    //判断是否显示分享立减活动 shareFlag
    //orderList[0].activityType
    let isShade =false;
    if (app.globalData.goodsDetails.data.shareFlag == 1 && this.data.orderList[0].activityType != 6 && this.data.orderList[0].activityType!=7){
      isShade=true;
    }else{
      isShade =false;
    }
    this.setData({
      isShade: isShade,
      shareCash: _this.data.shareKnock,
      isDrawOne: true,
      isShare: false
    });
  },
  onShareClose() {
    this.setData({
      isShare: false
    });
  },
  scroll(event) {
    this.setData({
      toTop: event.detail.scrollTop > 1000 ? true : false
    })
  },
  onLoad(options) {
    console.log(options)
    if (options.isRookieExclusive) {
      this.setData({
        isRookieExclusive: true
      })
    }
    //是否要显示上传身份证按钮
    let goodsDetails = app.globalData.goodsDetails;
    var goodId = goodsDetails.resultList[0].goodsId;
    for (var i of goodsDetails.resultList) {
      i.price = Number(i.price).toFixed(2);
      i.totalAmt = Number(i.totalAmt).toFixed(2);
      i.freight = Number(i.freight).toFixed(2);
      i.taxation = Number(i.taxation).toFixed(2);
      i.groupDisAmt = Number(i.groupDisAmt).toFixed(2);
    }
    //下单立减 保存
    goodsDetails.data.totalReducePrice=Number(goodsDetails.data.totalReducePrice).toFixed(2);
    //会员是否有优惠价格
    let userDisAmtTrue = goodsDetails.data.userDisAmt > 0 ?true:false;
    let userDisAmt = goodsDetails.data.userDisAmt;
    let userDisAmtNumber = goodsDetails.resultList[0].activityType == 6 ? goodsDetails.resultList[0].goodNumber:1;
    let isCard = null;
    if (goodsDetails.data.userAddresses && goodsDetails.data.userAddresses.isCard) {
      isCard = goodsDetails.data.userAddresses.isCard;
    };

    let addressId = null;
    if (goodsDetails.data.userAddresses && goodsDetails.data.userAddresses.id) {
      addressId = goodsDetails.data.userAddresses.id;
    }

    this.setData({
      userDisAmtTrue,
      userDisAmt,
      userDisAmtNumber,
      goodsDetails: goodsDetails,
      noAdd: goodsDetails.data.userAddresses ? false : true,
      userAddresses: goodsDetails.data.userAddresses || {},
      idCardButton: goodsDetails.data.outHomeNum > 0 && isCard != 1 ? true : false,
      idCardTipOk: goodsDetails.data.outHomeNum > 0 && isCard == 1 ,
      orderList: goodsDetails.resultList, //订单列表
      orderInfo: goodsDetails.data, //订单
      avlBal: goodsDetails.data.avlBal,//账户余额
      confirmNo: goodsDetails.data.confirmNo,
      addressId: addressId,
      goodId: goodId,
      isCrossBorder: goodsDetails.data.outHomeNum > 0 ? true : false,
      totalReducePrice: goodsDetails.data.totalReducePrice,
      groupOrder:options.groupOrder||2,
      groupDisAmt: goodsDetails.resultList[0].groupDisAmt //v1.2
    }, () => {
      let _this = this;
      //v1.2 拼团设置title
      if (this.data.orderList[0]&&this.data.orderList[0].activityType == 5){
        this.setData({
          title:'拼团确认订单'
        })
      }
      //优惠券列表
      this.getCouponsList(_this.data.orderInfo.totalPrice, (couponValue) => {
        //计算金额 到最后
        this.allComputerMoney();
      });
    });

    this.onShareConfirm();

  },
  onShow() {
    //是否要显示上传身份证按钮
    let goodsDetails = app.globalData.goodsDetails;
    var goodId = goodsDetails.resultList[0].goodsId;
    for (var i of goodsDetails.resultList) {
      i.price = Number(i.price).toFixed(2);
      i.totalAmt = Number(i.totalAmt).toFixed(2);
      i.freight = Number(i.freight).toFixed(2);
      i.taxation = Number(i.taxation).toFixed(2);
    }

    let isCard = null;
    if (goodsDetails.data.userAddresses && goodsDetails.data.userAddresses.isCard) {
      isCard = goodsDetails.data.userAddresses.isCard;
    };

    let addressId = null;
    if (goodsDetails.data.userAddresses && goodsDetails.data.userAddresses.id) {
      addressId = goodsDetails.data.userAddresses.id;
    }
    let _noAddType=true;
    if (goodsDetails.data.userAddresses){
      _noAddType = Object.keys(goodsDetails.data.userAddresses).length>0?false:true
    }
    this.setData({
      goodsDetails: goodsDetails,
      noAdd: _noAddType,
      userAddresses: goodsDetails.data.userAddresses || {},
      idCardButton: goodsDetails.data.outHomeNum > 0 && isCard != 1 ? true : false,
      orderList: goodsDetails.resultList, //订单列表
      orderInfo: goodsDetails.data, //订单
      avlBal: goodsDetails.data.avlBal,//账户余额
      confirmNo: goodsDetails.data.confirmNo,
      addressId: addressId,
      goodId: goodId,
      isCrossBorder: goodsDetails.data.outHomeNum > 0 ? true : false,
      totalReducePrice: goodsDetails.data.totalReducePrice,
      idCardTipOk: goodsDetails.data.outHomeNum > 0 && isCard == 1,
    }, () => {
      let _this = this;
      //优惠券列表
      this.getCouponsList(_this.data.orderInfo.totalPrice, (couponValue) => {
        //计算金额 到最后
        this.allComputerMoney();
      });
    });
    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, '', '');
    //..userId
    util.getNowUserId((userId) => {
      this.setData({
        userId
      })
    })
  },
  //获取新的文案
  getNewText(type) {
    let _type = type==3 ? 1 : 0;
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
        },()=>{
          //生成弹框
          if(type==3){
            this.dialogDraw('去了解');
          }else{
            this.dialogDraw();
          }
          this.setData({
            isShowDraw: true
          })
        })
      }
    })
  },
  //选择优惠券
  selectAdd() {
    wx.navigateTo({
      url: '/pages/addressManagement/addressManagement',
    })
  },
  invoiceTitleInput(e) {
    this.setData({
      'invoiceReq.invoiceTitle': e.detail.value
    })
  },
  taxNumInput(e) {
    this.setData({
      'invoiceReq.taxNum': e.detail.value
    })
  },
  emailInput(e) {
    this.setData({
      'invoiceReq.email': e.detail.value
    })
  },
  remarkInput(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  //发票类型
  invoiceTitleChange(event) {
    this.setData({
      'invoiceReq.invoiceTitleType': event.currentTarget.dataset.index
    })

  },
  //上传身份证
  updateAdd() {
    let objData = this.data.userAddresses;
    let urlObj = '';
    for (let i in objData) {
      urlObj += i + '=' + objData[i] + '&';
    }
    urlObj = urlObj.substr(0, urlObj.length - 1);
    wx.navigateTo({
      url: '/pages/addId/addId?' + urlObj,
    })
  },
  //得到优惠券列表
  getCouponsList(moneyNumber, callBack) {
    let reqObj = {
      url: '/api/user/getPrizeGrant',
      data: {
        couponType: 1,
        prizeType: 14
      }
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
        //剔除无法使用的优惠券
        let newCouponsList = [];
        for (let i of res.resultList) {
     
          if (moneyNumber >= i.investMoney) {
            newCouponsList.push(i);
          }

          for (let i of newCouponsList) {
            let startTimeValue = i.startTimeValue
            let endTimeValue = i.endTimeValue

            if (i.startTimeValue != null) {
              i.startTimeValue = i.startTimeValue.replace(/-/g, ".")
            }
            if (i.endTimeValue != null) {
              i.endTimeValue = i.endTimeValue.replace(/-/g, ".")
            }

            switch (i.investMoneyType) {
              case 1:
                i.investMoneyType = '全场通用';
                break;
              case 2:
                i.investMoneyType = '最多投用';
                break;
              case 3:
                i.investMoneyType = '投资满用';
                break;
              case 4:
                i.investMoneyType = '消费满多少可用';
                break;
            }
          }

          this.setData({
            couponsList: newCouponsList
          })
        }
        if (newCouponsList.length > 0) {
          //默认那张优惠券 金额 编号
          let couponValue = newCouponsList[0].couponValue;
          //优惠券编号
          let couponNum = newCouponsList[0].id;

          //控制选中的开关
          let couponsListArr = [];
          for (let i of newCouponsList) {
            couponsListArr.push(false);
          }
          //默认选择第一条
          couponsListArr[0] = true;
          //如果跨境
          if (this.data.isCrossBorder || this.data.groupOrder==1) {
            this.setData({
              couponsList: [],
              couponsListArr: [],
              couponValue: 0,
              couponNum: 0
            })
            callBack(0);
          }else if(this.data.isRookieExclusive){
            //如果新人专享 也不能用优惠券
            this.setData({
              couponsList: [],
              couponsListArr: [],
              couponValue: 0,
              couponNum: 0
            })
            callBack(0);
          } else if (this.data.orderList[0].activityType == 7 || this.data.orderList[0].activityType == 6) {
            //如果新人专享 也不能用优惠券
            this.setData({
              couponsList: [],
              couponsListArr: [],
              couponValue: 0,
              couponNum: 0
            })
            callBack(0);
          } else {
            this.setData({
              couponsList: newCouponsList,
              couponsListArr: couponsListArr,
              couponValue: couponValue,
              couponNum: couponNum

            })
            callBack(couponValue);
          }
        } else {
          callBack(0);
        }
      }
    })
  },
  //立即购买
  goPay() {
    var _this=this;
    if (this.data.addressId == null) {
      Toast('请填写收货地址信息');
      return false;
    }
    if (this.data.idCardButton) {
      Toast('请上传身份证实名认证，方便清关');
      return false;
    }
    let invoiceReq = {
      email: this.data.invoiceReq.email,
      invoiceTitle: this.data.invoiceReq.invoiceTitle,
      invoiceTitleType: this.data.invoiceReq.invoiceTitleType,
      invoiceType: this.data.invoiceReq.invoiceType,
      taxNum: this.data.invoiceReq.taxNum
    };
    //如果用户写了发票
    if (!(this.data.invoiceReq.invoiceTitle.length > 0)) {
      invoiceReq = {}
    }
    //接口加签
    let mdContent= "addressId=" + this.data.addressId + "&confirmNo=" + this.data.confirmNo + "&key=" + apiUrl.configValue
    let _mdContent = util.apiMd5(mdContent);
    _mdContent = _mdContent.toUpperCase();

    let reqObj = {
      url: '/api/order/createOrder',
      data: {
        addressId: this.data.addressId,
        balance: this.data.checked ? this.data.balance : 0,
        confirmNo: this.data.confirmNo,
        couponNum: this.data.couponNum,
        invoiceReq: invoiceReq,
        payAmt: this.data.endMoney,
        payPlatform: this.data.payPlatform,
        phoneIp: this.data.phoneIp,
        remark: this.data.remark,
        sign: _mdContent,
        disAmt: this.data.userDisAmt
      }
    }
    util.RequestPost(reqObj, null, (res, message) => {
      var flag=res.flage;
      if (message) {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 1500
        })
      }
      if (res.resCode == '0000') {
        let data = res.data;
        //如果用户使用账户余额支付
        if (!data) {
          if (flag=='1'){
            _this.getNewText();
          } else if (flag == '3'){
            _this.getNewText(3);
          }else{
            let activeNav = this.data.orderList[0].activityType == 5?999:1
            wx.navigateTo({
              url: '/pages/myOrder/myOrder?navActive=' + activeNav
            })
          }
          return false;
        }
        //成功数据
        wx.requestPayment({
          timeStamp: data.timestamp || '',
          nonceStr: data.noncestr || '',
          package: data.packages || '',
          signType: data.signType || '',
          paySign: data.paySign || '',
          success: (res)=> {
            //直接跳等待发货页面
            if (flag == '1') {
              _this.getNewText();
            } else if (flag == '3') {
              _this.getNewText(3);
            } else {
              let activeNav = this.data.orderList[0].activityType == 5 ? 999 : 1
              wx.navigateTo({
                url: '/pages/myOrder/myOrder?navActive=' + activeNav
              })
            }
          },
          fail: function () {
            // this.onShow()
            //直接跳等待发货页面
            wx.redirectTo({
              url: '/pages/myOrder/myOrder?navActive=0'
            })
          }
        })
      }
    })

  },
  //选择优惠券
  onSelectCoupons() {
    if (this.data.couponsList.length == 0) {
      return false;
    }
    this.setData({
      showSelectCoupons: true
    })
  },
  //选中优惠券
  //**需要计算当前的余额抵扣 */
  selectCoupons(event) {
    let couponsid = event.currentTarget.dataset.couponsid;
    let index = event.currentTarget.dataset.index;
    let couponsListArr = [];
    for (let i of this.data.couponsListArr) {
      couponsListArr.push(i);
    }
    if (couponsListArr[index]) {
      couponsListArr[index] = false;
      this.setData({
        couponNum: 0
      })
    } else {
      for (let i = 0; i < couponsListArr.length; i++) {
        couponsListArr[i] = false;
      }
      couponsListArr[index] = true;
      this.setData({
        couponNum: couponsid
      })
    }
    //得到金额
    let couponValue = couponsListArr[index] ? this.data.couponsList[index].couponValue : 0;
    this.setData({
      couponsListArr: couponsListArr,
      couponValue: couponValue
    }, () => {
      this.allComputerMoney();
    })
  },
  //全部的计算金额的公共方法
  allComputerMoney() {
    let endMoney = (this.data.orderInfo.totalPrice * 100
      - (this.data.shareKnockType ? this.data.shareKnock * 100 : 0)
      - (this.data.totalReducePriceTrue ? this.data.totalReducePrice * 100 : 0)
      - (this.data.couponValueTrue ? this.data.couponValue * 100 : 0)
      - (this.data.groupDisAmtTrue ? this.data.groupDisAmt * 100 : 0) //v1.2
      - (this.data.userDisAmtTrue ? this.data.userDisAmt * 100 : 0) //v1.4
      - (this.data.checked ? this.data.avlBal * 100 : 0)) / 100;
    endMoney = Number(endMoney).toFixed(2);

    //用户 不用优惠券 和余额抵扣的钱
    let endMoney1 = (this.data.orderInfo.totalPrice * 100
      - (this.data.shareKnockType ? this.data.shareKnock * 100 : 0)
      - (this.data.groupDisAmtTrue ? this.data.groupDisAmt * 100 : 0) //v1.2
      - (this.data.userDisAmtTrue ? this.data.userDisAmt * 100 : 0) //v1.4
      - (this.data.totalReducePriceTrue ? this.data.totalReducePrice * 100 : 0)) / 100;
    endMoney1 = Number(endMoney1).toFixed(2);

    // shareKnockType //分享立减
    // totalReducePriceTrue //下单立减
    // couponValueTrue //优惠券立减
    // checked  //余额抵扣
    // avlBal //账户余额

    //如果
    //1, 用了优惠券 (当前不要考虑这种，始终都用了优惠券，只是值是不是 0 的问题。)

    //2,用了分享立减(和上一种一样，就是金额大小的问题),
    //一定要用户 全部分享后得到一个和 在放进来
    //3,用了余额折扣（以下都是默认减去优惠券和分享立减）
    if (this.data.checked) {
      //优惠券比商品还大
      if (endMoney < 0 && this.data.couponValue > endMoney1) {
        this.setData({
          endMoney: '0.00',
          balance: '0.00'
        })
      } else {
        if (endMoney < 0) {
          //余额够商品钱 
          this.setData({
            endMoney: Number(0).toFixed(2),
            balance: ((this.data.orderInfo.totalPrice * 100
              - (this.data.shareKnockType ? this.data.shareKnock * 100 : 0)
              - (this.data.totalReducePriceTrue ? this.data.totalReducePrice * 100 : 0)
              - (this.data.groupDisAmtTrue ? this.data.groupDisAmt * 100 : 0) //v1.2
              - (this.data.userDisAmtTrue ? this.data.userDisAmt * 100 : 0) //v1.4
              - (this.data.couponValueTrue ? this.data.couponValue * 100 : 0)) / 100).toFixed(2),
          })
        } else {
          ////
          this.setData({
            endMoney: endMoney,
            balance: ((this.data.avlBal * 100) / 100).toFixed(2)
          })
        }
      }
    } else {
      //4,什么都不用
      //不用余额抵扣的钱 和账户余额比
      let _endMoney = (this.data.orderInfo.totalPrice * 100
        - (this.data.shareKnockType ? this.data.shareKnock * 100 : 0)
        - (this.data.totalReducePriceTrue ? this.data.totalReducePrice * 100 : 0)
        - (this.data.groupDisAmtTrue ? this.data.groupDisAmt * 100 : 0) //v1.2
        - (this.data.userDisAmtTrue ? this.data.userDisAmt * 100 : 0) //v1.4
        - (this.data.couponValueTrue ? this.data.couponValue * 100 : 0)) / 100;
      _endMoney = _endMoney.toFixed(2);
      //优惠券大于商品金额
      if (_endMoney < 0) {
        this.setData({
          endMoney: '0.00',
          balance: '0.00'
        })
      } else {
        //用户有钱多
        if (_endMoney < this.data.avlBal) {
          this.setData({
            endMoney: _endMoney,
            balance: _endMoney
          })
        } else {
          this.setData({
            endMoney: _endMoney,
            balance: ((this.data.avlBal * 100) / 100).toFixed(2)
          })
        }
      }
    }


  },
  //余额修改
  onChange({ detail }) {
    //**需要计算当前的余额抵扣 */
    // 需要手动对 checked 状态进行更新
    this.setData({ checked: detail });
    let endMoney = 0;
    this.setData({
      checked: detail
    }, () => {
      this.allComputerMoney();
    })
  },
  onClose() {
    let invoiceReqActive = this.data.invoiceReq.invoiceTitleType == 1 ? '个人' : '单位';
    this.setData({
      showInvoice: false,
      invoiceReqActive: invoiceReqActive
    });
  },
  onClose1() {
    this.setData({
      showSelectCoupons: false,
    });
  },
  onOpen() {
    this.setData({
      showInvoice: true
    });
  },
  // changeDrawState(state) {
  //   var state = state || this.data.drawState;
  //   if (state == 6) {
  //     this.setData({
  //       drawState: 1,
  //       isShade: false
  //     });
  //   } else {
  //     this.setData({
  //       drawState: state + 1,
  //     });
  //   };
  //   var isDrawEnd;
  //   if (state == 1 || state == 3 || state == 5) {
  //     isDrawEnd = true;
  //   } else {
  //     isDrawEnd = false;
  //   };
  //   this.setData({
  //     isDrawEnd: isDrawEnd
  //   });
  // },
  startDraw() { //开始摇奖
    var _this = this;
    this.setData({
      sd: 0,
      isOneDrawShow:false
    });
    var reqObj = {
      url: '/api/sharing/queryShareResult',
      data: {
        linkNo: _this.data.confirmNo
      }
    };
    let token = wx.getStorageSync('myxzToken');
    if (token) {
      let header = {
        'auth-token': token
      };
      wx.request({
        url: apiUrl.API_URL + reqObj.url,
        data: reqObj.data,
        header: header,
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          if (res && res.data) {
            if (res.data.resCode == '21006' || res.data.resCode == '21007') {
              Dialog.alert({
                title: res.data.resDesc,
                message:"   "
              });
              _this.setData({
                isInvalid: true,
                isShade: false
              });
            } else {
              var draw1, draw2, draw3, draw4;
              draw1 = [];
              for (var i = 0; i < 5; i++) {
                for (var j = 0; j <= 9; j++) {
                  draw1.unshift(j);
                }
              }
              draw2 = [...draw1];
              draw3 = [...draw1];
              draw4 = [...draw1];
              var cash = (res.data.data) ? Number(res.data.data) : 0;
              cash = cash == NaN ? 0 : cash;
              var cashStr = Math.round(cash * 100) + '';
              switch (cashStr.length) {
                case 1:
                  cashStr = '000' + cashStr;
                  break;
                case 2:
                  cashStr = '00' + cashStr;
                  break;
                case 3:
                  cashStr = '0' + cashStr;
                  break;
              };
              cashStr = cashStr.substr(-4, 4);

              var cash4, cash1, cash2, cash3;
              cash1 = parseInt(cashStr.charAt(0));
              cash2 = parseInt(cashStr.charAt(1));
              cash3 = parseInt(cashStr.charAt(2));
              cash4 = parseInt(cashStr.charAt(3));
  
              for (let i = 0; i <= cash1; i++) {
                draw1.unshift(i);
              };
              for (let j = 0; j <= cash2; j++) {
                draw2.unshift(j);
              };
              for (let m = 0; m <= cash3; m++) {
                draw3.unshift(m);
              };
              for (let n = 0; n <= cash4; n++) {
                draw4.unshift(n);
              };
              draw1.unshift(0);
              draw2.unshift(0);
              draw3.unshift(0);
              draw4.unshift(0);
              // var shareCash = _this.data.shareCash; 
              _this.setData({
                drawNum1: draw1.join(''),
                drawNum2: draw2.join(''),
                drawNum3: draw3.join(''),
                drawNum4: draw4.join(''),
                translatey_1: 'translatey-' + cash1,
                translatey_2: 'translatey-' + cash2,
                translatey_3: 'translatey-' + cash3,
                translatey_4: 'translatey-' + cash4,
                // shareCash: cash + shareCash
                shareCash:cash
              });
              var chanceNum = _this.data.chanceNum;
              var chanceTotal = _this.data.chanceTotal;
              var drawState = 2;
              if (chanceNum == chanceTotal) drawState = 3;
              setTimeout(() => {
                // _this.changeDrawState();
                _this.setData({
                  sd: 1,
                  drawState: drawState
                })
              }, 4000)
            }
          }
        },
        fail: function (res) {
       
        }
      })
    } else {
      wx.navigateTo({
        url: "/pages/init/init"
      })
    }
  },
  useDraw() { //使用奖金
    var shareCash = this.data.shareCash;
    // var endMoney = this.data.endMoney == NaN ? 0 : this.data.endMoney;
    this.setData({
      drawNum1: '0',
      drawNum2: '0',
      drawNum3: '0',
      drawNum4: '0',
      translatey_1: '',
      translatey_2: '',
      translatey_3: '',
      translatey_4: '',
      drawState: 1,
      isShade: false,
      shareKnock: shareCash.toFixed(2),
      // endMoney: endMoney - shareCash > 0 ? (endMoney - shareCash).toFixed(2):'0.00'
    });
    this.allComputerMoney();
  },
  shareDraw() { //分享
    var _this = this;
    var confirmNo = this.data.confirmNo;

    var reqObj = {
      url: '/api/sharing/addShareLog',
      data: {
        linkNo: confirmNo,
        type: 1,
        shareUserId: this.data.userId||0
      }
    };
    var token = wx.getStorageSync('myxzToken');
    if (token) {
      let header = {
        'auth-token': token
      };
      wx.request({
        url: apiUrl.API_URL + reqObj.url,
        data: reqObj.data,
        header: header,
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          if (res && res.data) {
            _this.setData({
              drawNum1: '0',
              drawNum2: '0',
              drawNum3: '0',
              drawNum4: '0',
              translatey_1: '',
              translatey_2: '',
              translatey_3: '',
              translatey_4: ''
            });

            if (res.data.resCode === "21006") {
              // Dialog.alert({
              //   message: res.data.resDesc
              // });
              _this.setData({
                // isInvalid: true,
                isShade: false
              });
              return;
            };
            if (res.data.data <= 0) {
              Dialog.alert({
                message: '对不起，您的可抽奖次数为0。'
              });
              _this.setData({
                isInvalid: true,
                isShade: false
              });
            } else {
              var chanceNum = _this.data.chanceNum + 1;
              _this.setData({
                chanceNum: chanceNum,
              });
              var isDrawOne = _this.data.isDrawOne;
              if (isDrawOne == true) {
                _this.setData({
                  isDrawOne: false,
                  drawState: 1
                })
              }
              // _this.changeDrawState();
            }
          }
        },
        fail: function (res) {
       
        }
      })
    } else {
      wx.navigateTo({
        url: "/pages/init/init"
      })
    }
  },
  invalidConfirm() {
    this.setData({
      isInvalid: false
    })
  },
  closeShade() {
    this.setData({
      isShade: false
    })
  },
  dialogDraw(ButtonText){
    dialogDraw.confirm({
      // title:'',
      message: this.data.newText,
      confirmButtonText: ButtonText?"去了解":"去抽奖"
    })
  },
  onGoDraw(){
    wx.navigateTo({
      url: "/pages/orderDraw/orderDraw"
    })
  },
  onGoOrder(){
    if(this.data.orderList[0] && this.data.orderList[0].activityType == 5){
      wx.navigateTo({
        url: '/pages/myOrder/myOrder?navActive=999'
      })
    }else{
      wx.navigateTo({
        url: '/pages/myOrder/myOrder?navActive=1'
      })
    }
  },
  onShareAppMessage: function (option) {
    var _this = this;
    var orderList = this.data.orderList;
    var sharePicNo = this.data.sharePicNo;
    sharePicNo = orderList.length - 1 < sharePicNo ? 0 : sharePicNo;
    var pic = orderList[sharePicNo] ? orderList[sharePicNo].visitFileUrl : '';
    //let userId = wx.getStorageSync('myxzUserId');
    sharePicNo++;
    if (orderList.length - 1 < sharePicNo) sharePicNo = 0;
    _this.setData({
      sharePicNo: sharePicNo,
      drawState: 1
    });
    _this.shareDraw();
    return {
      title: util.commonText2[Math.floor(Math.random() * 5)],
      imageUrl: pic,
      path: '/pages/goodsDetails1/goodsDetails1?id=' + _this.data.goodId + '&userId=' + this.data.userId+ '&activityId=0&left=true&path=goodsDetails',
      success: function (res) {
        let reqObj = {
          url: '/api/sharing/addShareLog',
          data: {
            type: 1
          }
        }
        util.RequestPost(reqObj, null, (res, message) => {
          if (res.resCode == '0000') {
            //成功数据
          }
        })
      }
    }
  },
})
