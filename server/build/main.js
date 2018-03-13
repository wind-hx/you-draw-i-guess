require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_fs__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_fs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_fs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_path__);



function getRandomArray(array) {
  if (array) {
    return array.sort(function (_) {
      return parseInt(Math.random() * 1000) % 2 ? 1 : -1;
    });
  }
  return array;
}

var projectRoot = __WEBPACK_IMPORTED_MODULE_1_path___default.a.resolve(__dirname, '../');
var wordData = __WEBPACK_IMPORTED_MODULE_0_fs___default.a.readFileSync(projectRoot + '/word.txt', 'utf-8');
var nickNameData = __WEBPACK_IMPORTED_MODULE_0_fs___default.a.readFileSync(projectRoot + '/nickname.txt', 'utf-8');
var allWord = wordData.split('\n');
var allNameArray = nickNameData.split('\n');
var keyIndex = 0;
var nameIndex = 0;

var allKeys = allWord.map(function (w) {
  return w.split(':');
});

var allNames = getRandomArray(allNameArray);
allKeys = getRandomArray(allKeys);

console.log('projectRoot:', projectRoot);
console.log('allGameKeyLength: ', allKeys.length);
console.log('allNameLength: ', allNames.length);
/* harmony default export */ __webpack_exports__["a"] = ({
  getNextKey: function getNextKey() {
    var keyWord = allKeys[keyIndex++];
    if (!keyWord) {
      allKeys = getRandomArray(allKeys);
      keyIndex = 0;
      keyWord = allKeys[keyIndex++];
    }
    return keyWord;
  },
  getNextName: function getNextName() {
    var keyWord = allNames[nameIndex++];
    if (!keyWord) {
      allNames = getRandomArray(allNames);
      nameIndex = 0;
      keyWord = allNames[nameIndex++];
    }
    return keyWord;
  }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, "src/service"))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ws__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ws___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ws__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_GlobalEmitService__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_GlobalEmitService___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__service_GlobalEmitService__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_DataService__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__controller_ConnectController__ = __webpack_require__(7);




var wsServer = __WEBPACK_IMPORTED_MODULE_0_ws___default.a.Server({ port: 9001 });
var globalMap = {
  userMap: {},
  roomMap: {},
  roomUser: {},
  gameMap: {}
};

function deleteExpireUser() {
  var allUsers = Object.values(globalMap.userMap);
  var nowTime = new Date().getTime();
  allUsers.forEach(function (u) {
    if (!u.isOnline) {
      var timeNotTouch = nowTime - u.lastLoginTime;
      if (timeNotTouch > 1000 * 60 * 60 * 2) {
        console.log('user not touch ', timeNotTouch);
        u.inGame = false;
        u.currentRoomId = '';
        delete globalMap.userMap[u.token];
        console.log('delete user from userMap: ', u.username);
      }
    }
  });
}

setInterval(function (_) {
  deleteExpireUser();
}, 100000);

wsServer.on('connection', function (ws) {
  new __WEBPACK_IMPORTED_MODULE_3__controller_ConnectController__["a" /* default */](ws, globalMap);
});

console.log('websocket start:', wsServer.options.port);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("ws");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var events = {};

global.$on = function (type, fn) {
  if (typeof fn === 'function') {
    var allFunction = events[type] || [];
    allFunction.push(fn);
    events[type] = allFunction;
  }
};

global.$emit = function (type, data) {
  var allFunction = events[type] || [];
  allFunction.forEach(function (fn) {
    return fn(data);
  });
};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_node_uuid__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_node_uuid___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_node_uuid__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_MessageDispatchService__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_SenderService__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_SenderService___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__service_SenderService__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }





var ConnectController = function ConnectController(ws, globalMap) {
  var _this = this;

  _classCallCheck(this, ConnectController);

  this.token = __WEBPACK_IMPORTED_MODULE_0_node_uuid___default.a.v4();
  this.id = __WEBPACK_IMPORTED_MODULE_0_node_uuid___default.a.v4();
  this.username = '';
  this.currentRoomId = null;
  this.isOnline = true;
  this.ws = ws;
  this.lastLoginTime = new Date().getTime();
  this.send = function (data, type) {
    __WEBPACK_IMPORTED_MODULE_2__service_SenderService___default.a.sendToUser(_this, data, type);
  };
  var userClient = this;
  ws.on('message', function (message) {
    try {
      userClient.lastLoginTime = new Date().getTime();
      var messageData = JSON.parse(message);
      var processFunction = __WEBPACK_IMPORTED_MODULE_1__service_MessageDispatchService__["a" /* default */][messageData.type] || __WEBPACK_IMPORTED_MODULE_1__service_MessageDispatchService__["a" /* default */]['default'];
      processFunction(buildContext(messageData, globalMap, userClient));
    } catch (e) {
      console.error('parse message error', message, e);
    }
  });

  ws.on('close', function (_) {
    _this.isOnline = false;
    global.$emit('userLeave', buildContext({ type: 'userLeave' }, globalMap, userClient));
  });

  ws.on('error', function (_) {
    console.log('ws error');
  });
  function buildContext(messageData, globalMap, userClient) {
    var currentUsers = globalMap.roomUser[userClient.currentRoomId];
    var currentRoom = globalMap.roomMap[userClient.currentRoomId];
    var currentGame = globalMap.gameMap[userClient.currentRoomId];
    if (currentRoom) {
      currentRoom.lastActiveTime = new Date().getTime();
    }
    return Object.assign({
      type: messageData.type,
      data: messageData.data,
      userClient: userClient
    }, globalMap, {
      currentRoom: currentRoom,
      currentUsers: currentUsers,
      currentGame: currentGame,
      userArray: currentUsers && Object.values(currentUsers),
      send: function send(data) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : messageData.type;

        __WEBPACK_IMPORTED_MODULE_2__service_SenderService___default.a.sendToUser(userClient, data, type, type === messageData.type ? messageData.id : null);
      },
      sendError: function sendError(data) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : messageData.type;

        __WEBPACK_IMPORTED_MODULE_2__service_SenderService___default.a.sendToUserError(userClient, data, type, type === messageData.type ? messageData.id : null);
      },
      sendToSameRoom: function sendToSameRoom(data) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : messageData.type;

        var currentRoomId = userClient.currentRoomId;
        var users = globalMap.roomUser[currentRoomId];
        Object.keys(users).forEach(function (k) {
          var sessionUser = globalMap.userMap[users[k].token];
          users[k] = sessionUser;
        });
        __WEBPACK_IMPORTED_MODULE_2__service_SenderService___default.a.sendToUsers(users, data, type, type === messageData.type ? messageData.id : null);
      }
    });
  }
};

/* harmony default export */ __webpack_exports__["a"] = (ConnectController);

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("node-uuid");

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__RoomService__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UserService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__GameService__ = __webpack_require__(12);



/* harmony default export */ __webpack_exports__["a"] = ({
  login: __WEBPACK_IMPORTED_MODULE_1__UserService__["a" /* default */].login,
  changename: __WEBPACK_IMPORTED_MODULE_1__UserService__["a" /* default */].changeName,
  createRoom: __WEBPACK_IMPORTED_MODULE_0__RoomService__["a" /* default */].create,
  enterRoom: __WEBPACK_IMPORTED_MODULE_0__RoomService__["a" /* default */].enter,
  leaveRoom: __WEBPACK_IMPORTED_MODULE_0__RoomService__["a" /* default */].leave,
  roomList: __WEBPACK_IMPORTED_MODULE_0__RoomService__["a" /* default */].list,
  enterIndex: __WEBPACK_IMPORTED_MODULE_0__RoomService__["a" /* default */].changeSub,
  leaveIndex: __WEBPACK_IMPORTED_MODULE_0__RoomService__["a" /* default */].changeUnSub,
  chatMsg: __WEBPACK_IMPORTED_MODULE_2__GameService__["a" /* default */].msg,
  beginGame: __WEBPACK_IMPORTED_MODULE_2__GameService__["a" /* default */].begin,
  gameData: __WEBPACK_IMPORTED_MODULE_2__GameService__["a" /* default */].getData,
  drawAction: __WEBPACK_IMPORTED_MODULE_2__GameService__["a" /* default */].drawAction,
  drawImage: __WEBPACK_IMPORTED_MODULE_2__GameService__["a" /* default */].drawImage,
  userNumber: __WEBPACK_IMPORTED_MODULE_1__UserService__["a" /* default */].userNumber,
  default: function _default(_ref) {
    var type = _ref.type;

    console.log('unknow message', type);
  }
});

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
global.roomId = null;
function getRoomId() {
  var date = new Date();
  if (!global.roomId) {
    var start = parseInt('' + date.getDate() + date.getHours() + date.getMinutes());
    global.roomId = start;
  } else {
    global.roomId += 2;
  }
  return global.roomId;
}
function getUserArray(currentUsers) {
  return Object.values(currentUsers).map(function (u) {
    return {
      username: u.username,
      id: u.id
    };
  });
}
function userLeave(ctx) {
  var userClient = ctx.userClient,
      currentUsers = ctx.currentUsers,
      roomMap = ctx.roomMap,
      userMap = ctx.userMap,
      currentRoom = ctx.currentRoom,
      sendToSameRoom = ctx.sendToSameRoom;

  if (currentRoom && currentRoom.status === 1) {
    Object.values(currentUsers).forEach(function (u) {
      if (userClient.id === u.id) {
        delete currentUsers[u.id];
      }
    });
    currentRoom.joined = Object.values(currentUsers).length;
    sendToSameRoom({ id: userClient.id }, 'userLeave');
    global.$emit('room-changed', { userMap: userMap, roomChangeData: currentRoom });
  }
  sendUserNumber(userMap);
}

global.$on('userLeave', userLeave);

function sendToSub(userMap, room, type) {
  if (room.type === '1') {
    Object.values(userMap).forEach(function (user) {
      if (user.changeSub) {
        user.send(room, type);
      }
    });
  }
}

function sendUserNumber(userMap) {
  var onlineUserNumber = Object.values(userMap).filter(function (u) {
    return u.isOnline;
  }).length;
  console.log('send userNumber: ', onlineUserNumber);
  Object.values(userMap).forEach(function (u) {
    console.log(u.username + ':' + u.changeSub);
    if (u.changeSub) {
      u.send(onlineUserNumber, 'userNumber');
    }
  });
}
global.$on('userLogin', function (_ref) {
  var userClient = _ref.userClient,
      userMap = _ref.userMap,
      currentUsers = _ref.currentUsers;

  if (currentUsers) {
    currentUsers[userClient.id] = userClient;
  }
  sendUserNumber(userMap);
});

global.$on('room-changed', function (_ref2) {
  var userMap = _ref2.userMap,
      roomChangeData = _ref2.roomChangeData;

  sendToSub(userMap, { id: roomChangeData.id, type: roomChangeData.type, joined: roomChangeData.joined, status: roomChangeData.status }, 'roomChanged');
});

global.$on('room-created', function (_ref3) {
  var userMap = _ref3.userMap,
      roomChangeData = _ref3.roomChangeData;

  sendToSub(userMap, roomChangeData, 'roomCreated');
});

/* harmony default export */ __webpack_exports__["a"] = ({
  changeUnSub: function changeUnSub(_ref4) {
    var userClient = _ref4.userClient;

    userClient.changeSub = false;
  },
  changeSub: function changeSub(_ref5) {
    var userClient = _ref5.userClient;

    userClient.changeSub = true;
  },
  list: function list(_ref6) {
    var send = _ref6.send,
        roomMap = _ref6.roomMap,
        roomUser = _ref6.roomUser;

    var rooms = Object.values(roomMap).filter(function (room) {
      room.joined = Object.values(roomUser[room.id]).length;
      return room.joined > 0 && room.type === '1';
    }).sort(function (a, b) {
      if (a.joined > b.joined) {
        return 1;
      } else if (a.createTime > b.createTime) {
        return 1;
      } else {
        return 0;
      }
    });
    send(rooms);
  },
  create: function create(_ref7) {
    var data = _ref7.data,
        userClient = _ref7.userClient,
        roomMap = _ref7.roomMap,
        roomUser = _ref7.roomUser,
        userMap = _ref7.userMap,
        send = _ref7.send;

    var room = {
      id: getRoomId(),
      name: data.name,
      createTime: new Date().getTime(),
      playNumber: 8,
      playTimes: 3,
      joined: 1,
      type: data.type,
      status: 1,
      gameTime: 60
    };
    roomMap[room.id] = room;
    roomUser[room.id] = {};
    send(room);
  },
  enter: function enter(_ref8) {
    var data = _ref8.data,
        userClient = _ref8.userClient,
        roomMap = _ref8.roomMap,
        roomUser = _ref8.roomUser,
        send = _ref8.send,
        sendToSameRoom = _ref8.sendToSameRoom,
        userMap = _ref8.userMap,
        sendError = _ref8.sendError;

    var room = roomMap[data.id];
    if (!room) {
      return send({ message: '房间不存在' }, 'roomClose');
    }
    var roomUsers = roomUser[room.id] || {};
    roomUser[room.id] = roomUsers;
    var isReLink = roomUsers[userClient.id];
    if (room.joined >= room.playNumber) {
      return sendError({ msg: '房间人数已满，不可加入' });
    } else if (room.status === 2) {
      return sendError({ msg: '该房间游戏已开始，不可加入' });
    } else {
      roomUsers[userClient.id] = userClient;
      room.joined = Object.values(roomUsers).length;
      userClient.currentRoomId = room.id;
      send(room);
      sendToSameRoom(getUserArray(roomUsers), 'userEnter');
      if (room.joined === 1) {
        global.$emit('room-created', { userMap: userMap, roomChangeData: room });
      } else {
        global.$emit('room-changed', { userMap: userMap, roomChangeData: room });
      }
    }
  },

  leave: userLeave
});

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__DataService__ = __webpack_require__(0);

/* harmony default export */ __webpack_exports__["a"] = ({
  login: function login(ctx) {
    var data = ctx.data,
        userClient = ctx.userClient,
        userMap = ctx.userMap,
        roomUser = ctx.roomUser,
        send = ctx.send;

    var user = data;
    var loginUser = function loginUser() {
      var sessionUser = userClient;
      var token = sessionUser.token;
      var id = sessionUser.id;
      userMap[token] = sessionUser;
      send({
        id: userClient.id,
        token: sessionUser.token,
        inGame: sessionUser.inGame,
        currentRoomId: sessionUser.currentRoomId,
        username: sessionUser.username
      });
      console.log('user login:', sessionUser.username);
      global.$emit('userLogin', ctx);
    };
    if (user.token) {
      var offLineUser = userMap[user.token];
      if (offLineUser) {
        userClient.username = offLineUser.username;
        userClient.token = offLineUser.token;
        userClient.id = offLineUser.id;
        userClient.inGame = offLineUser.inGame;
        userClient.currentRoomId = offLineUser.currentRoomId;
      } else {
        userClient.username = user.username;
        userClient.token = user.token;
      }
      loginUser();
    } else {
      var token = userClient.token;
      userClient.username = __WEBPACK_IMPORTED_MODULE_0__DataService__["a" /* default */].getNextName();
      loginUser();
    }
  },
  changeName: function changeName(_ref) {
    var data = _ref.data,
        userClient = _ref.userClient;

    userClient.username = data.username;
  },
  userNumber: function userNumber(_ref2) {
    var send = _ref2.send,
        userMap = _ref2.userMap;

    send(Object.values(userMap).filter(function (u) {
      return u.isOnline;
    }).length);
  }
});

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__DataService__ = __webpack_require__(0);

var firstScroe = 3;
var sencondScore = 2;
var minScore = 1;

function getGameKey() {
  return __WEBPACK_IMPORTED_MODULE_0__DataService__["a" /* default */].getNextKey();
}

function findNextUser(ctx) {
  var sendToSameRoom = ctx.sendToSameRoom,
      currentGame = ctx.currentGame,
      currentUsers = ctx.currentUsers,
      userArray = ctx.userArray,
      userMap = ctx.userMap;
  var playInfo = currentGame.playInfo,
      users = currentGame.users,
      currentTimes = currentGame.currentTimes,
      playTimes = currentGame.playTimes,
      userDraw = currentGame.userDraw;


  var currentPlayer = playInfo.player;
  var onLineUsers = getOnlineUser(ctx);
  if (onLineUsers.length === 0 || currentTimes >= playTimes) {
    // 如果在线人数为 0 或者 当前游戏次数大于等于 总游戏轮数， 游戏结束
    gameOver(ctx);
    return false;
  }
  userDraw.push({
    key: playInfo.key[0],
    play: currentPlayer,
    username: currentUsers[currentPlayer].username,
    imageData: playInfo.imageData
  });
  var nextPlayer = void 0;
  userArray.every(function (u, index) {
    if (u.id === currentPlayer) {
      nextPlayer = userArray[index + 1];
      if (!nextPlayer) {
        // 如果这个时候没有了，就是当前轮结束了
        currentGame.currentTimes++;
        nextPlayer = userArray[0];
      }
      currentGame.playInfo = { // 重新设置当前playInfo
        key: getGameKey(),
        time: currentGame.gameTime,
        player: nextPlayer.id
      };
      if (userMap[nextPlayer.token].isOnline) {
        sendToSameRoom(null, 'changeGamer');
        currentGame.start = false;
      } else {
        findNextUser(ctx);
      }
      return false;
    }
    return true;
  });
}

function toNextPlayer(ctx) {
  var sendToSameRoom = ctx.sendToSameRoom,
      currentGame = ctx.currentGame,
      currentUsers = ctx.currentUsers;
  var playInfo = currentGame.playInfo,
      users = currentGame.users,
      currentTimes = currentGame.currentTimes,
      playTimes = currentGame.playTimes,
      userDraw = currentGame.userDraw;

  clearTimeout(currentGame.timer);
  sendToSameRoom({ key: playInfo.key[0] }, 'thisOver');
  setTimeout(function (_) {
    findNextUser(ctx);
  }, 5000);
}

function gameOver(ctx) {
  var sendToSameRoom = ctx.sendToSameRoom,
      currentGame = ctx.currentGame,
      roomUser = ctx.roomUser,
      currentRoom = ctx.currentRoom,
      roomMap = ctx.roomMap,
      userArray = ctx.userArray;

  currentGame.isOver = true;
  currentRoom.status = 1;
  userArray.forEach(function (u) {
    u.inGame = false;
  });
  sendToSameRoom(currentGame.userScore, 'gameOver');
  roomUser[currentRoom.id] = {};
}

function timeCountDown(ctx) {
  var currentGame = ctx.currentGame,
      sendToSameRoom = ctx.sendToSameRoom;
  var playInfo = currentGame.playInfo;

  var time = playInfo.time;
  if (time > 0) {
    playInfo.time--;
    if (!playInfo.sendType && currentGame.gameTime / 2 >= playInfo.time) {
      playInfo.sendType = true;
      sendToSameRoom(playInfo.key[1], 'typeHints');
    }
    sendToSameRoom(playInfo.time, 'timeout');
    currentGame.timer = setTimeout(function (_) {
      timeCountDown(ctx);
    }, 1000);
  } else {
    toNextPlayer(ctx);
  }
}
function isAllFinish(ctx) {
  var userClient = ctx.userClient,
      currentGame = ctx.currentGame,
      sendToSameRoom = ctx.sendToSameRoom;
  var userScore = currentGame.userScore,
      currentTimes = currentGame.currentTimes,
      playInfo = currentGame.playInfo;

  var scoreMap = userScore[playInfo.key[0]];
  var onlineUsers = getOnlineUser(ctx);
  var answerNumber = Object.keys(scoreMap).length;
  if (answerNumber >= onlineUsers.length) {
    toNextPlayer(ctx);
  }
  var countScore = {};
  Object.values(userScore).forEach(function (score) {
    Object.keys(score).forEach(function (uid) {
      countScore[uid] = score[uid] + (countScore[uid] || 0);
    });
  });
  currentGame.countScore = countScore;
  sendToSameRoom(countScore, 'countScore');
}

function getOnlineUser(ctx) {
  var userMap = ctx.userMap,
      userArray = ctx.userArray;

  return userArray.filter(function (u) {
    return userMap[u.token].isOnline;
  });
}

function startGame(ctx) {
  ctx.currentGame.start = true;
  timeCountDown(ctx);
}

function countScore(ctx) {
  var userClient = ctx.userClient,
      currentGame = ctx.currentGame;
  var userScore = currentGame.userScore,
      currentTimes = currentGame.currentTimes,
      playInfo = currentGame.playInfo;

  var scoreKey = playInfo.key[0];
  var scoreMap = userScore[scoreKey];
  if (!scoreMap) {
    scoreMap = {};
    scoreMap[playInfo.player] = 0;
  }
  userScore[scoreKey] = scoreMap;
  var currentUserId = userClient.id;
  if (scoreMap[currentUserId]) {
    // 如果已经有分数了，就返回0
    return 0;
  }
  var answerNumber = Object.keys(scoreMap).length;
  if (answerNumber === 1) {
    // 如果没有分数Map，那说明该人是第一个答对的 + `firstScroe` 分
    scoreMap[currentUserId] = firstScroe;
    // 如果是第一个答对的，游戏时间缩小原来的 一般
    var halfTime = currentGame.gameTime / 2;
    if (playInfo.time > halfTime) {
      playInfo.time = halfTime;
    }
  } else if (answerNumber === 2) {
    // 第二个答对的 + `sencondScore` 分
    scoreMap[currentUserId] = sencondScore;
  } else {
    scoreMap[currentUserId] = minScore; // 第三及以后答对的 + `minScore` 分
  }
  scoreMap[playInfo.player] = Object.keys(scoreMap).length - 1; // 更新房主分数，当前批次，房主分数为答案总数
  isAllFinish(ctx); // 判断是否已经全部答完
  return scoreMap[currentUserId];
}

function sendAnswer(ctx) {
  var data = ctx.data,
      userClient = ctx.userClient,
      sendToSameRoom = ctx.sendToSameRoom,
      currentGame = ctx.currentGame;
  var playInfo = currentGame.playInfo;

  var currentKey = playInfo.key[0];
  var username = userClient.username;

  var msg = void 0;
  var type = void 0;
  if (currentKey === data) {
    msg = username + ' \u731C\u5BF9\u4E86\u7B54\u6848';
    var score = countScore(ctx);
    if (score > 0) {
      msg += '+' + score + '\u5206';
    }
    type = 'answer';
  } else {
    msg = username + ' \u8BF4: ' + data;
  }
  sendToSameRoom({
    msg: msg,
    type: type
  }, 'receiveMsg');
}

global.$on('userLeave', function (ctx) {
  var data = ctx.data,
      userClient = ctx.userClient,
      sendToSameRoom = ctx.sendToSameRoom,
      currentGame = ctx.currentGame;

  if (currentGame && !currentGame.isOver) {
    sendToSameRoom({ id: userClient.id }, 'userOffline');
    if (getOnlineUser(ctx).length === 0) {
      gameOver(ctx);
    }
  }
});

/* harmony default export */ __webpack_exports__["a"] = ({
  msg: function msg(ctx) {
    var data = ctx.data,
        userClient = ctx.userClient,
        sendToSameRoom = ctx.sendToSameRoom,
        currentGame = ctx.currentGame;

    var username = userClient.username;
    var msg = data;
    if (currentGame) {
      sendAnswer(ctx);
    } else {
      sendToSameRoom({
        msg: username + ' \u8BF4: ' + msg,
        type: 'normal'
      }, 'receiveMsg');
    }
  },
  begin: function begin(ctx) {
    var userClient = ctx.userClient,
        currentRoom = ctx.currentRoom,
        sendToSameRoom = ctx.sendToSameRoom,
        userArray = ctx.userArray,
        gameMap = ctx.gameMap,
        userMap = ctx.userMap;

    if (userArray.length > 1 && userClient.id === userArray[0].id) {
      // 判断人数是否大于2人，并且当前人是否是房主
      currentRoom.status = 2;
      userArray.forEach(function (u) {
        return u.inGame = true;
      });
      gameMap[currentRoom.id] = {
        users: userArray,
        playTimes: currentRoom.playTimes,
        gameTime: currentRoom.gameTime,
        userScore: {},
        userDraw: [],
        countScore: {},
        currentTimes: 1,
        playInfo: {
          key: getGameKey(),
          player: userArray[0].id,
          time: currentRoom.gameTime
        }
      };
      global.$emit('room-changed', { userMap: userMap, roomChangeData: { id: currentRoom.id, type: currentRoom.type, status: currentRoom.status } });
      sendToSameRoom({ id: currentRoom.id }, 'gameBegin');
    }
  },
  getData: function getData(ctx) {
    var userClient = ctx.userClient,
        currentRoom = ctx.currentRoom,
        currentGame = ctx.currentGame,
        send = ctx.send,
        data = ctx.data,
        sendError = ctx.sendError,
        sendToSameRoom = ctx.sendToSameRoom;

    if (!currentGame || currentGame.isOver) {
      return sendError({ type: 'gameOver', msg: '游戏已结束' });
    }
    if (userClient.currentRoomId === data.id) {
      var users = currentGame.users,
          playInfo = currentGame.playInfo,
          _countScore = currentGame.countScore;
      var player = playInfo.player,
          key = playInfo.key,
          time = playInfo.time;

      var gameData = {
        users: users.map(function (u) {
          return { id: u.id, username: u.username, score: _countScore[u.id] || 0 };
        }),
        player: player,
        time: time,
        imageData: playInfo.imageData
      };
      if (player === userClient.id) {
        gameData.key = key[0];
      } else {
        gameData.key = key[0].length + "个字";
      }
      if (!currentGame.start) {
        startGame(ctx);
      }
      send(gameData);
      sendToSameRoom({ id: userClient.id }, 'userOnline');
    } else {
      sendError({ msg: '进入游戏失败' });
    }
  },
  drawAction: function drawAction(_ref) {
    var sendToSameRoom = _ref.sendToSameRoom,
        data = _ref.data,
        currentGame = _ref.currentGame,
        userClient = _ref.userClient;

    if (userClient.id === currentGame.playInfo.player) {
      sendToSameRoom(data, 'drawAction');
    }
  },
  drawImage: function drawImage(_ref2) {
    var sendToSameRoom = _ref2.sendToSameRoom,
        data = _ref2.data,
        currentGame = _ref2.currentGame,
        userClient = _ref2.userClient;
    var playInfo = currentGame.playInfo;

    if (userClient.id === playInfo.player) {
      playInfo.imageData = data;
      sendToSameRoom(data, 'drawImage');
    }
  }
});

/***/ }),
/* 13 */
/***/ (function(module, exports) {

exports.send = function (ws, message) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.log('ws is not open', ws.readyState);
  }
};
exports.sendToUserError = function (userClient, data, type, id) {
  if (userClient.isOnline) {
    exports.send(userClient.ws, { data: data, type: type, id: id, error: true });
  }
};

exports.sendToUser = function (userClient, data, type, id) {
  if (userClient.isOnline) {
    exports.send(userClient.ws, { data: data, type: type, id: id });
  }
};

exports.sendToUsers = function (userClients, data, type, id) {
  Object.values(userClients).forEach(function (client) {
    exports.sendToUser(client, data, type, id);
  });
};

/***/ })
/******/ ]);
//# sourceMappingURL=main.map