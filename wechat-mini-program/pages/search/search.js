import eventUtils from '../../utils/eventUtils.js';
import socketUtils from '../../utils/socketUtils.js';
import regeneratorRuntime from '../../utils/runtime.js';
//search.js
//获取应用实例
const app = getApp()

Page({
  data: {
    romId: null
  },
  onLoad: function () {

  },
  gotoRom: function (e) {
    let romId = e.target.dataset.romid;
    let romName = e.target.dataset.romname;
    wx.navigateTo({
      url: '../rom/rom?romId=' + romId + '&romName=' + romName
    })
  }
})
