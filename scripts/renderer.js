$(document).on('click', '.x-menu-container', function() {

    if (notSaved) {
        saveCtrlS()
    }

    $('x-body').css('display', 'none')
    if ($('.crenamed').css('display') == 'none') {
        $('.welcome').fadeOut();
        var arg = "secondparam";
        ipcRenderer.send("btnclick", $(this).attr("data-id"));
        var currentID = $(this).attr("data-id")

        selectProjectAndTab(currentID)

        $('x-parent-box').removeClass('iscard')
        $('x-parent-box').removeAttr('iscard')

        isCardRenderer()
    }

    hideAttributes()
});

function notSaved() {
    return false
}

function selectProjectAndTab(id) {
    $('x-parent-box').css('display', 'block')
    $('x-parent-box>div[shimmer-load]').css('display', 'block')
    $('#tab' + id).attr('selected', '')
    $('.x-menu-container').removeClass('x-menu-selected')
    $('#container' + id).addClass('x-menu-selected')
    openComponents(id)
}

$(document).on('contextmenu', '.x-menu-container', function(e) {
    //console.log($(this))
    var posX = e.pageX - 50
    var posY = $(this).position().top;

    /*  if ($(this).hasClass('iscard')) {
          $('#container-menu>x-menuitem[action="iscard"]>x-label').text("Converter em View")
          $('#container-menu>x-menuitem').attr('data-card', true)
      } else {
          $('#container-menu>x-menuitem[action="iscard"]>x-label').text("Converter em Card")
          $('#container-menu>x-menuitem').attr('data-card', false)
      } */

    $('#container-menu').attr("style",
        "  position: fixed;" +
        "  top: " + (posY + 10) + "px;" +
        "  left: " + posX + "px ;")

    $('#container-menu').addClass('context-menu-show')
    $('#container-menu').attr('data-id', $(this).attr('data-id'))

});


$(document).on('mouseleave', '#container-menu', function() {
    $('#container-menu').removeClass('context-menu-show')
})

function contextSelected(element) {
    var action = $(element).attr('action')
    var id = $(element).parent().attr('data-id')

    $('#container-menu').removeClass('context-menu-show')
    $('.x-menu-container').find('x-label').css('display', 'block')
    if (action == "renomear") {
        $('.crenamed').css('display', 'block')
        var x = event.clientX; // Get the horizontal coordinate
        var y = event.clientY;
        $('.crenamed').attr('style',
            'left:0px; top:' + (parseInt(y) - 10) + 'px;'
        )
        $('.crenamed').fadeIn(100)
        $('.crenamed').find('input').val("")
        $('.crenamed').find('input').attr('data-id', id)
        $('.crenamed').find('input').attr('placeholder', $('#container' + id + '>x-label').text().toString().trim())
        $('.crenamed').find('input').val($('#container' + id + '>x-label').text().toString().trim())
            //$('#container' + id).find('x-label').css('display', 'none')
        $('#container' + id).parent().append($('.crenamed'))
        $('.crenamed').find('input').focus()
        $('.crenamed').css('display', 'block')
    } else if (action == "abrir") {
        $('#container' + id).click()
    } else if (action == "transform_startup") {
        var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();

        var dataUpdate = {
            startupContainer: true,
            ts: parseInt(timeStampInMs)
        }

        request('put', '/homes/' + id, dataUpdate, function(status, data) {
            if (status) {

                $('i[startupContainer]').remove()
                $('#container' + id).append('<i class="fas fa-bolt" startupContainer style="' +
                    '  color: #2196F3;' +
                    '  height: 8px;' +
                    ' width: 8px;' +
                    '  position: absolute;' +
                    '  left: 5px; ">  </i>')
                $('i[startupcontainer]').attr('tooltip-rox', 'true')
                $('i[startupcontainer]').attr('data-title', 'O container ' + id + ' está definido como StartupContainer e será aberto automaticamente ao iniciar o aplicativo...')
            } else {
                alerta("Oops, algo deu errado, tente novamente...", true)
            }
        })

    } else if (action == "excluir") {
        var continerId = $('x-menuitem[container].x-menu-selected').attr('data-id')


        if (continerId == id) {

            alerta("Feche o projeto antes de deletar...", true)

        } else {
            //{{prod}}/homes/33
            if (confirm("Tem certeja que deseja deletar o container " + $("#container" + id).text().trim() + " ?")) {
                requestGet('delete', '/homes/' + id, function(status, data) {
                    if (status) {
                        alerta("Yeahh, esse já foi! foco nos que ficam! Container deletado com sucesso!")
                        $("#container" + id).remove()
                    } else {
                        alerta("Oops, algo deu errado, tente novamente...", true)
                    }
                })
            }

        }
    } else if (action == "transform_card") {

        var lista = getHomeData().filter(function(item) {
            return parseInt(item.id) === parseInt($('#container-menu').attr('data-id'));
        });

        $('x-layouts-view').fadeIn(100);

        if (lista[0].cardSize != undefined && lista[0].cardSize.length > 2) {
            //console.log('x-layout-selector>x-menuitem[data-size="' + lista[0].cardSize + '"]')
            $('x-layout-selector>x-menuitem').removeClass('LayoutSelectorSelected')
            $('x-layout-selector>x-menuitem[data-size="' + lista.cardSize + '"]').addClass('LayoutSelectorSelected')

            rendererCard(lista[0].cardSize)
        }

    } else if (action == "transform_view") {
        //console.log("CARD")
        request('put', '/homes/' + $('#container-menu').attr('data-id'), {
                "isCard": false
            },
            function(status, data) {
                if (status) {
                    alerta("O Container " + $('#container-menu').attr('data-id') + " agora é um Card...")
                    var newCard = getHomeData()
                    newCard.filter(function(item) {
                        return item.id === parseInt($('#container-menu').attr('data-id'))
                    })[0].isCard = false

                    //console.log("HOME_DATA_AQUI " + newCard)
                    //console.log(newCard)

                    setHomeData(newCard)
                    initHome(newCard)
                    $('#container' + $('#container-menu').attr('data-id')).find('i').remove()
                    $('#container' + $('#container-menu').attr('data-id')).find('x-icon').remove()
                    $('#container' + $('#container-menu').attr('data-id')).prepend('<x-icon name="dashboard"> </x-icon>')
                    $('#container' + $('#container-menu').attr('data-id')).removeAttr("iscard")
                    $('#tab' + $('#container-menu').attr('data-id')).find('span[doctab-close]').click()
                } else {
                    alerta("Oops, Algo deu errado! tente novamente ...")
                }
            })
    }
}

$(document).on('click', '#btnSaveFase3', function(e) {
    request('put', '/homes/' + $('#container-menu').attr('data-id'), {
            "isCard": true,
            "cardSize": $(".LayoutSelectorSelected").text().trim()
        },
        function(status, data) {
            if (status) {
                alerta("O Container " + $('#container-menu').attr('data-id') + " agora é um Card " + $('.LayoutSelectorSelected').attr('data-size'))
                var newCard = getHomeData()
                newCard.filter(function(item) {
                    return item.id === parseInt($('#container-menu').attr('data-id'))
                })[0].isCard = true
                newCard.filter(function(item) {
                    return item.id === parseInt($('#container-menu').attr('data-id'))
                })[0].cardSize = $('.LayoutSelectorSelected').attr('data-size').trim()

                //console.log("HOME_DATA_AQUI " + newCard)
                //console.log(newCard)

                setHomeData(newCard)
                initHome(newCard)
                $('#container' + $('#container-menu').attr('data-id')).attr("iscard", "true")
                $('#container' + $('#container-menu').attr('data-id')).find('x-icon').remove()
                $('#container' + $('#container-menu').attr('data-id')).find('i').remove()
                $('#container' + $('#container-menu').attr('data-id')).prepend('<i style=" margin-right: 6px;" class="fas fa-dolly-flatbed" aria-hidden="true"></i>')
                $('#tab' + $('#container-menu').attr('data-id')).find('span[doctab-close]').click()
                $('x-layouts-view').fadeOut()
            } else {
                alerta("Oops, Algo deu errado! tente novamente ...")
            }
        })
});


$(document).on('keydown', '.crenamed > input', function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    //console.log(code)
    if (code == 13) {
        renameContainer($(this).attr('data-id'), $(this).val())
    } else if (code == 27) {
        $('#container-menu').removeClass('context-menu-show')
        $('.x-menu-container').find('x-label').css('display', 'block')
        $('.crenamed').css('display', 'none')
    }
});

function renameContainer(containerId, newAlias) {
    //console.log(containerId)
    //console.log(newAlias)
    request('put', '/homes/' + containerId, {
        "alias": newAlias
    }, function(status, data) {
        //console.log(data)
        if (status) {
            $('#container-menu').removeClass('context-menu-show')
            $('.x-menu-container').find('x-label').css('display', 'block')
            $('.crenamed').css('display', 'none')
            $('#container' + containerId).find('x-label').text(newAlias)
            openFiles()
        } else {
            logoff()
            setUserData({
                success: false,
                error: "Bad Request"
            })
            errorPulse()
            alerta("Falha na tentativa de alteração de nome...", true)
        }
    })
}

function openComponents(containerId) {

    requestGet('get', '/components?containerId=' + containerId + "&_sort=index:ASC", function(status, data) {

        //console.log("***************************")
        //console.log(data)
        //console.log("***************************")

        if (status) {
            setCurrentComponent(data)
            addStructToList(data)
            addComponentToList()
            addAttributes()
            rendererFiles()
            applyStyles()
            getTheme()

            $('x-body').fadeIn(100)
            $('x-body').css('display', 'flow-root');
            $('x-parent-box>div[shimmer-load]').fadeOut()

        } else {
            alerta("OOps, algo deu errado, tente novamente mais tarde...", true)
        }
    })
}

function rendererFiles() {
    requestGet('get', '/files?clientId=' + getUserData().user.id, function(status, data) {
        //console.log(data)
        if (status) {
            setFiles(data)
        } else {
            alerta("Erro ao tentar sincronizar seus <strong>assets</strong>", true)
        }
    })
}

function addStructToList(q) {
    //console.log("LALALALAL")
    //console.log(q)
    //console.log("LALALALAL")
    $('x-menuitem[estruct]').remove()
    $('x-button[componentcreated]').remove()
    q.forEach(element => {

        //console.log(element)
        var names = ""

        if (element.params[2].value.trim().length > 1) {
            names = "  <x-label style=' text-align: right;font-size: 9px;font-weight: 100;color: #c0c0c036;'> " + element.params[2].value + " </x-label> "
        }

        var item = "<x-menuitem data='" + JSON.stringify(element.params) + "' estruct class='x-estruct' data-id='" + element.name + "'>" +
            "  <x-icon name='layers'> </x-icon> " +
            "  <x-label> " + element.name + " </x-label> " + names +
            "  </x-menuitem>"
        $('.sidebar-internal').find('.body').find('structs-body').append(item)
        elementGet('x-body', JSON.stringify(element.params), element.name, element.name)
        rendererComponent($('#' + element.name), false)
    });
}

function initHome(data) {
    //console.log("initHome")
    $('x-menuitem[container]').remove()
    var tsCalc = 0
    var tsCalcId = 0
    data.forEach(element => {
        //console.log(element)
        var icon = ' <x-icon name = "dashboard"> </x-icon> '
        var isCard = ""
        if (element.isCard != null && element.isCard == true) {
            icon = '<i style=" margin-right: 6px;" class="fas fa-dolly-flatbed" aria-hidden="true"></i>'
            isCard = "iscard"
        }

        var label = '<label style=" margin: 0px;  font-size: 10px;     font-weight: 100;  color: #c0c0c094;">ID: ' + element.id + '</label>'
        var item = '<x-menuitem ' + isCard + ' id="container' + element.id + '" container class="x-menu-container ' + isCard + '" data-id="' + element.id + '">' +
            icon +
            '  <x-label> ' + element.alias + ' </x-label> ' + label +
            ' </x-menuitem>'
        if (element.ts > tsCalc) {
            tsCalc = element.ts
            tsCalcId = element.id
        }
        $('x-containers-body').append(item)
    });

    $('i[startupContainer]').remove()
    $('#container' + tsCalcId).append('<i class="fas fa-bolt" startupContainer style="' +
        '  color: #2196F3;' +
        '  height: 8px;' +
        ' width: 8px;' +
        '  position: absolute;' +
        '  left: 5px; ">  </i>')
    $('i[startupcontainer]').attr('tooltip-rox', 'true')
    $('i[startupcontainer]').attr('data-title', 'O container ' + tsCalcId + ' está definido como StartupContainer e será aberto automaticamente ao iniciar o aplicativo...')

}

function addComponentToList() {
    requestGet('get', '/objects', function(status, data) {
        //console.log(data)
        if (status) {
            setObjects(data)
            $('x-menuitem[components]').remove()
            $('x-menuitem[addcomponents]').remove()
            data.forEach(element => {
                var item = '<x-menuitem   itemid="it' + element.name + '"  components data-type="' + element.name + '">' +
                    ' <i class="' + element.icon + '"></i>   ' +
                    '  <x-label> ' + element.name + ' </x-label> ' +
                    '  </x-menuitem>'

                var item2 = '<x-menuitem   itemid="it' + element.name + '"  addcomponents data-type="' + element.name + '">' +
                    ' <i class="' + element.icon + '"></i>   ' +
                    '  <x-label> ' + element.name + ' </x-label> ' +
                    '  </x-menuitem>'

                $('.sidebar-internal').find('.header').append(item)
                $('x-menu[additem]').append(item2)

            });
        } else {
            alerta("Erro ao tentar sincronizar seus <strong>objects</strong>", true)
        }
    })
}

$('.type-color').click(function() {

    pickr.on('init', instance => {
        //console.log('init', instance);
    }).on('show', (color, instance) => {
        //console.log('show', color, instance);
    });

})

function addAttributes() {
    requestGet('get', '/attributes', function(status, data) {
        //console.log(data)
        if (status) {
            rendererAttr(data)
        } else {
            alerta("Erro ao tentar sincronizar seus <strong>attributes</strong>", true)
        }
    })
}

function rendererAttr(data) {
    $('x-box[attributes]').remove()
    var attribForEl = []

    $('sidebar-R').css('width', '0px')

    data.forEach(element => {

        attribForEl.push({
            "id": element.id,
            "el": element.el,
            "target": element.target,
            "type": element.type,
            "value": element.response
        })
        if (element.type.toLowerCase() == "config") {
            if (element.el == "color") {
                $('#' + element.target).val(element.value)
                $('.' + element.target).val(hex2rgba_convert(element.value, 100))
            }
        }

        if (element.visible) {

            var disabled = ""
            if (element.editable == true) {
                disabled = ""
            } else {
                disabled = "disabled"
            }


            var itemValue = ""
            var item = '<x-box ' + element.name.replace("%", "").replace("(", "").replace(")", "").replace(" ", "_").trim() + ' ' + disabled + ' data-list="' + element.value + '" ' + element.name.trim() + ' data-id="' + element.id + '" id="attribute' + element.id + '" attributes class="x-attributes" data-type="' + element.type + '">' +
                '  <x-label  ' + disabled + '> ' + element.name.trim() + ' </x-label> '

            if (element.editable) {
                itemValue = '  <x-input  ' + disabled + ' xname="' + element.name.trim() + '" bx="' + element.type + '"  id="attr' + element.id + '" class="box-values type-' + element.type.toLowerCase() + '" placeholder="' + element.hint + '" value="' + element.value + '">    </x-input> '
            } else {
                itemValue = '  <x-input  ' + disabled + ' xname="' + element.name.trim() + '"  ' + element.name + ' bx="' + element.type + '"  id="attr' + element.id + '" class="box-values type-' + element.type.toLowerCase() + '" disabled="true" placeholder="' + element.hint + '" value="' + element.value + '">    </x-input> '
            }

            if (element.type == "COLOR") {
                if (element.value == null || element.value.toString().length < 6) {
                    ' <span>' + element.value + '</span> <x-popover modal> ' +
                        '<x-rectcolorpicker alphaslider ' + disabled + ' bx="' + element.type + '"  class="box-values type-' + element.type.toLowerCase() + '  box-values"   onchange="xColorSelectChange(this,' + element.id + ')" onkeyup="xColorSelectChange(this,' + element.id + ')"></x-rectcolorpicker>' +
                        '</x-popover>' +
                        '</x-colorselect>'
                } else {
                    itemValue = '<x-colorselect  ' + disabled + ' class="box-values type-' + element.type.toLowerCase() + '  box-values" id="attr' + element.id + '" value="' + element.value + '" style="margin-top: 10px;">' +
                        ' <span>' + element.value + '</span> <x-popover modal> ' +
                        '<x-rectcolorpicker alphaslider bx="' + element.type + '"    onchange="xColorSelectChange(this,' + element.id + ')" onkeyup="xColorSelectChange(this,' + element.id + ')" value="' + element.value + '"></x-rectcolorpicker>' +
                        '</x-popover>' +
                        '</x-colorselect>'
                }
            } else if (element.type == "NUMBER") {
                var suffix = "px"
                if (element.name.indexOf("%") != -1) {
                    suffix = "%"
                }
                if (element.editable) {
                    itemValue = '  <x-numberinput  ' + disabled + ' bx="' + element.type + '"  suffix="' + suffix + '"  style="cursor:pointer" id="attr' + element.id + '" class="el-' + element.el.toLowerCase() + '  box-values type-' + element.type.toLowerCase() + '" placeholder="' + element.hint + '" value="' + element.response + '">    </x-input> '
                } else {
                    itemValue = '  <x-numberinput  ' + disabled + ' bx="' + element.type + '"  suffix="' + suffix + '"  style="cursor:pointer" id="attr' + element.id + '" class="el-' + element.el.toLowerCase() + '  box-values type-' + element.type.toLowerCase() + '" disabled="true" placeholder="' + element.hint + '" value="' + element.response + '">    </x-input> '
                }
            } else if (element.type == "JSON") {

                if (element.editable) {
                    itemValue = '  <pre contenteditable="true"  ' + disabled + ' xname="' + element.name.trim() + '" bx="' + element.type + '"  id="attr' + element.id + '" class="mode-json box-values type-' + element.type.toLowerCase() + '" placeholder="' + element.hint + '" value="' + element.value + '">    </pre> '
                } else {
                    itemValue = '  <pre  ' + disabled + ' xname="' + element.name.trim() + '"  ' + element.name + ' bx="' + element.type + '"  id="attr' + element.id + '" class="mode-json box-values type-' + element.type.toLowerCase() + '" disabled="true" placeholder="' + element.hint + '" value="' + element.value + '">    </pre> '
                }

            } else if (element.type == "OPTION") {
                if (element.editable) {
                    itemValue = '  <x-input  ' + disabled + ' data-list="' + element.value + '" bx="' + element.type + '"  style="cursor:pointer" id="attr' + element.id + '" class="box-values type-' + element.type.toLowerCase() + '" placeholder="' + element.hint + '" value="' + element.response + '">    </x-input> '
                } else {
                    itemValue = '  <x-input  ' + disabled + '  data-list="' + element.value + '" bx="' + element.type + '"  style="cursor:pointer" id="attr' + element.id + '" class="box-values type-' + element.type.toLowerCase() + '" disabled="true" placeholder="' + element.hint + '" value="' + element.response + '">    </x-input> '
                }
            } else if (element.type == "INPUT_LIST") {

            } else if (element.type == "TEXT") {

            } else {

            }
            item = item + itemValue + '  </x-box>'
            $('.sidebar-R').append(item)
        }
    });
    setAttribs(attribForEl)
}

$(document).on('keydown', '#menu-file-select > x-input', function(e) {
    var parentId = $('#menu-file-select').attr('data-id')
        //console.log("ID: ")
        //console.log($(this))
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {
        $("#" + parentId).val($('#menu-file-select').children().eq(1).text())
        $('#menu-file-select').fadeOut(100)
    } else if (code == 27) {
        $('#menu-file-select').fadeOut(100)
    }

    $('#menu-file-select').find('x-menuitem').remove()
    if ($(this).val().trim().length == 0) {
        getFiles().forEach(element => {
            var name = element.alias + "-" + element.id
            var item = '<x-menuitem data-src="' + element.url + '" data-parent="' + parentId + '" data-id="' + element.id + '"  data-alias="' + element.alias + '"><img src="' + element.url + '">' +
                '   <x-label>' + element.alias + "-" + element.id + '</x-label>' +
                '   </x-menuitem> '
            $('#menu-file-select').append(item)
        })
        var item = '<x-menuitem data-parent="' + parentId + '" data-id="null"  data-alias="null">' +
            '   <x-label style=" text-align: center;width: 100%;">REMOVER IMAGEM</x-label>' +
            '   </x-menuitem> '
        $('#menu-file-select').append(item)
    } else {
        getFiles().forEach(element => {
            var name = element.alias + "-" + element.id
            if (name.indexOf($(this).val()) != -1) {
                var item = '<x-menuitem data-parent="' + parentId + '" data-id="' + element.id + '"  data-alias="' + element.alias + '"><img src="' + element.url + '">' +
                    '   <x-label>' + element.alias + "-" + element.id + '</x-label>' +
                    '   </x-menuitem> '
                $('#menu-file-select').append(item)
            }
        })
        var item = '<x-menuitem data-parent="' + parentId + '" data-id="null"  data-alias="null">' +
            '   <x-label style=" text-align: center;width: 100%;">REMOVER IMAGEM</x-label>' +
            '   </x-menuitem> '
        $('#menu-file-select').append(item)
    }
});


$(document).on('click', '#menu-file-select > x-menuitem', function() {
    if ($(this).text().trim() != "REMOVER IMAGEM") {
        //console.log($(this).text())
        var parentId = "#" + $(this).attr('data-parent')

        $(parentId).val($(this).text())

    } else {
        //console.log("NAOO")
        $(parentId).val('null')
    }
    $('#menu-file-select').fadeOut(100)
})

$(document).on('mouseleave', '#menu-file-select', function() {
    $('#menu-file-select').fadeOut(100)
})

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#falseinput').attr('src', e.target.result);
            $('#base').val(e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

$('.dropzone').click(function() {
    imageIsLoaded()
})

function upl_im(t) {
    showLoading()
    var file = t.files[0];
    if (!file || !file.type.match(/image.*/)) return;
    var fd = new FormData();
    fd.append("image", file);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.imgur.com/3/image.json");
    xhr.onload = function() {
        var link_src = JSON.parse(xhr.responseText).data.link;
        // document.getElementById('res').style.backgroundImage = 'url(' + link_src + ')';
        hideLoading()
        savePictureInDataBase(link_src, "picture")

    }
    xhr.onabort = function() {
        hideLoading()

    }
    xhr.setRequestHeader('Authorization', 'Client-ID 3626d25d317b068');
    xhr.send(fd);
}


$(document).on('click', '#popmenu-find>x-item>.delete', function() {
    var id = $('#popmenu-find').attr('data-id')
    deleteFile(id)
})

$(document).on('keydown', '#popedit-finder', function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {
        renameFile($(this).attr('data-id'), $(this).val())
    } else if (code == 27) {
        $('#popmenu-find').animate({
            'top': '0px'
        })
        $('ul[x-files]').animate({
            'padding-top': '0px'
        })
    }
});

function renameFile(id, newName) {

    request('put', '/files/' + id, {
        "alias": newName
    }, function(status, data) {
        //console.log(data)
        if (status) {
            alerta(" renomeado como <strong>" + newName + "</strong> ")
            $('x-menuitem[data-id="' + id + '"]').attr('data-alias', newName + id)
            $('#popmenu-find').animate({
                'top': '0px'
            })
            $('ul[x-files]').animate({
                'padding-top': '0px'
            })
        } else {
            alerta("Erro ao tentar renomear seus <strong> file id " + id + "</strong>", true)
        }
    })
}

function deleteFile(id) {
    request('delete', '/files/' + id, function(status, data) {
        //console.log(data)
        if (status) {
            $('x-menuitem[data-id="' + id + '"]').fadeOut()
            $('#popmenu-find').animate({
                'top': '0px'
            })
        } else {
            alerta("Erro ao tentar deletar o <strong> file id " + id + "</strong>", true)
        }
    })
}

function savePictureInDataBase(foto, alias) {
    showLoading()
    if (alias == undefined) {
        alias = "picture"
    }

    var data = {
        "clientId": getUserData().user.id,
        "url": foto,
        "alias": alias
    }

    request('post', '/files', data, function(status, data) {
        //console.log(data)
        if (status) {
            openFiles()
        } else {
            alerta("Falha ao tentar salvar arquivo, tente novamente...", true)
        }
    })
}


$(document).on('click', 'x-photo-view', function() {
    //  $('x-photo-view').find('photo-full').css('background', null)
    // $('x-photo-view').fadeOut()
})

$(document).on('mouseleave', '#context-attribute', function() {
    $('#context-attribute').removeClass('context-menu-show')
})

$(document).on('click', 'x-box[data-type="OPTION"]', function(e) {
    var posY = e.pageY;
    $('#context-attribute').attr("style",
        "  position: fixed;" +
        "  top: " + posY + "px;" +
        "  left: 100%; float: right;  margin-left: -105px; background: black; border: 1px solid var(--accent-color); ")

    $('#context-attribute').find('x-menuitem').remove()

    //console.log($(this).attr('data-list'))

    $(this).attr('data-list').split(',').forEach(element => {
        var item = ' <x-menuitem onclick="attribSelected(this, ' + $(this).attr('data-id') + ')" type="OPTION">' +
            ' <x-label>' + element.trim() + '</x-label> </x-menuitem> '
        $('#context-attribute').append(item)

    })

    $('#context-attribute').addClass('context-menu-show')
    $('#context-attribute').attr('data-id', $(this).attr('data-id'))
})


function rgba2hex(orig) {
    var a, isPercent,
        rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
        alpha = (rgb && rgb[4] || "").trim(),
        hex = rgb ?
        (rgb[1] | 1 << 8).toString(16).slice(1) +
        (rgb[2] | 1 << 8).toString(16).slice(1) +
        (rgb[3] | 1 << 8).toString(16).slice(1) : orig;

    if (alpha !== "") {
        a = alpha;
    } else {
        a = 01;
    }
    // multiply before convert to HEX
    a = ((a * 255) | 1 << 8).toString(16).slice(1)
    hex = hex + a;

    return hex;
}

function xColorSelectChange(item, id) {
    var cor = $('#attr' + id).attr('value')
        //console.log(rgba2hex(cor))
    $('#attr' + id).find('span').html(rgba2hex(cor))
}


function xColorThemeSelect(item) {
    $('#' + $(item).attr('target')).val(rgba2hex($(item).val()))
}

function rgba2hex(orig) {
    var a, isPercent,
        rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
        alpha = (rgb && rgb[4] || "").trim(),
        hex = rgb ?
        (rgb[1] | 1 << 8).toString(16).slice(1) +
        (rgb[2] | 1 << 8).toString(16).slice(1) +
        (rgb[3] | 1 << 8).toString(16).slice(1) : orig;
    if (alpha !== "") {
        a = alpha;
    } else {
        a = 01;
    }

    a = Math.round(a * 100) / 100;
    var alpha = Math.round(a * 255);
    var hexAlpha = (alpha + 0x10000).toString(16).substr(-2).toUpperCase();
    hex = hex + hexAlpha;

    return "#" + hex;
}


$(document).on('click', 'x-component-item', function() {

    $('#border-live').attr('style',
        'position: absolute; display: block;   ' +
        'top: ' + $(this).position().top + "px !important;" +
        'left:' + $(this).position().left + "px !important ;" +
        'width:' + $(this).css('width') + ";" +
        'height:' + $(this).css('height') + "  ;"
    )

})



$(document).on('click', 'x-menu-vs>img', function() {
    $('x-system-modules').css('display', 'none')
    $('x-menu-vs').find('i').removeClass('x-menu-vs-i-active')
    $('x-menu-vs').find('img').removeClass('x-menu-vs-i-active')
    $(this).addClass('x-menu-vs-img-active')
    openFiles()
})
$(document).on('click', '[x-menu-folder]', function() {
    $('x-system-modules').css('display', 'block')
    $('x-menu-vs').find('i').removeClass('x-menu-vs-i-active')
    $('x-menu-vs').find('img').removeClass('x-menu-vs-img-active')
    $(this).addClass('x-menu-vs-i-active')
    openFiles()
})

$(document).on('click', '.addFile', function() {
    $('x-sidebar-body > .uploadhide').click()
})

function loadJSON(json, callback) {
    showLoading()
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', json, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
        hideLoading()

    };
    xobj.send(null);
}

$(function() {
    $('x-parent-box').draggable();
});

$(document).on('click', 'x-menuitem[fileItem]', function() {
    $('#popedit-finder').val($(this).attr('data-alias'))
    $('#popmenu-find').attr('data-id', $(this).attr('data-id'))
    $('#popedit-finder').attr('data-id', $(this).attr('data-id'))
})

$(document).on('click', 'ul[x-files]>x-menuitem', function() {
    if ($(this).hasClass('active')) {
        $('#popmenu-find').animate({
            'top': '0px'
        })
        $('ul[x-files]').animate({
            'padding-top': '0px'
        })
        $('ul[x-files]>x-menuitem').removeClass('active')
    } else {
        $('ul[x-files]>x-menuitem').removeClass('active')
        $(this).addClass('active')
        $('#popedit-finder').attr('data-id', $(this).attr('data-id'))
        $('#popmenu-find').attr('data-id', $(this).attr('data-id'))
        $('#popmenu-find').animate({
            'top': '34px'
        })
        $('ul[x-files]').animate({
            'padding-top': '34px'
        })
    }
})

function openFiles() {
    requestGet('get', '/files?clientId=' + getUserData().user.id, function(status, data) {
        //console.log(data)
        if (status) {
            setFiles(data)
            $('x-menuitem[fileItem]').remove()
            data.forEach(element => {
                //    //console.log(element)
                var item = '<x-menuitem fileItem data-id="' + element.id + '" data-alias="' + element.alias + "-" + element.id + '"  onclick="onFileClick(' + element + ')" >' +
                    ' <x-label> </x-label> ' +
                    '<img src="assets/bg.jpg" />' +
                    '<img style="    position: absolute; background: transparent;' +
                    ' " src="' + element.url + '"/>' +
                    '<label>' + element.alias + '</label>' +
                    ' </x-menuitem '
                $('ul[x-files]').append(item)

            });
        } else {
            alerta('Falha ao tentar acessar seus <strong>assets')
        }
    })
}