import eventUtils from '../../utils/eventUtils.js';
import socketUtils from '../../utils/socketUtils.js';
//main.js
//获取应用实例
const app = getApp()

Page({
  data: {
    user: null,
    firstname: null,
    romList: [],
    onlineNumber: 1
  },
  onShow: function() {
    socketUtils.sendMsg({ data: {}, type: 'enterIndex' });
  },
  onHide: function() {
    socketUtils.sendMsg({ data: {}, type: 'leaveIndex' });
  },
  onLoad: function () {
    this.initEvent();
    this.setData({
      user: app.globalData.user,
      firstname: app.globalData.user.username.substring(0, 1),
      romList: app.globalData.romList,
      onlineNumber: app.globalData.onlineNumber
    })
  },
  initEvent: function () {
    let that = this;
    eventUtils.on('userNumber', ((data) => {
      this.setData({
        onlineNumber: data.data
      });
      app.globalData.onlineNumber = data.data;
    }));

    eventUtils.on('roomCreated', ((data) => {
      this.data.romList.push(data.data);
      this.setData({
        romList: this.data.romList
      });
      app.globalData.romList = this.data.romList;
    }));

    eventUtils.on('roomChanged', (data) => {
      // 房间人数等于0 则不显示房间
      if (data.data.joined === 0) {
        for (let i = 0; i < this.data.romList.length; i++) {
          if (this.data.romList[i].id === data.data.id) {
            this.data.romList.splice(i, 1);
            break;
          }
        }
      } else {
        for (let i = 0; i < this.data.romList.length; i++) {
          if (this.data.romList[i].id === data.data.id) {
            this.data.romList[i] = Object.assign(this.data.romList[i], data.data);
            break;
          }
        }
      }
      
      this.setData({
        romList: this.data.romList
      });
      app.globalData.romList = this.data.romList;
      console.log(this.data.romList);
    });
  },
  gotoSearch: function (e) {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  gotoCreateRom: function (e) {
    wx.navigateTo({
      url: '../createRom/createRom'
    })
  },
  gotoRom: function (e) {
    let romId = e.target.dataset.romid;
    wx.navigateTo({
      url: '../rom/rom?romId=' + romId
    })
  }
})
