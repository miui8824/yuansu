// pages/myIntegral/myIntegral.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:"积分明细",
    loadMoreType:true,
    loadMoreTip:true,
    page:1,
    pageSize:10,
    noneHeight: "",
    _num: "",
    _integral: [
     
    ],
    orderList:[

    ],
    showNoOrder:true,
    height:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this=this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          noneHeight: res.screenHeight - 280,
        });
      },
    });
    //计算下拉框的 高度
    wx.getSystemInfo({
      success: (res) => {
        wx.createSelectorQuery().select('.top').boundingClientRect(function (rect) {
          var is_1_height = Number(rect.height) // 节点的宽度
          _this.setData({
            height: Number(res.windowHeight) - is_1_height-50
          });
        }).exec();
      }
    });
  },
  loadMore() {
    if (!this.data.loadMoreType) {
      return false;
    }
    this.setData({ page: this.data.page + 1, loadMoreTip: true });
    this.point(this.data.page);
  },
  point(pageNumber) {
 
    let _this = this;
    let reqObj = {
      url: '/api/user/integral/list',
      data: { pageNum: this.data.page, pageSize: this.data.pageSize }
    }
    util.RequestGet(reqObj, '', (res, message) => {
     
      _this.setData({
        _num: res.model.totalSum
      })
      if (message) {
        wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
      }
      this.setData({ loadMoreTip: false });
      //第一次发请求
      if (_this.data.page == 1) {
        if (res.resultList.length == 0) {
          _this.setData({ showNoOrder: true });
          return false;
        } else {
          // if (res.resultList.length<10){
          //   _this.setData({ loadMoreType: false });
          // }
          for (let i of res.resultList){
              i.couponValue = Number(i.couponValue).toFixed(0);
          }
          _this.setData({ orderList: res.resultList})
        }
      
      } else {
        if (res.resultList.length <10) {
          for (let i of res.resultList) {
            i.couponValue = Number(i.couponValue).toFixed(0);
          }
          //保持数据不变
          //到底部了
          let allData = [..._this.data.orderList, ...res.resultList];
          _this.setData({ orderList: allData });
          _this.setData({ loadMoreType: false });
        } else {
          for (let i of res.resultList) {
            i.couponValue = Number(i.couponValue).toFixed(0);
          }
          // let allData = _this.data.orderList.concat(res.resultList);
          let allData = [..._this.data.orderList, ...res.resultList];
          _this.setData({ orderList: allData });
          
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, '', '');
    this.point(1)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})