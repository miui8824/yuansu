// pages/groupHome/groupHome.js
const app = getApp()
var apiUrl = require('../../static/js/url.js');
var util = require('../../utils/util.js');
Page({
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:'拼团',
    navType:2,//正在疯抢
    groupList:[],

    iPage:1,
    pageSize:10,
    isLoadMore:true,//是否能加载更多
  },
  onLoad: function (options) {
    this.getGroupList();
  },
  onShow(){
    //埋点函数 页面操作事件 下一个页面地址
    //util.mdFun(this, '', '');
  },
  //导航切换
  navClick(event){
    this.setData({
      navType: event.currentTarget.dataset.types == "1" ? 1 : 2,
      iPage:1,
      isLoadMore:true,
      groupList: []
    })
    this.getGroupList();
  },
  //加载拼团数据
  getGroupList(){
    //进来就自增
    let _iPage = this.data.iPage;
    this.setData({
      iPage: _iPage + 1
    })
    //如果没有数据 就不发请求了
    if (!this.data.isLoadMore){
      return false;
    }
    let reqObj = {
      url: '/api/goods/group/goods?activityStatus=' + this.data.navType + '&iPage=' + _iPage +'&pageSize='+this.data.pageSize
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
        for(let i of res.resultList){
          i.price = Number(i.price).toFixed(2)
          if(i.groupType==2){
            i.categoryName="新人团"
          }
          if (i.groupType==1){
            i.categoryName = "普通团"
          }
        }
        //成功数据
        if(this.data.iPage==1){
          //数据少于10条 ,直接替换 ，不让请求了
          if (res.resultList.length<10){
            this.setData({
              isLoadMore:false
            })
          }
          this.setData({
            groupList: res.resultList
          })
        }else{
          //数据少于10条 ,直接拼接 ，不让请求了
          let oldList = this.data.groupList;
          let newList;
          if (res.resultList.length < 10) {
            this.setData({
              isLoadMore: false
            })
          }
          newList = oldList.concat(res.resultList);
          this.setData({
            groupList: newList
          })
        }
      }
    })
  },
  //立即购买
  goGroup(event){
    wx.navigateTo({
      url: '/pages/groupDetails/groupDetails?activityId=' + event.currentTarget.dataset.activityid + '&goodsId=' + event.currentTarget.dataset.goodsid
    })

  },
  goHome: function () {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },
})