// pages/aftersaleRuleDetail/aftersaleRuleDetail.js
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    space:'\n',
    showIcon: true,//引入的自定义导航左边返回按钮
    title: '售后政策',
    article: '', //富文本内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let reqObj = {
      url: '/api/config/setAfterSalesRules'
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
        console.log(res)
        //初始化富文本
        if(res.data.desc!=null){
          WxParse.wxParse('article', 'html', res.data.desc, this, 0);
        }
      }
    })
  }
})