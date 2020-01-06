ENDPOINT = 'http://162.241.100.82:1337'
ENDPOINT_ROCKET_API = 'http://localhost:3000'
SECRET_CRIPYTO = 'appdsock-m-1029l-12jsoo1-2121.232i'
function loadJSON(json, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', json, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(JSON.parse(xobj.responseText));
    }
  };
  xobj.send(null);
}

function rTrim(str){
    return str.replace(/\s+$/, "");
}
function lTrim(str){
    return str.replace(/^\s+/, "");
}

function rocketNetwork(method, route, json, callback) {
  $('.loadingItem').fadeIn()
  $('#loading-footer').fadeIn()
  $('.loadingItem').css('display', 'block')
  var ajaxTime= new Date().getTime();
  $.ajax({
    type: method,
    url: ENDPOINT_ROCKET_API + route,
    beforeSend: function(xhr) {
      try{
        xhr.setRequestHeader('Authorization', 'Bearer ' + getUserData().jwt);
        xhr.setRequestHeader('x-appdock-token', JSON.parse(getKeyData()).data[0].token);
        xhr.setRequestHeader('x-api-key', JSON.parse(getKeyData()).data[0].apiKey);
      }catch(d){
        alerta("Erro ao tentar acessar as chaves de API, refaça o login!", true)
      }
     },
    data: JSON.stringify(json),
    contentType: "application/json; charset=utf-8",
    traditional: true,
    success: function(data, textStatus, xheader) {
      var totalTime = new Date().getTime()-ajaxTime+"ms";
      console.log("------------START")
      console.log(route)
      console.log(textStatus)
      console.log(xheader)
      console.log(data)
      console.log(xheader)
      console.log("------------END")
      $('.loadingItem').fadeOut()
      $('#loading-footer').fadeOut()
      return callback(true, data, totalTime)

    },
    error: function(data) {
      var totalTime = new Date().getTime()-ajaxTime;
      $('.loadingItem').fadeOut()
      $('#loading-footer').fadeOut()
      return callback(false, null, totalTime)
    }
  });
}



function request(method, route, json, callback) {
  $('.loadingItem').fadeIn()
  $('#loading-footer').fadeIn()
  $('.loadingItem').css('display', 'block')
  $.ajax({
    type: method,
    url: ENDPOINT + route,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + getUserData().jwt);
    },
    data: JSON.stringify(json),
    contentType: "application/json; charset=utf-8",
    traditional: true,
    success: function(data, textStatus, xheader) {
      console.log("------------START")
      console.log(route)
      console.log(textStatus)
      console.log(xheader)
      console.log(data)
      console.log("------------END")

      $('.loadingItem').fadeOut()
      $('#loading-footer').fadeOut()
      return callback(true, data)

    },
    error: function(data) {
      $('.loadingItem').fadeOut()
      $('#loading-footer').fadeOut()
      return callback(false, null)
    }
  });
}


function requestGet(method, route, callback) {
  $('.loadingItem').fadeIn()
  $('#loading-footer').fadeIn()
  $('.loadingItem').css('display', 'block')

  $.ajax({
    type: method,
    url: ENDPOINT + route,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + getUserData().jwt);
    },
    contentType: "application/json; charset=utf-8",
    traditional: true,
    success: function(data, textStatus, xheader) {
      console.log("------------START")
      console.log(route)
      console.log(textStatus)
      console.log(xheader)
      console.log(data)
      console.log("------------END")
      $('.loadingItem').fadeOut()
      $('#loading-footer').fadeOut()
      return callback(true, data)
    },
    error: function(data) {
      $('.loadingItem').fadeOut()
      $('#loading-footer').fadeOut()
      return callback(false, null)
    }
  });
}


function requestNoAuth(method, route, json, callback) {
  $('.loadingItem').fadeIn()
  $('#loading-footer').fadeIn()
  $('.loadingItem').css('display', 'block')
  $.ajax({
    type: method,
    url: ENDPOINT + route,
    contentType: "application/json; charset=utf-8",
    traditional: true,
    data: JSON.stringify(json),
    success: function(data, textStatus, xheader) {
      console.log("------------START")
      console.log(route)
      console.log(textStatus)
      console.log(xheader)
      console.log(data)
      console.log("------------END")
      $('.loadingItem').fadeOut()
      $('#loading-footer').fadeOut()
      return callback(true, data)
    },
    error: function(data) {
      $('.loadingItem').fadeOut()
      $('#loading-footer').fadeOut()
      return callback(false, null)
    }
  });
}
