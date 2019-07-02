const app = getApp();
Component({
  properties: {
    //小程序页面的表头
    title: {
      type: String,
      default: '穿衣助手拼团'
    },
    //是否展示返回和主页按钮
    showIcon: {
      type: Boolean,
      default: true
    }
  },

  data: {
    statusBarHeight: 0,
    titleBarHeight: 0,
    goBackType:true
  },

  ready: function () {
    //当前页面是我的订单 返回是跳到个人中心
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route //当前页面url
    if (url =='pages/myOrder/myOrder'){
      this.setData({
        goBackType:false
      })
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
      wx.navigateBack({
        delta: 1,
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
      app.globalData.isFromDetail1 = true
      wx.switchTab({
        url: '/pages/grouponList/main'
      })
    }
  }
})
