// pages/myRegiment/myRegiment.js
const app = getApp()
var apiUrl = require('../../static/js/url.js');
var util = require('../../utils/util.js');
import Toast from '../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    active: 0,
    navNames: ['拼团中', '拼团成功', '拼团失败'],
    orderList:[

    ],
    page:1,
    iPage:1, //进来默认显示第一页
    type:1 //进来默认 显示拼团中的列表
  },

  //切换标签页所执行的方法
  onChange(event) {
    console.log(this.data.orderList.length);
    let that = this;
    console.log(event.detail.index + 1);
    if (event.detail.index + 1==1){
      this.findGroupByType(1, 2);
      // this.setData({
      //   orderList: [{},{}]
      // })
    } else if (event.detail.index + 1==2){
      // that.setDate({
      //   orderList:[]
      // })
      this.findGroupByType(1, 3);
      // this.setData({ page: 2, orderList:[]})
      console.log(this.data.page);
    } else if (event.detail.index + 1==3){
      this.findGroupByType(1, 4);
      // this.setData({
      //   orderList: [{}, {},{}]
      // })
    }
  },

  GO_details(data){
    console.log(data.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/myRegimentDetails/myRegimentDetails?groupBuyingId=' + data.currentTarget.dataset.id
    })
  },
  // 去首页
  goHome() {
    this.onUnload = function () { };
    wx.switchTab({ url: '/pages/home/home' });

  },
  // 我的拼团列表
  findGroupByType(iPage, type){
    console.log(type,iPage);
    let token = wx.getStorageSync('myxzToken');
    //  token = "t_1_1_eeabc2c9-939b-4026-acdc-590eb1fb7067"
    let reqObj = {
      url: '/api/myGroup/findGroupByType?auth-token=' + token,
      data: {
        iPage: iPage,
        pageSize: 10,
        type: type
      }
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {  
        wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
      }
      if (res.resCode == '0000') {
        console.log(res);
        for (let i of res.resultList) {
          i.realPayAmout = Number(i.realPayAmout).toFixed(2);
          for(let j of i.orderGoods){
            j.goodPrices = Number(j.goodPrices).toFixed(2);
          }
          
        }
        this.setData({
          orderList: res.resultList
        })
       
        console.log(res);

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.navNames.length);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.findGroupByType(1,2);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})