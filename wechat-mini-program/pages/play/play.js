import eventUtils from '../../utils/eventUtils.js';
import socketUtils from '../../utils/socketUtils.js';
import regeneratorRuntime from '../../utils/runtime.js';
import stringUtils from '../../utils/stringUtils.js';
//play.js
//获取应用实例
const app = getApp();
let cxt = null;

Page({
  data: {
    isShowScoreList:false,
    isShowAnswerList: false,
    answerText: '',
    playId: 0,
    playerId: '',
    isDraw: false,
    leftText: '',
    rightText: '',
    userList: [],
    userListSortByScore: [],
    playCount: 8,
    msgList: [],
    canvasData: {
      startMoveX: 0,
      startMoveY: 0
    }
  },
  onLoad: async function (query) {
    // 初始化数据
    this.initData(query);
    // 初始化事件
    this.initEvent();
    // 初始化游戏
    this.initGame();
  },
  reLoadData: function () {
    this.setData({
      isShowScoreList: false,
      isShowAnswerList: false,
      answerText: '',
      playerId: '',
      isDraw: false,
      leftText: '',
      rightText: '',
      userList: [],
      userListSortByScore: [],
      playCount: 8,
      msgList: [],
      canvasData: {
        startMoveX: 0,
        startMoveY: 0
      }
    });
    cxt.clearRect(0, 0, wx.getSystemInfoSync().windowWidth, 260)
    cxt.draw();
  },
  initData: function (query) {
    this.setData({
      isShowScoreList: false,
      isShowAnswerList: false,
      answerText: '',
      playId: parseInt(query.playId),
      playerId: '',
      isDraw: false,
      leftText: '',
      rightText: '',
      userList: [],
      userListSortByScore: [],
      playCount: 8,
      msgList: [],
      canvasData: {
        startMoveX: 0,
        startMoveY: 0
      }
    });
  },
  initEvent: function () {
    eventUtils.on('timeout', (data) => {
      // 倒计时更新
      this.setData({
        rightText: data.data
      });
    });

    eventUtils.on('typeHints', (data) => {
      // 左上角游戏提示更新
      this.setData({
        leftText: this.data.leftText + ' ' + data.data
      });
    });

    eventUtils.on('thisOver', (data) => {
      // 某一局结束 更新该局正确答案
      this.setData({
        answerText: data.data.key,
        isShowAnswerList: true
      });
    });

    eventUtils.on('userOffline', (data) => {
      // 不在线用户
    });

    eventUtils.on('userOnline', (data) => {
      // 在线用户
    });

    eventUtils.on('drawAction', (data) => {
      // 收到服务器的画画指令
      this.drawCanvas(data.data.actionName, data.data.data, data.data.setting);
    });

    eventUtils.on('changeGamer', (data) => {
      // 重置游戏
      this.reLoadData();
      this.initGame();
    });
    
    eventUtils.on('countScore', (data) => {
      // 本地缓存的分数新增
      this.increaseScore(data.data);
    });

    eventUtils.on('gameOver', (data) => {
      // 游戏结束 更新本地缓存的分数 具体分数以服务器为准
      this.updateScore(data.data);
      // 游戏结束 需要显示该局分数排名 该函数是考本userList信息并根据分数排序把值赋给userListSortByScore
      this.copyUserListToUserListSortByScore();
    });

    eventUtils.on('receiveMsg', (data) => {
      let msgList = this.data.msgList;
      msgList.push(data.data.msg);
      this.setData({
        msgList: msgList
      });
    });
  },
  initGame: async function () {
    let isDraw = false;
    // 获取游戏对战信息
    let playData = await socketUtils.request({ id: this.data.playId }, 'gameData');
    // 初始化画布
    cxt = wx.createCanvasContext('playCanvas');
    cxt.rect(0, 0, wx.getSystemInfoSync().windowWidth, 260);
    cxt.lineCap = 'round';
    cxt.lineJoin = 'round';

    let users = [];
    for (let i = 0; i < playData.users.length; i++) {
      let user = playData.users[i];
      user.firstname = user.username.substring(0, 1);
      user.style = 'player-item';
      if (user.id === app.globalData.user.id) {
        user.style = 'player-item me';
      }

      if (user.id === playData.player) {
        user.style = 'player-item draw';
      }

      if (user.id === app.globalData.user.id && playData.player === app.globalData.user.id) {
        user.style = 'player-item me draw';
        isDraw = true;
      }
      users.push(user);
    }

    this.setData({
      isDraw: isDraw,
      playerId: playData.player,
      rightText: playData.time,
      userList: users,
      leftText: '提示: ' + playData.key
    });
  },
  onShow: async function () {
    
  },
  onHide: function () {
    
  },
  onUnload: function () {
    
  },
  sendMsg: function (e) {
    let data = e.detail.value;
    socketUtils.request(data.msg, 'chatMsg');
  },
  sendAction: function (obj) {
    socketUtils.sendMsg({ data: obj, type: 'drawAction'});
  },
  drawCanvas: function (action, data, setting) {
    switch (action) {
      case 'start':
        this.startDrawCanvas(data, setting);
      break;

      case 'move':
        this.moveDrawCanvas(data, setting);
      break;

      case 'end':
        cxt.closePath();
        break;

      case 'clear':
        break;

      case 'undo':

        break;

      case 'redo':

        break;
    }
  },
  startDrawCanvas: function (data, setting) {
    let lw = setting.line;
    let x = parseInt(data.x);
    let y = parseInt(data.y);
    let startX = x - lw / 16;
    let startY = y - lw / 16;
    console.log(`设置颜色:${setting.color}, 设置宽度:${setting.line}, x: ${x}, y: ${y}`);

    cxt.setStrokeStyle(setting.color);
    cxt.setLineWidth(setting.line);

    cxt.beginPath();
    cxt.fill();
    
    cxt.moveTo(startX, startY);
    cxt.lineTo(x, y);

    cxt.stroke();
    cxt.draw(true);
    this.setData({
      canvasData: {
        startMoveX: x,
        startMoveY: y
      }
    });
  },
  moveDrawCanvas: function (data, setting) {
    let x = parseInt(data.x);
    let y = parseInt(data.y);;
    console.log(`设置颜色:${setting.color}, 设置宽度:${setting.line}, x: ${x}, y: ${y}`);
    
    cxt.moveTo(this.data.canvasData.startMoveX, this.data.canvasData.startMoveY);
    cxt.lineTo(x, y);

    cxt.stroke();
    cxt.draw(true);
    this.setData({
      canvasData: {
        startMoveX: x,
        startMoveY: y
      }
    });
  },
  start: function (event) {
    if (this.data.isDraw) {
      let data = this.getTouch(event);
      console.log(data);
      this.drawCanvas('start', data, { color: '#000000', line: 4 });
      this.sendAction({ actionName: 'start', data: data, setting: { color: '#000000', line: 4 } });
    }
  },
  move: function (event) {
    if (this.data.isDraw) {
      let data = this.getTouch(event);
      console.log(data);
      this.drawCanvas('move', data, { color: '#000000', line: 4 });
      this.sendAction({ actionName: 'move', data: data, setting: { color: '#000000', line: 4 }});
    }
  },
  end: function (event) {
    console.log(event);
  },
  getTouch: function (event) {
    let touch = event.touches[0];
    let x = touch.x;
    let y = touch.y;
    return {x, y};
  },
  awswerClick: function () {
    this.setData({
      isShowAnswerList: false
    });
  },
  cancelAnswer: function () {
    this.setData({
      isShowAnswerList: false
    });
  },
  reGoToHome: function() {
    this.setData({
      isShowScoreList: false
    });
  },
  increaseScore: function (data) {
    let userList = this.data.userList;
    for (let i = 0; i < userList.length; i++) {
      let score = data[userList[i].id];
      if (stringUtils.isNotNull(score)) {
        userList[i].score += score;
      }
    }
    this.setData({
      userList: userList
    });
  },
  updateScore: function (data) {
    let userList = this.data.userList;
    for (let i = 0; i < userList.length; i++) {
      let score = data[userList[i].id];
      if (stringUtils.isNotNull(score)) {
        userList[i].score = score;
      }
    }
    this.setData({
      userList: userList
    });
  },
  copyUserListToUserListSortByScore: function () {
    let userList = this.data.userList;
    userList.sort((a, b) => {
      if (a.score > b.score) {
        return -1;
      } else if (a < b) {
        return 1;
      } else {
        return 0;
      }
    });
    this.setData({
      userListSortByScore: userList,
      isShowScoreList: true
    });
  }
})
