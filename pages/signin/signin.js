// pages/signin/signin.js
var util = require('../../utils/util.js');
Page({
  data: {
    showIcon: true,//引入的自定义导航左边返回按钮
    title:"签到",
    steps: [{ name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 },{ name: 1 }],
    active:5,
    stepsData: [{ key: '第一天', value: '+1积分' }, { key: '第一天', value: '+1积分' }, { key: '第一天', value: '+1积分' }, { key: '第一天', value: '+1积分' }, { key: '第一天', value: '+1积分' }, { key: '第一天', value: '+1积分' }, { key: '第一天', value: '+1积分' }],
    signinOk:false,
    signinRules:true
  },
  onLoad: function () {
  },
  onShow(){
    //埋点函数 页面操作事件 下一个页面地址
    util.mdFun(this, '', '');
  }
})