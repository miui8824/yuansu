// pages/momentsMaterial/momentMaterial.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title: '发圈素材',
    showNomore:true,
    navActive: 0,
    navNames: ['每日心语', '招商素材', '礼包素材', '沙龙地推'],
    list: [],
    hasMore: true,
    isLoading: true,
    iPage: 0,
    pageSize: 6,
    mode: 'scaleToFill',
    id:7,
    like:false,
    userId:null,
    statusBarHeight:40
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //计算下拉框的 高度
    wx.getSystemInfo({
      success: (res) => {
        console.log(res.statusBarHeight)
        let statusBarHeight = res.statusBarHeight * 2
        console.log(statusBarHeight)
        this.setData({
          statusBarHeight
        })
      }
    });
    this.showMore()
    this.getTabs()
    let that = this
    let userId = wx.getStorageSync('myxzUserId');
    console.log(userId)
    this.setData({
      userId
    })
  },

  getTabs(){
    let that = this
    var reqObj = {
      url: `/api/research/material`
    }
    util.RequestGet(reqObj, null, (res, message) => {
      if(message){}
      if (res.resCode == '0000') {
        console.log(res)
        that.setData({
          navNames: res.data.articleCategoryList,
          id: res.data.articleCategoryList[0].id
        },()=>{
          wx.showLoading({
            title: '加载中',
            success: function () {
              that.getList()
            }
          })
        })
      }
    })
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

  tabChange(event) {
    console.log(event)
    let that = this
    this.setData({
      navActive: event.detail.index,
      list: [],
      iPage: 0,
      hasMore: true,
      isLoading: true,
      id: that.data.navNames[event.detail.index].id
    }, () => {
      let that = this
      wx.showLoading({
        title: '加载中',
        success: function () {
          that.getList()
        }
      })
    });
  },

  copyText(e){
    console.log(e)
    wx.setClipboardData({
      data: this.data.list[e.currentTarget.dataset.index].content,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },

  // 点赞
  clickLike(e){
    let { list,like } = this.data
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let isLike = e.currentTarget.dataset.islike;
    let likeFlag = false; //标志，避免多次发请求
    let status = 1
    console.log(isLike)
    if(likeFlag === true){
      return false
    }
    if (isLike=='2'){
      status = 1
    }else if(isLike=='1'){
      status = 2
    }
    let that = this
    var dynamicLike = {
      'dynamicId':id,
      'status':status,
      'userId':that.data.userId
    }
    var reqObj = {
      url: `api/research/dynamicLike`,
      data: dynamicLike
    }
    util.RequestPost(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({
          title: res.resDesc,
          icon:'none'
        })
      }
      if (res.resCode == '0000') {
        console.log(res)
        for(let i in list){
          if(i==index){
            if(list[i].isLike==2){
              list[index].isLike=1
              list[i].likeCount=parseInt(list[i].likeCount)+1
            }else{
              list[index].isLike = 2
              list[i].likeCount = parseInt(list[i].likeCount) - 1
            }
          }
        }
        that.setData({
          list
        },()=>{
          likeFlag= false
        })
      }
    })
  },

  getList() {
    let { iPage, pageSize, list,id} = this.data
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
        for(let i of resultList){
          if(i.content==null){
            i.content=''
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
        })
      }
      wx.hideLoading();
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
  },

  preview(e){
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.imgurl, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.imgurl] // 需要预览的图片http链接列表
    })
  },

  save(e){
    let url = e.currentTarget.dataset.imgurl
    let that = this;
    let isFirst = wx.getStorageSync('isFirst') || 0;
    wx.getSetting({
      success(res){
        if (!res.authSetting['scope.writePhotosAlbum']){
         wx.authorize({
           scope: 'scope.writePhotosAlbum',
           success(){
             that.saveImg(url)
           },
           fail(){
             if(isFirst == 0){
               wx.setStorageSync('isFirst',1);
             }else{
               that.imageRrrorAuth()
             }
           }
         })
       }else{
          that.saveImg(url)
       } 
      }
    })
  },

  // 微信改版弹框授权
  imageRrrorAuth() {
    wx.showModal({
      title: '提示',
      content: '需要您授权保存相册',
      showCancel: false,
      success: modalSuccess => {
        wx.openSetting({
          success(settingdata) {
            if (settingdata.authSetting['scope.writePhotosAlbum']) {
              wx.showModal({
                title: '提示',
                content: '获取权限成功,再次保存图片即可',
                showCancel: false,
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '获取权限失败，将无法保存到相册',
                showCancel: false,
              })
            }
          },
          fail(failData) {
            console.log("failData", failData)
          },
          complete(finishData) {
            console.log("finishData", finishData)
          }
        })
      }
    })
  },

  saveImg(url){
    let imgUrl = url
    wx.downloadFile({
      url: imgUrl,
      success:function(res){
        if(res.statusCode===200){
          let img = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: img,
            success(res) {
              console.log(res)
              console.log('aaaa')
              wx.showToast({
                title: '保存图片成功',
                icon: 'success',
                duration: 2000
              })
            },
            fail() {
              console.log('bbbbbb')
              wx.showToast({
                title: '保存图片失败',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      },
      fail(){
        wx.showToast({
          title: '保存图片失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: `pages/momentsMaterial/momentMaterial`
    }
  }
})