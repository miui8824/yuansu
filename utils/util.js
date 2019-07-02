//引入公共api地址
var apiUrl = require('../static/js/url.js');
var Base64 = require('../static/js/base64.js');
var Md5 = require('../static/js/md5.js');
const app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// canvas画图分享的发放 （保存图片，绘制分享图）
let eventDraw = function() {
  this.setData({
    GetImage: true
  })
  wx.showLoading({
    title: '绘制分享图片中',
    mask: true
  })
  this.setData({
    painting: {
      width: 375,
      height: 555,
      clear: true,
      views: [
        // 背景图
        {
          type: 'image',
          url: 'https://file.maiyatown.com/images/v1.2/home_bg.png',
          top: 0,
          left: 0,
          width: 375,
          height: 555
        },
        {
          type: 'image',
          url: 'http://yscb.oss-cn-shanghai.aliyuncs.com/pro/static/img/20190621165146153.png',
          top: 12,
          left: 99,
          width: 35,
          height: 35
        },

        {
          type: 'text',
          content: '元素城堡',
          fontSize: 16,
          color: '#402D16',
          textAlign: 'left',
          top: 25,
          left: 146,
          bolder: true
        },

        {
          type: 'image',
          url: 'https://file.maiyatown.com/images/v1.2/home_share_img1.png',
          top: 60,
          left: 32.5,
          width: 310,
          height: 350
        },
        // 二维码图片
        // {
        //   type: 'image',
        //   url: 'https://file.maiyatown.com/images/v1.2/home_share_img3.png',
        //   top: 420,
        //   left: 250,
        //   width: 88,
        //   height: 88
        // },
        {
          type: 'text',
          content: '听说，长得好看的人都加入MAIYA TOWN啦！',
          fontSize: 14,
          color: '#101010',
          textAlign: 'left',
          top: 440,
          left: 32.5,
          lineHeight: 20,
          MaxLineNumber: 2,
          breakWord: true,
          width: 155,
          bolder: true
        }
      ]
    }
  })
}
// 保存图片的方法
let eventSave = function() {
  console.log('aaa')
  console.log(this.data.shareImage);
  wx.saveImageToPhotosAlbum({
    filePath: this.data.shareImage,
    success(res) {
      console.log(res);
      wx.showToast({
        title: '保存图片成功',
        icon: 'success',
        duration: 2000
      })
    }
  })
}
// 获得图片的路径
let eventGetImage = function(event) {
  console.log(event)
  wx.hideLoading()
  const { tempFilePath, errMsg } = event.detail
  if (errMsg === 'canvasdrawer:ok') {
    this.setData({
      shareImage: tempFilePath
    })
  }
}
let RequestGet=function(reqObj,headerData,callback){
  // wx.showLoading({
  //   title: '加载中',
  //   icon: 'loading',
  // })
  let token = wx.getStorageSync('myxzToken');
  console.log(token)
  if (token){
    let header = Object.assign({ 'auth-token': token, client: "1"}, headerData);
    wx.request({
      url: apiUrl.API_URL+reqObj.url,
      data: reqObj.data,
      header: header,
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        // wx.hideLoading();
        if (res.data.resCode == '9100') {
          //token过期
          console.log('init'+new Date().getTime());
          wx.redirectTo({
            url: '/pages/init/init',
          })
        } else if (res.data.resCode == '0000') {
          //成功状态
          callback(res.data);
        } else {
          //成功但是有情况的时候
          callback(res.data, true);
        }
      },
      fail: function (res) { 
        console.log(res);
      }
    }) 
  }else{
    console.log('跳转授权页面',apiUrl.API_URL+reqObj.url,new Date().getTime());
    wx.redirectTo({
      url: "/pages/init/init"
    })
  }
}
let RequestPostHeader = function (reqObj, headerData, callback){
  let header = Object.assign({ "Content-Type": "application/x-www-form-urlencoded"}, headerData);
  RequestPost(reqObj, header, callback);
}
let RequestPost = function (reqObj, headerData, callback) {
  // wx.showLoading({
  //   title: '加载中',
  //   icon: 'loading',
  // })
  let token = wx.getStorageSync('myxzToken');
  if (token) {
    let header = Object.assign({ 'auth-token': token,'client':1 }, headerData);
    wx.request({
      url: apiUrl.API_URL + reqObj.url,
      data: reqObj.data,
      header: header,
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        wx.hideLoading();
        if (res.data.resCode == '9100') {
          //token过期
          console.log('init' + new Date().getTime());
          wx.redirectTo({
            url: '/pages/init/init',
          })
        } else if (res.data.resCode == '0000'){
          //成功状态
          callback(res.data);
        }else{
          //成功但是有情况的时候
          callback(res.data,true);
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  } else {
    console.log('跳转授权页面', apiUrl.API_URL + reqObj.url, new Date().getTime());
    wx.redirectTo({
      url: "/pages/init/init"
    })
  }
}
let postFormId = function (formId){
  // let reqObj = {
  //   url: '/api/message/saveFromID?formId=' + formId,
  // }
  // RequestPost(reqObj, null, (res, message) => {
  //   if (message) {
  //     wx.showToast({
  //       title: res.resDesc,
  //       icon: 'none',
  //       duration: 1500
  //     })
  //   }
  //   if (res.resCode == '0000') {
  //     //成功数据
  //   }
  // })
  let token = wx.getStorageSync('myxzToken');
  wx.request({
    url: apiUrl.API_URL + '/api/message/saveFromID?formId=' + formId,
    header: { 'auth-token': token },
    method: 'POST',
    dataType: 'json',
    success: function (res) {},
    fail: function (res) {
      console.log(res);
    }
  })
}
let confirmGoods = function (subOrderId){
  let reqObj = {
    url: '/api/myOrder/confirmReceipt?subOrderId=' + subOrderId
  }
  RequestPost(reqObj, null, (res, message) => {
    if (message) {
      wx.showToast({
        title: res.resDesc,
        icon: 'none',
        duration: 1500
      })
    }
    if (res.resCode == '0000') {
      //成功数据
    }
  })
}
let commonText1 = ['我在元素城堡等你', '就差你了，跟我们一起加入元素城堡吧', '瞅啥，赶紧点进来呀！', '点我，你会变美的哦！'];
let commonText2 = ['嘘，偷偷地分享一个好东西给你！', '今天的爆款，全平台最低价！', '这是我精选出来的商品，一起买呀！', '这是我精选出来的商品，一起买呀！', '能一起分享好东西的才是闺蜜！'];
//绑定邀请好友
let bindfriend = function(data){
  console.log(data);
  let token = wx.getStorageSync('myxzToken');
  wx.request({
    url: apiUrl.API_URL +'/api/user/bindFriend',
    header: { 'auth-token': token, client: 1},
    method: 'POST',
    data: {
      userId: data
    },
    dataType: 'json',
    success: function (res) {
      console.log('绑定好了')
      console.log(res);
    },
    fail: function (res) {
      console.log(res);
    }
  })
}
//埋单接口
let mdApi=function(data){
  console.log(data)
  let data1=JSON.stringify(data);
  let baseObj=new Base64();
  let data2 = baseObj.encode(data1);
  let token = wx.getStorageSync('myxzToken');
  console.log(apiUrl)
  wx.request({
    url: "http://bpoint.juoke.com/bpdata",
    header: { "auth-token": token },
    method: "POST",
    data: {
      data: data2
    },
    dataType: "json",
    success: function(res) {},
    fail: function(res) {
      console.log(res);
    }
  });
}
//埋点函数
let mdFun = function (thisObj, pageOption, outLink, pageKey){
  console.log(thisObj.data.title || pageKey)
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  let mdObj = {
    "acctId": "10001",   // 小程序 ，10001
    "accessUrl": url,  // 当前页面地址
    "pageKey": pageKey || thisObj.data.title  , // 页面标识/活动关键字
    "pageOption": pageOption||'',   //页面操作事件  可用值：点击客服， 活动id_商品id，banner图
    "outLink": outLink||'',   //下一个页面地址 可用值：banner跳转链接
    "token": wx.getStorageSync('myxzToken'),
    "userId": wx.getStorageSync('myxzUserId'),   // 用户ID 
    "clientSystem": wx.getStorageSync('myxzSystem') //操作系统
  }
  console.log('埋点', mdObj)
  mdApi(mdObj)
}
//md5加密
let apiMd5=function(data){
  return Md5(data)
}
//设置缓存数据 单位是秒
let setCacheData=function(keys,values,times){
  if(times>0){
    let overTime = new Date().getTime() / 1000 + times;
    overTime=overTime*1000;
    console.log(overTime)
    let _value={
      overTime,
      value: values
    }
    wx.setStorageSync(keys, _value);
  }else{
    return false;
  }
}
//获取缓存数据
let getCacheData = function (keys) {
  let nowData = new Date().getTime();
  if (nowData > wx.getStorageSync(keys).overTime){
    //需要发请求了
    return true;
  }else{
    return false;
  }
}

//.. userid 
//得到当前最新的userId
let getNowUserId = function (callBack){
  let reqObj = {
    url: '/api/user/myInfo'
  }
  RequestGet(reqObj, null, (res, message) => {
    if (res.resCode == '0000') {
      //成功数据
      callBack(res.data.id)
    }
  })
}

//定时器
let timeTime=null;
//用户预约提醒 ，发起拼团  
let groupPlayFun =function (){
  //清除定时器
  clearInterval(timeTime);
  let reqObj = {
    url: '/api/goods/group/appointList'
  }
  RequestGet(reqObj, null, (res, message) => {
    if (res.resCode == '0000') {
      //我预约的拼团
      let resData = res.data;
      // resData= [{
      //   activityId: 100,
      //   activityType: 100,
      //   appointTime: 100,
      //   goodImg: "https://file.maiyatown.com/static/goods/2019021100100034306.jpg",
      //   goodsId: 110,
      //   subTitle: "stri爱的魔力转圈圈ng",
      //   title: "爱的魔力转圈圈",
      //   toBeginTime: 305000
      // }]
      //触发第二个接口 得到我发起的拼团
      let reqObj = {
        url: '/api/goods/group/myGroups'
      }
      RequestGet(reqObj, null, (res, message) => {
        if (res.resCode == '0000') {

          //发起拼团的数据
          let _resData = res.data;
          // _resData = [{
          //   "activityId": 18,
          //   "goodsId": 256,
          //   "title": "Maxigenes 美可卓 蓝胖子 全脂奶粉 1kg",
          //   "subTitle": "【澳洲直邮】包邮包税到您家",
          //   "goodImg": "https://file.maiyatown.com/static/goods/2019021100100034306.jpg",
          //   "groupId": 332,
          //   "remainderTime": 1810000
          // }]
          timeTime = setInterval(()=>{
            //预约提示的列表
            let tipList = [];
            //拼团提示列表
            let tipList1 = [];

            //预约拼团数据
            resData.forEach((item, index) => {
              item.toBeginTime = Number(item.toBeginTime) - 180000;
              // item.toBeginTime = Number(item.toBeginTime) - 1000;
              //距离活动5分钟
              if (item.toBeginTime < 300000 && item.toBeginTime > 30000) {
                resData.splice(index, 1, '');
                tipList.push(item);
              }
            })
            resData.forEach((item, index) => {
              if(item==''){
                resData.splice(index, 1)
              }
            })
            _resData.forEach((item, index) => {
              item.remainderTime = Number(item.remainderTime) - 180000;
              // item.remainderTime = Number(item.remainderTime) - 1000;
              //距离活动30分钟
              if (item.remainderTime < 1800000 && item.remainderTime>60000) {
                _resData.splice(index, 1, '');
                tipList1.push(item);
              }
            })
            _resData.forEach((item, index) => {
              if (item == '') {
                _resData.splice(index, 1)
              }
            })

            //触发预约提醒 
            //现在不管用户有没有处理 我都弹出来
            //1个订单只会一次 一旦触发 会删除这条数据
            if (tipList.length > 0) {
              app.setGlobalData({
                appointmentTimeData: tipList
              })
            }
            if (tipList1.length > 0) {
              //触发拼团提醒
              app.setGlobalData({
                groupTimeData: tipList1
              })
            }
          },180000)
        }
      })
    }
  })
}

module.exports = {
  formatTime,
  RequestGet,
  RequestPost,
  RequestPostHeader,
  postFormId,
  confirmGoods,
  commonText1,
  commonText2,
  mdApi,
  mdFun,
  apiMd5,
  setCacheData,
  getCacheData,
  getNowUserId,
  eventDraw,
  eventSave,
  eventGetImage,
  groupPlayFun,
  bindfriend
}
