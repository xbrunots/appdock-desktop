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
         if (getUserData().success != undefined &&
             getUserData().success != null &&
             getUserData().success != 'null') {
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
     var passHash = sha1($('#senha').val())
     if ($('#senha').val().length > 5 && isEmail($('#email').val())) {
         if (cadastrando) {
             if ($('#senha').val() == $('#c_senha').val()) {
                 var createUserQuery = "insert into appdock_db.client(email, password) values('" + $('#email').val() + "','" + passHash + "');"
                 querySql(createUserQuery, function callback(data) {
                     if (data.success) {
                         $('#btnEsqueciSenha').click()
                     } else {
                         alert(data.error.message)
                     }
                 })
             } else {
                 errorPulse()
                 alert("As senhas são diferentes")
             }

         } else {
             var select = "select * from appdock_db.client where email = '" + $('#email').val() + "' and password = '" + passHash + "' ;"
             querySql(select, function callback(data) {
                 console.log(data)
                 if (data.success && data.data.length > 0) {
                     setUserData(data)
                     loginSucess()
                 } else {
                     setUserData({ success: false })
                     errorPulse()
                     alert("Email e/ou Senha Inválidos")
                 }
             })
         }

     } else {
         errorPulse()
         alert("Email e/ou Senha Inválidos")
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
             var novaSennha = Math.floor(Math.random() * 999999) + 111111;
             var passHash = sha1(novaSennha.toString())
             var select = "update appdock_db.client set password = '" + passHash + "' where email = '" + $("#email").val() + "' ;"

             querySql(select, function callback(data) {
                 console.log(data)
                 if (data.success) {
                     alert('Sua nova senha é:  ' + novaSennha)
                 } else {
                     setUserData({ success: false })
                     errorPulse()
                     alert(data.error)
                 }
             })

             //recoveryPassword(novaSennha, $("#email").val())
         } else {
             errorPulse()
             alert("Email Inválido")
         }
     }
 })

 function loginSucess() {
     rendererData()
     enterStudio()
 }

 function rendererData() {

     console.log(getUserData())
     var q = "select container.*, container.id as containerId from appdock_db.container " +
         " inner join appdock_db.style ON appdock_db.container.styleId = style.id " +
         " where appdock_db.container.clientId = " + getUserData().data[0].id

     querySql(q, function(data) {
         console.log(data)

         if (data == undefined || data == null || data == 'null') {
             logoff()
             return
         }
         if (data.success == false) {
             logoff()
             return
         }
         $('.welcome').css('display', 'flex')
         setHomeData(data)
         initHome(data)
     });
 }

 function logoff() {
     setUserData({ success: false })
     $('x-login').fadeIn()
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