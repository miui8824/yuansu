var util = require('../../utils/util.js');
var apiUrl = require('../../static/js/url.js');
Page({
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:'我的粉丝',
    height:0,
    fansNum:0,
    fans_show:true,
    Fans:[],
    hasMore: true,
    isLoading: true,
    iPage:0,
    pageSize:10,
  },
  onLoad(option) {
    
    this.setData({
      fansNum: Number(option.fansNum)
      // fansNum: 0
    })
    this.fan()
  },
  onShow(){
    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, '', '');
  },
  fan() {
    let { iPage, pageSize, hasMore, isLoading, Fans, fansNum } = this.data
    let that = this
    let token = wx.getStorageSync('myxzToken');
    let url = apiUrl.API_URL +'/api/user/myFansList';
    if (token) {
      iPage++
      // let header = Object.assign({ 'auth-token': token }, headerData);
      wx.request({
        url: url + "?iPage=" + iPage + "&pageSize=" + pageSize,
        header: {
          'auth-token': token
        },
        success(res) {
          let hasMore = iPage < Math.ceil(fansNum / 10) ? true : false;
         
            wx.hideLoading();
            that.setData({
              fans_show: true,
              Fans: [...Fans,...res.data.resultList],
              isLoading: false,
              hasMore,
              iPage
            })
        }
      })
    } else {
     
      wx.navigateTo({
        url: "/pages/init/init"
      })
    }
  },
  // onReachBottom() {
  //   console.log("chufale")
  //   if (this.data.isLoading == true || this.data.hasMore == false) {
  //     return
  //   }
  //   this.setData({
  //     isLoading: true
  //   })
  //   this.fan()
  // },
  loadMore(){
    if (this.data.isLoading == true || this.data.hasMore == false) {
      return
    }
    this.setData({
      isLoading: true
    })
    this.fan()
  }
})