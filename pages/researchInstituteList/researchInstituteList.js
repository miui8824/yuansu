const app = getApp();
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title: '线下沙龙',
    showNomore:true,
    list: [],
    id:null,
    iPage:0, 
    pageSize:6,
    hasMore: true,
    isLoading: true,
    mode: 'scaleToFill',
    parentId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options)
    this.setData({
      id:options.id,
      title:options.catname,
      parentId: options.parentId
    },()=>{
      that.getList()
    })
  },


  getList() {
    let { iPage, pageSize,list,id } = this.data
    let that = this
    iPage++
    var reqObj = {
      url: `/api/research/articleList?iPage=${iPage}&&pageSize=${pageSize}&&id=${id}`
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if (message) {
      }
      if (res.resCode == '0000') {
        console.log(res)
        let resultList = res.resultList
        if (resultList == null) {
          resultList = []
        }
        for (let i of resultList) {
          i.createTime = that.formatDate(new Date(i.createTime))
          if (i.videoUrl != "") {
            i.isImg=false
          } else if (i.videoUrl == "") {
            i.isImg=true
          }
        }
          let hasMore = iPage < Math.ceil(res.resultCount / pageSize) ? true : false;
          that.setData({
            hasMore,
            isLoading: false,
            iPage,
            list: [...list, ...resultList]
          }, () => {
            that.showMore()
            setTimeout(function () {
              if (that.data.list.length == 0) {
                wx.showToast({
                  title: '暂无文章，逛逛首页吧',
                  duration: 3000,
                  icon: 'none',
                  success: function () {
                    setTimeout(function () {
                      wx.reLaunch({
                        url: '/pages/home/home',
                      })
                    }, 2000)
                  }
                })
              }
            }, 500)
          })
      }
      wx.hideLoading();
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
            if (res[0].top > screenHeight) {
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

  goDetail(e) {
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: `/pages/articleDetails/articleDetails?id=${e.currentTarget.dataset.id}`,
    })
  },



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    if (this.data.isLoading == true || this.data.hasMore == false) {
      return
    }

    that.setData({
      isLoading: true
    })
    that.getList()
  }
})