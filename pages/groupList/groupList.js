// pages/groupList/groupList.js
const app = getApp()
var apiUrl = require('../../static/js/url.js');
var util = require('../../utils/util.js');
Page({
  data: {
    showIcon:true,
    activityId:'',//活动id
    goodsId:'',//商品ID
    goodTitle:'',//商品介绍
    price:'0.00',//价格
    goodImg:'',//商品主图
    groupList:[],//拼团列表数据
  },
  onLoad: function (options) {
    if (options.goodsId){
      this.setData({
        activityId: options.activityId,
        goodsId: options.goodsId,
        goodImg: options.goodImg,
        price: options.price,
        goodTitle: options.title,
      }, () => {
        this.getGroupList();
      });
    }
  },
  onShow: function () {

  },
  //得到拼团列表数据
  getGroupList() {
    let reqObj = {
      url: '/api/goods/group/list?activityId=' + this.data.activityId + '&goodsId=' + this.data.goodsId,
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
        //成功数据
        let groupList = res.data;
        setInterval(() => {
          for (let iii of groupList) {
            iii.remainderTime = iii.remainderTime - 1000;
            iii.remainderTimeData = this.countTime1(iii.remainderTime);
          }
          this.setData({
            groupList: groupList
          })
        }, 1000)
      }
    })
  },
  //去参团
  goToSpell(event){
    wx.navigateTo({
      url: '/pages/groupDetails/groupDetails?activityId=' + event.currentTarget.dataset.activityid + '&goodsId=' + event.currentTarget.dataset.goodsid + '&groupId='+ event.currentTarget.dataset.groupid
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
    return '' + hh + ':' + m + ':' + s;
  }
})