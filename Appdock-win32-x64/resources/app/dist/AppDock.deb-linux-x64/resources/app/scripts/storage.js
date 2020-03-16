 function encrypt(message = '', key = '') {
     // var message = CryptoJS.AES.encrypt(message, key);
     return message.toString();
 }

 function decrypt(message = '', key = '') {
     // var code = CryptoJS.AES.decrypt(message, key);
     //  var decryptedMessage = code.toString(CryptoJS.enc.Utf8);

     return message;
 }

 function setUserData(o) {
     localStorage.setItem('local-json', encrypt(JSON.stringify(o)));
 }

 function getUserData() {
     var retrievedObject = localStorage.getItem('local-json');
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