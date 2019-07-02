// pages/bindPhone/bindPhone.js

var util = require('../../utils/util.js');
var apiUrl = require('../../static/js/url.js');
import Toast from '../../dist/toast/toast';
Page({
  data: {
    showIcon: false,//引入的自定义导航左边返回按钮
    title:'绑定微信',
    wechat: '',
    phoneFalse:false
  },

  onLoad: function (options) {
  },
  onShow: function () {
    util.mdFun(this, '', '')
  },
  onReady: function () { 
    wx.setNavigationBarTitle({
      title: "绑定微信"//页面标题为路由参数  
    })
  }, 

  bindWechat() {

    if (this.data.wechat.match(/^\s*$/)) {
      // this.setData({ phoneFalse: false });
      Toast('请输入要绑定的微信号');
      return false;
    }else{
      let wechat = this.data.wechat

      let that = this
      let token = wx.getStorageSync('myxzToken');
      let client = 1;
      let url = apiUrl.API_URL +'/api/wxOpenUser/auth/wheatId?wheatId=' + wechat;

      if (token) {
        // let header = Object.assign({ 'auth-token': token }, headerData);
        wx.request({
          url: url,
          method: "POST",
          data: {
            // "":wechat
          },
          header: {
            'auth-token': token,
            'client': client
          },
          success(res) {
            wx.hideLoading();
            wx.showToast({
              title: '绑定成功',
              icon: 'succes',
              duration: 1000,
              mask: true
            });
            wx.switchTab({
              url: "/pages/mySelf/mySelf"
            })
          }
        })
      } else {
        Toast.fail('验证码错误');

        wx.redirectTo({
          url: "/pages/init/init"
        })
      }
    }

  },
  // bindWechat() {
  //   if (this.data.wechat.length == 0) {
  //     this.setData({ phoneFalse:true});
  //     return false;
  //   }

  //   let reqObj = {
  //     url: '/api/wxOpenUser/auth/wheatId?wheatId=' + this.data.wechat,
  //   }
  //   util.RequestPost(reqObj, { client: 1 }, function (res, message) {
  //     if (message) {
  //       wx.showToast({
  //         title: res.resDesc,
  //         icon: 'none',
  //         duration: 1500
  //       });
  //       wx.showToast({
  //         title: '绑定成功',
  //         icon: 'success',
  //         duration: 2000
  //       });
  //       setTimeout(() => {
  //         wx.navigateBack();
  //       }, 1500)
  //     }
  //   })
  // },
  changePhone(event) {
    if (event.detail.length == 0) {
      // this.setData({ phoneFalse: false });

      return false;
    }
    this.setData({ wechat: event.detail, phoneFalse: false })
  },
  testPhone() {
    if (this.data.wechat.length == 0) {
      this.setData({ phoneFalse: true });
      return false;
    }
  }
})