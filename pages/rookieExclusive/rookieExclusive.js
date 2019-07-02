// pages/rookieExclusive/rookieExclusive.js
var util = require('../../utils/util.js');
import Dialog from '../../dist/dialog/dialog';
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮 
    title: '新人专享',
    goodsList: [],
    isOver:false,
    iPage:0,
    pageSize:10,
    hasMore: true,
    isLoading: true,
    activityId:null,
    bannerUrl:"",
    controller:true,
    showNomore: true
  },

  //监听页面高度判断是否展示底线
  showMore() {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        let screenHeight = res.screenHeight
        if (that.data.goodsList.length != 0) {
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


  // canvas画图分享的发放 （保存图片，绘制分享图）
  eventDraw() {
    this.setData({
      GetImage: true
    })
    let reqObj = {
      url: '/api/mainShare/homeShare',
      data: {}
    }
    util.RequestPost(reqObj, null, (res, message) => {
      if (message) {
        wx.showToast({
          title: "生成失败",
          icon: 'none',
          duration: 1500
        })
      }
      if (res.resCode == '0000') {
        console.log(res.data.copywriting, res.data.imgUrl);
        //成功数据
        // wx.showToast({
        //   title: '添加成功!',
        //   icon: 'success',
        //   duration: 1500
        // })
        this.setData({
          copywriting: res.data.copywriting,
          imgUrl: res.data.imgUrl
        })
        //回到顶部
        wx.pageScrollTo({
          scrollTop: 0
        })
        wx.showLoading({
          title: '绘制分享图片中',
          mask: true
        })
        console.log(this.data.copywriting, this.data.imgUrl)
        this.setData({
          painting: {
            width: 375,
            height: 555,
            clear: true,
            views: [
              // 背景白图
              {
                type: 'image',
                url: 'https://file.maiyatown.com/images/v1.2/home_bg.png',
                top: 0,
                left: 0,
                width: 375,
                height: 555
              },
              // 最上面的小麦
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
                top: 20,
                left: 146,
                bolder: true
              },
              // 中间的图 this.data.imgUrl
              {
                type: 'image',
                url: this.data.all_data.orderGoods[0].goodImg,
                top: 60,
                left: 32.5,
                width: 310,
                height: 350
              },
              // 矩形
              {
                type: 'rect',
                background: 'red',
                top: 425,
                left: 120,
                width: 45,
                height: 20
              },
              // 拼团状态
              {
                type: 'text',
                content: "拼团中",
                fontSize: 12,
                color: '#FFFFFF',
                textAlign: 'left',
                top: 427,
                left: 125,
                lineHeight: 20,
                MaxLineNumber: 2,
                breakWord: true,
                width: 155,
                bolder: true
              },
              // 商品价格
              {
                type: 'text',
                content: "￥" + this.data.all_data.orderGoods[0].goodPrices,
                fontSize: 24,
                color: '#FF262C',
                textAlign: 'left',
                top: 420,
                left: 32.5,
                lineHeight: 20,
                MaxLineNumber: 2,
                breakWord: true,
                width: 155,
                bolder: true
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
              // 动态生成的字
              {
                type: 'text',
                content: this.data.copywriting,
                fontSize: 16,
                color: '#101010',
                textAlign: 'left',
                top: 460,
                left: 32.5,
                lineHeight: 20,
                MaxLineNumber: 2,
                breakWord: true,
                width: 155,
                bolder: true
              },
              // 二维码下面的字
              // {
              //   type: 'text',
              //   content: "长按识别小程序码",
              //   fontSize: 12,
              //   color: '#999999',
              //   textAlign: 'left',
              //   top: 520,
              //   left: 240,
              //   lineHeight: 20,
              //   // MaxLineNumber: 2,
              //   // breakWord: true,
              //   width: 155,
              //   bolder: true
              // }
            ]
          }
        })
      }
    })


  },
  // 保存图片的方法
  eventSave() {
    this.setData({
      GetImage: false
    })
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
  },
  share_hide: function () {
    this.setData({
      GetImage: false
    })
  },

  // 获得图片的路径
  eventGetImage(event) {
    console.log(event)
    wx.hideLoading()
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showMore()
    this.getGoodsList()
  },


  getGoodsList(){
    let { iPage, goodsList, pageSize} = this.data
    let that = this
    iPage++
    let reqObj = {
      url: `/api/goods/newcomersGoodList?iPage=${iPage}&pageSize=10`
    }

    util.RequestGet(reqObj, null, (res, message) => {
      console.log(res)
      if (res.data== null) {
          this.setData({
            isOver: true
          })
          return false
      }
      if(res.data.onlineState==2){
        this.setData({
          isOver:true
        })
        return false
      }
      if (res.data.endTime!=null){
        if(res.data.endTime-res.data.nowTime<=0){
          this.setData({
            isOver: true
          })
          return false
        }
      }
      let hasMore = iPage < Math.ceil(res.resultCount / pageSize) ? true : false;
      for (let i of res.resultList){
        i.price = i.price.toFixed(2) 
        i.disCountPrice = i.disCountPrice.toFixed(2)
        i.disCountPriceMain=i.disCountPrice.toString().split(".")[0]
        i.disCountPriceFloat = i.disCountPrice.toString().split(".")[1]
        if (i.disCountPriceFloat.length==1){
          i.disCountPriceFloat = i.disCountPriceFloat+"0"
        }
      }
      that.setData({
        activityId: res.data.activityId,
        hasMore,
        isLoading: false,
        iPage,
        goodsList: [...goodsList, ...res.resultList],
        bannerUrl: res.data.bannerList == null ? '' : res.data.bannerList[0].bannerUrl
      },()=>{
        that.showMore()
      })
    })
  },

  //跳转商品详情
  goShopDetail(event) {
    if(this.data.controller){
      let reqObj = {
        url: '/api/goods/immBuyCond'
      }
      util.RequestGet(reqObj, null, (res, message) => {
        console.log(res)
        let that = this
        if (res.resCode == 21025) {
          Dialog.alert({
            message: '很抱歉，您已经购物过1次啦，不算新人哦，新人专享特惠价只开放给未购买过的新人享受',
            confirmButtonText: "知道了，返回首页"
          }).then(() => {
            that.goHome()
          });
        } else {
          wx.navigateTo({
            url: `/pages/goodsDetails/goodsDetails?id=${event.currentTarget.dataset.id}&activityId=${this.data.activityId}&left=${true}&isRookieExclusive=${true}`
          })
        }
      })

      //开发用
      // wx.navigateTo({
      //   url: `/pages/goodsDetails/goodsDetails?id=${event.currentTarget.dataset.id}&activityId=${this.data.activityId}&left=${true}&isRookieExclusive=${true}`
      // })

      this.setData({
        controller:false
      })
    }

  },


  goHome(){
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      controller:true
    })
  },

  goBackIndex:function(){
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoading == true || this.data.hasMore == false) {
      return
    }

    this.setData({
      isLoading: true
    })
    this.getGoodsList()
  }
})