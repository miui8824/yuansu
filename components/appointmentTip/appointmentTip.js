// components/appointmentTip/appointmentTip.js
const app = getApp()
var apiUrl = require('../../static/js/url.js');
var util = require('../../utils/util.js');
Component({
  properties: {
    testdata:{
      type:Number,
      value:0
    }
  },
  //新版声明 生命周期
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached() {
      //初始化全局的 定时器
      this.theTimer=null;
      let _this=this;
      _this.setData({
        appointmentTimeData: app.globalData.appointmentTimeData
      })
      app.watch$('appointmentTimeData', (n, o) => {
        if(n.length>0){
          //清掉计时器
          clearInterval(this.theTimer);

          //第一次触发定时器
          n.forEach((item, index) => {
            item.toBeginTime = item.toBeginTime - 1000;
            //倒计时转换 为 时分秒
            let timeArr = _this.countTime1(item.toBeginTime);
            item.hhhh = timeArr[0]
            item.mmmm = timeArr[1]
            item.ssss = timeArr[2]
          })
          _this.setData({
            appointmentTimeData: n,
            tipShow: app.globalData.openGroupTip
          },()=>{
            this.theTimer = setInterval(() => {
              n.forEach((item, index) => {
                item.toBeginTime = item.toBeginTime - 1000;
                //倒计时转换 为 时分秒
                let timeArr = _this.countTime1(item.toBeginTime);
                item.hhhh = timeArr[0]
                item.mmmm = timeArr[1]
                item.ssss = timeArr[2]
                console.log(item.hhhh,item.mmmm,item.ssss);
              })
              _this.setData({
                appointmentTimeData: n
              })
            }, 1000)
          })
        }
      })
    },
    
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  data: {
    //拼团数据
    appointmentTimeData:[],
    hhhh:'00',
    mmmm:'00',
    ssss:'00',
    //蹦出弹出款
    tipShow:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToSpell(event){
      this.setData({
        tipShow: false
      })
      setTimeout(()=>{
        wx.navigateTo({
          url: '/pages/groupDetails/groupDetails?activityId=' + event.currentTarget.dataset.activityid + '&goodsId=' + event.currentTarget.dataset.goodsid
        })
      },500)
    },
    closeTip(){
      app.globalData.openGroupTip = false;
      this.setData({
        tipShow: false
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
      }else{
        return ['00', '00', '00'];
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
      return [hh,m,s]
    }
  }
})
