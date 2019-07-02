// pages/addId/addId.js
var util = require('../../utils/util.js');
var areaListData = require('../../static/js/add.js');
var url = require('../../static/js/url.js');
const app = getApp();
Page({
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    addId:'',//当前身份证的地址的那个ID
    idCard: '',
    iscardSm: '', //身份证正面照
    iscardFm: '', //身份证反面照
  },
  onLoad: function (options) {
    //需要获取到
    if (options.id){
      this.setData({
        addId: options.id
      })
    }
  },
  onShow: function () {

  },
  //输入身份证
  inputIdCard(e) {
    this.setData({
      idCard: e.detail.value
    })
  },
  //新增正面照
  addSmCard() {
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: url.API_URL + '/api/file/upload', // 仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          //参数
          formData: {
            busiType: 4,
            fileType: 2
          },
          name: 'file',
          success(res) {
            const data = res.data
            let _data = JSON.parse(data);
            if (_data.resCode == '0000') {
              _this.setData({
                iscardSm: _data.data
              })
            } else if (_data.resCode == '9001') {
              wx.showToast({
                icon: 'none',
                title: _data.resDesc,
              })
            }
          }
        })
      }
    })
  },
  addFmCard() {
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: url.API_URL + '/api/file/upload', // 仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          //参数
          formData: {
            busiType: 4,
            fileType: 2
          },
          name: 'file',
          success(res) {
            const data = res.data
            let _data = JSON.parse(data);
            if (_data.resCode == '0000') {
              _this.setData({
                iscardFm: _data.data
              })
            } else if (_data.resCode == '9001') {
              wx.showToast({
                icon: 'none',
                title: _data.resDesc,
              })
            }

          }
        })
      }
    })
  },
  closeSmImage() {
    this.setData({ iscardSm: '' })
  },
  closeFmImage() {
    this.setData({ iscardFm: '' })
  },
  bindSuccess(){
    if (this.data.idCard) {
      if (!(/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.data.idCard) ||
        /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/.test(this.data.idCard))) {
        wx.showToast({
          title: '请输入正确的身份证号码',
          icon: 'none',
          duration: 1500
        });
        return false;
      }
    }
    console.log({
      id: this.data.addId,
      idCard: this.data.idCard,
      iscardFm: this.data.iscardFm,
      iscardSm: this.data.iscardSm
    })
    let reqObj = {
      url: '/api/user/address/certifiCation',
      data: {
        id:this.data.addId,
        idCard: this.data.idCard,
        iscardFm: this.data.iscardFm,
        iscardSm: this.data.iscardSm
      }
    }
    util.RequestPost(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({
          title: res.resDesc,
          icon: 'none',
          duration: 1500
        })
      }
      if (res.resCode == '0000') {
        //获取当前的身份证和地址
        let _goodsDetails = app.globalData.goodsDetails;
        _goodsDetails.data.userAddresses = res.data;
        app.globalData.goodsDetails = _goodsDetails;
        //成功数据
        wx.showToast({
          title: '实名认证成功！',
          icon: 'success',
          duration: 1500
        })
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    })
  }
})