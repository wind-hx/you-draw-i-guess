//index.js
//获取应用实例
const app = getApp()
import socketUtils from '../../utils/socketUtils.js';
import userData from '../../data/userData.js';


Page({
  data: {
    motto: '你画我猜',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    
  },
  gotoMain: function (e) {
    wx.redirectTo({
      url: '../main/main'
    })
  },
  gotoPlay: function (e) {
    wx.redirectTo({
      url: '../play/play'
    })
  },
  gotoTest: function (e) {
    wx.redirectTo({
      url: '../test/test'
    })
  }
})
