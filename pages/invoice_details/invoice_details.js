// pages/invoice_details/invoice_details.js
const app = getApp()
var apiUrl = require('../../static/js/url.js');
var util = require('../../utils/util.js');
import Toast from '../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title: '发票详情',
    id:"",
    imgArr: [
      'http://bpic.588ku.com/element_origin_min_pic/16/10/30/528aa13209e86d5d9839890967a6b9c1.jpg',
      'http://bpic.588ku.com/element_origin_min_pic/16/10/30/54fcef525fa8f6037d180f3c26f3be65.jpg',
      'http://bpic.588ku.com/element_origin_min_pic/16/10/30/62e3ca3a02dddb002eff00482078d194.jpg',
      'http://bpic.588ku.com/element_origin_min_pic/16/10/31/c7167fcfb4ebcd12621c05b0c852e98e.jpg'
    ]
  },
  previewImage: function (e) {
    console.log(e);
    console.log(this.data.imgArr );
    const img = []
    for(var i =0;i<this.data.imgArr.length;i++){
      img.push(this.data.imgArr[i].fileUrl);
    }
    console.log(img)
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: img // 需要预览的图片http链接列表
    })
  }  ,
  fp_xiangqing2() {
    let token = wx.getStorageSync('myxzToken');
    let reqObj = {
      url: '/api/myOrderInfo/invoiceDetail? auth-token=' + token,
      data: {
        orderId: this.data.id,
      }
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
      }
      if (res.resCode == '0000') {
        console.log(res);
        this.setData({
          imgArr:res.data.fileList
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
    this.setData({
      id:options.id
    })
    this.fp_xiangqing2();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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