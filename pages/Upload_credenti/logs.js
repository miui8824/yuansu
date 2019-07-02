//logs.js
const util = require('../../utils/util.js')
var url = require('../../static/js/url.js');

import Dialog from '../../dist/dialog/dialog';
var WxParse = require('../../wxParse/wxParse.js');


Page({
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:'申请退款',
    // 仅退款 未收货
    actionSheetList1: [{ id: 1, reason: '商品无货' }, { id: 2, reason: '发货时间有问题' }, { id: 3, reason: '不想要了' }, { id: 4, reason: '商品信息填写错误' }, { id: 5, reason: "地址信息填写错误" }, { id: 6, reason: "商品降价" }],

    // 仅退款 已收货
    actionSheetList2: [{ id: 7, reason: '缺少件' }, { id: 8, reason: '发错货' }, { id: 9, reason: '质量问题' }, { id: 10, reason: '商品与页面描述不符' }, { id: 11, reason: '商品损坏' }, { id: 12, reason: '其他' }, { id: 13, reason: '与卖家协商一致' }],

    // 退货退款
    actionSheetList3: [{ id: 7, reason: '缺少件' }, { id: 8, reason: '发错货' }, { id: 9, reason: '质量问题' }, { id: 10, reason: '商品与页面描述不符' }, { id: 11, reason: '商品损坏' }, { id: 12, reason: '其他' }],
    selectReasonArr:[],
    refundReasonText:"",//退款原因显示文本
    actionSheetShow1:false,
    logs: [],
    applyNum:0,
    isSubOrder:null,
    orderStatus:null,
    refundType:1,//退款类型
    inputRefund: null,//预期退款金额
    maxRefund:0,//可退款最大金额
    accepted:false,//是否已收货
    aftersaleList: [],//获取到的申请列表
    aftersaleList1:[],//选中商品列表
    hasVoucher:false,//初始无凭证状态
    voucherList: [],//凭证照片列表
    disposeWay: "",//处理方式
    selectArr:[],//选中状态
    list:[],//计算最大列表
    refundDesc:"",//退款说明
    refundResCode:0,//退货原因编号
    aftersaleId:-1,
    selectedcheckSrc:"https://file.maiyatown.com/images/shopCar/shopping_cart_selected_check.svg",
    selecteddefaultSrc: "https://file.maiyatown.com/images/shopCar/shopping_cart_selected_default.svg",
    orderType:null
  },

//退货说明
  refundDesc(e){
    // console.log(e.detail.value)
    this.setData({
      refundDesc:e.detail.value
    })
  },


//选择未收货
  chooseUnacceptStatus(){
    // let that = this
    let selectReasonArr=[]
    let { accepted,  actionSheetList1 } =this.data
    for (let i of actionSheetList1) {
      selectReasonArr.push(false);
    }
    if(!accepted){
      return false
    }else{
      this.setData({
        accepted:false,
        selectReasonArr,
        refundReasonText:""
      })
    }
    
    console.log('未收货', this.data.accepted)
  },


//选择已收货
  chooseAcceptedStatus(){
    // let that = this
    let selectReasonArr=[]
    let { accepted , actionSheetList2 } = this.data
    for (let i of actionSheetList2) {
      selectReasonArr.push(false);
    }
    if(accepted){
      return false
    }else{
      this.setData({
        accepted:true,
        selectReasonArr,
        refundReasonText: ""
      })
    }
    
    console.log('已收货',this.data.accepted)
  },


  //退款原因说明
  onchoose(e){
    console.log(e.currentTarget.dataset)
    let index = e.currentTarget.dataset.index
    let { selectReasonArr, accepted, refundReasonText, actionSheetList1, actionSheetList2, actionSheetList3, refundResCode } = this.data
    if (selectReasonArr[index]) {
      return false
    } else {      
      for (var i = 0; i < selectReasonArr.length;i++) {
        var arri = "selectReasonArr[" + i + "]";
        this.setData({
          [arri] : false
        })
      }
      selectReasonArr[index] = true;
    }

    if(accepted){
      this.setData({
        refundResCode:7+index
      })
    }else{
      this.setData({
        refundResCode: 1+index
      })
    }

    this.setData({
      selectReasonArr,
      refundReasonText: e.currentTarget.dataset.value
    })
  },

//提交申请
  submitApplication(){
    let { applySelectedNum, applyNum, expRefundAmt, accepted, list, refundDesc, voucherList, aftersaleList1, inputRefund, refundType, refundResCode, aftersaleId, refundReasonText,maxRefund} = this.data
    if (list.length <= 0) {
      wx.showToast({
        icon: 'none',
        title: "请选择申请售后商品~",
      })
      return false
    }
    if (refundReasonText == "") {
      wx.showToast({
        icon: 'none',
        title: "请选择退款原因~",
      })
      return false
    } 

    if (maxRefund == 0) {
      wx.showToast({
        icon: 'none',
        title: "不好意思，该商品不能申请退款哟~",
      })
      return false
    }

    if ((inputRefund == 0 && maxRefund > 0) || (inputRefund == "" && maxRefund > 0) || (inputRefund == null && maxRefund > 0) ){
      wx.showToast({
        icon: 'none',
        title: "请填写退款金额~",
      })
      return false
    }

    if (inputRefund != 0 && inputRefund != "" && inputRefund != null) {
      if(this.refundNumTips()){
        let info = {
          "expRefundAmt": inputRefund,
          "goodQuantity": applyNum,
          "id": 0,
          "isDelivery": accepted ? 1 : 2,
          "orderGoodIds": list,
          "orderNo": aftersaleList1[0].orderNo,
          "orderNum": aftersaleList1[0].orderNum,
          "proofUrlList": voucherList,
          "refundDesc": refundDesc,
          "refundResCode": refundResCode,
          "refundType": refundType
        }
        let reqObj = {
          url: "/api/orderRefund/saveProxy",
          data: info
        }
        util.RequestPost(reqObj, null, (res, message) => {
          if (message) {
            console.log(message)
            // wx.showToast({
            //   title: res.resDesc,
            //   icon: 'none',
            //   duration: 1500
            // })
          }
          if (res.resCode == '0000') {
            console.log(res)
            this.setData({
              aftersaleId: res.model.refundId
            })
            wx.setStorage({
              key: 'createTimeValue',
              data: res.model.createTimeValue,
            })
            wx.redirectTo({
              url: `/pages/Refund_details/Refund_details?id=${this.data.aftersaleId}`
            })
          }
        })
      }
        
      
    } 
    
    

    
  },

  cancelReturn(){
    wx.navigateTo({
      url: '/pages/myOrder/myOrder'
    })
  },

  refundReason1(){
    this.setData({
      actionSheetShow1:true
    })
  },

  onClose1(){
    this.setData({
      actionSheetShow1: false
    })
  },



  refundNumTips(){
    let {inputRefund,maxRefund}=this.data
    console.log(inputRefund.toString().split("."))
    if (inputRefund.toString().split(".").length != 1 && inputRefund.toString().split(".")[1].length > 2) {
      Dialog.confirm({
        title: '小数点位数不大于2位',
        message:"   ",
        showCancelButton: false,
        confirmButtonText: "知道了"
      }).then(() => {
        // on confirm
      })
      return false;
    }
    
    if (inputRefund.toString().split(".").length == 2 && inputRefund.toString().split(".")[1] == "") {
      Dialog.confirm({
        title: '请输入正确的金额格式',
        message: "   ",
        showCancelButton: false,
        confirmButtonText: "知道了"
      }).then(() => {
        // on confirm
      })
      return false;
    }

    if (inputRefund<0) {
      Dialog.confirm({
        title: '请输入正确的金额格式',
        message: "   ",
        showCancelButton: false,
        confirmButtonText: "知道了"
      }).then(() => {
        // on confirm
      })
      return false;
    }

    inputRefund = parseFloat(this.toFixed(inputRefund, 2))
    if (!this.isNotANumber(inputRefund)) {
      Dialog.confirm({
        title: '请输入正确的金额格式',
        message: "   ",
        showCancelButton: false,
        confirmButtonText: "知道了"
      }).then(() => {
        // on confirm
      })
      return false;
    }

    if (inputRefund > maxRefund) {
      // console.log("最大金额888")
      Dialog.confirm({
        title: '您可退最大金额为¥' + maxRefund,
        message: "   ",
        showCancelButton:false,
        confirmButtonText:"知道了"
      }).then(() => {
        return false;
      })
      
    }

    return true
  },



  delVoucher(e){
    let { voucherList } = this.data
    console.log(e)
    voucherList.splice(e.currentTarget.dataset.index,1)
    this.setData({
      voucherList
    })
  },



  uploadVoucher(){
    let that = this;
    let { hasVoucher, voucherList} =this.data
    console.log(voucherList.length)
    if(voucherList.length>=3){
      Dialog.confirm({
        message: '您已上传三张凭证，请删除后再次上传',
        showCancelButton: false,
        confirmButtonText: "知道了"
      }).then(() => {
        // on confirm
      })
      return false
    }
    wx.chooseImage({
      success: function(res) {
        const tempFilePaths = res.tempFilePaths;
        let {voucherList} = that.data
        wx.uploadFile({
          url: url.API_URL + '/api/file/upload', 
          filePath: tempFilePaths[0],
          formData:{
            busiType: 5,
            fileType: 2
          },
          name: 'file',
          success(res){
            console.log(res)
            const data = res.data
            let _data = JSON.parse(data);
            console.log('_data', _data)
            if (_data.resCode == '0000') {
              voucherList.push(_data.data)
              console.log(voucherList)
              that.setData({
                voucherList
              })
            } else if (_data.resCode == '9001') {
              wx.showToast({
                icon: 'none',
                title: _data.resDesc,
              })
            }
          }
        })
        
      },
      count:1
    })
    if (voucherList.length < 0) {
      this.setData({
        hasVoucher:false
      })
    }else{
      this.setData({
        hasVoucher: true
      })
    }

  },



  inputRefundNum(e){ 
    this.setData({
      inputRefund: e.detail.value
    })
  },

 //小数点位数函数
  toFixed(num,d){
    num *=Math.pow(10,d);
    num = Math.round(num);
    return num/(Math.pow(10,d))
  },

  // 是否数字
  isNotANumber(inputData) {
    if(parseFloat(inputData).toString() == 'NaN') {
  　　　return false;
　　  } else {
  　　　return true;
　　  } 
  },


  // 获取最大退款值
  getMaxRefund(){
    let { aftersaleList, aftersaleList1, selectArr} = this.data
    let list = []
      for (let v of aftersaleList1) {
          let option = new Object()
          option.id = v.id
          option.goodQuantity = v.refundNum
          option.orderNum = v.orderNum
          option.orderNo = v.orderNo
          list.push(option)
      }
    // maxRefund=this.toFixed(maxRefund,2)
    this.setData({
      list
    })
    let reqObj = {
      url: "/api/orderRefund/maxExpectedMoney",
      data: list
    }
    util.RequestPost(reqObj, null, (res, message) => {
      if (message) {
        console.log(message)
      }
      if (res.resCode == '0000') {
        console.log(res)
        this.setData({
          maxRefund:Number(res.model.maxExpectedMoney).toFixed(2),
          inputRefund: res.model.maxExpectedMoney
        })
      }
    })
  },




  onLoad: function (options) {
    console.log(options);
    if(options.orderStatus&&options.isSubOrder){
      this.setData({
        orderStatus: options.orderStatus,
        isSubOrder: options.isSubOrder
      })
    }
    let selectArr=[]
    let { accepted, actionSheetList2, actionSheetList1, aftersaleList,refundType } = this.data

    this.setData({
      title: "申请售后"//页面标题为路由参数  
    })
    let selectReasonArr=[]
    
    if(accepted){
      for (let i of actionSheetList2) {
        selectReasonArr.push(false);
      }
    }else{
      for (let i of actionSheetList1) {
        selectReasonArr.push(false);
      }
    }
    let that =this
    wx.getStorage({
      key: "myxzAftersaleSelectedList",
      success(res){
        console.log(res.data)

        let aftersaleList = []
        let aftersaleList1 = []
        let applyNum=0
        for (let i of res.data) {
          selectArr.push(true);
          aftersaleList.push(i);
          aftersaleList1.push(i);
          applyNum+=i.goodQuantity;
        }
        that.setData({
          aftersaleList,
          aftersaleList1,
          selectArr,
          applyNum
        })
        that.getMaxRefund()
      }
    })
    
    wx.getStorage({
      key: "myxzDisposeWay",
      success(res) {
        console.log(res.data)
        if (res.data==2){
          that.setData({
            accepted:true,
            refundType: res.data,
            title: '退货退款'
          })
        }else{
          that.setData({
            accepted:false,
            refundType: res.data,
            title: '申请售后'
          })
        }
        
      }
    })
    wx.getStorage({
      key: "myxzOrderType",
      success(res) {
        console.log(res.data)
        that.setData({
          orderType:res.data
        })
      }
    })

    
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      }),
      selectReasonArr,
      selectArr
    });

    console.log(this.data.list)
    
  },
  onShow: function () {
    util.mdFun(this, '', '')
  }

})
