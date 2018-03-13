import storageUtils from './utils/storageUtils.js';
import socketUtils from './utils/socketUtils.js';
import userData from './data/userData.js';
import regeneratorRuntime from './utils/runtime.js';
import eventUtils from './utils/eventUtils.js';

//app.js
App({
  onLaunch: function () {
    this.init(this)
    
    
  },
  globalData: {
    user: storageUtils.get('user'),
    romList: [],
    onlineNumber: 1
  },
  init: (ctx) => {
    ctx.initSocket(ctx);
    ctx.initEvent(ctx);
  },
  initSocket: (ctx) => {
    let that = ctx;
    socketUtils.socketInit(
      async (result) => {
        if (result) {
          let loginUser = that.globalData.user === null ? {} : that.globalData.user;
          that.globalData.user = await socketUtils.request(loginUser, 'login');

          socketUtils.request(that.globalData.user, 'roomList').then((data) => {
            that.globalData.romList = data;
          });

          socketUtils.request(that.globalData.user, 'userNumber').then((data) => {
            that.globalData.onlineNumber = data;
          });

        }
      }
    );
  },
  initEvent: (ctx) => {
    let that = ctx;
  }
})