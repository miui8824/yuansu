// components/Nav/nav.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {}
    }
  },
  methods: {
    navClick(event){
      let url = ['/pages/home/home', '/pages/maiya/maiya', '/pages/shopCar/shopCar', '/pages/mySelf/mySelf']
      let number = event.currentTarget.dataset.numbers;
      if (number!=this.data.navOn) {
        this.setData({
          navOn: number
        });
        // wx.redirectTo({
        //   url: url[number]
        // })
       }else{
         return false
       }
      
    },
  },
  //分享函数
  onShareAppMessage() {
    return {
      title: '就差你了，跟我们一起加入元素城堡吧',
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          let reqObj = {
            url: '/api/sharing/addShareLog',
            data: {
              linkNo: '',
              type: 0
            }
          }
          util.RequestPost(reqObj, null, (res, message) => {
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
      }
    }
  }
})
