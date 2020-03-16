$(document).on('click', 'x-button[menubar-run]', function() {

    $('x-button[menubar-saverun]').attr('disabled', true)
    $('x-button[menubar-run]').attr('disabled', true)

    $('x-button[menubar-run]i').css('display', 'none')
    $('x-button[menubar-run]x-label').css('display', 'none')
    $('x-button[menubar-run]>x-throbber').css('display', 'block')
    saveFuncions(function(e) {
        if (e) {
            runProject($('.x-menu-selected').attr('data-id'))
        } else {
            alerta("Algo deu errado, tente novamente", true)
        }
    })
})
$(document).on('click', 'x-button[menubar-saverun]', function() {

    $('x-button[menubar-saverun]i').css('display', 'none')
    $('x-button[menubar-saverun]x-label').css('display', 'none')
    $('x-button[menubar-saverun]>x-throbber').css('display', 'block')

    $('x-button[menubar-saverun]').attr('disabled', true)
    $('x-button[menubar-run]').attr('disabled', true)

    alerta("Building...")

    if ($('back-shadow').css('display') == "block") {
        saveFuncions(function(e) {
            if (e) {
                runProject($('[startupcontainer]').parent().attr('data-id'))
            } else {
                alerta("Algo deu errado, tente novamente", true)
            }
        })
    } else {
        updateButton(function(e) {
            if (e) {
                runProject($('[startupcontainer]').parent().attr('data-id'))
            } else {
                alerta("Algo deu errado, tente novamente", true)
            }
        })
    }
})
var initalize = false

function runProject(cid) {
    const appuimADB = require('appium-adb')
    const { ADB } = appuimADB
    let _adb = new ADB();
    if (initalize == false) {
        alerta("Inicializando container <span style='color:#00ff0a '>" +
            cid + "</span>")
        initalize = true
    }
    //forma 1 com monkey
    //  ADB.shell('monkey -p me.newproject -c android.intent.category.LAUNCHER 1')
    //      .then(() => {
    //    })
    //forma 2 com am start

    var hashString =
        getCurrentProjectData().id + "|" +
        getCurrentProjectData().userId + "|" +
        getCurrentProjectData().name + "|" +
        cid


    var elText = GLOBAL_ENCRIPTA(hashString);
    var openCommand = "am start -a android.intent.action.VIEW -n me.newproject/.feature.home.HomeActivity -e param " + elText
    var stopCommand = "am force-stop me.newproject"

    _adb.shell(stopCommand)
        .then(() => {
            _adb.shell(openCommand)
                .then(() => {

                    alerta("Container <span style='color:#00ff0a '>" +
                        cid + "</span>" +
                        " inicializado no dispositivo <span style='color:#FFFFFF '>" +
                        $('#deviceConnected').text() + "</span>")
                    initalize = false

                    $('x-button[menubar-run]i').css('display', 'block')
                    $('x-button[menubar-run]x-label').css('display', 'block')
                    $('x-button[menubar-run]>x-throbber').css('display', 'none')


                    $('x-button[menubar-saverun]i').css('display', 'block')
                    $('x-button[menubar-saverun]x-label').css('display', 'block')
                    $('x-button[menubar-saverun]>x-throbber').css('display', 'none')

                    $('x-button[menubar-saverun]').removeAttr('disabled')
                    $('x-button[menubar-run]').removeAttr('disabled')

                })
        })

}

$(document).on('click', 'fun-header>x-label>x-button[logcat]', function() {
    if ($(this).hasClass("open")) {

    } else {
        if (parseInt($('#sidebar-bottom').css('height')) <= 50) {
            $('#sidebar-bottom').animate({
                height: '500px'
            }, 250)
            $('fun-header>x-button[close]').find('i').removeClass('fa-chevron-up')
            $('fun-header>x-button[close]').find('i').addClass('fa-chevron-down')
        }
        $('fun-header>x-label>x-button').removeClass("open")
        $(this).addClass("open")
        logCat()
        openLogcat()
    }
})

function logCat() {

}

function printScreenCelular() {
    const appuimADB = require('appium-adb')
    const { ADB } = appuimADB
    let adb = new ADB();

    adb.shell('screencap -p  /sdcard/screencap.png')
        .then(() => { adb.pull('/mnt/sdcard/screencap.png', 'screencap.png') })
}

$(document).on('click', 'x-menu[menu_device_adb]>x-menuitem[srcpy]', function() {
    mirror()
})
$(document).on('click', 'x-menu[menu_device_adb]>x-menuitem[rec]', function() {
    recDevice()
})

function mirror() {
    //windows
    const exec = require('child_process').exec;
    const child = exec('scrcpy',
        (error, stdout, stderr) => {
            console.log(`stderr: ${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
    //fim do windows
}

function recDevice() {
    //windows  
    var fs = require('fs');
    var dir = 'c:/AppDock';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const exec = require('child_process').exec;
    const child = exec('scrcpy --record file.mp4',
        (error, stdout, stderr) => {
            console.log(`stderr: ${stderr}`);
            var ts = new Date().valueOf()
            oldPath = "./file.mp4"
            newPath = 'c:/AppDock/' + ts + ".mp4"

            fs.rename(oldPath, newPath, function(err) {
                console.log(err)
                if (err) throw err
                alerta("Gravação salva com sucesso! confira: <a href='" + newPath + "' target='_blank'>" + newPath + "</a>")
            })

            console.log(error)
        });


    //fim do windows 
}