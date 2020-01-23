 const crypto = require("crypto");

 function showLoading() {
     $('.loadingItem').fadeIn()
 }

 function hideLoading() {
     $('.loadingItem').fadeOut()
 }

 $(window).bind("load", function() {
     console.log(getUserData())

     if (getUserData() == undefined || getUserData() == null || getUserData() == 'null') {
         logoff()
     } else {
         if (getUserData() != null && getUserData().success == undefined) {
             loginSucess()
         }
     }
 });

 function enterStudio() {
     $('x-login').fadeOut()
 }

 function sha1(data) {
     return crypto.createHash("sha1").update(data, "binary").digest("hex");
 }

 cadastrando = false;

 function isEmail(email) {
     var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
     return regex.test(email);
 }


 $(document).on('click', '.button-login', function() {
     if ($('#senha').val().length > 5 && isEmail($('#email').val())) {
         if (cadastrando) {
             if ($('#senha').val() == $('#c_senha').val()) {
                 var jsonData = {
                     "username": $('#email').val(),
                     "email": $('#email').val(),
                     "password": $('#senha').val()
                 };

                 requestNoAuth('post', '/auth/local/register', jsonData, function(status, data) {
                     if (status) {
                         setUserData(data)
                         loginSucess()
                         console.log(data.responseJSON)
                         alerta("Cadastro realizado com sucesso!")
                     } else {
                         console.log(data.responseJSON)
                         alerta(data.responseJSON.message[0].messages[0].message, true)
                     }
                 })

             } else {
                 errorPulse()
                 alerta("As senhas são diferentes", true)
             }

         } else {
             var jsonData = {
                 "identifier": $('#email').val(),
                 "password": $('#senha').val()
             };
             requestNoAuth('post', '/auth/local', jsonData, function(status, data) {
                 if (status) {
                     setUserData(data)
                     loginSucess()
                 } else {
                     setUserData({
                         success: false,
                         error: "Bad Request"
                     })
                     errorPulse()
                     alerta("Falha na tentativa de login...", true)
                 }
             })
         }

     } else {
         errorPulse()
         alerta("Email e/ou Senha Inválidos")
     }
 })

 function errorPulse() {
     $('x-login').find('div').find('div').toggleClass('error_pulse')
 }

 $(document).on('click', '#btnCadastro', function() {
     cadastrando = true;
     modeLogin()
 })

 $(document).on('click', 'x-label[logoff]', function() {
     logoff()
 })

 $(document).on('click', '#btnEsqueciSenha', function() {
     if (cadastrando) {
         cadastrando = false;
         modeCadastro()
     } else {
         if (isEmail($('#email').val())) {
             requestNoAuth('post', '/auth/forgot-password', {
                 "email": $('#email').val()
             }, function(status, data) {
                 if (status) {
                     modeLogin()
                 } else {
                     setUserData({
                         success: false,
                         error: "Bad Request"
                     })
                     errorPulse()
                     alerta("Falha na requisição...", true)
                 }
             })
         } else {
             errorPulse()
             alert("Email Inválido")
         }
     }
 })

 function loginSucess() {
     if (getUserData().success == undefined) {
         //rendererData()
         listProject()
         enterStudio()
         genetateTokens()
     } else {
         logoff()
     }
 }

 function genetateTokens() {
     rocketNetwork('post', '/init-api', {
         "email": getUserData().user.email
     }, function(status, data) {
         rocketNetwork('post', '/token', {
             "email": getUserData().user.email,
             "secret": data.data[0].secret
         }, function(status, dataToken) {

             data.data[0].token = dataToken.data[0].token

             setKeyData(JSON.stringify(data))
         })
     })
 }

 function rendererData() {
     if (getUserData().success == undefined) {

         var clientId = getUserData().user.id
         console.log(clientId)
         requestGet('get', '/homes/?clientId=' + clientId, function(status, data) {
             if (status) {
                 $('.welcome').css('display', 'flex')
                 var newData = []
                 data.forEach(element => {
                     element.containerId = element.id
                     newData.push(element)
                 })
                 setHomeData(newData)
                 console.log(newData)
                 initHome(newData)
             } else {
                 logoff()
                 errorPulse()
                 alerta("Oops, falha ao carregar containers", true)
             }
         })
     } else {
         logoff()
         alerta("Tente novamente!", true)
         return
     }
 }

 function logoff() {
     $('x-login').fadeIn()
     setUserData({
         success: false
     })
     $('.welcome').css('display', 'none')
 }

 function modeLogin() {
     $(this).css('display', 'none')
     $('#c_senha').css('display', 'block')
     $('#c_senha').css('display', 'block')
     $('#btnLogin').css('background', '#087d0d')
     $('#btnLogin').text("CADASTRAR")
     $('#btnLogin').text("CADASTRAR")
     $('#btnEsqueciSenha').find('x-label').text("LOGIN")
     $('#btnLogin').css("color", "white")
     $('#title').text("Cadastro")
 }

 function modeCadastro() {
     $('#btnCadastro').css('display', 'block')
     $('#c_senha').css('display', 'none')
     $('#c_senha').css('display', 'none')
     $('#btnLogin').css('background', '#330782')
     $('#btnLogin').text("ENTRAR")
     $('#btnLogin').text("ENTRAR")
     $('#btnEsqueciSenha').find('x-label').text("ESQUECI A SENHA")
     $('#btnLogin').css("color", "white")
     $('#title').text("Login")
 }