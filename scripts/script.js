$(function() {
    $('.sortable').each(function() {
        var clone, before, parent;
        $(this).sortable({
            connectWith: $('x-body').not(this),
            helper: "clone",
            ghost: true,
            start: function(event, ui) {
                $(ui.item).show();
                clone = $(ui.item).clone();
                before = $(ui.item).prev();
                parent = $(ui.item).parent();
            },
            stop: function(event, ui) {
                if (before.length) before.after(clone);
                else parent.prepend(clone);

                console.log($(ui.item))
                createObject(ui.item)
                $(ui.item).remove()

            }
        }).disableSelection();
    });
    $('x-body').each(function() {
        var clone, before, parent;
        $(this).sortable({
            connectWith: $('x-body'),
            helper: "x-body-clone",
            ghost: true,
            start: function(event, ui) {

            },
            stop: function(event, ui) {
                console.log($('x-body>x-button[componentcreated]'))
                var newPos = 0
                Array.from($('x-body>x-button[componentcreated]')).forEach(element => {
                    newPos = newPos + 1
                    updatePositon($(element).attr('id'), newPos)
                });
            }
        }).disableSelection();
    });

});

function hex2rgba_convert(hex, opacity = 100) {
    hex = hex.replace('#', '');
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);

    result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
    return result;
}

function updatePositon(uid, newIndex) {
    console.log(uid)
    console.log(newIndex)
    var continerId = $('x-doctab[selected="selected"]').attr('data-id')

    var q = "update appdock_db.components set `index`= " + newIndex +
        " where uid = '" + uid + "' and containerId = " + continerId + " ;"
    console.log(q)
    querySql(q, function(data) {
        if (data == undefined || data.success == false) {
            return
        }
    });
}

GLOBAL_COMPONENT_ID = ""

$(document).on('click', 'x-struct-option>span[delete]', function() {
    if (confirm("Tem certeza que deseja deletar o objeto " + $(this).attr('data-id') + "?")) {
        $('body').append($('x-struct-option'))
        $('x-struct-option').fadeOut()
        deleteButton($(this).attr('data-id').replace('#', ''))
    }
})

$(document).on('click', 'x-menuitem[estruct]', function() {
    var idNew = "#" + $(this).attr('data-id')
    $(idNew).click()
})


$(document).on('click', '.close-theme-colors', function() {
    $('x-theme-dialog').fadeOut(100)
})

$(document).on('click', 'x-menu-theme', function() {
    $('x-theme-dialog').fadeIn(100)
    $('x-theme-dialog').css('display', 'flex')
    getTheme()
})

$(document).on('click', 'x-button[componentCreated]', function() {
    $('componentCreated').removeClass('selected')
    $(this).addClass('selected')
    $('.type-id').val($(this).attr('id'))

    GLOBAL_COMPONENT_ID = "#" + $('[bx="ID"]').val()

    $('x-menuitem[estruct]').removeClass('selected-struct')
    $('x-menuitem[data-id="' + $('[bx="ID"]').val() + '"]').addClass('selected-struct')

    var data = JSON.parse($(GLOBAL_COMPONENT_ID).attr('data'))

    data.forEach(element => {
        console.log(element.value)
        if ($('#attr' + element.id).hasClass('type-color')) {
            $('#attr' + element.id).val(element.value)
            $('#attr' + element.id).find('span').html(element.value)
        } else {
            $('#attr' + element.id).val(element.value)
        }
    })

    $('.sidebar-R ').animate({ width: '200px' }, 100)

    $('#border-live').remove()

    var borderLive = '<div id="border-live" style="position: absolute; display: block;   width:100% !important;height:100% !important;"> ' +
        ' <x-struct-option> <span delete data-id="' + GLOBAL_COMPONENT_ID + '"></span></x-struct-option>' +
        ' </div>'
    $(GLOBAL_COMPONENT_ID).prepend(borderLive)

})


function applyStyles() {
    const divv = document.querySelectorAll('x-body>x-button[componentcreated]');
    divv.forEach(el => {
        if (el != undefined) {

            var item = JSON.parse($(el).attr('data'))
            console.log(item)
            console.log(item[0].value)

            var id = item[0].value
            var name = item[1].value
            var text = item[2].value
            var textSize = item[3].value
            var textColor = item[4].value
            var fontFamily = item[5].value
            var backgroundColor = item[6].value

            $(el).attr('create-' + name, '')

            var background = item[7].value

            var backgroundSize = item[8].value
            var float = item[9].value

            var spacesW = item[10].value
            var spacesH = item[11].value

            var marginLeft = item[12].value
            var marginTop = item[13].value
            var marginRight = item[14].value
            var marginBottom = item[15].value
            var textAlign = item[16].value
            var borderRadius = item[17].value

            var borderColor = (item.size > 18) ? item[18].value : "#000000"
            var borderSize = (item.size > 18) ? item[19].value : "0"
            var borderStyle = (item.size > 18) ? item[20].value : "0"

            var element = $("#" + id)

            element.text(text)

            var width = 0
            var height = 0
            if (spacesW == '0.50') {
                width = $('x-body').width() / 5
            } else if (spacesW == '0.75') {
                width = $('x-body').width() / 4
            } else if (spacesW == 1) {
                width = $('x-body').width() / 3
            } else if (spacesW == 2) {
                width = $('x-body').width() / 2
            } else if (spacesW == 3) {
                width = $('x-body').width()
            } else {
                width = $('x-body').width()
            }

            varFatorH = 36;
            height = varFatorH * spacesH
            if (background != null && background != 'null' && background != "?") {
                if (background.toString().indexOf('data:image') == -1) {
                    let dogs = getFiles().data.filter((animal) => {
                        return animal.id == parseInt(background.split('-')[1]);
                    })
                    background = dogs[0].url
                }
            }

            element.css("border-radius", borderRadius + "px")
            element.css("border-color", borderColor)
            element.css("border-width", borderSize)
            element.css("border-style", borderStyle)
            element.css("margin-top", marginTop + "px")
            element.css("margin-right", marginRight + "px")
            element.css("margin-bottom", marginBottom + "px")
            element.css("margin-left", marginLeft + "px")
            element.css("text-align", textAlign)
            element.css("font-size", textSize + "px")
            element.css("width", width + "px")
            element.css("height", height + "px")
            element.css("color", textColor)
            if (background != null && background != 'null' && background != "?") {
                element.css("background", "url(" + background + ")")
                element.css("background-repeat", 'no-repeat')
                element.css("background-position", 'center center')
                element.css("background-size", backgroundSize)
            }

            element.css("background-color", backgroundColor)

            console.log("_________________")

            if (float != null && float != 'null' && float != "?") {
                if (float.toString().toUpperCase() == "CENTER") {
                    var x = $('x-body').width() / 2
                    var xx = x - (width / 2)
                    element.css('margin-left', xx + "px")
                } else {
                    element.css("float", float)
                }
            }


        }
    })

}

function exitProject(el) {
    if ($('x-doctab[edited]').length > 0) {
        $('#closeUp').click()
    }
}


function createObject(object) {
    var data = getAttribs()
    var item = $(object).attr("data-type")
    var size = $('x-body>x-button[componentcreated]').length + 1

    data[0].value = item.toString().toLowerCase() + size
    data[1].value = item.toString().toUpperCase()

    if (item.toUpperCase() == "LABEL") {
        data[2].value = item.toString().toLowerCase()
        data[4].value = "#141414"
        data[6].value = "#FFFFFF"
        data[10].value = 2
        data[11].value = 1
    } else if (item.toUpperCase() == "INPUT") {
        data[2].value = item.toString().toLowerCase()
        data[4].value = "#141414"
        data[6].value = "#FFFFFF"
        data[10].value = 2
        data[11].value = 1

    } else if (item.toUpperCase() == "IMAGEVIEW") {
        data[2].value = item.toString().toLowerCase()
        data[4].value = "#141414"
        data[6].value = "#FFFFFF"
        data[10].value = 3
        data[11].value = 3

    } else if (item.toUpperCase() == "LIST") {
        data[2].value = item.toString().toLowerCase()
        data[4].value = "#141414"
        data[6].value = "#FFFFFF"
        data[10].value = 3
        data[11].value = 1
    }

    elementGet(JSON.stringify(data), item, item.toString().toLowerCase() + size)
    rendererComponent($('#' + item.toString().toLowerCase() + size), true)
}

function elementGet(data, item, iid) {
    var element = ' '

    if (item.toUpperCase() == "BUTTON") {

        element = element + "<x-button componentCreated data='" + data + "' id='" + iid + "'> <x-label>Button</x-label> </x-button>"

    } else if (item.toUpperCase() == "LABEL") {

        element = element + "<x-button createLabel componentCreated data='" + data + "' id='" + iid + "'> " + iid + "</x-label>"
    } else if (item.toUpperCase() == "INPUT") {
        element = element + "<x-button createInput componentCreated data='" + data + "' id='" + iid + "' value='" + iid + "'>  </x-input>"

    } else if (item.toUpperCase() == "IMAGEVIEW") {

        element = element + "<x-button createImageView componentCreated data='" + data + "' id='" + iid + "'></x-button>  "
    } else if (item.toUpperCase() == "LIST") {

        element = element + "<x-button createList componentCreated data='" + data + "' id='" + iid + "'  >  </x-button>"
    } else {
        element = element + "<x-button componentCreated data='" + data + "' id='" + iid + "'> <x-label>Button</x-label> </x-button>"
    }
    $('x-body').append(element)
}

function rgb2hex(orig) {
    var rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : orig;
}

$(document).on('change', '.box-values, .box-values>main>x-input', function() {

    var value = ""
    if ($(this).hasClass('type-color')) {
        value = rgb2hex($(this).val())
    } else if ($(this).hasClass('type-option')) {
        value = $(this).find('x-label').val()
    } else {
        value = $(this).val()
    }

    console.log(GLOBAL_COMPONENT_ID)

    var newData = JSON.parse($(GLOBAL_COMPONENT_ID).attr('data'))
    newData.forEach(element => {
        if (element.id == $(this).parent().attr('data-id')) {
            element.value = value
        }
    });

    $(GLOBAL_COMPONENT_ID).attr('data', JSON.stringify(newData))

    console.log('---------------------------')
    console.log(value)
    console.log('---------------------------')

    $('x-doctab[selected="selected"]').attr('edited', '')

    applyStyles()
})



$(document).on('click', '#menu-file-select > x-menuitem', function() {

    if ($(this).attr('data-id') == "null") {
        $('#' + $(this).attr('data-parent')).val("null")
        $('#' + $(this).attr('data-parent')).css("color: #607d8b6b")
    } else {

        $('#' + $(this).attr('data-parent')).css("color: #FFFFFF")
        console.log($(GLOBAL_COMPONENT_ID).attr('data'))
        console.log($(this).attr('data-id'))
        var newData = JSON.parse($(GLOBAL_COMPONENT_ID).attr('data'))

        console.log("VAII")
        newData.forEach(element => {
            console.log(element)
            if ("attr" + element.id == $(this).attr('data-parent')) {
                element.value = $(this).find('x-label').text()
            }
        });

        $(GLOBAL_COMPONENT_ID).attr('data', JSON.stringify(newData))
        $('x-doctab[selected="selected"]').attr('edited', '')
        console.log('---------------------------')
        console.log($(this).find('x-label').text())
        console.log($(this).attr('data-id'))
        console.log('---------------------------')

        $('#' + $(this).attr('data-parent')).val($(this).find('x-label').text())
        $('#' + $(this).attr('data-picture-id')).val($(this).attr('data-id'))


        applyStyles()

    }
})

function attribSelected(element, id) {
    var action = $(element).attr('type')
    $('#context-attribute').removeClass('context-menu-show')

    var newData = JSON.parse($(GLOBAL_COMPONENT_ID).attr('data'))

    newData.forEach(el => {
        if (el.id == id) {
            el.value = $(element).find('x-label').text()
        }
    });

    $(GLOBAL_COMPONENT_ID).attr('data', JSON.stringify(newData))

    $('x-doctab[selected="selected"]').attr('edited', '')
    console.log('---------------------------')
    console.log($(element).find('x-label').text())
    console.log('---------------------------')
    applyStyles()
    $('#attr' + id).val($(element).find('x-label').text())

}

function deleteButton(button) {
    var continerId = $('x-doctab[selected="selected"]').attr('data-id')
    var q = "delete from appdock_db.components where uid='" + button.toString().trim() + "' and containerId= " + continerId
    console.log(q)
    querySql(q, function(data) {
        if (data == undefined || data.success == false) {
            return
        }

        openComponents($('x-doctab[selected="selected"]').attr('data-id'))
    });
}

function rendererComponent(element, saveSQL) {
    var json = element.attr('data')
    if (saveSQL) {
        saveButton(element)
    }
    applyStyles()
}

$('.type-color').ColorPicker({
    color: '#0000ff',
    onShow: function(colpkr) {
        $(colpkr).fadeIn(500);
        return false;
    },
    onHide: function(colpkr) {
        $(colpkr).fadeOut(500);
        return false;
    },
    onChange: function(hsb, hex, rgb) {
        $('.type-color').css('backgroundColor', '#' + hex);
        $('.type-color').attr('value', '#' + hex);
    }
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function saveButton(button) {
    var continerId = $('x-doctab[selected="selected"]').attr('data-id')
    var index = $('x-button[componentcreated]').length
    console.log(button)
    var uid = $(button).attr('id')
    var q = "insert into appdock_db.components(name, containerId,params,uid,`index`)" +
        " value ('" + $(button).find('x-label').text() + "','" + continerId + "','" + $(button).attr('data') + "','" + uid + "', " + index + ") ;"
    console.log(q)
    button.attr('data-uid', uid)

    console.log(button)
    querySql(q, function(data) {
        if (data == undefined || data.success == false) {
            return
        }
        var item = "<x-menuitem data='#' estruct class='x-estruct' data-id='" + uid + "'>" +
            "  <x-icon name='layers'> </x-icon> " +
            "  <x-label> " + uid + " </x-label> " +
            "  </x-menuitem>"
        $('.sidebar-internal').find('.body').append(item)

    });
}


$(document).keydown(function(e) {
    var key = undefined;
    var possible = [e.key, e.keyIdentifier, e.keyCode, e.which];
    console.log(key)
    while (key === undefined && possible.length > 0) {
        key = possible.pop();
    }
    if (e.keyCode == 46 && GLOBAL_COMPONENT_ID != "") {
        if (confirm("Tem certeza que deseja deletar o objeto " + GLOBAL_COMPONENT_ID.replace("#", "") + "?")) {
            deleteButton(GLOBAL_COMPONENT_ID.replace("#", ""))
        }
    }
    if (key && (key == '115' || key == '83') && (e.ctrlKey || e.metaKey) && !(e.altKey)) {
        e.preventDefault();
        updateButton()
        return false;
    }
    return true;
});


function updateButton() {

    $('x-doctab[selected="selected"]').removeAttr('edited')

    $('x-body>x-button[componentcreated]').each(function(i, obj) {
        console.log($(obj).attr('id'))
        console.log($(obj).attr('data'))

        var q = "update appdock_db.components set params= " +
            " '" + $(obj).attr('data') + "' where uid = '" + $(obj).attr('id') + "' ;"

        querySql(q, function(data) {
            if (data == undefined || data.success == false) {
                return
            }
        });
    });
}

function getTheme() {
    var continerName = $('x-doctab[selected="selected"]').val()

    $('.statusbar-title').text(continerName)

    var continerId = $('x-doctab[selected="selected"]').attr('data-id')
    let containerJson = getHomeData().data.filter((d) => {
        return d.id == parseInt(continerId);
    })
    var myContainer = JSON.parse(containerJson[0].json)
    $('.statusbar-title').text(myContainer.title)
    $('x-actionbar').css('background', myContainer.primary)
    $('x-statusbar').css('background', myContainer.secundary)
    $('x-footerbar').css('background', myContainer.secundary)

    $('x-colorselect[target="color-primary"]').val(hex2rgba_convert(myContainer.primary))
    $('x-colorselect[target="color-secundary"]').val(hex2rgba_convert(myContainer.secundary))
    $('x-colorselect[target="color-accent"]').val(hex2rgba_convert(myContainer.accent))

    $('#color-primary').val(myContainer.primary)
    $('#color-secundary').val(myContainer.secundary)
    $('#color-accent').val(myContainer.accent)
    $('#config-title').val(myContainer.title)

}

$(document).on('click', '#button-save-config', function() {
    saveTheme()
})

$(document).on('change', '#color-accent', function() {
    $('x-colorselect[target="color-accent"]').val(hex2rgba_convert($(this).val()))
})
$(document).on('change', '#color-primary', function() {
    $('x-colorselect[target="color-primary"]').val(hex2rgba_convert($(this).val()))
})
$(document).on('change', '#color-secundary', function() {
    $('x-colorselect[target="color-secundary"]').val(hex2rgba_convert($(this).val()))
})



function saveTheme() {
    var continerId = $('x-doctab[selected="selected"]').attr('data-id')
    var continerName = $('x-doctab[selected="selected"]').val()
    var primary = $('#color-primary').val()
    var secundary = $('#color-secundary').val()
    var accent = $('#color-accent').val()
    var title = $('#config-title').val()
    var darkicons = ""

    $('.statusbar-title').text(title)
    $('x-actionbar').css('background', primary)
    $('x-statusbar').css('background', secundary)
    $('x-footerbar').css('background', secundary)

    var theme = '{"primary":"' + primary + '","secundary":"' + secundary + '",' +
        '"accent":"' + accent + '","title":"' + title + '","darkicons":"' + darkicons + '" ' +
        '}'

    var q = "update appdock_db.container set json= " +
        " '" + theme + "' where id = '" + continerId + "' ;"

    querySql(q, function(data) {
        if (data == undefined || data.success == false) {
            return
        } else {
            alerta("Configuração do container " + continerName + " alterada com sucesso!")
            $('x-theme-dialog').fadeOut(100)
        }
    });
}

$(document).on('mouseenter', '.toast-container', function() {
    $(this).find('x-toast').fadeIn(200)
        //  $(this).find('x-toast').animate({
        //       zoom: '1.0'
        // }, 200)
})

$(document).on('mouseleave', '.toast-container', function() {
    //  $(this).find('x-toast').animate({
    //     zoom: '0.5'
    //}, 200)
    $(this).find('x-toast').fadeOut(200)
})