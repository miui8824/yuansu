const app = getApp();
Component({
  properties: {
    //小程序页面的表头
    title: {
      type: String,
      default: ''
    },
    //是否展示返回和主页按钮
    showIcon: {
      type: Boolean,
      default: true,
      // out_show:false
    },
    aa:{
      type: Boolean,
      default: true,
    }

  },

  data: {
    statusBarHeight: 0,
    titleBarHeight: 0,
    goBackType:true,
    goBackType1:true //解决1.4分享页面不弹红包跳首页弹红包
  },

  ready: function () {
    //当前页面是我的订单 返回是跳到个人中心
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route //当前页面url
    console.log('zzt',url)
    if (url =='pages/myOrder/myOrder'){
      this.setData({
        goBackType:false
      })
    } else if (url == 'pages/articleDetails/articleDetails' || url == 'pages/bagsList/bagsList' || url == 'pages/bagList/bagList'){//处理1.4分享页面不跳红包但首页跳红包
    console.log("goBackType1变成false")
      this.setData({
        goBackType1:false
      })
    }else{
      console.log('zztelse')
    }
    // 因为很多地方都需要用到，所有保存到全局对象中
    if (app.globalData && app.globalData.statusBarHeight && app.globalData.titleBarHeight) {
      this.setData({
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight
      });
    } else {
      let that = this
      wx.getSystemInfo({
        success: function (res) {
          if (!app.globalData) {
            app.globalData = {}
          }
          if (res.model.indexOf('iPhone') !== -1) {
            app.globalData.titleBarHeight = 44
          } else {
            app.globalData.titleBarHeight = 48
          }
          app.globalData.statusBarHeight = res.statusBarHeight
          that.setData({
            statusBarHeight: app.globalData.statusBarHeight,
            titleBarHeight: app.globalData.titleBarHeight
          });
        },
        failure() {
          that.setData({
            statusBarHeight: 0,
            titleBarHeight: 0
          });
        }
      })
    }
  },

  methods: {
    headerBack() {
      console.log(this.data.showIcon);
      wx.navigateBack({
        delta: this.data.showIcon==true?1:2,
        fail(e) {
          wx.switchTab({
            url: '/pages/grouponList/main'
          })
        }
      })
    },
    headerMySelf(){
      wx.switchTab({
        url: '/pages/mySelf/mySelf'
      });
    },
    headerHome() {
      console.log("111111")
      app.globalData.isFromDetail1 = true
      wx.switchTab({
        url: '/pages/home/home'
      })
    },
    headerHome1() {//处理1.4分享页面不跳红包但首页跳红包
      console.log("222222")
      wx.switchTab({
        url: '/pages/home/home'
      })
    }
  }
})
