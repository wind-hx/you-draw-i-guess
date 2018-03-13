export default {
  isNull: (obj) => {
    if (obj === null || obj === undefined || obj === '') {
      return true;
    } else {
      return false;
    }
  },
  isNotNull: (obj) => {
    if (obj === null || obj === undefined || obj === '') {
      return false;
    } else {
      return true;
    }
  },
  findRequestParmValue: (url, paras) => {
    var paraString = url.substring(url.indexOf("?") + 1, url.length)
      .split("&");
    var paraObj = {}
    let i, j;
    for (i = 0; j = paraString[i]; i++) {
      paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j
        .substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof (returnValue) == "undefined") {
      return "";
    } else {
      return returnValue;
    }
  }
};
