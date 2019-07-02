// pages/myorder/myorder.js
var util = require('../../utils/util.js');
var apiUrl = require('../../static/js/url.js');
import Dialog from '../../dist/dialog/dialog';
Page({
  data: {
    // zzt的变量 
    list_num:true,// 判断是不是只有 一个子菜单
    child_list:[],//子列表
    navActive: 0,
    showNoOrder: false,
    orderList: [],
    navNames: ['全部', '待付款', '待收货', '已完成', '已取消'],
    scrollTop: 0,
    goTopShow: false,

    page: 1,
    pageSize: 10,
    orderType: 999,
    loadMoreType: true, //全部加载完 
    loadMoreTip: false,//加载数据更多状态
    daifk_order_status:true,
    all_order:[// 全部

    ],
    all_orderchild:[],
    daifk_order:[//待付款 
      {
        orderNum: "111111111111",
        status: "待付款",
        goodSun: '2',//订单数量
        realPayAmout: "888",//实际付款
        goodAttrDesc: "XL",//商品规格
        goodImg: '',//商品图片
        goodNum: '4', //商品数量
        goodName: "AAYTO [女士] 韩版新款短款休闲百搭时尚显瘦毛衣。AAYTO [女...",//商品名称
        goodPrices: "246",//商品实际价格
      }
    ],
    daish_order:[],
    finish_order:[],
    qx_order:[]

  },
  tankuang(){
    Dialog.confirm({
      title: '订单确认?',
      message: '确定取消订单？'
    }).then(() => {

    }).catch(() => {
      // on cancel
    });
  },
  onLoad(option) {
    this.allOrder();
    this.daifkOrder();
    //0 - 待支付 1 - 待收货 3 - 已完成 4 - 已取消
    if (option.navActive == 0) {
      this.setData({ orderType: 0, navActive: 1 }, function () {
        // this.getOtherList();
      })
    } else if (option.navActive == 1) {
      // this.setData({ orderType: 1, navActive: 2 }, function () {
      //   this.getOtherList();
      // })
    } else {
      // this.getOrderList();
    }
  },
  goHome() {
    wx.switchTab({ url: '/pages/home/home' });
  },
  tabChange(event) {
    //切换tab 初始化所有数据
    console.log(event);
    // this.setData({
    //   navActive: event.detail.index,
    //   page: 1,
    //   orderList: [],
    //   loadMoreType: true,
    //   showNoOrder: false
    // })
    // //0 - 待支付 1 - 待收货 3 - 已完成 4 - 已取消
    // switch (event.detail.index) {
    //   case 0:
    //     this.getOrderList();
    //     this.setData({ orderType: 999 })
    //     break;
    //   case 1:
    //     this.setData({ orderType: 0 })
    //     this.getOtherList();
    //     break;
    //   case 2:
    //     this.setData({ orderType: 1 })
    //     this.getOtherList();
    //     break;
    //   case 3:
    //     this.setData({ orderType: 3 })
    //     this.getOtherList();
    //     break;
    //   case 4:
    //     this.setData({ orderType: 4 })
    //     this.getOtherList();
    //     break;
    // }
  },
  loadMore() {
    if (!this.data.loadMoreType) {
      return false;
    }
    this.setData({ page: this.data.page + 1, loadMoreTip: true });
    if (this.data.navActive == 0) {
      this.getOrderList();
    } else {
      this.getOtherList();
    }
  },
  // 待付款请求
  daifkOrder(){
    let that = this
    let token = wx.getStorageSync('myxzToken');
    let url = apiUrl.API_URL +'/api/myOrder/findOrderByUser';
    if (token) {
      // let header = Object.assign({ 'auth-token': token }, headerData);
      wx.request({
        url: url,
        data: {
          iPage: 1,
          pageSize: 20,
          status:1
        },
        header: {
          'auth-token': token
        },
        success(res) {
          console.log(res.data)
          wx.hideLoading();

          // that.setData({

          // });
        }
      })
    } else {
      console.log('跳转授权页面');
      wx.navigateTo({
        url: "/pages/init/init"
      })
    }
  },
  //请求全部订单 （zzt）
  allOrder(){
    let that = this
    let token = wx.getStorageSync('myxzToken');
    let url = apiUrl.API_URL +'/api/myOrder/findAllOrderByUser';
    if (token) {
      // let header = Object.assign({ 'auth-token': token }, headerData);
      wx.request({
        url: url,
        data: {
          iPage: 1, 
          pageSize:20
        }, 
        header: {
          'auth-token': token
        },
        success(res) {
          wx.hideLoading();
          console.log(res.data)
          console.log(res.data.resultList.length)          
          that.setData({
            all_order:res.data.resultList
          });
          console.log(that.data.all_order)
          var  test = [];
          for (let i of res.data.resultList){
            console.log(i)
            let good = 0;
            for (let ii of i.orderGoods){
                // console.log(ii);
              that.data.all_orderchild.push(ii);
            }
            console.log(good);
          }
          console.log(that.data.all_orderchild);
        }
      })
    } else {
      console.log('跳转授权页面');
      wx.navigateTo({
        url: "/pages/init/init"
      })
    }
  },
 onShow(){
   //埋点函数 页面操作事件 下一个页面地址
   util.mdFun(this, '', '');
 }
   
  //得到全部订单列表
  // getOrderList(pageNumber) {
  //   let _this = this;
  //   let reqObj = {
  //     url: '/api/myOrder/findAllOrderByUser',
  //     data: { iPage: pageNumber || this.data.page, pageSize: this.data.pageSize }
  //   }
  //   util.RequestGet(reqObj, '', (res, message) => {
  //     if (message) {
  //       wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
  //     }
  //     this.setData({ loadMoreTip: false });
  //     //第一次发请求
  //     if (_this.data.page == 1) {
  //       if (res.resultList.length == 0) {
  //         _this.setData({ showNoOrder: true });
  //         return false;
  //       } else {
  //         _this.setData({ orderList: res.resultList })
  //       }
  //     } else {
  //       if (res.resultList.length == 0) {
  //         //保持数据不变
  //         //到底部了
  //         _this.setData({ loadMoreType: false });
  //       } else {
  //         let allData = _this.data.orderList.concat(res.resultList);
  //         _this.setData({ orderList: allData });
  //       }
  //     }
  //   })
  // },
  // //得到其他状态的订单
  // getOtherList(pageNumber) {
  //   let _this = this;
  //   let reqObj = {
  //     url: '/api/myOrder/findOrderByUser',
  //     data: { iPage: pageNumber || this.data.page, pageSize: this.data.pageSize, status: this.data.orderType }
  //   }
  //   util.RequestGet(reqObj, '', (res, message) => {
  //     if (message) {
  //       console.log(message)
  //       wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
  //     }
  //     this.setData({ loadMoreTip: false });
  //     //第一次发请求
  //     if (_this.data.page == 1) {
  //       if (res.resultList.length == 0) {
  //         _this.setData({ showNoOrder: true });
  //         return false;
  //       } else {
  //         _this.setData({ orderList: res.resultList })
  //       }
  //     } else {
  //       if (res.resultList.length == 0) {
  //         //保持数据不变
  //         //到底部了
  //         _this.setData({ loadMoreType: false });
  //       } else {
  //         let allData = _this.data.orderList.concat(res.resultList);
  //         _this.setData({ orderList: allData });
  //       }
  //     }
  //   })
  // },
  // //订单操作
  // delOrder(event) {
  //   let reqObj = {
  //     url: '/api/myOrder/delOrder',
  //     data: {
  //       orderId: event.currentTarget.dataset.orderid,
  //       subOrderId: event.currentTarget.dataset.suborderid || '',
  //       status: event.currentTarget.dataset.status
  //     }
  //   }
  //   util.RequestPostHeader(reqObj, null, (res, message) => {
  //     if (message) {
  //       wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
  //     }
  //     if (this.data.navActive == 0) {
  //       this.setData({ page: 1 }, this.getOrderList(1));
  //     } else {
  //       this.setData({ page: 1 }, this.getOtherList(1));
  //     }
  //   })
  // },
  // //取消订单
  // offOrder(event) {
  //   Dialog.confirm({
  //     title: '订单确认?',
  //     message: '确定取消订单？'
  //   }).then(() => {
  //     let reqObj = {
  //       url: '/api/myOrder/canelOrder',
  //       data: {
  //         orderId: event.currentTarget.dataset.orderid,
  //         cancalReason: ''
  //       }
  //     }
  //     util.RequestPostHeader(reqObj, null, (res, message) => {
  //       if (message) {
  //         wx.showToast({ title: res.resDesc, icon: 'none', duration: 1500 });
  //       }
  //       if (this.data.navActive == 0) {
  //         this.setData({ page: 1 }, this.getOrderList(1));
  //       } else {
  //         this.setData({ page: 1 }, this.getOtherList(1));
  //       }
  //     })
  //   }).catch(() => {
  //     // on cancel
  //   });

  // },
  // //跳转订单详情
  // goOrderAbout(event) {
  //   //结果的状态
  //   let status;
  //   //所有数据
  //   let dataObj = event.currentTarget.dataset.item;
  //   let id = dataObj.id;
  //   let subId = dataObj.subId;
  //   //是在全部页面点击的详情
  //   if (this.data.orderType == 999) {
  //     let isSubOrder = dataObj.isSubOrder;
      
  //     let orderStatus = dataObj.orderStatus;
  //     // <!--订单状态 2 - 0 - 待支付 1 - 2 - 待收货 1 - 3 - 已完成 2 - 2 - 已取消-- >
  //     let theStatus = '' + isSubOrder + '-' + orderStatus;
  //     //0 - 待支付 1 - 待收货 3 - 已完成 4 - 已取消
  //     switch (theStatus) {
  //       case '2-0':
  //         status = 0;
  //         break;
  //       case '1-2':
  //         status = 1;
  //         break;
  //       case '1-3':
  //         status = 3;
  //         break;
  //       case '2-2':
  //         status = 4;
  //         break;
  //     }
  //   } else {
  //     status = this.data.orderType;
  //   }
  //   wx.navigateTo({
  //     url: '/pages/orderAbout/orderAbout?orderId=' + id + '&status=' + status + '&subOrderId=' + subId
  //   })
  // }
})