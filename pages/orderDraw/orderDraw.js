 // pages/orderDraw/orderDraw.js
 var apiUrl = require('../../static/js/url.js');
var util = require('../../utils/util.js');
var apiUrl = require('../../static/js/url.js');
import Dialog from '../../dist/dialog/dialog';
 Page({

   /**
    * 页面的初始数据
    */
   data: {
     showIcon: true,//引入的自定义导航左边返回按钮
     title:'大转盘活动',
     drawStart: '',
     drawEnd: '',
     activityStart: '',
     activityEnd: '',
     turntableState: 1,
     chanceNum: 0,
     products: [{}, {}, {}, {}, {}, {}, {}, {}],
     time: ['00', '00', '00', '00'],
     sd: 1,
     scrollTop:0,
     prizeList: [],
     turntableN: '',
     shade: 0,
     drawPrize: '优惠券', //中奖类型
     drawPicture: 'https://file.maiyatown.com/images/turntable/yhq.png', //中奖图片
     drawProduct: '20元优惠券', //中奖产品
     drawNum: 1, //中奖数量
     drawCode: 38465658261, //领券码
     prizePage: 1,
     toPrizeList:'prize-page-0',
     activityContent:"",
     big_turntable_bg_one: apiUrl.FILE+"/miniProgram/big_turntable_bg_one.png",
     big_turntable_bg_two: apiUrl.FILE +"/miniProgram/big_turntable_bg_two.png",
     big_turntable_bg_three: apiUrl.FILE +"/miniProgram/big_turntable_bg_three.png",
     big_turntable_image_brand: apiUrl.FILE +"/miniProgram/big_turntable_image_brand.png",

     big_turntable_image_disc: apiUrl.FILE +"/miniProgram/big_turntable_image_disc.png",
     turntableState: apiUrl.FILE +"/miniProgram/{{turntableState!=2||chanceNum<=0?   'big_turntable_image_pointer_gray.png':'big_turntable_image_pointer_orange.png'}}",

     big_turntable_title_winning: apiUrl.FILE +"/miniProgram/big_turntable_title_winning.png",
     big_turntable_title_activity: apiUrl.FILE +"/miniProgram/big_turntable_title_activity.png",
     big_turntable_bg_yellow: apiUrl.FILE +"/miniProgram/big_turntable_bg_yellow.png",
     big_turntable_bg_cloud: apiUrl.FILE +"/miniProgram/big_turntable_bg_cloud.png",
     big_turntable_image_red_envelope: apiUrl.FILE +"/miniProgram/big_turntable_image_red_envelope.png"
   },
   startDraw() { //抽奖
     var _this = this;
     var chanceNum = this.data.chanceNum;
     this.setData({
       sd: 0,
       turntableN: ''
     });
     var products = this.data.products;
     let token = wx.getStorageSync('myxzToken');
     var reqObj = {
       url: '/api/activity/luckCycle'
     };
     if (token) {
       let header = {
         'auth-token': token
       };
       wx.request({
         url: apiUrl.API_URL + reqObj.url,
         header: header,
         method: 'POST',
         dataType: 'json',
         success: function(res) {
           if (res.data.data==null){
           Dialog.alert({
             title: res.data.resDesc || '活动已结束',
             message:' '
           });};
           if (res && res.data && res.data.data) {
             var data = res.data.data;
             var no = data.prizeNo; //中奖产品编号
             var index = products.findIndex(d => {
               return d.no == no
             });
             console.log(no,index);
             var prize = data.selectTypeStr; //中奖类型
             if (prize != '一等奖' && prize != '二等奖' && prize != '三等奖' && prize != '优惠券') prize='普照奖';
             var product = data.prizeName; //中奖产品
             //  var num = data.prizeNum; //中奖数量
             var code = data.couponNo; //中奖码
             var picture = data.largeImageUrl; //---
            //  console.log(picture,no);
             _this.setData({
               chanceNum: chanceNum - 1,
               turntableN: 'turntable-' + index,
               drawPrize: prize,
               drawPicture: picture,
               drawProduct: product,
               // drawNum: num,
               drawCode: code
             });
             setTimeout(() => {
               _this.setData({
                 shade: 1,
                 sd: 1
               });
               _this.getPrizeList(1,true);    //flag=true时更新的抽奖结果到第一页显示
             }, 4200);
           }
         },
         fail: function(res) {
           console.log(res);
         }
       })
     } else {
       wx.navigateTo({
         url: "/pages/init/init"
       })
     }
   },
   closePrize() {
     this.setData({
       shade: 0,
     })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   transfTime(time) {
     var s = 1000;
     var m = s * 60;
     var h = m * 60;
     var d = h * 24;
     var dd = Math.floor(time / d);
     var ddd, hhh, mmm, sss;
     if ((dd + '').length < 2) {
       ddd = '0' + dd
     } 
    // else if ((dd + '').length < 3) {
    //    ddd = '00' + dd;
    //  } 
    else {
       ddd = dd + ''
     };
     var hh = Math.floor((time - dd * d) / h);
     if ((hh + '').length < 2) {
       hhh = '0' + hh
     } else {
       hhh = hh + ''
     };
     var mm = Math.floor((time - dd * d - hh * h) / m);
     if ((mm + '').length < 2) {
       mmm = '0' + mm
     } else {
       mmm = mm + ''
     };
     var ss = Math.floor((time - dd * d - hh * h - mm * m) / s);
     if ((ss + '').length < 2) {
       sss = '0' + ss
     } else {
       sss = ss + ''
     };
     return [ddd, hhh, mmm, sss]
   },
   timeFormat_d(time) {
     var y = new Date(time).getFullYear() + '';
     var m = new Date(time).getMonth() + 1;
     m = m >= 10 ? (m + '') : ('0' + m);
     var d = new Date(time).getDate();
     d = d >= 10 ? (d + '') : ('0' + d);
     return y + '.' + m + "." + d
   },
   onLoad: function(options) {
     var _this = this;
     let token = wx.getStorageSync('myxzToken');
     var reqObj = {
       url: '/api/activity/luckCycleDetail'       
     }
     if (token) {
       let header = {
         'auth-token': token
       };
       wx.request({                        //获取抽奖产品/抽奖状态
         url: apiUrl.API_URL + reqObj.url,
         header: header,
         method: 'GET',
         dataType: 'json',
         success: function(res) {
           if (res.data.data == null){
             Dialog.alert({
               title: res.data.resDesc,
               message:' '
             }).then(() => {
              wx.navigateBack()
             });
           };
           if (res && res.data) {
             var data = res.data.data;
           console.log(data)
             if (!data) {
               _this.setData({
                 turntableState: 3
               });
               return
             }
             var thisTime;   
             var start = data.luckStartTime;
             var end = data.luckEndTime;
             var actStart = data.startTime;
             var actEnd = data.endTime;
             var activityContent = data.activityContent
            //  actStart = 1547107607000;
            //  start = 1547712407000;
            //  end = 1547885207000;
            //  actEnd = 1548144407000;
             var chance = data.remainderTimes;
            //  chance = 6;
             var pros = [];
             var products = data.prizes ? data.prizes : [];
             products.forEach((d, i) => {
               pros.push({                    //产品列表
                 no: d.prizeNo,
                 name: d.prizeName,
                 pic: d.smallImageUrl
               }) //---
             });
             thisTime = new Date().getTime();
             console.log(start, thisTime, end, actStart, actEnd);
             var setTime = function(now) {      //判断状态
               var state, time0;
               if (start > now) {
                 state = 1;
                 var snTime = start - now;
                 time0 = [..._this.transfTime(snTime)];
               } else if (now < end) {
                 state = 2;
                 var enTime = end - now;
                 time0 = [..._this.transfTime(enTime)];
               } else {
                 state = 3;
               }
               return [state, time0]
             };
             var st = setTime(thisTime);
             var state = st[0];
             var time = st[1];
             _this.setData({
               drawStart: _this.timeFormat_d(start),
               drawEnd: _this.timeFormat_d(end),
               activityStart: _this.timeFormat_d(actStart),
               activityEnd: _this.timeFormat_d(actEnd),
               products: pros,
               chanceNum: chance,
               turntableState: state, 
               time: time,
               activityContent: activityContent
             });
             if (state < 3) {
               var si = setInterval(() => {
                 thisTime += 1000;
                 var st = setTime(thisTime);
                 var state = st[0];
                 var time = st[1];
                 _this.setData({
                   turntableState: state,   //状态
                   time: time      //计时
                 });
                 if (state == 3) clearInterval(si);
               }, 1000)
             }
           }
         },
         fail: function(res) {
           console.log(res);
         }
       });
       //---获奖列表---
       _this.getPrizeList(1);
     } else {
       wx.navigateTo({
         url: "/pages/init/init"
       })
     };
   },
   prizeScroll(e) {
     var prizePage = this.data.prizePage;
     this.getPrizeList(prizePage + 1);    
   },
   getPrizeList(iPage,flag) {
     var _this = this;
     var pageSize=10;    //每次载入10条
     let token = wx.getStorageSync('myxzToken');
     var reqObj = {
       iPage: iPage,     //页码
       pageSize: pageSize
     }
     if (token) {
       let header = {
         'auth-token': token
       };
       wx.request({
         url: apiUrl.API_URL + '/api/activity/luckCycleRecords',
         header: header,
         data: reqObj,
         method: 'GET',
         dataType: 'json',
         success: function(res) {
           if (res && res.data) {
             if (res.data.resultList && res.data.resultList.length > 0) {   
               var pds = flag?[]:_this.data.prizeList;     
               var rl = res.data.resultList; 
               var rlLenght = rl.length;
               for (var i = 0; i < rlLenght; i++) {
                 pds.push({
                   name: rl[i].nickName,
                   product: rl[i].prizeName,
                   num: rl[i].prizeNum ? rl[i].prizeNum : 1
                 })
               };
      
               var toPrizeList = (iPage-1) * pageSize;
               _this.setData({
                 prizeList: pds,
                 prizePage: iPage,
                 toPrizeList: 'prize-page-' + toPrizeList
               })
             }

           }
         },
         fail: function(res) {
           console.log(res);
         }
       });
     } else {
       wx.navigateTo({
         url: "/pages/init/init"
       })
     };
   },
   onPageScroll: function (e) {
     this.setData({
       scrollTop: e.scrollTop
     });
    //  console.log(e.scrollTop)
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
   },
   onUnload() {
     wx.switchTab({ url: '/pages/home/home' });
   },
   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function() {

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

   },

 })