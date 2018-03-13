import eventUtils from '../../utils/eventUtils.js';
import socketUtils from '../../utils/socketUtils.js';
import regeneratorRuntime from '../../utils/runtime.js';
//createRom.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },
  onLoad: function () {
    this.initEvent();

  },
  initEvent: function () {

  },
  createRomBtn: async function(e) {
    let data = e.detail.value;
    let result = await socketUtils.request({ name: data.romname, playNumber: 8, type: data.type, playTimes: 3}, 'createRoom');
    console.log(result);
    wx.navigateTo({
      url: '../rom/rom?romId=' + result.id
    })

  }
})
