 


var Base64 = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  encode: function(e) {
    var t = "";
    var n, r, i, s, o, u, a;
    var f = 0;
    e = Base64._utf8_encode(e);
    while (f < e.length) {
      n = e.charCodeAt(f++);
      r = e.charCodeAt(f++);
      i = e.charCodeAt(f++);
      s = n >> 2;
      o = (n & 3) << 4 | r >> 4;
      u = (r & 15) << 2 | i >> 6;
      a = i & 63;
      if (isNaN(r)) {
        u = a = 64
      } else if (isNaN(i)) {
        a = 64
      }
      t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
    }
    return t
  },
  decode: function(e) {
    var t = "";
    var n, r, i;
    var s, o, u, a;
    var f = 0;
    e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (f < e.length) {
      s = this._keyStr.indexOf(e.charAt(f++));
      o = this._keyStr.indexOf(e.charAt(f++));
      u = this._keyStr.indexOf(e.charAt(f++));
      a = this._keyStr.indexOf(e.charAt(f++));
      n = s << 2 | o >> 4;
      r = (o & 15) << 4 | u >> 2;
      i = (u & 3) << 6 | a;
      t = t + String.fromCharCode(n);
      if (u != 64) {
        t = t + String.fromCharCode(r)
      }
      if (a != 64) {
        t = t + String.fromCharCode(i)
      }
    }
    t = Base64._utf8_decode(t);
    return t
  },
  _utf8_encode: function(e) {
    e = e.replace(/\r\n/g, "\n");
    var t = "";
    for (var n = 0; n < e.length; n++) {
      var r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r)
      } else if (r > 127 && r < 2048) {
        t += String.fromCharCode(r >> 6 | 192);
        t += String.fromCharCode(r & 63 | 128)
      } else {
        t += String.fromCharCode(r >> 12 | 224);
        t += String.fromCharCode(r >> 6 & 63 | 128);
        t += String.fromCharCode(r & 63 | 128)
      }
    }
    return t
  },
  _utf8_decode: function(e) {
    var t = "";
    var n = 0;
    var r = c1 = c2 = 0;
    while (n < e.length) {
      r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r);
        n++
      } else if (r > 191 && r < 224) {
        c2 = e.charCodeAt(n + 1);
        t += String.fromCharCode((r & 31) << 6 | c2 & 63);
        n += 2
      } else {
        c2 = e.charCodeAt(n + 1);
        c3 = e.charCodeAt(n + 2);
        t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
        n += 3
      }
    }
    return t
  }
}


function GLOBAL_DECRIPTO(vals) {
  return Base64.decode(vals);
}

function GLOBAL_ENCRIPTA(vals) {
  var encodedString = Base64.encode(vals);
  return encodedString
}

function encrypt(message = '', key = '') {
  // var message = CryptoJS.AES.encrypt(message, key);
  return message.toString();
}

function decrypt(message = '', key = '') {
  // var code = CryptoJS.AES.decrypt(message, key);
  //  var decryptedMessage = code.toString(CryptoJS.enc.Utf8);

  return message;
}

function setKeyData(o) {
  localStorage.setItem('KeyData-json', encrypt(o));
}

function getKeyData() {
  var retrievedObject = localStorage.getItem('KeyData-json');
  return decrypt(retrievedObject);
}

function setRocketData(o) {
  localStorage.setItem('RocketData-json', encrypt(o));
}

function getRocketData() {
  var retrievedObject = localStorage.getItem('RocketData-json');
  return decrypt(retrievedObject);
}


function setRocketColunas(o) {
  localStorage.setItem('RocketColunas-json', encrypt(o));
}

function getRocketColunas() {
  var retrievedObject = localStorage.getItem('RocketColunas-json');
  return decrypt(retrievedObject);
}

function setJwtToken(o) {
  localStorage.setItem('jwtToken-json', encrypt(o));
}

function getJwtToken() {
  var retrievedObject = localStorage.getItem('jwtToken-json');
  return decrypt(retrievedObject);
}

function setUserData(o) {
  localStorage.setItem('local-json', encrypt(JSON.stringify(o)));
}

function getUserData() {
  var retrievedObject = localStorage.getItem('local-json');
  return decrypt(JSON.parse(retrievedObject));
}

function setComponentDefault(o) {
  localStorage.setItem('componentDefault-json', encrypt(JSON.stringify(o)));
}

function getComponentDefault() {
  var retrievedObject = localStorage.getItem('componentDefault-json');
  return decrypt(JSON.parse(retrievedObject));
}

function setAttribs(o) {
  localStorage.setItem('setAttribs-json', encrypt(JSON.stringify(o)));
}

function getAttribs() {
  var retrievedObject = localStorage.getItem('setAttribs-json');
  return decrypt(JSON.parse(retrievedObject));
}


function setFiles(o) {
  localStorage.setItem('setFiles-json', encrypt(JSON.stringify(o)));
}

function getFiles() {
  var retrievedObject = localStorage.getItem('setFiles-json');
  return decrypt(JSON.parse(retrievedObject));
}

function setCurrentComponent(o) {
  localStorage.setItem('component-current-json', encrypt(JSON.stringify(o)));
}

function getCurrentComponent() {
  var retrievedObject = localStorage.getItem('component-current-json');
  return decrypt(JSON.parse(retrievedObject));
}


function setHomeData(o) {
  localStorage.setItem('home-data', encrypt(JSON.stringify(o)));
}

function getHomeData() {
  var retrievedObject = localStorage.getItem('home-data');
  return decrypt(JSON.parse(retrievedObject));
}

function saveLocalData(o) {
  localStorage.setItem('local-data', encrypt(o));
}

function getLocalData() {
  var retrievedObject = localStorage.getItem('local-data');
  return decrypt(retrievedObject);
}


function setObjects(o) {
  localStorage.setItem('objects-json', encrypt(JSON.stringify(o)));
}

function getObjects() {
  var retrievedObject = localStorage.getItem('objects-json');
  return decrypt(JSON.parse(retrievedObject));
}

function setLayouts(o) {
  localStorage.setItem('Layouts-json', encrypt(JSON.stringify(o)));
}

function getLayouts() {
  var retrievedObject = localStorage.getItem('Layouts-json');
  return decrypt(JSON.parse(retrievedObject));
}
