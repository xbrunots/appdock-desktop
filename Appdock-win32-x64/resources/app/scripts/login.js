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

 function listProject() {

     d = new Date();
     hour = d.getHours();
     var comprimento = "Olá"
     if (hour < 5) {
         comprimento = ("Boa Noite");
     } else
     if (hour < 8) {
         comprimento = ("Bom Dia");
     } else
     if (hour < 12) {
         comprimento = ("Bom Dia!");
     } else
     if (hour < 18) {
         comprimento = ("Boa tarde");
     } else {
         comprimento = ("Boa noite");
     }

     $('x-project-form-title>p').html(comprimento + " <strong tooltip-rox data-title='Clique para editar seu perfil' style='color: white;    cursor: pointer;'>" + getUserData().user.username + "</strong>, acompanhe abaixo seus projetos")


     dataRequest = {
         name: $('div[form-new-card]>x-input').val(),
         userId: getUserData().user.id
     }
     $('x-project-select').fadeIn(100)
     requestGet('get', '/projects?userId=' + getUserData().user.id, function(status, data) {
         if (status) {
             $('x-project-form-projects').html(" ")
             setProjectData(data)
             if (data.length < 1) {
                 var notFountItems = '<div style="' +
                     '     color: #ffffff38;                position: unset;' +
                     '       position: absolute;                top: 48%;' +
                     '      left: 30%;                width: 40%;' +
                     '   "><div style="                display: flex !important;' +
                     '        align-items: center;                justify-content: center;' +
                     '       margin-bottom: 18px;            "><i class="fas fa-people-carry" aria-hidden="true" style="' +
                     '      font-size: 40px;                "></i></div>                                <x-label style="' +
                     '      text-align: center;                font-size: 20px;' +
                     ' ">Seus projetos serão listados aqui, a medida que forem criados... </x-label>            <div>      ' +
                     '</div></div>'
                 $('x-project-form-projects').append(notFountItems)
             } else {
                 data.forEach(projetos => {
                     var item = '<x-project-item data-id="' + projetos.id + '">' +
                         '<i  data-id="' + projetos.id + '" class="far fa-trash-alt"></i>' +
                         '<i class="fas fa-box x-project-item-icon" aria-hidden="true"></i>' +
                         '  <p  data-id="' + projetos.id + '"> ' + projetos.name + ' </p></x-project-item>'

                     $('x-project-form-projects').append(item)

                 })
             }
         } else {
             alerta("Oops, falha ao tentar acessar projetos, tente novamente mais tarde...", true)
         }
     })
 }


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

                 console.log("HOME_DATA_AQUI " + newCard)
                 console.log(newCard)

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