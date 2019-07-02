// pages/logistics/logistics.js
import Dialog from '../../dist/dialog/dialog';
var util = require('../../utils/util.js');
Page({
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:'物流详情',
    orderParty:'',
    danhao:'',
    logisticsData:[]
    // phone:"",
    // _outContext:[],
    // other:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.getOrderDetail(options.com, options.num);
    this.setData({
      orderParty: options.name,
      danhao:options.num
    })
    // this.getOrderDetail('jd', '78616095362')
  },
  onShow(){
    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, '', '');
  },
  getOrderDetail(com,num){
    let reqObj = {
      url: '/api/express/expressFormat',
      data: {
        com: com,
        num: num
      }
    }
    util.RequestPost(reqObj, null, (res, message) => {
      if (message) {
        // wx.showToast({
        //   title: res.resDesc,
        //   icon: 'none',
        //   duration: 1500
        // })
      }
      if (res.resCode == '0000') {
     
        this.setData({
          logisticsData:res.data
        })
        // let context = res.data.data[0].context;
        // let selectArr = context.match(/(((13[0-9])|(15[^4])|(18[0,1,2,3,5-9])|(17[0-8])|(147))\d{8})/g)
        // let outContext = context.split(selectArr[0]);
        // let _outContext=[]
        // for (let i = 0; i < outContext.length;i++){
        //   _outContext.push(outContext[i])
        //   _outContext.push(selectArr[0]);
        // }
        // _outContext.length = _outContext.length-1;
        // console.log(_outContext);
        // let isNaNArr=[]
        // for(let i of _outContext){
        //   if(isNaN(Number(i))||i==""){
        //     isNaNArr.push(false)
        //   }else{
        //     isNaNArr.push(true)
        //     this.setData({
        //       phone: i,
        //       _outContext
        //     })
        //   }
        // }
        // let other = _outContext.splice(2).join()
        // console.log(isNaNArr)
        // console.log(other)
        // //成功数据
        // this.setData({
        //   orderDetail: res.data,
        //   other
        // })
      }
    })
  },
  call(e){

    let phone = e.currentTarget.dataset.phone;
    let isnumber = e.currentTarget.dataset.isnumber;
    if(isnumber==1){
      wx.makePhoneCall({
        phoneNumber: phone
      })
    }else{
      return false
    }
    
  }
})