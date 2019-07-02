// pages/bindPhone/bindPhone.js
var util = require('../../utils/util.js');
var apiUrl = require('../../static/js/url.js');
import Toast from '../../dist/toast/toast';
Page({
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:'绑定手机',
    codeNumber:60,
    phoneFalse:false,
    codeFalse: false,//应该是不要提示用户验证码输入错误
    phone:'',
    code:'',
    codeText:'获取验证码',
    //禁止 点击
    codeOff:false,
    // twostatus:true
    from:'',

    groupId:'',
    activityId:'',
    goodsId:'',
    out_showinvite:''
  },
  onLoad: function (options) {
    if (options.from){
      this.setData({
        from: options.from
      })
    }
    //用户点击拼团分享 发现没手机号
    if (options.groupId){
      this.setData({
        groupId: options.groupId,
        activityId: options.activityId,
        goodsId: options.goodsId,
        out_showinvite: options.out_showinvite
      })
    }
   
    wx.setNavigationBarTitle({
      title: "绑定手机"//页面标题为路由参数  
    })
  },
  onShow: function () {
    util.mdFun(this, '', '')
  },
  onReady: function () {},
  bindPhone() {
    console.log(this.data.phone, this.data.phone);
    if (!(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.data.phone))){
     
      Toast('请输入正确的手机号');
      return;
    }
    if (this.data.code == '' && this.data.phone == '' ){
      console.log('2')
      Toast('请输入正确的手机号和验证码');
      // if (){
      //   console.log('3')
      //   Toast('请输入手机号');
      // }
      return false
    } else if (this.data.code == ''){
     
      Toast('请输入正确的验证码');
    } else if (this.data.phone == '' ){
     console.log('dsds')
      Toast('请输入正确的手机号');
    }else{
      let that = this
      let token = wx.getStorageSync('myxzToken');
      let client = 1;
      let url = apiUrl.API_URL +'/api/wxOpenUser/auth/mobile';
      console.log(token);
      if (token) {
        // let header = Object.assign({ 'auth-token': token }, headerData);
        wx.request({
          url: url,
          method: "POST",
          data: {
            phoneNum: this.data.phone+'',
            code: this.data.code+''
          }, 
          header: {
            'auth-token': token,  
            'client': client
          },
          success(res) {
            console.log(res);
            if (res.data.resCode=='0000'){
              console.log(res.data.resDesc)
              // if(res.)
              // console.log(res)
              wx.hideLoading();
              // wx.showToast({
              //   title: '绑定成功',
              //   icon: 'succes',
              //   duration: 1000,
              //   mask: true
              // });
              Toast('绑定成功');
              let oldData = wx.getStorageSync('myxzUserInfo');
              if (oldData) {
                let newData = Object.assign(oldData, res.data.data)
                wx.setStorageSync('myxzUserInfo', newData);
              } else {
                wx.setStorageSync('myxzUserInfo', res.data);
              }
              if (that.data.from){
                wx.navigateBack()
              } else if (that.data.groupId){
                //如果参团 进来绑定手机号  跳转到商品详情
                wx.reLaunch({
                  url: '/pages/groupDetails/groupDetails?groupId=' + that.data.groupId + '&activityId=' + that.data.activityId + '&goodsId=' + that.data.goodsId + '&out_showinvite=true',
                })
              }else{
                wx.switchTab({
                  url:"/pages/mySelf/mySelf"
                })
              }
            }else{
              console.log(res.data.resDesc)
              Toast(res.data.resDesc);
            }


          }
        })
      } else {
        Toast('验证码错误');
        console.log('跳转授权页面');
        wx.navigateTo({
          url: "/pages/init/init"
        })
      }
    }
  },
  changePhone(event){
    if(event.detail.length==0){
      this.setData({ phoneFalse: false });
      return false;
    }
    this.setData({ phone: event.detail, phoneFalse: false, codeOff: false})
  },
  testPhone(){
    if (!(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.data.phone))){
      this.setData({ phoneFalse:true})
    }else{
      this.setData({ phoneFalse: false })
    }
  },
  settime(){
   let that = this
    if (this.data.codeNumber == 0 ) {
        that.setData({
          codeText: '获取验证码',
          codeOff: false
        });
      } else {
        that.setData({
          codeText: this.data.codeNumber + 's',
          codeOff: true
        });
        // console.log(that.data.codeOff);

        setTimeout(() => {
          that.setData({
            codeNumber:this.data.codeNumber-1,
          });
          that.settime()
        }, 1000)
      }
    
  },
  a(){
    console.log('dd')
  },
  yanzhengma() {
    let that = this
    let token = wx.getStorageSync('myxzToken');
    let client = 1;
    let url = apiUrl.API_URL +'/api/sms/code/send';
    console.log(token);
    if (token) {
      // let header = Object.assign({ 'auth-token': token }, headerData);
      wx.request({
        url: url,
        data: {
          phoneNum: this.data.phone,
          type:1
        }, // 仅为示例，并非真实的接口地址
        header: {
          'auth-token': token , 
          'client' :client
        },
        success(res) {
          console.log(res);
          wx.hideLoading();
          if (res.data.resCode!="0000"){
            Toast(res.data.resDesc);
          } else if(res.data.resCode=='0000'){
            Toast("发送成功");
            that.setData({
              codeNumber:60
            },function(){
              that.settime();
            })
          }
         
         
        
        }
      })
    } else {
      console.log('跳转授权页面');
      wx.navigateTo({
        url: "/pages/init/init"
      })
    }
  },
  changeCode(event){
    if (event.detail.length == 0) {
      this.setData({ codeFalse: false });
      return false;
    }
    this.setData({ code: event.detail })
  },
  testCode() {
    console.log(this.data.codeOff);
    // let codeNumber=60;
    //发请求获取验证码 得到结果 也要提示是否通过
    if (this.data.codeOff == true  ){
      return false;
    }else{
      if (this.data.phone != ''){ 
        if (!(/^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/.test(this.data.phone))){
          Toast('请输入正确的手机号');
        }else{
          this.setData({
            codeOff:true
          })
          this.yanzhengma();
        }
        
      }else{
        Toast('请输入正确的手机号');
        console.log(this.data.phoneFalse)
        return false;
    }
    }

    // settime();

    // this.data.phone
    // let reqObj = {
    //   url: '/api/myOrder/findAllOrderByUser',
    //   data: {
    //     iPage: this.data.page,
    //     pageSize: this.data.pageSize
    //   }
    // }
    // util.RequestGet(reqObj, null, (res, message) => {
    //   if (message) {
    //     wx.showToast({             title: res.resDesc,             icon: 'none',             duration: 1500           });
    //   }
    //   if (res.resCode == '0000') {
    //     //成功数据
    //   }
    // })


    // let reqObj = {
    //   url: '/api/wxOpenUser/auth/wheatId',
    //   data: {
    //     wheatId: 'QQ374046604'
    //   }
    // }
    // util.RequestPost(reqObj, null, (res, message) => {
    //   if (message) {
    //     wx.showToast({             title: res.resDesc,             icon: 'none',             duration: 1500           });
    //   }
    //   if (res.resCode == '0000') {
    //     //成功数据
    //   }
    // })
  }
})