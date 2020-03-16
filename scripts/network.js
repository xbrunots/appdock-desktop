ENDPOINT = 'http://162.241.100.82:1337'
ENDPOINT_ROCKET_API = 'http://localhost:3000'
SECRET_CRIPYTO = 'appdsock-m-1029l-12jsoo1-2121.232i'

function logger(title, msg, isError = false) {

}

function loadJSON(json, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', json, true);
    xobj.onreadystatechange = function() {
        logger("LoadObject [statusCode]: ", xobj.status)
        logger("LoadObject [body]: ", xobj.responseText)
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);
}

function rTrim(str) {
    return str.replace(/\s+$/, "");
}

function lTrim(str) {
    return str.replace(/^\s+/, "");
}

function rocketNetwork(method, route, json, callback) {
    console.log(route)
    $('.loadingItem').fadeIn()
    $('#loading-footer').fadeIn()
    $('.loadingItem').css('display', 'block')
    var ajaxTime = new Date().getTime();
    $.ajax({
        type: method,
        url: ENDPOINT_ROCKET_API + ("/" + route).replace("//", "/"),
        beforeSend: function(xhr) {
            try {
                xhr.setRequestHeader('Authorization', 'Bearer ' + getUserData().jwt);
                xhr.setRequestHeader('x-appdock-token', JSON.parse(getKeyData()).data[0].token);
                xhr.setRequestHeader('x-api-key', JSON.parse(getKeyData()).data[0].apiKey);
            } catch (d) {
                alerta("Erro ao tentar acessar as chaves de API, refaça o login!", true)
            }
        },
        data: JSON.stringify(json),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function(data, textStatus, xheader) {
            var totalTime = new Date().getTime() - ajaxTime + "ms";
            console.log("------------START")
            console.log(route)
            console.log(textStatus)
            console.log(xheader)
            console.log(data)
            console.log("------------END")
            $('.loadingItem').fadeOut()
            $('#loading-footer').fadeOut()

            logger("rocketNetwork [totalTime]: ", totalTime)
            logger("rocketNetwork [route]: ", route)
            logger("rocketNetwork [xheader]: ", xheader)
            logger("rocketNetwork [data]: ", data)

            return callback(true, data, totalTime)

        },
        error: function(data) {
            var totalTime = new Date().getTime() - ajaxTime;
            $('.loadingItem').fadeOut()
            $('#loading-footer').fadeOut()

            logger("rocketNetwork [totalTime]: ", totalTime, true)
            logger("rocketNetwork [error]: ", data, true)

            return callback(false, null, totalTime)
        }
    });
}



function requestServices(method, route, headers, callback) {
    $('.loadingItem').fadeIn()
    $('#loading-footer').fadeIn()
    $('.loadingItem').css('display', 'block')

    var ajaxTime = new Date().getTime();

    console.log(route)
    console.log(method)

    $.ajax({
        type: method,
        url: route,
        beforeSend: function(xhr) {
            try {
                if (headers.length > 3) {
                    console.log(headers)
                    headers.split(",").forEach(headerItem => {
                        var key = headerItem.split(":")
                        xhr.setRequestHeader(key[0], key[1]);
                    })
                } else {
                    console.log("nenhum header")
                }
            } catch (d) {
                console.log(d)
            }
        },
        //data: JSON.stringify(json),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function(data, textStatus, xheader) {
            var totalTime = new Date().getTime() - ajaxTime + "ms";
            console.log("------------START")
            console.log(route)
            console.log(textStatus)
            console.log(xheader)
            console.log(data)
            console.log(xheader)
            console.log("------------END")
            $('.loadingItem').fadeOut()
            $('#loading-footer').fadeOut()


            var ret = {
                success: true,
                data: data
            }

            logger("requestServices [totalTime]: ", totalTime)
            logger("requestServices [route]: ", route)
            logger("requestServices [xheader]: ", xheader)
            logger("requestServices [data]: ", ret)

            return callback(true, ret, totalTime)

        },
        error: function(data) {
            var totalTime = new Date().getTime() - ajaxTime;
            $('.loadingItem').fadeOut()
            $('#loading-footer').fadeOut()
            var ret = {
                success: false,
                data: null
            }
            logger("requestServices [totalTime]: ", totalTime, true)
            logger("requestServices [error]: ", ret, true)
            return callback(false, ret, totalTime)
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

            logger("request [route]: ", route)
            logger("request [xheader]: ", xheader)
            logger("request [data]: ", data)
            $('.loadingItem').fadeOut()
            $('#loading-footer').fadeOut()
            return callback(true, data)

        },
        error: function(data) {
            $('.loadingItem').fadeOut()
            $('#loading-footer').fadeOut()
            logger("request [error]: ", data, true)
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

            logger("requestGet [route]: ", route)
            logger("requestGet [xheader]: ", xheader)
            logger("requestGet [data]: ", data)

            $('.loadingItem').fadeOut()
            $('#loading-footer').fadeOut()
            return callback(true, data)
        },
        error: function(data) {
            logger("requestGet [error]: ", data, true)
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