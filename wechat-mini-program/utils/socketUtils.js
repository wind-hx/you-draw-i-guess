import config from '../config/config';
import eventUtils from './eventUtils.js';

let socketOpen = false;
let events = {};
let socketMsgQueue = [];
const app = getApp();

const socketInit = (callback) => {
  
  console.info(config);

  wx.connectSocket({
    url: `ws://${config.webSocketHost}:${config.webSocketPort}`
  });

  wx.onSocketOpen((res) => {
    socketOpen = true;

    for (let i = 0; i < socketMsgQueue.length; i++) {
      sendMsg(socketMsgQueue[i]);
    }

    callback(true);
  });

  wx.onSocketError((res) => {
    console.log('socket error: ');
    console.log(res);
    callback(false);
  });

  wx.onSocketClose((res) => {
    console.log('socket close!');
    console.log(res);
  });
  
  wx.onSocketMessage((res) => {
    console.log(res);
    let data = JSON.parse(res.data);
    console.log('socket on message: ');
    console.log(data);
    if (data.id) {
      event(data.id, data);
    } else {
      // 全局事件
      eventUtils.event(data.type, data);
    }
  });
}

const sendMsg = (msg) => {
  if (typeof (msg) === 'object') {
    msg = JSON.stringify(msg);
  }
  console.info(msg);

  if (socketOpen) {
    wx.sendSocketMessage({
       data: msg
    });
    
  } else {
    socketMsgQueue.push(msg);
    console.error('socket not connect');
    callback(false);
  }
}

const request = (data, type) => {
  return new Promise((resolve, reject) => {
    try {
      const messageId = type + '_' + new Date().getTime()
      const msg = { data, type, id: messageId }
      on(messageId, ({ data, error }) => {
        if (error === true) {
          reject(data)
        }
        resolve(data)
        delete events[messageId]
      })
      sendMsg(msg)
    } catch (e) {
      reject(e)
    }
  })
}

const on = (name, fn) => {
  if (typeof fn === 'function') {
    if (!events[name]) events[name] = []
    events[name].push(fn)
  }
}

const event = (name, data) => {
  let eventsArray = events[name]
  eventsArray && eventsArray.forEach(fn => fn(data))
}

module.exports = {
  socketInit: socketInit,
  sendMsg: sendMsg,
  request: request,
  on: on
}
