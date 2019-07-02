// pages/advancedTraining/advancedTraining.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title: '进阶培训',
    showNomore:true,
    swiperData:[    ],
    list:[    ],
    hasMore: true,
    isLoading: true,
    iPage: 0,
    pageSize: 6,
    mode: 'scaleToFill',
    isImg: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showMore()
    this.getInfo()
  },

  //监听页面高度判断是否展示底线
  showMore() {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        let screenHeight = res.screenHeight
        if (that.data.list.length != 0) {
          wx.createSelectorQuery().select('#btLine').boundingClientRect().exec(function (res) {
            console.log(res)
            if (res[0].top + 64 > screenHeight) {
              that.setData({
                showNomore: true
              })
            } else {
              that.setData({
                showNomore: false
              })
            }
          })
        }

      },
    })
  },

  getInfo(){
    let { swiperData, iPage, pageSize, list } = this.data
    let that = this
    iPage++
    var reqObj = {
      url: `/api/research/advancedTraining`
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
      }
      if (res.resCode == '0000') {
        console.log(res)
        let articleList = res.data.articleList
        if (articleList != null) {
          articleList = res.data.articleList.reverse()
        }
        if(articleList==null){
          articleList=[]
        }
        if (res.data.imgUrl == "" && res.data.videoUrl!=""){
          this.setData({
            isImg:false
          })
        } else if (res.data.imgUrl != "" && res.data.videoUrl == ""){
          this.setData({
            isImg: true
          })
        }
        for(let i of articleList){
          i.createTime = that.formatDate(new Date(i.createTime))
          i.showTime = that.formatDate(new Date(i.showTime))
        }


        var swiperArray = function (len, arr) {
          var R = [];
          for (let F = 0; F < arr.length;) {
            R.push(arr.slice(F, F += len))
          }
          return R
        }
        this.setData({
          swiperData: swiperArray(4, res.data.articleCategoryList),
          list: [...list,...articleList]
        },()=>{
          that.showMore()
        })
      }
    })
  },

  formatDate(now) { //时间戳转化为具体的日期
    var year = now.getFullYear();
    var month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
    var date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    var hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
    var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
    return year + "-" + month + "-" + date;
  },

  swiperJump(e){
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: `/pages/researchInstituteList/researchInstituteList?id=${e.currentTarget.dataset.id}&&catname=${e.currentTarget.dataset.catname}&&parentId=${e.currentTarget.dataset.parentid}`,
    })
  },

  goDetail(e){
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: `/pages/articleDetails/articleDetails?id=${e.currentTarget.dataset.id}`,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})