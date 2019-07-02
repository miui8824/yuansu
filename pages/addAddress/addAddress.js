// pages/addAddress/addAddress.js
var util = require('../../utils/util.js');
var areaListData = require('../../static/js/add.js');
var url = require('../../static/js/url.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:'新增地址',
    checked:false, //开关
    areaList: areaListData,
    show:false,
    activeAdd:"", //选中地址

    id:'',
    name:'',
    phone:'',
    addDetails:'',
    idCard:'',
    // iscardSm:'https://file.maiyatown.com/static/sfzxx2018122211041765117.jpg', //身份证正面照
    // iscardFm: 'https://file.maiyatown.com/static/sfzxx2018122211114613426.jpg', //身份证反面照
    iscardSm: '', //身份证正面照
    iscardFm: '', //身份证反面照

    province: '',// 省
    city:'',//市
    location:'',//区
    isAddButton:true,
    stopSend:true
  },
  onLoad(option){
    //加载数据
    if(option.id){
      wx.setNavigationBarTitle({
        title: '编辑地址'
      })
      this.setData({
        title: '编辑地址',
        isAddButton:false,
        province: option.province,
        city: option.city,
        location: option.location,
        name: option.consigneeName,
        phone: option.phoneNum,
        addDetails: option.detailAddress,
        idCard: option.idCard,
        id: option.id,
        checked: option.isDefault==1?true:false,
        iscardSm: option.iscardSm, //身份证正面照
        iscardFm: option.iscardFm, //身份证反面照
        activeAdd: option.province+ option.city+option.location //选中地址
      }
        // , function () {
        //   //埋点函数 页面操作事件 下一个页面地址
        //   util.mdFun(this, '', '')
        // }
      )
    }
    // else {
    //   //埋点函数 页面操作事件 下一个页面地址
    //   util.mdFun(this, '', '')
    // }
  },
  onShow: function () {
    util.mdFun(this, '', '')
  },
  addClick(){
    this.setData({
      show:true
    })
  },
  activeAddFun(event){
    let add='';
    let obj = event.detail.values;
    for (let i of obj){
      if (obj.indexOf(i)==0){
        add +=i.name;
      }else{
        add += "-" + i.name;
      }
      
    }
    this.setData({
      activeAdd:add,
      show: false,
      province: obj[0].name||'',
      city: obj[1].name||'',
      location: obj[2].name||''
    })
  },
  activeAddOff(){
    this.setData({
      show: false
    })
  },
  onChange({ detail }){
    this.setData({
      checked: detail
    })
  },
  inputPhone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  inputName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  inputAdd(e){
    this.setData({
      addDetails: e.detail.value
    })
  },
  inputIdCard(e){
    this.setData({
      idCard: e.detail.value
    })
  },
  //保存地址
  bindSuccess(){
    let _this = this
    let { stopSend } = this.data

    if (!(/^[\u0391-\uFFE5]+$/.test(this.data.name))||this.data.name.length<2) {
      wx.showToast({
        title: '收货人姓名输入不正确',
        icon: 'none',
        duration: 1500
      });
      return false;
    } 
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.data.phone))) {
      wx.showToast({
        title: '联系电话输入格式不正确',
        icon: 'none',
        duration: 1500
      });
      return false;
    } 
    if (!this.data.activeAdd){
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none',
        duration: 1500
      });
      return false;
    }
    if (this.data.addDetails.length<5) {
      wx.showToast({
        title: '详细地址输入格式不正确',
        icon: 'none',
        duration: 1500
      });
      return false;
    } 
    let reqObj = {
      url: '/api/user/address/add',
      data: {
        city: this.data.city,
        consigneeName: this.data.name,
        detailAddress: this.data.addDetails,
        idCard: this.data.idCard,
        iscardFm: this.data.iscardFm,
        iscardSm: this.data.iscardSm,
        isDefault: this.data.checked?1:2,
        location: this.data.location,
        phoneNum: this.data.phone,
        province: this.data.province,
      }
    }
    if(stopSend){
      this.setData({
        stopSend:false
      })
      util.RequestPost(reqObj, null, (res, message) => {
        if (message) {
          this.setData({
            stopSend:true
          })
          wx.showToast({
            title: res.resDesc,
            icon: 'none',
            duration: 1500
          })
        }
        if (res.resCode == '0000') {
          //成功数据
          wx.showToast({
            title: '新增地址成功！',
            icon: 'success',
            duration: 1500
          })
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      })
    }else{
      return false
    }


  },
  editorAdd(){
    let reqObj = {
      url: '/api/user/address/update/address',
      data: {
        id:this.data.id,
        city: this.data.city,
        consigneeName: this.data.name,
        detailAddress: this.data.addDetails,
        idCard: this.data.idCard,
        iscardFm: this.data.iscardFm,
        iscardSm: this.data.iscardSm,
        isDefault: this.data.checked?1:2,
        location: this.data.location,
        phoneNum: this.data.phone,
        province: this.data.province,
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
        //成功数据
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1500
        })
        //如果修改成功 且 填了身份证
        if (this.data.idCard && this.data.iscardFm && this.data.iscardSm && this.data.name){
          let addActive={
            id:this.data.id,
            city: this.data.city,
            consigneeName: this.data.name,
            detailAddress: this.data.addDetails,
            idCard: this.data.idCard,
            iscardFm: this.data.iscardFm,
            iscardSm: this.data.iscardSm,
            isDefault: this.data.checked?1:2,
            location: this.data.location,
            phoneNum: this.data.phone,
            province: this.data.province,
            isCard:1
          }
          //选择当前地址 
          let _goodsDetails = app.globalData.goodsDetails;
          _goodsDetails.data.userAddresses = addActive;
          app.globalData.goodsDetails = _goodsDetails;
        }
        wx.navigateBack();
        //url: '/pages/addressManagement/addressManagement'
      }
    })
  }
})