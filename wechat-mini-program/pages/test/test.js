import eventUtils from '../../utils/eventUtils.js';
import socketUtils from '../../utils/socketUtils.js';
import regeneratorRuntime from '../../utils/runtime.js';
//play.js
//获取应用实例
const app = getApp()
// 使用 wx.createContext 获取绘图上下文 context
const ctx = wx.createCanvasContext('test')
Page({
  data: {
    isShowScoreList: true
  },
  onLoad: function (query) {
    
  },
  onReady: function (e) {
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineWidth(4);
    // for (let i = 0; i < 5; i++) {
    //   ctx.moveTo(i + 10, i + 10)
    //   ctx.lineTo(110 + i, 60 + 1)
    //   ctx.stroke()
    //   ctx.draw(true)
    // }
    
    // ctx.lineTo(155, 84)
    // ctx.stroke();
    // ctx.draw(true);
    // ctx.lineTo(145, 102)
    // ctx.stroke();
    // ctx.draw(true);
    // ctx.lineTo(135, 120)
    // ctx.stroke();
    // ctx.draw(true);
    // ctx.lineTo(126, 137)
    ctx.moveTo(10, 10)
    ctx.lineTo(110, 60)
    ctx.stroke()
    ctx.draw(true)
  },
  btnClick: function () {
    // this.setData({
    //   isShowScoreList: !this.data.isShowScoreList
    // });

    let arr = [5, 39, 8, 1, 2, 13, 55];
    arr = arr.sort((a, b) => { 
      if (a > b) {
        return -1;
      } else if (a < b) {
        return 1;
      } else {
        return 0;
      }
    });
    console.log(arr);
  

  },
  cancelEditRemark: function () {
    console.log('取消');
    this.setData({
      isShowScoreList: !this.data.isShowScoreList
    });
  },
  editRemark: function (result) {
    console.log('确认');
    this.setData({
      isShowScoreList: !this.data.isShowScoreList
    });
  }
})
