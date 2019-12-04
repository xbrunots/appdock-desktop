$(document).on('click', '.x-menu-container', function() {
    if ($('.crenamed').css('display') == 'none') {
        $('.welcome').fadeOut();
        var arg = "secondparam";
        ipcRenderer.send("btnclick", $(this).attr("data-id"));
        var checkExit = 0
        var currentID = $(this).attr("data-id")
        var itemArray = $('x-doctabs').find('x-doctab');
        if (itemArray != undefined) {

            itemArray.each(function(i, value) {

                if ($(value).attr('data-id') == currentID) {
                    checkExit++
                }
            });
        }


        var modeloItem = ' <x-doctab id="tab' + currentID + '" selected data-id="' + currentID + '">' +
            ' <x-icon name="dashboard"></x-icon>' +
            ' <x-label>' + $(this).text() + '</x-label>' +
            '</x-doctab>'

        if (checkExit == 0) {
            $('x-doctabs').append(modeloItem)
        }

        selectProjectAndTab(currentID)
    }
});

$(document).on('click', 'x-doctab', function(e) {
    selectProjectAndTab($(this).attr('data-id'))
})


function selectProjectAndTab(id) {
    $('x-doctab').removeAttr('selected')
    $('#tab' + id).attr('selected', '')
    $('.x-menu-container').removeClass('x-menu-selected')
    $('#container' + id).addClass('x-menu-selected')
    openComponents(id)
}

$(document).on('click', 'x-footer > .zoom', function() {

})

$(document).on('contextmenu', '.x-menu-container', function(e) {
    console.log($(this))
    var posX = e.pageX - 50
    var posY = $(this).position().top;

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
        $('.crenamed').fadeIn()
        $('.crenamed').find('input').val("")
        $('.crenamed').find('input').attr('data-id', id)
        $('.crenamed').find('input').attr('placeholder', $('#container' + id).text().toString().trim())
        $('#container' + id).find('x-label').css('display', 'none')
        $('#container' + id).append($('.crenamed'))
        $('.crenamed').find('input').focus()
        $('.crenamed').css('display', 'block')
    } else if (action == "abrir") {
        $('#container' + id).click()
    } else if (action == "copiar") {

    } else if (action == "excluir") {

    }
}

$(document).on('keydown', '.crenamed > input', function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    console.log(code)
    if (code == 13) {
        renameContainer($(this).attr('data-id'), $(this).val())
    } else if (code == 27) {
        $('#container-menu').removeClass('context-menu-show')
        $('.x-menu-container').find('x-label').css('display', 'block')
        $('.crenamed').css('display', 'none')
    }
});

function renameContainer(containerId, newAlias) {

    var q = "update container set alias='" + newAlias + "' where id = " + containerId
    console.log(q)
    querySql(q, function(data) {
        if (data == undefined || data.success == false) {
            return
        }
        console.log(data.data)
        $('#container-menu').removeClass('context-menu-show')
        $('.x-menu-container').find('x-label').css('display', 'block')
        $('.crenamed').css('display', 'none')
        $('#container' + containerId).find('x-label').text(newAlias)

        openFiles()

    });
}

function openComponents(containerId) {
    var q = "select * from components where containerId = " + containerId + " order by `index` "
    querySql(q, function(data) {

        if (data == undefined || data.success == false) {
            return
        }

        $('x-doctab').find('#ripple').remove()
        setCurrentComponent(data)
        addStructToList(data.data)
        addComponentToList()
        addAttributes()
        rendererFiles()
        applyStyles()
        getTheme()
    });
}

function rendererFiles() {
    showLoading()
    var q = "select * from files where clientId = " + getUserData().data[0].id
    querySql(q, function(data) {
        hideLoading()
        if (data == undefined || data.success == false) {
            alerta("Erro ao tentar sincronizar seus <strong>assets</strong>", true)
            return
        }
        setFiles(data)
    });
}

function addStructToList(q) {
    $('x-menuitem[estruct]').remove()
    $('x-button[componentcreated]').remove()
    q.forEach(element => {
        var item = "<x-menuitem data='" + JSON.stringify(element.params) + "' estruct class='x-estruct' data-id='" + element.uid + "'>" +
            "  <x-icon name='layers'> </x-icon> " +
            "  <x-label> " + element.uid + " </x-label> " +
            "  </x-menuitem>"
        $('.sidebar-internal').find('.body').append(item)


        console.log("****************")
        console.log("R:")
        console.log(element.params)
        console.log(element.name)
        console.log(element.uid)
        console.log("****************")

        elementGet(element.params, element.name, element.uid)
        rendererComponent($('#' + element.uid), false)
    });
}

function initHome(q) {
    console.log("initHome")
    $('x-menuitem[container]').remove()
    q.data.forEach(element => {

        console.log(element)

        var item = '<x-menuitem id="container' + element.containerId + '" container class="x-menu-container" data-id="' + element.containerId + '">' +
            ' <x-icon name = "dashboard"> </x-icon> ' +
            '  <x-label> ' + element.alias + ' </x-label> ' +
            ' </x-menuitem>'

        $('.sidebar-L').append(item)
    });
}

function addComponentToList() {
    loadJSON('./scripts/json/components.json', function(response) {
        $('x-menuitem[components]').remove()
        var dataJ = JSON.parse(response).data
        var defaultJ = JSON.parse(response).default
        setComponentDefault(defaultJ)
        dataJ.forEach(element => {
            var item = '<x-menuitem   itemid="it' + element.name + '"  components data-type="' + element.name + '">' +
                '  <x-icon name="' + element.config.icon + '"> </x-icon> ' +
                '  <x-label> ' + element.name + ' </x-label> ' +
                '  </x-menuitem>'
            $('.sidebar-internal').find('.header').append(item)
        });
    });
}

$('.type-color').click(function() {

    pickr.on('init', instance => {
        console.log('init', instance);
    }).on('show', (color, instance) => {
        console.log('show', color, instance);
    });

})

function addAttributes() {
    loadJSON('./scripts/json/attributes.json', function(response) {
        $('x-box[attributes]').remove()
            // console.log(JSON.parse(response).sort((a, b) => a.name.localeCompare(b.name)))

        var attribForEl = []

        $('sidebar-R').css('width', '0px')

        JSON.parse(response).forEach(element => {

            attribForEl.push({ "id": element.id, "el": element.el, "target": element.target, "type": element.type, "value": element.response })

            if (element.type.toLowerCase() == "config") {
                if (element.el == "color") {
                    $('#' + element.target).val(element.value)
                    $('.' + element.target).val(hex2rgba_convert(element.value, 100))
                }
            }

            if (element.visible) {

                var itemValue = ""
                var item = '<x-box data-list="' + element.value + '" data-id="' + element.id + '" id="attribute' + element.id + '" attributes class="x-attributes" data-type="' + element.type + '">' +
                    '  <x-label> ' + element.name + ' </x-label> '

                if (element.editable) {
                    itemValue = '  <x-input bx="' + element.type + '"  id="attr' + element.id + '" class="box-values type-' + element.type.toLowerCase() + '" placeholder="' + element.hint + '" value="' + element.value + '">    </x-input> '
                } else {
                    itemValue = '  <x-input bx="' + element.type + '"  id="attr' + element.id + '" class="box-values type-' + element.type.toLowerCase() + '" disabled="true" placeholder="' + element.hint + '" value="' + element.value + '">    </x-input> '
                }

                if (element.type == "COLOR") {
                    if (element.value == null || element.value.toString().length < 6) {
                        ' <span>' + element.value + '</span> <x-popover modal> ' +
                            '<x-rectcolorpicker bx="' + element.type + '"  class="box-values type-' + element.type.toLowerCase() + '  box-values"   onchange="xColorSelectChange(this,' + element.id + ')" onkeyup="xColorSelectChange(this,' + element.id + ')"></x-rectcolorpicker>' +
                            '</x-popover>' +
                            '</x-colorselect>'
                    } else {
                        itemValue = '<x-colorselect class="box-values type-' + element.type.toLowerCase() + '  box-values" id="attr' + element.id + '" value="' + element.value + '" style="margin-top: 10px;">' +
                            ' <span>' + element.value + '</span> <x-popover modal> ' +
                            '<x-rectcolorpicker bx="' + element.type + '"    onchange="xColorSelectChange(this,' + element.id + ')" onkeyup="xColorSelectChange(this,' + element.id + ')" value="' + element.value + '"></x-rectcolorpicker>' +
                            '</x-popover>' +
                            '</x-colorselect>'
                    }
                } else if (element.type == "NUMBER") {
                    if (element.editable) {
                        itemValue = '  <x-numberinput bx="' + element.type + '"  suffix="px"  style="cursor:pointer" id="attr' + element.id + '" class="box-values type-' + element.type.toLowerCase() + '" placeholder="' + element.hint + '" value="' + element.response + '">    </x-input> '
                    } else {
                        itemValue = '  <x-numberinput bx="' + element.type + '"  suffix="px"  style="cursor:pointer" id="attr' + element.id + '" class="box-values type-' + element.type.toLowerCase() + '" disabled="true" placeholder="' + element.hint + '" value="' + element.response + '">    </x-input> '
                    }
                } else if (element.type == "SRC") {


                } else if (element.type == "OPTION") {
                    if (element.editable) {
                        itemValue = '  <x-input bx="' + element.type + '"  style="cursor:pointer" id="attr' + element.id + '" class="box-values type-' + element.type.toLowerCase() + '" placeholder="' + element.hint + '" value="' + element.response + '">    </x-input> '
                    } else {
                        itemValue = '  <x-input bx="' + element.type + '"  style="cursor:pointer" id="attr' + element.id + '" class="box-values type-' + element.type.toLowerCase() + '" disabled="true" placeholder="' + element.hint + '" value="' + element.response + '">    </x-input> '
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
    });
}

$(document).on('keydown', '#menu-file-select > x-input', function(e) {
    var parentId = $('#menu-file-select').attr('data-id')
    console.log("ID: ")
    console.log($(this))
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {
        $("#" + parentId).val($('#menu-file-select').children().eq(1).text())
        $('#menu-file-select').fadeOut(100)
    } else if (code == 27) {
        $('#menu-file-select').fadeOut(100)
    }

    $('#menu-file-select').find('x-menuitem').remove()
    if ($(this).val().trim().length == 0) {
        getFiles().data.forEach(element => {
            var name = element.alias + "-" + element.id
            var item = '<x-menuitem data-parent="' + parentId + '" data-id="' + element.id + '"  data-alias="' + element.alias + '"><img src="' + element.url + '">' +
                '   <x-label>' + element.alias + "-" + element.id + '</x-label>' +
                '   </x-menuitem> '
            $('#menu-file-select').append(item)
        })
        var item = '<x-menuitem data-parent="' + parentId + '" data-id="null"  data-alias="null">' +
            '   <x-label style=" text-align: center;width: 100%;">REMOVER IMAGEM</x-label>' +
            '   </x-menuitem> '
        $('#menu-file-select').append(item)
    } else {
        getFiles().data.forEach(element => {
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

$(document).on('click', '.type-src', function(e) {
    var top = e.pageY - 40;
    var left = e.pageX;
    var parentId = $(this).attr('id')

    $('#menu-file-select').attr("data-id", $(this).attr('id'))

    $('#menu-file-select').attr('style',
        'top:' + top + 'px; right:0px; display:block;'
    )
    $('#menu-file-select').find('x-input').focus()

    $('#menu-file-select').find('x-menuitem').remove()
    getFiles().data.forEach(element => {
        var item = '<x-menuitem data-parent="' + parentId + '" data-id="' + element.id + '"  data-alias="' + element.alias + '"><img src="' + element.url + '">' +
            '   <x-label>' + element.alias + "-" + element.id + '</x-label>' +
            '   </x-menuitem> '
        $('#menu-file-select').append(item)
    })
    var item = '<x-menuitem data-parent="' + parentId + '" data-id="null"  data-alias="null">' +
        '   <x-label style=" text-align: center;width: 100%;">REMOVER IMAGEM</x-label>' +
        '   </x-menuitem> '
    $('#menu-file-select').append(item)
})

$(document).on('click', '#menu-file-select > x-menuitem', function() {
    if ($(this).text().trim() != "REMOVER IMAGEM") {
        console.log($(this).text())
        var parentId = "#" + $(this).attr('data-parent')
        $(parentId).val($(this).text())
    } else {
        console.log("NAOO")
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
    }
});

function renameFile(id, newName) {
    showLoading()
    var q = "update files set alias = '" + newName + "' where id = " + id
    querySql(q, function(data) {
        hideLoading()
        if (data == undefined || data.success == false) {
            alerta("Falha ao tentar renomear arquivo, tente novamente...", true)
            return
        } else {
            alerta(" renomeado como <strong>" + newName + "</strong> ")
            $('x-menuitem[data-id="' + id + '"]').attr('data-alias', newName + id)
            $('#popmenu-find').animate({
                'top': '0px'
            })
        }
        hideLoading()
    });
}

function deleteFile(id) {
    showLoading()
    var q = "delete from files where id = " + id
    querySql(q, function(data) {
        hideLoading()
        if (data == undefined || data.success == false) {
            alerta("Falha ao tentar deletar arquivo, tente novamente...", true)
            return
        } else {
            $('x-menuitem[data-id="' + id + '"]').fadeOut()
            $('#popmenu-find').animate({
                'top': '0px'
            })
        }
        hideLoading()
    });
}

function savePictureInDataBase(foto, alias) {
    showLoading()
    if (alias == undefined) {
        alias = "picture"
    }
    var q = "insert into files(clientId,url,alias) values(" + getUserData().data[0].id + ", '" + foto + "', '" + alias + "')"
    querySql(q, function(data) {
        hideLoading()
        if (data == undefined || data.success == false) {
            alerta("Falha ao tentar salvar arquivo, tente novamente...", true)
            return
        } else {
            openFiles()
        }
        hideLoading()
    });
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

    $(this).attr('data-list').split(',').forEach(element => {
        var item = ' <x-menuitem onclick="attribSelected(this, ' + $(this).attr('data-id') + ')" type="OPTION">' +
            ' <x-label>' + element.trim() + '</x-label> </x-menuitem> '
        $('#context-attribute').append(item)

    })

    $('#context-attribute').addClass('context-menu-show')
    $('#context-attribute').attr('data-id', $(this).attr('data-id'))
})


function rgb2hex(orig) {
    var rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : orig;
}

function xColorSelectChange(item, id) {
    var cor = $('#attr' + id).attr('value')
    console.log(rgb2hex(cor))
    $('#attr' + id).find('span').html(rgb2hex(cor))
        //$('#attr' + id).val(rgb2hex(cor))
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

$(document).on('click', 'x-footer > x-menuitem', function() {
    if (parseInt($('#sidebar-bottom').css('height')) > 23) {
        $('x-footer > x-menuitem').removeClass('footer-selected')
        $('#sidebar-bottom').attr('style', 'height:22px')
        $('x-sidebar-body').find('x-menubar').css('display', 'none')
    } else {
        $('x-footer > x-menuitem').removeClass('footer-selected')
        $(this).addClass('footer-selected')
        $('#sidebar-bottom').attr('style', 'height:450px')
        $('x-sidebar-body').find('x-menubar').css('display', 'none')
        if ($(this).hasClass('folder')) {
            $('x-sidebar-body').find('x-menubar').css('display', 'block')
            openFiles()
        }
    }
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
    $("x-parent-box").draggable();
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
        $('ul[x-files]>x-menuitem').removeClass('active')
    } else {
        $('ul[x-files]>x-menuitem').removeClass('active')
        $(this).addClass('active')
        $('#popedit-finder').attr('data-id', $(this).attr('data-id'))
        $('#popmenu-find').attr('data-id', $(this).attr('data-id'))
        $('#popmenu-find').animate({
            'top': '44px'
        })
    }
})

function openFiles() {

    showLoading()
    var q = "select * from files where clientId = " + getUserData().data[0].id
    querySql(q, function(data) {
        hideLoading()
        if (data == undefined || data.success == false) {
            alerta('Falha ao tentar acessar seus <strong>assets')
            return
        }
        setFiles(data)
        $('x-menuitem[fileItem]').remove()
        data.data.forEach(element => {
            //    console.log(element)
            var item = '<x-menuitem fileItem data-id="' + element.id + '" data-alias="' + element.alias + "-" + element.id + '"  onclick="onFileClick(' + element + ')" >' +
                ' <x-label> </x-label> ' +
                '<img src="assets/bg.jpg" />' +
                '<img style="    position: absolute; background: transparent;' +
                ' " src="' + element.url + '"/>' +
                ' </x-menuitem '
            $('ul[x-files]').append(item)

        });
    });
}