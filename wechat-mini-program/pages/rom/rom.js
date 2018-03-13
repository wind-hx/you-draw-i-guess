import eventUtils from '../../utils/eventUtils.js';
import socketUtils from '../../utils/socketUtils.js';
import regeneratorRuntime from '../../utils/runtime.js';
//rom.js
//获取应用实例
const app = getApp()

Page({
  data: {
    romId: 0,
    romName: null,
    userList: [],
    playCount: 8,
    msgList: [],
    isMaster: false
  },
  onLoad: function (query) {
    this.setData({
      romId: parseInt(query.romId)
    });
    this.initEvent();
  },
  initEvent: function () {
    eventUtils.on('userEnter', (data) => {
      this.setData({
        userList: data.data
      });
      this.formatUserList();
    });

    eventUtils.on('userLeave', (data) => {
      for (let i = 0; i < this.data.userList.length; i++) {
        if (this.data.userList[i].id === data.data.id) {
          this.data.userList[i] = { username: '等待加入', id: undefined, firstname: '空', style: 'player-item empty-item' };
          break;
        }
      }
      this.formatUserList();
    });

    eventUtils.on('receiveMsg', (data) => {
      this.data.msgList.push({msg: data.data.msg, type: data.data.normal});
      this.setData({
        msgList: this.data.msgList
      });
    });

    eventUtils.on('gameBegin', (data) => {
      let playId = data.data.id;
      wx.navigateTo({
        url: '../play/play?playId=' + playId
      })
    });
  },
  onShow: async function () {
    let result = await socketUtils.request({id: this.data.romId}, 'enterRoom');
    this.setData({
      romName: result.name
    });
  },
  onUnload: function () {
    socketUtils.request({}, 'leaveRoom');
  },
  formatUserList: function () {
    this.data.isMaster = false;
    let realList = [];
    let emptyList = [];
    for (let i = 0; i < this.data.playCount; i++) {
      if (this.data.userList[i] && this.data.userList[i].id) {
        this.data.userList[i].firstname = this.data.userList[i].username.substring(0, 1);
        this.data.userList[i].style = 'player-item';
        // 判断是不是当前登录用户
        if (this.data.userList[i].id === app.globalData.user.id) {
          this.data.userList[i].style = 'player-item me';
        }
        realList.push(this.data.userList[i]);
      } else {
        let empty = { username: '等待加入', id: undefined, firstname: '空', style: 'player-item empty-item' };
        this.data.userList.push(empty);
        emptyList.push(empty);
      }
    }
    // 第一个是房主
    realList[0].style = 'player-item master';
    // 即使房主 也是自己
    if (realList[0].id === app.globalData.user.id) {
      realList[0].style = 'player-item master me';
      this.data.isMaster = true;
    }

    // 用户数组 加 空数组 合并
    this.data.userList = realList.concat(emptyList);
    console.log(this.data.userList);
    this.setData({
      userList: this.data.userList,
      isMaster: this.data.isMaster
    });
  },
  sendMsg: function (e) {
    let data = e.detail.value;
    socketUtils.request(data.msg, 'chatMsg');
  }
})
