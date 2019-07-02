// pages/addressManagement/addressManagement.js
var util = require('../../utils/util.js');
import Dialog from '../../dist/dialog/dialog';
const app = getApp();
Page({
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:'地址管理',
    addShow:false,
    addList:[],
    couponid:'',//优惠券ID
    addActive:{},//当前选中地址
    onGo:true
  },
  onLoad(options){
    if(options.couponid){
      this.setData({
        couponid:options.couponid
      })
    }
  },
  onShow(){
    this.getAddList();    
    util.mdFun(this, '', '');
    this.setData({
      onGo:true
    })
  },
  getAddList(){
    let reqObj = {
      url: '/api/user/address/list',
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
        if (!res.data){
          this.setData({
            addShow:false
          })
          app.globalData.goodsDetails.data.userAddresses = {};
        }else{
          //默认选中地址 
          let addActive={};
          for(let i of res.data){
            if (i.isDefault==1){
              addActive=i;
            }
          }
          if (Object.keys(addActive).length!=0){
            //选择当前地址 
            let _goodsDetails = app.globalData.goodsDetails;
            _goodsDetails.data.userAddresses = addActive;
            app.globalData.goodsDetails = _goodsDetails;
          }else{
            app.globalData.goodsDetails.data.userAddresses = {};
          }

          //成功数据
          this.setData({
            addList: res.data.length < 1 ? [] : res.data,
            addShow: res.data.length < 1 ? false : true,
            addActive: addActive
          })
        }
      }
    })
  },
  //编辑地址
  editorAdd(event){
    let objData = event.currentTarget.dataset.item;
    let urlObj='';
    for (let i in objData){
      urlObj+=i+'='+objData[i]+'&';
    }
    urlObj = urlObj.substr(0, urlObj.length-1);
    wx.navigateTo({
      url: '/pages/addAddress/addAddress?' + urlObj,
    })
    this.getAddList(); 
  },
  //删除
  deleteAdd(event){
    Dialog.confirm({
      title: '确定要删除该地址吗？',
      message:"   "
    }).then(() => {
      let objData = event.currentTarget.dataset.item;
      let reqObj = {
        url: '/api/user/address/del?id=' + objData.id,
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
          this.getAddList();

        }
      })

    }).catch(() => {
      // on cancel
    });

  },
  //选择当前地址 也是默认地址
  isDefaultChange(event){
    let objData = event.currentTarget.dataset.item;
    let index = event.currentTarget.dataset.index;
    objData.isDefault=objData.isDefault==1?2:1;
    
    //选择当前地址 
    let _goodsDetails = app.globalData.goodsDetails;
    _goodsDetails.data.userAddresses = objData;
    app.globalData.goodsDetails = _goodsDetails;
    
    let reqObj = {
      url: '/api/user/address/isDefault?id=' + objData.id +'&isDefault=1'
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
        this.getAddList();
      }
    })
  },
  //确认兑换
  exchangeSuccess(){
    if (Object.keys(this.data.addActive).length != 0 && this.data.addList.length!=0){
      let add = this.data.addActive;
      let address = '' + add.consigneeName + add.phoneNum + add.province + add.city + add.location + add.detailAddress;
      let reqObj = {
        url: '/api/user/couponExchange?address=' + address + '&id=' + this.data.couponid
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
            title: '兑换成功',
            icon: 'success',
            duration: 1500
          })
          setTimeout(function () {
            wx.navigateBack();
          }, 1500)
        }
      })
    }else{
      wx.showToast({
        icon:'none',
        title: '请添加地址！',
      })
    }
    
  },
  goAddAdd(){
    let { onGo } = this.data 
    if(onGo){
      this.setData({
        onGo:false
      })
      wx.navigateTo({
        url: '/pages/addAddress/addAddress',
      })
    }

  }
})