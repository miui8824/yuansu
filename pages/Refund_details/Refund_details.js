// pages/Refund_details/Refund_details.js
import Dialog from '../../dist/dialog/dialog';
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title: '退款详情',
    state1: false,
    state2: false,
    state3: false,
    state4: false,
    state5: false,
    rejectReason:"",
    aftersaleid: -1,
    aftersaleTime: "",
    refundEndTime: "",
    auditTime: "",
    cancelSuccess: false,
    rejected: false,
    refundType: 1,
    refundSuccessNum: "",
    data_refond: [],
    userExpressNum:"",
    userExpressCompany:"",
    deliverAddress:"",
    deliverName:"",
    deliverPhone:"",
    day:"",
    hour:"",
    minute:"",
    timer:null,
    expressNum:"",
    expressCompany:"",
    rejectedUrlList:[],
    activityType:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    let { aftersaleTime } = this.data
    let that = this
    wx.getStorage({
      key: 'createTimeValue',
      success: function (res) {
        let aftersaleTime = res.data
        that.setData({
          aftersaleTime
        })
      },
    })

    
    this.setData({
      aftersaleid: query.id
    })
  },
  onShow:function(){
    this.getAftersaleDetail()
    util.mdFun(this, '', '')
  },

  goHome(){
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

  whichNav() {
    let { refundType } = this.data
    if (refundType == 1) {
      this.setData({
        title: '退款详情'
      })
    } else if (refundType == 2) {
      this.setData({
        title: '退货退款详情'
      })
    }
  },

  // 获取退款详情
  getAftersaleDetail() {
    let { aftersaleid, refundEndTime, rejectReason, activityType } = this.data;
    let reqObj = {
      url: `/api/orderRefund/detail?id=${aftersaleid}`
    }

    util.RequestGet(reqObj, null, (res, message) => {
      console.log(res)
      res.model.expRefundAmt = Number(res.model.expRefundAmt).toFixed(2);
      //仅退款且退款完成
      if (res.model.refundStatus == 12 && res.model.refundType == 1) {
        this.setData({
          state1: true,
          state2: true,
          state3: true,
          refundSuccessNum: Number(res.model.actRefundAmt + res.model.avlRefundAmt).toFixed(2)
        })
      } else if (res.model.refundStatus == 12 && res.model.refundType == 2) { //退货退款且退款完成
        this.setData({
          state1: true,
          state2: true,
          state3: true,
          state4: true,
          state5: true,
          refundSuccessNum: Number(res.model.actRefundAmt + res.model.avlRefundAmt).toFixed(2)
        })
      } else if (res.model.refundStatus == 10) {//待审核
        this.setData({
          state1: true
        })
      } else if (res.model.refundStatus == 11) {//（退款）退款审核通过
        this.setData({
          state1: true,
          state2: true
        })

      } else if (res.model.refundStatus == 13) {//（退款）退款审核未通过
        this.setData({
          rejected: true,
          auditTime: res.model.refundEndTimeValue,
          rejectReason: res.model.rejectReason.toString()
        })
      } else if (res.model.refundStatus == 14) {//退款已取消
        this.setData({
          cancelSuccess: true,
          refundEndTime: res.model.refundEndTimeValue
        })
      } else if (res.model.refundStatus == 15 || res.model.refundStatus == 16) {//（退货）退货审核通过 ||用户退货中
        this.setData({
          state1: true,
          state2: true,
          state3: true,
          deliverAddress: res.model.deliverAddress,
          deliverName: res.model.deliverName,
          deliverPhone: res.model.deliverPhone,
          userExpressCompany: res.model.userExpressCompany,
          userExpressNum: res.model.userExpressNum
        },()=>{
          if (res.model.refundStatus == 15){
            this.refundCountDown(res.model.timeRemaining/1000)
          }
        })
      } else if (res.model.refundStatus == 17&&res.model.refundType==2) {//（退货）仓库确认收货
        this.setData({
          state1: true,
          state2: true,
          state3: true,
          state4: true
        })
      } else if (res.model.refundStatus == 18) {//（退货）仓库驳回
        this.setData({
          rejected:true,
          auditTime: res.model.refundEndTimeValue,
          rejectReason: res.model.rejectReason.toString(),
          rejectedUrlList: res.model.rejectedUrlList,
          expressCompany: res.model.expressCompany,
          expressNum: res.model.expressNum
        })
      } else if (res.model.refundStatus == 19) {//（退货）自动驳回
        this.setData({
          rejected: true,
          auditTime: res.model.refundEndTimeValue,
          rejectReason: res.model.rejectReason.toString()
        })
      }
      this.setData({
        data_refond: res.model,
        refundType: res.model.refundType,
        activityType: res.model.activityType
      },()=>{
        this.whichNav()
      })
    })

  },


  showDialog() {
    console.log(this.data.aftersaleid)
    let that = this
    Dialog.confirm({
      message: '您将撤销本次退款申请，确定继续吗？'
    }).then(() => {
      let reqObj = {
        url: `/api/orderRefund/undo?id=${that.data.aftersaleid}`
      }

      util.RequestPost(reqObj, null, (res, message) => {
        console.log(res)
        if (message) {
          wx.showToast({
            title: res.resDesc,
            icon: 'none',
            duration: 1500
          })
        }
        if (res.resCode == '0000') {
          that.getAftersaleDetail()
          //成功数据
          that.setData({
            cancelSuccess: true
          })
        }
      })

    }).catch(() => {
      // on cancel
    });



  },




  // 撤销申请
  cancelApplication() {
    let { aftersaleid } = this.data;
    let reqObj = {
      url: `/api/orderRefund/undo?id=${this.data.aftersaleid}`,
      data: {
        aftersaleid
      }
    }

    util.RequestPost(reqObj, null, (res, message) => {
      console.log(res)
      if (message) {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 1500
        })
      }
      if (res.resCode == '0000') {
        //成功数据
        wx.redirectTo({
          url: '/page/applicationCanceled/applicationCanceled',
        })
      }
    })



  },


  /**
 * 生命周期函数--监听页面隐藏
 */
  onHide: function () {
    clearInterval(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
  },


  goRefundLogistic:function(){
    let {data_refond}=this.data
    wx.navigateTo({
      url: `/pages/refundLogistics/refundLogistics?refundId=${data_refond.id}&orderNo=${data_refond.orderNo}&orderNum=${data_refond.orderNum}`,
    })
  },

  //倒计时函数
  refundCountDown: function (leftTime) {
    let { timer } = this.data
    let that = this
    that.setData({
      timer: setInterval(function () {
        let day = 0,
          hour = 0,
          minute = 0
        if (leftTime > 0) {
          day = Math.floor(leftTime / (60 * 60 * 24));
          hour = Math.floor(leftTime / (60 * 60)) - (day * 24);
          minute = Math.floor(leftTime / (60)) - (day * 24 * 60) - (hour * 60);
        }
        if (day <= 9) day = '0' + day;
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        that.setData({
          day,
          hour,
          minute
        })
        leftTime--;
        if (leftTime <= 0) {
          that.getAftersaleDetail();
          clearInterval(that.data.timer);
        }
      }, 1000)
    })
  },
})