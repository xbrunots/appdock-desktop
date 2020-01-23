function strToBoolean(string) {
    if (string == undefined) {
        return false
    }
    switch (string.toLowerCase().trim()) {
        case "true":
        case "yes":
        case "1":
            return true;
        case "false":
        case "no":
        case "0":
        case null:
            return false;
        default:
            return Boolean(string);
    }
}

function updateData(itemId, keyValue, value) {
    console.log(value)
    var newData = JSON.parse($(itemId).attr('data'))
    var ok = false
    newData.forEach(d => {
        if (d.el.toLowerCase() == keyValue.toLowerCase()) {
            d.value = value
        }
    })
    $(itemId).attr('data', JSON.stringify(newData))
}

$(document).on("click", "x-button[gravity-change]", function() {
    if ($(this).attr('mode') == 'CENTER') {
        $(this).attr('mode', 'TOP')
        $('x-body').removeClass('center-body')
        $('x-body').addClass('top-body')
        $(this).find('strong').text("TOP")
    } else {
        $(this).attr('mode', 'CENTER')
        $('x-body').removeClass('top-body')
        $('x-body').addClass('center-body')
        $(this).find('strong').text("CENTER")
    }
})

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }

        if (cls == 'string') {
            var strrr = '"<span    class="' + cls + '">' + match.replace('"', '').replace('"', '') + '</span>"';
        } else {
            var strrr = '<span    class="' + cls + '">' + match + '</span>';
        }
        if (cls == 'key') {
            strrr = '<span data-campo="' + match.replace('"', '').replace(':') + '" class="' + cls + '">' + match + '</span>';
        }
        return strrr;
    });
}

$(document).on('click', 'span[config-adapter]', function() {
    $(this).addClass("rotating")
    var viewParse = ""
    var nameAndRouteCripto = GLOBAL_DECRIPTO(getAttributByEl(JSON.parse($(GLOBAL_COMPONENT_ID).attr('data')), "adapter").value)

    if (nameAndRouteCripto != null && nameAndRouteCripto.length > 3) {
        var nameAndRoute = nameAndRouteCripto.split('|')
        var name = nameAndRoute[0]
        var route = nameAndRoute[1]

        viewParse = JSON.parse(route)
            // var viewName = viewParse.view.viewName

        $('x-label[select_transation]>input').val(name)
            //$('x-label[select_view]>input').val(viewName)

        delete viewParse.view
    } else {
        var filter = 'id is not null'
        var include = '*'
        var order = 'id'
        var group = ''
        var join = ''

        var pagination = {}
        pagination.rows = 10
        pagination.page = 1
        var bodyData = {}
        bodyData.filter = filter
        bodyData.include = include
        bodyData.order = order
        bodyData.group = group
        bodyData.join = join
        bodyData.pagination = pagination
        viewParse = bodyData
    }

    $('x-json-pre').html("")
    $('x-json-pre-result').html("")

    $('x-json-pre').html("")
    $('x-json-pre').append(
        syntaxHighlight(JSON.stringify(viewParse, undefined, 4), undefined, 4)
    );

    $('x-card[adapter-manager]').fadeIn()
    $('x-card[adapter-manager]').animate({
        top: '20px'
    }, 100)
    $(this).find("i").removeClass("rotating")

    rocketNetwork('get', '/rocket/routes', {}, function(status, data) {
        setRocketData(JSON.stringify(data))
            //  $('x-card[adapter-manager]').fadeIn()
            //applyJsonPreForAdapter()
        FIRST_OPEN = true
            //  $('x-card[adapter-manager]').animate({
            //      top: '20px'
            //  }, 100)
    })
})

FIRST_OPEN = true

$(document).on('click', 'x-card[adapter-manager]>header>x-button[close-config]', function() {
    $('x-card[adapter-manager]').animate({
        top: '100%'
    }, 100)

    $('x-card[adapter-manager]').fadeOut()
})

function getAttributByType(el) {
    return getAttribs().filter(function(item) {
        return item.type === el;
    })[0];
}

$(function() {
    $('.sortable').each(function() {
        var clone, before, parent;
        $(this).sortable({
            connectWith: 'x-body ',
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

    $('.sortable').each(function() {
        var clone, before, parent;
        $(this).sortable({
            connectWith: ' x-button[dockcontainer]',
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


    // $('x-body').each(function() {
    //   var clone, before, parent;
    //   $(this).sortable({
    //     connectWith: $('x-body'),
    //     helper: "x-body-clone",
    //     ghost: true,
    //     start: function(event, ui) {
    //
    //     },
    //     stop: function(event, ui) {
    //       console.log($('x-body>x-button[componentcreated]'))
    //       var newPos = 0
    //       Array.from($('x-body>x-button[componentcreated]')).forEach(element => {
    //         newPos = newPos + 1
    //         updatePositon($(element).attr('id'), newPos)
    //       });
    //     }
    //   }).disableSelection();
    // });

});

var lastHContainers
$(document).on('click', '.expand_button[target="containers-target"]', function() {
    if ($(this).attr('status') == "open") {
        $(this).find('i').removeClass('rotate-icon')
        lastHContainers = $("#" + $(this).attr('target')).css('height')
        $(this).attr('status', 'close')
        $("#containers-target").animate({
            height: "0px",
            opacity: 0
        })
    } else {
        $(this).find('i').addClass('rotate-icon')
        $(this).attr('status', 'open')
        $("#containers-target").animate({
            height: lastHContainers,
            opacity: 1
        })
    }
})



var lastHContainersRocket
$(document).on('click', '.expand_button2[target="containers-rocket"]', function() {
    if ($(this).attr('status') == "open") {
        $(this).find('i').removeClass('rotate-icon')
        lastHContainersRocket = $("#" + $(this).attr('target')).css('height')
        $(this).attr('status', 'close')
        $("#containers-rocket-data").animate({
            height: "0px",
            opacity: 0
        })
    } else {
        $(this).find('i').addClass('rotate-icon')
        $(this).attr('status', 'open')
        $("#containers-rocket-data").animate({
            height: lastHContainersRocket,
            opacity: 1
        })
        rendererServiceCardHome(function() {

        })
    }
})

$(document).on('click', '.expand_allbutton[target="#containers-rocket-data"]', function() {
    //views
    var ite = '.expand_allbutton[target="#containers-rocket-data"]'
    var alturaPadrao = $(this).attr("altura")
    var listaSelector = $(this).attr("target")
    expandAndCollapse(this, alturaPadrao, listaSelector, function(expand) {
        if (expand) {
            showInsideLoader(ite)
            rendererServiceCardHome(function() {
                hideInsideLoader(ite)
            })
        }
    })
})

function showInsideLoader(ele) {
    $(ele).append($('.diamicLoadingInsider'))
    $(ele).find('i').fadeOut(50)
    $('.diamicLoadingInsider').css('display', 'block')
}

function hideInsideLoader(ele) {
    $('.diamicLoadingInsider').css('display', 'none')
    $(ele).find('i').fadeIn(100)
}

$(document).on('click', '.expand_allbutton[target=".sidebar-internal>.header"]', function() {
    // components
    var alturaPadrao = $(this).attr("altura")
    var listaSelector = $(this).attr("target")
    expandAndCollapse(this, alturaPadrao, listaSelector, function(expand) {

    })
})

$(document).on('click', '.expand_allbutton[target="structs-body"]', function() {
    //structs
    var alturaPadrao = $(this).attr("altura")
    var listaSelector = $(this).attr("target")
    expandAndCollapse(this, alturaPadrao, listaSelector, function(expand) {

    })
})


function expandAndCollapse(element, alturaPadrao, listaSelector, callback) {
    if ($(element).attr('status') == "open") {
        $(element).find('i').removeClass('rotate-icon')
        $(element).attr('status', 'close')
        $(listaSelector).animate({
            height: "0px",
            opacity: 0
        })
        callback(false)
    } else {
        $(element).find('i').addClass('rotate-icon')
        $(element).attr('status', 'open')
        $(listaSelector).animate({
            height: alturaPadrao,
            opacity: 1
        })
        callback(true)
            //
    }
}

function hex2rgba_convert(hex, opacity = 100) {
    if (hex != undefined) {
        hex = hex.replace('#', '');
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);

        result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
        return result;
    } else {
        return hex
    }
}

function updatePositon(uid, newIndex) {
    if (uid != undefined && uid.toString().length > 0) {
        console.log(uid)
        console.log(newIndex)
        var continerId = $('x-menuitem[container].x-menu-selected').attr('data-id')
        requestGet('get', '/components/?containerId=' + continerId + "&uid=" + uid + "&_sort=index:ASC", function(status, data) {
            console.log(data)
            if (status) {
                request('put', '/components/' + data[0].id, {
                        "index": newIndex
                    },
                    function(status, data) {})
            }
        })
    }
}


function updateName(uid, newName) {
    if (uid != undefined && uid.toString().length > 0) {
        console.log(uid)
        console.log(newName)

        var lista = getCurrentComponent().filter(function(item) {
            return item.name.toLowerCase().replace("#", "") === newName.toLowerCase().replace("#", "")
        });

        if (lista.length > 0) {
            alerta("O id <strong>" + newName + "</strong> já existe!", true)

        } else {

            var newData = JSON.parse($("#" + uid.replace("#", "")).attr('data'))
            newData.forEach(element => {
                if (element.el == "id") {
                    element.value = newName
                }
            });
            var continerId = $('x-menuitem[container].x-menu-selected').attr('data-id')
            requestGet('get', '/components/?containerId=' + continerId + "&uid=" + uid + "&_sort=index:ASC", function(status, data) {
                console.log(data)
                if (status) {
                    request('put', '/components/' + data[0].id, {
                            "name": newName,
                            "uid": newName
                        },
                        function(status, data) {
                            if (status) {
                                if ($("#" + uid).hasClass('component-is-JSON')) {
                                    $("#" + uid).find('p').text(newName)
                                }
                                $("#" + uid).attr('id', newName)
                            }
                        })
                }
            })
        }

    }
}

GLOBAL_COMPONENT_ID = ""

$(document).on('click', 'x-struct-option>span[delete]', function() {
    if (confirm("Tem certeza que deseja deletar o objeto " + $(this).attr('data-id') + "?")) {
        $('body').append($('x-struct-option'))
        $('x-struct-option').fadeOut(200)
        $($(this).attr('data-id')).remove()
        deleteButton($(this).attr('data-id').replace('#', ''))
    }
})

$(document).on('click', 'x-menuitem[estruct]', function() {
    var idNew = "#" + $(this).attr('data-id')
    $(idNew).click()
})

$(document).on('click', 'span[data-campo]', function() {
    var ind = $(this).attr('data-campo')
    $('span[data-campo]').removeClass('campo-selected')
    $('span[data-campo="' + ind + '"]').addClass('campo-selected')
})

$(document).on('click', 'x-expresion[placeholder="expression"]', function() {
    var ind = $(this).parent().attr('data-id')
    $('span[data-campo]').removeClass('campo-selected')
    $('span[data-campo="' + ind + '"]').addClass('campo-selected')
})


$(document).on('mouseenter', '.front>x-campo-api', function() {

})

$(document).on('mouseleave', '.front>x-campo-api', function() {

})

$(document).on('click', '.close-theme-colors', function() {
    $('x-theme-dialog').fadeOut(100)
    $('x-menu-vs').find('i').removeClass('x-menu-vs-i-active')
    $('x-menu-vs').find('img').removeClass('x-menu-vs-i-active')
})

$(document).on('click', '[x-settings-theme]', function() {
    $('x-theme-dialog').fadeIn(100)
    $('x-theme-dialog').css('display', 'flex')

    if ($('.x-menu-selected').attr('iscard') != undefined) {
        $('#config-elevation').parent().css('display', 'block')
        $('#config-radius').parent().css('display', 'block')
        $('#config-title').parent().css('display', 'none')
        $('.color-primary').parent().css('display', 'none')
        $('.color-secundary').parent().css('display', 'none')
        $('.color-accent').parent().css('display', 'none')
    } else {
        $('#config-elevation').parent().css('display', 'none')
        $('#config-radius').parent().css('display', 'none')
        $('#config-title').parent().css('display', 'block')
        $('.color-primary').parent().css('display', 'block')
        $('.color-secundary').parent().css('display', 'block')
        $('.color-accent').parent().css('display', 'block')
    }
    getTheme()
})



$(document).on('click', '#button-save-transaction', function() {
    var names = $('x-label[select_transation]>input').val().replace("@", "")
    var viewName = $('x-label[select_view]>input').val()
    var jsonObj = JSON.parse($('x-json-pre').text()) //!s

    var dataViews = JSON.parse(getRocketData()).data.filter(function(item) {
        return item.route.replace("@", "") === viewName.replace("@", "");
    })[0]

    jsonObj.view = dataViews
    var nameForCripyto = "@" + names + "|" + JSON.stringify(jsonObj)

    var hash = GLOBAL_ENCRIPTA(nameForCripyto);
    $('x-input[xname="ADAPTER"]').val(hash.toString())

    var newData = JSON.parse($(GLOBAL_COMPONENT_ID).attr('data'))
    newData.forEach(element => {
        if (element.el.toLowerCase().trim() == "adapter") {
            element.value = hash.toString()
        }
    });
    updateButton()
    $(GLOBAL_COMPONENT_ID).attr('data', JSON.stringify(newData))
    $('x-button[close-config]').click()
})

$(document).on('click', 'x-button[goevents]', function() {
    if (parseInt($('x-events').css('right')) < 0) {
        $('x-events').animate({
            right: '200px'
        }, 100)
    } else {
        $('x-events').animate({
            right: '-200px'
        }, 100)
    }
})


$(document).on('click', 'x-events>div>.expand_button', function() {
    if ($('x-events').css('right') < "-100px") {
        if ($('.sidebar-R').css('width') > "1px") {
            $('x-events').animate({
                right: '200px'
            }, 100)
        } else {
            $('x-events').animate({
                right: '0px'
            }, 100)

        }
    } else {
        $('x-events').animate({
            right: '-200px'
        }, 100)
    }

})

/*
$(document).on('click', 'x-parent-box[iscard="true"]', function() {
    $('x-body').resizable();
    $('x-body').resizable('destroy');
    $('x-body').resizable({
        disabled: false,
        resize: function(event, ui) {
            setNewSizeOfXbody(ui.size.width, ui.size.height)
        }
    });
});
*/


function setNewSizeOfXbody(w, h) {
    /*width: 200 px;
    height: 200 px;
    min - height: 200 px;
    max - height: 200 px;
    min - width: 200 px;
    max - width: 200 px; */
    var heightNew = h + "px"
    var wightNew = w + "px"

    $('x-body').css({
        'width': wightNew,
        'height': heightNew,
        'min-height': heightNew,
        'max-height': heightNew,
        'min-width': wightNew,
        'max-width': wightNew
    })
}

function hexToRgbA(ahex) {
    //clean #
    ahex = ahex.substring(1, ahex.length);
    ahex = ahex.split('');

    var r = ahex[0] + ahex[0],
        g = ahex[1] + ahex[1],
        b = ahex[2] + ahex[2],
        a = ahex[3] + ahex[3];

    if (ahex.length >= 6) {
        r = ahex[0] + ahex[1];
        g = ahex[2] + ahex[3];
        b = ahex[4] + ahex[5];
        a = ahex[6] + (ahex[7] ? ahex[7] : ahex[6]);
    }

    var int_r = parseInt(r, 16),
        int_g = parseInt(g, 16),
        int_b = parseInt(b, 16),
        int_a = parseInt(a, 16);


    int_a = int_a / 255;

    if (int_a < 1 && int_a > 0) int_a = int_a.toFixed(2);

    if (int_a || int_a === 0)
        return 'rgba(' + int_r + ', ' + int_g + ', ' + int_b + ', ' + int_a + ')';
    return 'rgb(' + int_r + ', ' + int_g + ', ' + int_b + ')';
}

$(document).on('click', 'x-button[componentCreated]', function() {

    if ($(this).find("[create-lottie]").length > 0) {
        $(this).text("")
    }
    if (!cntrlIsPressed) {
        $('componentCreated').removeClass('selected')
    }

    $(this).addClass('selected')
    $('.type-id').val($(this).attr('id'))

    GLOBAL_COMPONENT_ID = "#" + $('[bx="ID"]').val()

    $('x-box[json]>pre').html("")
    $('x-box[json]>pre').removeClass("JsonParseError")


    $('x-codetabs>x-menuitem>x-label').text(GLOBAL_COMPONENT_ID)
    $('x-codetabs').css('display', 'flex')
    $('x-menuitem[estruct]').removeClass('selected-struct')
    $('x-menuitem[data-id="' + $('[bx="ID"]').val() + '"]').addClass('selected-struct')

    var data = JSON.parse($(GLOBAL_COMPONENT_ID).attr('data'))

    var fixedValue = "false"
    var fixedArray = data.filter(function(item) {
        return item.el.toLowerCase().trim() === "fixed"
    })

    if (fixedArray.length > 0) {
        fixedValue = fixedArray[0].value
    }



    $('.x-attributes').css('display', 'flex')

    data.forEach(element => {

        if ($('#attribute' + element.id).attr('data-type') == "COLOR") {
            if (element.value.indexOf("#") != -1) {
                $('#attr' + element.id).val(hexToRgbA(element.value))
            } else {
                $('#attr' + element.id).val(element.value)
            }
            $('#attr' + element.id).find('span').html(element.value)
        } else {
            $('#attr' + element.id).val(element.value)
        }

        $('.x-attributes[json]').css('display', 'none')

        if (!$(GLOBAL_COMPONENT_ID).hasClass('component-is-LIST')) {
            $('.x-attributes[orientation]').css('display', 'none')
            $('.x-attributes[adapter]').css('display', 'none')
        }

        if ($(GLOBAL_COMPONENT_ID).hasClass('component-is-JSON')) {
            if (element.id > 3) {
                $('.x-attributes[data-id="' + element.id + '"]').css('display', 'none')
            }
            $('.x-attributes[json]').css('display', 'flex')
            var dataParams = JSON.parse($(GLOBAL_COMPONENT_ID).attr('data'))
            console.log(dataParams)
            var params = dataParams.filter(function(item) {
                return item.el.toLowerCase().trim() === "json"
            })

            if (params.length > 0 && params[0].value != null && params[0].value != undefined && rTrim(lTrim(params[0].value)).length > 1) {
                var jsParse = JSON.parse(params[0].value)
                var jsonContent = syntaxHighlight(JSON.stringify(jsParse, undefined, 4))
                $('x-box[json]>pre').html(jsonContent)
            }
        }

    })

    $('.sidebar-R ').animate({
        width: '200px'
    }, 100)

    $('x-button[goevents]').attr('style', 'display;flex !important')
    $('x-button[goevents]').css('opacity', '1')
    if (!cntrlIsPressed) {
        $('.border_live').remove()
    }
    var db = ''
    if ($('#attr3').val().toLowerCase() == "list") {
        db = ' <span tooltip-rox target="x-simulator>x-parent-box" data-title="Clique para adicionar um Adapter ao List" config-adapter><i class="fas fa-rocket"></i></span>' +
            ' <span tooltip-rox  target="x-simulator>x-parent-box" data-title="Clique para relacionar um Container ao Adapter e usá-lo como Card" config-card=""><x-icon name="dashboard"> </x-icon> ' +
            '<label>...</label></span>'
    }
    var borderLive = '<div id="border-live" class="border_live" style="position: absolute; display: block;   width:100% !important;height:100% !important;"> ' +
        ' <x-struct-option> ' +
        '<span tooltip-rox  target="x-simulator>x-parent-box" data-title="Clique para deletar o Componente" delete data-id="' + GLOBAL_COMPONENT_ID + '"></span>' + db +
        '</x-struct-option>' +
        ' </div>'
    refreshMarkLines(GLOBAL_COMPONENT_ID)
    $("x-button[componentcreated]").draggable({
        disabled: true
    });
    $("x-button[componentcreated]").resizable({
        disabled: true
    });

    $('x-line-x').css('left', '0px')
    $('x-line-x').css('top', $(GLOBAL_COMPONENT_ID).css('top'))
    $('x-line-y').css('left', $(GLOBAL_COMPONENT_ID).css('left'))
    $('x-line-y').css('top', '0px')

    $(GLOBAL_COMPONENT_ID).draggable({
        disabled: false,
        grid: [5, 5],
        drag: function(event, ui) {
            $('x-line-x').css('left', '0px')
            $('x-line-x').css('top', ui.position.top)

            $('x-line-y').css('left', ui.position.left)
            $('x-line-y').css('top', '0px')

            refreshMarkLines(GLOBAL_COMPONENT_ID)

        }
    });

    $(GLOBAL_COMPONENT_ID).resizable('destroy');
    $(GLOBAL_COMPONENT_ID).resizable({
        disabled: false,
        handler: 'n, s, e, w',
        minHeight: 24,
        resize: function(event, ui) {
            saveButtonToNewSize(ui.size.height, ui.size.width, fixedValue)
        }
    });

    saveButtonToNewDirection()

    var currentComponentCard = getCurrentComponent().filter(function(item) {
        return item.name.toLowerCase().trim() === GLOBAL_COMPONENT_ID.replace("#", "").toLowerCase().trim()
    })


    $(GLOBAL_COMPONENT_ID).prepend(borderLive)
    console.log(currentComponentCard)
    if (currentComponentCard.length > 0 && currentComponentCard[0].card != null) {
        console.log("OK")
        $('x-struct-option>span[config-card]>label').text(currentComponentCard[0].card.alias + " [" + currentComponentCard[0].card.id + "]")
    }

    openFunctions()

    if ($('.border_live').length == 1) {
        firtsSelectedItem = GLOBAL_COMPONENT_ID
    }
    if ($('.border_live').length > 1) {
        borderLiveEditableComponentMode = true
        $('x-struct-option>span[delete]').remove()
        $('x-struct-option>span[config-adapter]').remove()
            //$('.box-values').attr('disabled', true)
        $('x-alinhamento-body').animate({
            top: '36px'
        }, 150)
        $('x-alinhamento-body').css('display', 'flex')
            //$('.sidebar-R').css('display','none') 
    } else {
        borderLiveEditableComponentMode = false
            //$('.box-values').removeAttr('disabled')
        $('x-alinhamento-body').animate({
                top: '-36px'
            }, 150)
            //  $('.sidebar-R').fadeIn()
            //$('.sidebar-R').animate({
            //   width: '200px'
            //  })
    }


    $('.el-width').removeAttr('disabled')
    $('.el-height').removeAttr('disabled')

    if (fixedValue.toLowerCase().trim() == "height") {
        $('.el-width').attr('disabled', true)
    } else if (fixedValue.toLowerCase().trim() == "width") {
        $('.el-height').attr('disabled', true)
    } else {

    }

})
firtsSelectedItem = ""

$(document).on('click', 'x-event-action>x-select', function(e) {
    if (parseInt($('x-event-action>x-select>x-menu').css('min-width')) > 600) {
        $(this).find('x-menu').css('top', e.pageY)
        $(this).find('x-menu').css('left', e.pageX - 100)
    }
})
$(document).on('click', 'x-connect-container-dialog>x-card>header>x-button', function() {
    $('x-connect-container-dialog').fadeOut(150)
})

$(document).on('click', 'x-struct-option>span[config-card]', function(e) {
    $('x-connect-container-dialog').fadeIn(150)
    $('x-connect-container-dialog').css('display', 'flex')

})

$(document).on('click', '#btnLinkContainer', function(e) {
    var regex = /\d+/g;
    var string = $('#labelSelectContainer').val();
    var matches = string.match(regex);
    matches = parseInt(matches)

    var containers = getHomeData().filter(function(item) {
        return item.id === matches
    })

    console.log(containers)

    var isMine = containers.length > 0

    if (matches > 0 && isMine) {
        var data = getCurrentComponent().filter(function(item) {
            return item.name.toLowerCase().trim() === GLOBAL_COMPONENT_ID.replace("#", "").toLowerCase().trim()
        })

        request('put', '/components/' + data[0].id, {
                "card": matches
            },
            function(status, data) {
                if (status) {
                    $('x-connect-container-dialog').fadeOut(150)
                    $('x-struct-option>span[config-card]>label').text(matches)
                    var newComponent = getCurrentComponent()

                    newComponent.filter(function(item) {
                        return item.id === data.id
                    })[0].card = data.card

                    setCurrentComponent(newComponent)

                } else {
                    alerta("OOps Algo deu Errado! tente novamente :)", true);
                }
            })
    } else {
        alerta("ID Inválido!", true);
    }
})


$(document).on('mouseenter', '*[tooltip-rox]', function(e) {
    var title = $(this).attr('data-title')
    var position = $(this).attr('data-position')
    var h = $(this).css('height')
    var pos = "margin-top: -" + h + "px;"
    var pos2 = "top: 0px;"
    var labelCss = '  z-index: 999999999;  position: relative;'
        /*if (position != undefined) {
            if (position.toLowerCase() == "top") {
                pos = "margin-top: -" + h + "px;"
                pos2 = "bottom: 0px;"
            } else if (position.toLowerCase() == "bottom") {
                pos = "margin-top: " + h + "px;"
                pos2 = "top: 0px;"
            }
        }*/
    pos = pos + "left:" + e.pageX + "px;top:" + e.pageY + "px; "
    var tooltipItem = "<tooltip-rox-item  style= '" + pos + "'> <label style='" + labelCss + "'>" + title + "</label></tooltip-rox-item>"
    $('tooltip-rox-item').remove()
        // $($(this).attr('target')).append(tooltipItem)
    $('body').append(tooltipItem)
    $('tooltip-rox-item').fadeIn()
})


$(document).on('mouseleave', '*[tooltip-rox]', function(e) {
    $('tooltip-rox-item').remove()
})



function saveButtonToNewSize(newH, newW, fixedValue) {
    var hMove = parseInt(newH)
    var wMove = parseInt(newW)

    var h100 = parseInt($('x-body').css('height')) / 100
    var w100 = parseInt($('x-body').css('width')) / 100

    var hFinal = Math.round(hMove / h100)
    var wFinal = Math.round(wMove / w100)

    $('#attr12').val(wFinal)
    $('#attr13').val(hFinal)

    if (fixedValue.toLowerCase().trim() == "true") {
        $('.el-height').attr('disabled', true)
        $('.el-width').attr('disabled', true)

        $(GLOBAL_COMPONENT_ID).css('height', newW)
        $(GLOBAL_COMPONENT_ID).css('width', newW)
    }

    var dataJsonD = JSON.parse($(GLOBAL_COMPONENT_ID).attr("data"))
    var ok = false
    dataJsonD.forEach(d => {
        if (d.el.toLowerCase() == "width") {
            d.value = wFinal
            ok = true
        }
    })
    if (!ok) {
        dataJsonD.push({
            id: dataJsonD[(dataJsonD.length - 1)].id + 1,
            el: "width",
            type: "NUMBER",
            value: wFinal
        })
    }
    ok = false
    dataJsonD.forEach(d => {
        if (d.el.toLowerCase() == "height") {
            d.value = hFinal
            ok = true
        }
    })
    if (!ok) {
        dataJsonD.push({
            id: dataJsonD[(dataJsonD.length - 1)].id + 1,
            el: "height",
            type: "NUMBER",
            value: hFinal
        })
    }

    console.log(dataJsonD)
    $(GLOBAL_COMPONENT_ID).attr("data", JSON.stringify(dataJsonD))

    refreshMarkLines(GLOBAL_COMPONENT_ID)
}

$(document).on('click', 'x-alinhamento-body>x-button[pull-left]', function() {
    var left = 6000
    $('.border_live').each(function(i, button) {
        if (parseInt($(button).parent().css('left')) < parseInt(left)) {
            left = $(button).parent().css('left')
        }

        console.log("XXXX")
        console.log(left)
        console.log($(button).parent().css('left'))
        console.log("XXXX")
    })

    console.log("ESCOLHIDO:")
    console.log(left)

    $('.border_live').parent().animate({ 'left': left })
    newLeft($('.border_live').parent().attr('id'), left)

    $('x-line-x').css('left', '0px')
    $('x-line-x').css('top', $('.border_live').parent().css('top'))
    $('x-line-y').css('left', left)
    $('x-line-y').css('top', '0px')

})



$(document).on('click', 'x-alinhamento-body>x-button[pull-top]', function() {
    var top = 6000
    $('.border_live').each(function(i, button) {
        if (parseInt($(button).parent().css('top')) < parseInt(top)) {
            top = $(button).parent().css('top')
        }

        console.log("XXXX")
        console.log(top)
        console.log($(button).parent().css('top'))
        console.log("XXXX")
    })

    console.log("ESCOLHIDO:")
    console.log(top)

    $('.border_live').parent().animate({ 'top': top })
    newTop($('.border_live').parent().attr('id'), top)

    $('x-line-x').css('left', '0px')
    $('x-line-x').css('top', top)
    $('x-line-y').css('left', $('.border_live').parent().css('left'))
    $('x-line-y').css('top', '0px')

})


$(document).on('click', 'x-alinhamento-body>x-button[equals-w]', function() {
    //firtsSelectedItem
    var w = $(firtsSelectedItem).css('width')
    $('.border_live').parent().animate({ 'width': w })
    newSizeWidtht($('.border_live').parent().attr('id'), w)
})

$(document).on('click', 'x-alinhamento-body>x-button[equals-h]', function() {
    var h = $(firtsSelectedItem).css('height')
    $('.border_live').parent().animate({ 'height': h })
    newSizeHeight($('.border_live').parent().attr('id'), h)
})

$(document).on('click', 'x-alinhamento-body>x-button[pull-top]', function() {
    var top = 6000
    $('.border_live').each(function(i, button) {
        if (parseInt($(button).parent().css('top')) < parseInt(top)) {
            top = $(button).parent().css('top')
        }

        console.log("XXXX")
        console.log(top)
        console.log($(button).parent().css('top'))
        console.log("XXXX")
    })

    console.log("ESCOLHIDO:")
    console.log(top)

    $('.border_live').parent().animate({ 'top': top })
    newTop($('.border_live').parent().attr('id'), top)

    $('x-line-x').css('left', '0px')
    $('x-line-x').css('top', top)
    $('x-line-y').css('left', $('.border_live').parent().css('left'))
    $('x-line-y').css('top', '0px')

})



$(document).on('click', 'x-alinhamento-body>x-button[pull-right]', function() {
    var left = -6000
    $('.border_live').each(function(i, button) {
        if (parseInt($(button).parent().css('left')) > parseInt(left)) {
            left = $(button).parent().css('left')
        }

        console.log("XXXX")
        console.log(left)
        console.log($(button).parent().css('left'))
        console.log("XXXX")
    })

    console.log("ESCOLHIDO:")
    console.log(left)

    $('.border_live').parent().animate({ 'left': left })
    newLeft($('.border_live').parent().attr('id'), left)

    $('x-line-x').css('left', '0px')
    $('x-line-x').css('top', $('.border_live').parent().css('top'))
    $('x-line-y').css('left', left)
    $('x-line-y').css('top', '0px')
})





function saveButtonToNewDirection() {

    var xMove = parseInt($(GLOBAL_COMPONENT_ID).css('left')) //+ parseInt($(GLOBAL_COMPONENT_ID).css('width'))
    var yMove = parseInt($(GLOBAL_COMPONENT_ID).css('top')) //+ parseInt($(GLOBAL_COMPONENT_ID).css('height'))

    var y100 = parseInt($('x-body').css('height')) / 100
    var x100 = parseInt($('x-body').css('width')) / 100

    var yFinal = Math.round(yMove / y100)
    var xFinal = Math.round(xMove / x100)


    $('#attr31').val(xFinal)
    $('#attr30').val(yFinal)

    console.log("LEFT: " + xFinal)
    console.log("TOP: " + yFinal)



    var dataJsonD = JSON.parse($(GLOBAL_COMPONENT_ID).attr("data"))
    var ok = false
    dataJsonD.forEach(d => {
        if (d.el.toLowerCase() == "left") {
            d.value = xFinal
            ok = true
        }
    })
    if (!ok) {
        dataJsonD.push({
            id: dataJsonD[(dataJsonD.length - 1)].id + 1,
            el: "left",
            type: "NUMBER",
            value: xFinal
        })
    }
    ok = false
    dataJsonD.forEach(d => {
        if (d.el.toLowerCase() == "top") {
            d.value = yFinal
            ok = true
        }
    })
    if (!ok) {
        dataJsonD.push({
            id: dataJsonD[(dataJsonD.length - 1)].id + 1,
            el: "top",
            type: "NUMBER",
            value: yFinal
        })
    }

    console.log(dataJsonD)
    $(GLOBAL_COMPONENT_ID).attr("data", JSON.stringify(dataJsonD))
}

borderLiveEditableComponentMode = false

$(document).on('click', 'x-input[xname="SRC"]', function(e) {
    var top = e.pageY;
    var left = e.pageX;
    var parentId = $(this).attr('id')
    $('#menu-file-select').attr("data-id", $(this).attr('id'))

    $('#menu-file-select').attr('style',
            'top:' + top + 'px; right:0px; display:block;'
        )
        // $('#menu-file-select').find('x-input').focus()

    $('#menu-file-select').find('x-menuitem').remove()
    getFiles().forEach(element => {
        var item = '<x-menuitem  data-src="' + element.url + '"  data-parent="' + parentId + '" data-id="' + element.id + '"  data-alias="' + element.alias + '"><img src="' + element.url + '">' +
            '   <x-label>' + element.alias + "-" + element.id + '</x-label>' +
            '   </x-menuitem> '
        $('#menu-file-select').append(item)
    })
    var item = '<x-menuitem data-parent="' + parentId + '" data-id="null"  data-alias="null">' +
        '   <x-label style=" text-align: center;width: 100%;">REMOVER</x-label>' +
        '   </x-menuitem> '
    $('#menu-file-select').append(item)
})

$(document).on('keydown', 'x-input[xname="SRC"]', function(e) {


})

$(document).on('keydown', function(e) {
    if (cntrlIsPressed) {
        var top = $(GLOBAL_COMPONENT_ID).css('top')
        var left = $(GLOBAL_COMPONENT_ID).css('left')
        if ($('.border_live').length == 1) {
            if (e.keyCode == 37) { // left
                $('.border_live').parent().css('left', (parseInt($('.border_live').parent().css('left')) - 1) + "px")
                newLeft(GLOBAL_COMPONENT_ID, left)

            } else if (e.keyCode == 39) { // right
                $('.border_live').parent().css('left', (parseInt($('.border_live').parent().css('left')) + 1) + "px")
                newLeft(GLOBAL_COMPONENT_ID, left)

            } else if (e.keyCode == 38) { // up
                $('.border_live').parent().css('top', (parseInt($('.border_live').parent().css('top')) - 1) + "px")
                newTop(GLOBAL_COMPONENT_ID, top)

            } else if (e.keyCode == 40) { // down
                $('.border_live').parent().css('top', (parseInt($('.border_live').parent().css('top')) + 1) + "px")
                newTop(GLOBAL_COMPONENT_ID, top)

            }
            refreshMarkLines($('.border_live').parent().attr('id'))
        }
    }
})

//$('x-line-y>span').css('top', '0px')

function updateBadgeHeight(value) {
    $('x-line-y>span').css('display', 'block')
    var percentOne = parseInt($('x-body').css('height')) / 100
    var value2 = parseInt(value) / percentOne
    $('x-line-y>span').html("Y: " + Math.round(value2) + "%")
}

function updateBadgeWidtht(value) {
    $('x-line-x>span').css('display', 'block')
    var percentOne = parseInt($('x-body').css('width')) / 100
    var value2 = parseInt(value) / percentOne
    $('x-line-x>span').html("X: " + Math.round(value2) + "%")
}

function refreshMarkLines(id) {
    var w = $("#" + id.replace("#", "")).css('left')
    var h = $("#" + id.replace("#", "")).css('top')
    updateBadgeWidtht(w)
    updateBadgeHeight(h)
}

function newLeft(id, value) {
    console.log(value)
    var percentOne = parseInt($('x-body').css('width')) / 100
    var value2 = parseInt(value) / percentOne
    $('#attr31').val(Math.round(value2))
    updateData("#" + id.replace("#", ""), "left", Math.round(value2))
}

function newTop(id, value) {
    console.log(value)
    var percentOne = parseInt($('x-body').css('height')) / 100
    var value2 = parseInt(value) / percentOne
    $('#attr30').val(Math.round(value2))
    updateData("#" + id.replace("#", ""), "top", Math.round(value2))
}

function newSizeHeight(id, value) {
    console.log(value)
    var percentOne = parseInt($('x-body').css('height')) / 100
    var value2 = parseInt(value) / percentOne
    $('#attr13').val(Math.round(value2))
    updateData("#" + id.replace("#", ""), "height", Math.round(value2))
}

function newSizeWidtht(id, value) {
    console.log(value)
    var percentOne = parseInt($('x-body').css('width')) / 100
    var value2 = parseInt(value) / percentOne
    $('#attr12').val(Math.round(value2))
    updateData("#" + id.replace("#", ""), "width", Math.round(value2))
}

function getAttributByEl(itemArray, itemEl) {
    var newArr = itemArray.filter(function(item) {
        return item.el === itemEl;
    })
    return newArr[0];
}

function hideAttributes() {
    $('.sidebar-R ').animate({
        width: '0px'
    }, 100)
    $('x-events').animate({
        right: '-200px'
    }, 100)

    $('x-button[goevents]').css('opacity', '0')

    $('x-codetabs').css('display', 'none')
}

function applyStyles() {
    const divv = document.querySelectorAll('x-body>x-button[componentcreated]');
    divv.forEach(el => {
        if (el != undefined) {

            var item = JSON.parse($(el).attr('data'))

            console.log(item)

            var id = $(el).attr('id')
            var name = getAttributByEl(item, 'name').value
            var text = getAttributByEl(item, 'text').value
            var textSize = getAttributByEl(item, 'text-size').value
            var textColor = getAttributByEl(item, 'color').value
            var fontFamily = getAttributByEl(item, 'font-family').value
            var backgroundColor = getAttributByEl(item, 'background-color').value
            var fixed = getAttributByEl(item, 'fixed')
            if (fixed != undefined && fixed != null) {
                fixedValue = fixed.value
            } else {
                fixedValue = "false"
            }

            $(el).attr('create-' + name, '')

            var background = getAttributByEl(item, 'background').value

            var backgroundSize = getAttributByEl(item, 'background-size').value
            var float = getAttributByEl(item, 'float').value

            var spacesW = getAttributByEl(item, "width").value
            var spacesH = getAttributByEl(item, "height").value

            var X = 30
            var Y = 6
            try {
                X = getAttributByEl(item, "left").value
                Y = getAttributByEl(item, "top").value
            } catch (e) {
                X = 30
                Y = 6
            }

            var marginLeft = getAttributByEl(item, 'margin-left').value
            var marginTop = getAttributByEl(item, 'margin-top').value
            var marginRight = getAttributByEl(item, 'margin-right').value
            var marginBottom = getAttributByEl(item, 'margin-bottom').value
            var textAlign = getAttributByEl(item, 'text-align').value
            var borderRadius = getAttributByEl(item, 'border-radius').value
            var borderColor = getAttributByEl(item, 'border-color').value
            var borderSize = getAttributByEl(item, 'border-width').value
            var borderStyle = getAttributByEl(item, 'border-style').value


            var element = $("#" + id)

            element.text(text)

            var y100 = parseInt($('x-body').css('height')) / 100
            var x100 = parseInt($('x-body').css('width')) / 100

            var xValue = Math.round(x100 * parseInt(X))
            var yValue = Math.round(y100 * parseInt(Y))


            var height = Math.round(y100 * parseInt(spacesH))
            var width = Math.round(x100 * parseInt(spacesW))

            if (fixedValue.toLowerCase().trim() == "true") {
                $('.el-width').attr('disabled', true)
                $('.el-height').attr('disabled', true)
                height = width
                width = width
            }

            console.log("_________________")
            console.log("_________________")
            console.log("_________________")
            console.log(getAttributByEl(item, 'z-index'))
            console.log("_________________")
            console.log("_________________")
            console.log("_________________")

            if (getAttributByEl(item, 'z-index') != undefined) {
                element.css("z-index", getAttributByEl(item, 'z-index').value)
            }

            element.css("border-radius", borderRadius + "px")
            element.css("border-color", borderColor)
            element.css("border-width", borderSize)
            element.css("border-style", borderStyle)
            element.css("left", xValue)
            element.css("top", yValue)
                // element.css("margin-top", marginTop + "px")
                // element.css("margin-right", marginRight + "px")
                // element.css("margin-bottom", marginBottom + "px")
                // element.css("margin-left", marginLeft + "px")
            element.css("text-align", textAlign)
            element.css("font-size", textSize + "px")

            element.css("width", width + "px")
            element.css("height", height + "px")

            element.css("color", textColor)
            if (background != null && background != 'null' && background != "?" && background.indexOf("{{") == -1) {
                element.css("background", "url(" + background + ")")
                element.css("background-repeat", 'no-repeat')
                element.css("background-position", 'center center')
                element.css("background-size", backgroundSize)
            }

            element.css("background-color", hexToRgbA(backgroundColor))

            console.log("++++++")
            console.log(backgroundColor)
            console.log("++++++")
            if (background.indexOf("{{") > -1) {
                element.css("background", "rgba(33, 150, 243, 0.28)")
                element.css("color", "rgba(33, 150, 243, 0.7)")
                element.css("background-color", "rgba(33, 150, 243, 0.28)")
                element.css("border", "1px solid #2196f336")
                element.text(background)
            }


            if ($(element).css('background').indexOf('url(') != -1 && name.toLowerCase().indexOf('lottie') != -1) {
                var url = $(element).css('background').split('url(')[1].split(')')[0].replace('"', '').replace('"', '')
                element.text(" ")
                var lottieFile = '<lottie-player component ' +
                    ' src="' + url + '"  background="transparent"  speed="1"  style="width: 100%; height: 100%;"  loop  autoplay >' +
                    '</lottie-player>'

                $(element).append(lottieFile)
            }

            $(el).addClass('component-is-' + name)

            if (name.toLowerCase().trim() == "json") {
                $(element).html("")
                $(element).append('<i class="fas fa-database" aria-hidden="true"></i>')
                $(element).append('<p style=" background: black !important;   padding: 0px !important;' +
                    '  margin: 0px !important;  margin-left: 8px !important;">' + id + '</p>')

            }


            // if (float != null && float != 'null' && float != "?") {
            //   if (float.toString().toUpperCase() == "CENTER") {
            //     var x = $('x-body').width() / 2
            //     var xx = x - (width / 2)
            //     element.css('margin-left', xx + "px")
            //   } else {
            //     element.css("float", float)
            //   }
            // } 

        }
        isCardRenderer()
    })

}


function isCardRenderer() {
    var homeItem = getHomeData().filter(function(item) {
        return item.id === parseInt($('x-menuitem[container].x-menu-selected').attr('data-id'))
    })

    console.log(homeItem)

    if (homeItem.length > 0 && homeItem[0].isCard != null && homeItem[0].isCard) {
        $('x-parent-box').addClass('iscard')
        $('x-parent-box').attr('iscard', true)
        console.log("OKOKOKOKOKOKOKOKOK")

        var cardSize = homeItem[0].cardSize

        var w = cardSize.split("x")[0] + "% "
        var h = cardSize.split("x")[1] + "% "

        //   $('x-parent-box').attr('style',
        //       'height: ' + h + '!important; max-height: ' + h + '!important; min-height: ' + h + '!important;' +
        //     'width: ' + w + ' !important; max-width: ' + w + '!important; min-width: ' + w + '!important;')
        var css = 'height: ' + h + '; max-height: ' + h + '; min-height: ' + h + ';' +
            'width: ' + w + '; max-width: ' + w + '; min-width: ' + w + ';'

        $('#cardConfigs').remove()

        var style = document.createElement('style');
        style.type = 'text/css';
        style.id = "cardConfigs"
        style.innerHTML = 'x-parent-box[iscard]>x-body { ' + css + ' }';
        document.getElementsByTagName('head')[0].appendChild(style);

    }
}
$(document).on('click', '.sidebar-R>div>.expand_button', function() {
    hideAttributes()
})

$(document).on('mouseenter', '#containers-rocket-data>x-menuitem', function() {
    $('span[delrocket]').remove() //
    var divDelete = "<span delrocket data-id='" + $(this).attr('data-id') + "'  data-text='" + $(this).text() + "'><i class='fas fa-trash-alt'></span>";
    $(this).append(divDelete)
})

$(document).on('mouseleave', '#containers-rocket-data>x-menuitem', function() {
    $('span[delrocket]').remove()
})

$(document).on('click', 'span[delrocket]', function(e) {

    console.log("#containers-rocket-data>x-menuitem[data-id='" + $(this).attr('data-id') + "']")

    if (confirm("Deletar " + $(this).attr('data-text') + " ?")) {
        request('delete', '/layouts/' + parseInt($(this).attr('data-id')), {}, function(status, data) {
            alerta("Sucesso! View deletada com  sucesso!")
            $("#containers-rocket-data>x-menuitem[data-id='" + $(this).attr('data-id') + "']").remove()

            $('.expand_allbutton[target="#CONTAINERS-rocket-data"]').click()

        })
    }

    e.preventDefault();
    return false;


})


var viewEditando = null

function exitProject(el) {

    alert($(el).parent().attr("data-id"));

    console.log($(el).parent().parent());

}

function getNumber(str) {
    return str.match(/\d+/)[0]
}

function recreate(item, size, callback) {
    if ($("#" + item.toLowerCase() + size).length > 0) {
        console.log("SSSSSSSS" + size)
        recreate(item, size + 1)
    }
    callback(size)
}


$(document).on('click', 'span[doctab-close]', function(e) {
    $('#tab' + $(this).attr('data-id')).remove()
    $('x-body').html("")
    $('x-parent-box').fadeOut(100)
    e.preventDefault
    return false
})


$(document).on('click', 'x-button[create-lottie]', function(e) {

    1217
})



function createObject(object, dock) {
    var data = getAttribs()
    var item = $(object).attr("data-type")

    var maior = 0
    $('x-body>x-button[componentcreated]').each(function(i, elemento) {
        var regex = /\d+/g;

        console.log(elemento)

        var string = $(elemento).attr('id');
        var matches = string.match(regex);
        if (parseInt(matches) > maior) {
            maior = parseInt(matches)
        }
    })
    var size = (parseInt(maior) * 1) + 1

    console.log(maior)


    data[0].value = item.toString().toLowerCase() + size
    data[1].value = item.toString().toUpperCase()
    data[2].value = item.toString().toLowerCase()

    if (item.toUpperCase() == "LABEL") {

        data[4].value = "#141414"
        data[6].value = "#FFFFFF"
        data[10].value = 33
        data[11].value = 6
    } else if (item.toUpperCase() == "INPUT") {
        data[4].value = "#141414"
        data[6].value = "#FFFFFF"
        data[10].value = 2
        data[11].value = 1

    } else if (item.toUpperCase() == "IMAGEVIEW") {
        data[4].value = "#141414"
        data[6].value = "#FFFFFF"
        data[10].value = 3
        data[11].value = 3

    } else if (item.toUpperCase() == "LIST") {
        data[4].value = "#141414"
        data[6].value = "#FFFFFF"
        data[10].value = 100
        data[11].value = 35
    } else if (item.toUpperCase() == "DOCK-VERTICAL") {
        data[4].value = "#141414"
        data[6].value = "#FFFFFF"
        data[10].value = 100
        data[11].value = 35
    } else if (item.toUpperCase() == "DOCK-HORIZONTAL") {
        data[4].value = "#141414"
        data[6].value = "#FFFFFF"
        data[10].value = 100
        data[11].value = 35
    } else {
        data[4].value = "#141414"
        data[6].value = "#FFFFFF"
        data[10].value = 33
        data[11].value = 6
    }
    elementGet(JSON.stringify(data), item, item.toString().toLowerCase() + size)
    rendererComponent($('#' + item.toString().toLowerCase() + size), true)
}

function elementGet(data, item, iid) {
    var element = ' '
    console.log(data)

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
    } else if (item.toUpperCase() == "LOTTIE") {
        element = element + "<x-button lottie componentCreated data='" + data + "' id='" + iid + "'> Lottie  </x-button>"
    } else {
        element = element + "<x-button componentCreated data='" + data + "' id='" + iid + "'> <x-label>Button</x-label> </x-button>"
    }
    $('x-body').append(element)
}

function rgb2hex(orig) {
    console.log(orig)
    var rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
    console.log(rgb)
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : orig;
}

$(document).on('change', '.box-values, .box-values>main>x-input', function() {
    console.log(value)

    var value = ""
    if ($(this).hasClass('type-color')) {
        value = rgba2hex($(this).val())
    } else if ($(this).hasClass('type-option')) {
        value = $(this).find('x-label').val()
    } else {
        value = $(this).val()
    }
    console.log(value)

    console.log(GLOBAL_COMPONENT_ID)

    var newData = JSON.parse($(GLOBAL_COMPONENT_ID).attr('data'))
    if ($(this).hasClass('el-top')) {
        newData.forEach(element => {
            if (element.el == "top") {
                element.value = value
            }
        });
    } else if ($(this).hasClass('el-left')) {
        newData.forEach(element => {
            if (element.el == "left") {
                element.value = value
            }
        });
    } else if ($(this).hasClass('el-z-index')) {

        var okZ = false
        newData.forEach(element => {
            if (element.el == "z-index") {
                element.value = value
                okZ = true
            }
        });

        if (!okZ) {
            newData.push({
                id: newData[(newData.length - 1)].id + 1,
                el: "z-index",
                type: "NUMBER",
                value: value
            })
        }
        console.log("ZZZZZZZZZZZZZZZZ: " + okZ + " " + value)
    } else if ($(this).hasClass('type-id')) {
        updateName(GLOBAL_COMPONENT_ID.replace("#", ""), value)
    } else {
        newData.forEach(element => {
            if (element.id == $(this).parent().attr('data-id')) {
                console.log(element.id)
                element.value = value
            }
        });
    }

    console.log($(this).parent())
    console.log(newData)

    $(GLOBAL_COMPONENT_ID).attr('data', JSON.stringify(newData))
    console.log('---------------------------')
    console.log(value)
    console.log('---------------------------')

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

        var newData = JSON.parse($(GLOBAL_COMPONENT_ID).attr("data"))
        var ok = false
        newData.forEach(d => {
            if (d.el.toLowerCase() == "background") {
                d.value = $(this).attr('data-src')
                ok = true
            }
        })
        if (!ok) {
            newData.push({
                id: data[(data.length - 1)].id + 1,
                el: "background",
                type: "SRC",
                value: $(this).attr('data-src')
            })
        }

        console.log(newData);
        $(GLOBAL_COMPONENT_ID).attr('data', JSON.stringify(newData))
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
    var nok = true

    newData.forEach(el => {
        if (el.id == id) {
            el.value = $(element).find('x-label').text()
            nok = false
        }
    });

    if (nok && id == 35) {
        newData.push({
            id: id,
            el: "orientation",
            type: "OPTION",
            value: $(element).find('x-label').text()
        })
    }



    if (nok && id == 36) {
        newData.push({
            id: id,
            el: "fixed",
            type: "OPTION",
            value: $(element).find('x-label').text()
        })
    }

    $(GLOBAL_COMPONENT_ID).attr('data', JSON.stringify(newData))

    console.log('---------------------------')
    console.log($(element).find('x-label').text())
    console.log('---------------------------')
    applyStyles()
    $('#attr' + id).val($(element).find('x-label').text())

}

function deleteButton(button) {

    var continerId = $('x-menuitem[container].x-menu-selected').attr('data-id')
    requestGet('get', '/components/?containerId=' + continerId + '&name=' + button.toString().trim() + "&_sort=index:ASC", function(status, data) {
        console.log(data)
        if (status) {
            requestGet('delete', '/components/' + data[0].id, function(status, data) {
                console.log(data)
                if (status) {
                    alerta(button.toString().toLowerCase() + " deletado com sucesso!")
                } else {
                    alerta("OOps, algo deu errado, tente novamente mais tarde...", true)
                }
            })
        } else {
            alerta("OOps, algo deu errado, tente novamente mais tarde...", true)
        }
    })
}

function rendererComponent(element, saveSQL) {
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
    if (button != undefined && $(button).attr('id').toString().length > 2) {
        var continerId = $('x-menuitem[container].x-menu-selected').attr('data-id')
        var index = $('x-button[componentcreated]').length
        console.log(button)
        var uid = $(button).attr('id')
        button.attr('data-uid', uid)

        var dataXXX = {
            "index": index,
            "name": $(button).attr('id'),
            "containerId": continerId,
            "params": JSON.parse($(button).attr('data')),
            "uid": uid
        }

        request('post', '/components', dataXXX, function(status, data) {
            if (status) {
                var item = "<x-menuitem data='#' estruct class='x-estruct' data-id='" + uid + "'>" +
                    "  <x-icon name='layers'> </x-icon> " +
                    "  <x-label> " + uid + " </x-label> " +
                    "  </x-menuitem>"
                $('.sidebar-internal').find('.body').find('structs-body').append(item)
            } else {
                alerta("Erro ao tentar criar um componente...", true)
            }
        })
    }
}

function setAttribSelected(value, id) {
    $('#context-attribute').removeClass('context-menu-show')
    if ($('.border_live').length > 1) {
        $('.border_live').each(function(i, button) {
            updateAttribSelected(value, id, $(button).attr("id"))
        })
    } else {
        updateAttribSelected(value, id, GLOBAL_COMPONENT_ID)
    }
}

function updateAttribSelected(value, id, componentId) {
    var idC = "#" + componentId.replace("#", "")
    var newData = JSON.parse($(idC).attr('data'))
    newData.forEach(el => {
        if (el.id == id) {
            el.value = value
        }
    });

    $(GLOBAL_COMPONENT_ID).attr('data', JSON.stringify(newData))


    applyStyles()
}

$(document).on('click', '#btnCancelFase3', function() {
    $('div[steps]>.step-selected').removeClass('step-selected')
    $('#btnSaveFase3').attr('disabled', true)
    $('div[step1]').addClass('step-selected')
    $('x-layout-fase1>input').val("")
    $('x-layout-fase2>input').val("")
    $('x-layout-fase1').fadeIn()
    $('x-layout-fase2').fadeOut()
    $('x-layout-body').fadeOut()
    $('x-layout-fase1').attr('style', 'opacity: 1')
    $('x-layout-fase2').attr('style', '')
    $('x-layout-body').attr('style', '')
    $('x-layout-header>x-close').click()
    $('x-layout-fase1').attr('style', 'opacity: 1')
    $('div[popnotff]').find('i').remove()
    $('create-view[default]>div[field]').removeAttr('field')
})


$(document).on('click', '#btnFase2OK', function() {
    var route = $('x-layout-fase2>input').val().replace("@", "")
    let containerJson = JSON.parse(getRocketData()).data.filter((d) => {
        return d.route.trim().toLowerCase() == route.trim().toLowerCase()
    })
    if (containerJson.length == 1) {

        if ($('x-layout-fase2>input').val().length > 2) {

            populateContextViewCreattor(route)

            $('div[steps]>.step-selected').removeClass('step-selected')
            $('div[step3]').addClass('step-selected')

            $('x-layout-fase2').css('height', '100%')

            $('x-layout-fase2').fadeOut(50)
            $('x-layout-fase2').animate({
                height: '0px',
                display: "none"
            })
            $('x-layout-fase2').fadeOut()
            $('x-layout-body').fadeIn()
            $('x-layout-body').css('display', 'flex')
            $('#btnSaveFase3').removeAttr('disabled')
        } else {
            alerta("Selecione um serviço!", true)
        }
    } else {
        alerta("Verifique o nome do serviço, e tente novamente...", true)

    }
})

function populateContextViewCreattor(route) {
    rocketNetwork('get', '/~/@' + route, {}, function(status, data) {
        $('x-layout-fase3-contextmenu').html("")
        console.log(data)
        var colunasRe = []
        JSON.parse(JSON.stringify(data)).data.forEach(coluna => {
            colunasRe.push(coluna.Field)
            var menuItem = '<x-menuItem field="' + coluna.Field + '"><i style="margin-right: 10px" class="fas fa-database"></i>' + coluna.Field + '</x-menuItem>'
            $('x-layout-fase3-contextmenu').append(menuItem)
        })
        var menuItemD = '<x-menuItem class="remove" remove><i style="margin-right: 10px" class="fas fa-times"></i>REMOVER CAMPO</x-menuItem>'
        $('x-layout-fase3-contextmenu').append(menuItemD)

        var menuItemD = '<x-menuItem class="remove" clear><i style="margin-right: 10px" class="fas fa-times"></i>LIMPAR</x-menuItem>'
        $('x-layout-fase3-contextmenu').append(menuItemD)

        $('div[step3]').attr('data', JSON.stringify(colunasRe))
    })
}



$(document).on('mouseleave', 'x-layout-fase3-contextmenu', function() {
    $(this).fadeOut()
})

$(document).on('click', '#btnFase1OK', function() {
    if ($('x-layout-fase1>input').val().length > 2) {
        $('div[steps]>.step-selected').removeClass('step-selected')
        $('div[step2]').addClass('step-selected')

        $('x-layout-fase1').fadeOut(50)
        $('x-layout-fase1').animate({
            height: '0px',
            display: "none"
        })
        $('x-layout-fase2').fadeIn()
    } else {
        alerta("O nome deve ter mais de 3 caracteres :)", true)
    }
})

$(document).on('click', 'x-layout-fase3-contextmenu>x-menuitem[remove]', function() {
    $('create-view>div[type="' + $('x-layout-fase3-contextmenu').attr('target') + '"]>div[popnotff]').remove()
    $('create-view>div[type="' + $('x-layout-fase3-contextmenu').attr('target') + '"]').removeAttr("field")
})

$(document).on('click', 'x-layout-fase3-contextmenu>x-menuitem[clear]', function() {
    $('create-view>div>div[popnotff]').remove()
    $('create-view>div').removeAttr("field")
})

$(document).on('click', 'x-struct-option>span[function]', function() {
    openFunctions()
})

function openFunctions() {
    $('.kotlin').val(" ")
    $('.kotlin').val(" ")
    $('.kotlin').html(" ")
    $('.hwt-content').html(" ")
    $('.hwt-backdrop>.hwt-content').html("")
    GLOBAL_CODE_HISTORICO = []

    var funcs = getAttributByEl(JSON.parse($(GLOBAL_COMPONENT_ID).attr('data')), 'functions').value

    if ($('fun-header>x-label>x-button').text().trim().length > 0) {
        $('fun-header>x-label>x-button').text("Kobit Script Editor | " + GLOBAL_COMPONENT_ID + " [" + $(GLOBAL_COMPONENT_ID).text() + "]")
    } else {
        $('fun-header>x-label>x-button').text("Kobit Script Editor | " + GLOBAL_COMPONENT_ID)
    }
    if (funcs != "null" && funcs != null && funcs.length > 7) {
        $('.kotlin').val(GLOBAL_DECRIPTO(funcs))
        $('.kotlin').val(GLOBAL_DECRIPTO(funcs))
        $('.kotlin').highlightWithinTextarea('update');
        $('textarea').highlightWithinTextarea('update');
    } else {
        $('.kotlin').val(" ")
        $('.kotlin').val(" ")
    }

}

function closeFunctions() {
    $('.kotlin').val(" ")
    $('.kotlin').val(" ")
    $('.kotlin').html(" ")
    $('.hwt-content').html(" ")
    $('.hwt-backdrop>.hwt-content').html("")
}

$(document).on('click', 'fun-header>x-button[close]', function() {
    if (parseInt($('#sidebar-bottom').css('height')) <= 50) {
        $('#sidebar-bottom').animate({
            height: '500px'
        }, 250)
        $('fun-header>x-button[close]').find('i').removeClass('fa-chevron-up')
        $('fun-header>x-button[close]').find('i').addClass('fa-chevron-down')
    } else {

        $('fun-header>x-button[close]').find('i').addClass('fa-chevron-up')
        $('fun-header>x-button[close]').find('i').removeClass('fa-chevron-down')
        $('#sidebar-bottom').animate({
            height: '30px'
        }, 250)
    }
})

$(document).on('contextmenu', 'create-view>div', function() {
    var x = event.clientX; // Get the horizontal coordinate
    var y = event.clientY;
    $('x-layout-fase3-contextmenu').attr('style',
        'left:' + x + 'px; top:' + y + 'px;'
    )
    $('x-layout-fase3-contextmenu').fadeIn()
    $('x-layout-fase3-contextmenu').attr("target", $(this).attr('type'))
})

$(document).on('click', 'x-layout-fase3-contextmenu>x-menuitem', function() {
    if (!$(this).hasClass("remove")) {
        addDataBaseIconPoint($("x-layout-fase3-contextmenu").attr("target"), $(this).attr("field"))
    }
})

function addDataBaseIconPoint(target, field) {
    $('create-view>div[' + target + ']').attr("field", field)
    $('x-layout-fase3-contextmenu').fadeOut()
    var dbNotifyIcon = '<div popnotff><i class="fas fa-database icon-db-notify"></i>' + field + '</div>'
    $('create-view>div[' + target + ']>div[popnotff]').remove()
    $('create-view>div[' + target + ']').append(dbNotifyIcon)
}

function getAttributes($node) {
    $.each($node[0].attributes, function(index, attribute) {
        console.log(attribute.name + ':' + attribute.value);
    });
}

$(document).on('click', '[x-menu-database]', function() {
    $('x-menu-vs').find('i').removeClass('x-menu-vs-i-active')
    $('x-menu-vs').find('img').removeClass('x-menu-vs-i-active')
    $('x-container-database').fadeIn(100)
    $('x-container-database').css('display', 'flex')

    $(this).addClass('x-menu-vs-i-active')
    $('x-container-database>x-card>x-panel>x-card[rocket]').remove()
    rendererServiceCards($('x-container-database>x-card>x-panel'))
        // rocketNetwork('get', '/rocket/routes', {}, function(status, data) {
        //   console.log(data)
        //   if (status) {
        //
        //     data.data.forEach(element => {
        //       var ball = "style = 'color: #c0c0c059 !important;'"
        //
        //       if (parseInt(element.registers) > 0) {
        //         ball = ""
        //       }
        //
        //       var card = ' <x-card rocket data-route="@' + element.route + '">' +
        //         '  <x-label> @' + element.route + '</x-label>' +
        //         '  <p ' + ball + '>' + element.registers + ' registros</p>'
        //       $('x-container-database>x-card>x-panel').append(card)
        //     })
        //   } else {
        //     alerta("Token inválido! refaça o login para acessar o RocketData", true)
        //   }
        // })

})


function rendererServiceCards(target) {
    rocketNetwork('get', '/rocket/routes', {}, function(status, data) {
        setRocketData(JSON.stringify(data))
        console.log(data)
        if (status) {
            data.data.forEach(element => {
                var ball = "style = 'color: #c0c0c059 !important;'"

                if (parseInt(element.registers) > 0) {
                    ball = ""
                }

                console.log(card);
                var card = ' <x-card rocket data-route="@' + element.route + '">' +
                    '  <x-label> @' + element.route + '</x-label>' +
                    '  <p ' + ball + '>' + element.registers + ' registros</p>'
                target.append(card)
            })
        } else {
            alerta("Token inválido! refaça o login para acessar o RocketData", true)
        }
    })
}

function rendererServiceCardHome(callback) {
    var target = $('#containers-rocket-data')
    $('#containers-rocket-data>x-menuitem[rocket]').remove()
    var homeId = $('x-containers-body>x-menuitem[container].x-menu-selected').attr('data-id')
    requestGet('get', '/layouts/?email=' + getUserData().user.email, function(status, data) {
        setLayouts(data)
        console.log(data)
        if (status) {
            data.forEach(element => {

                var card = ' <x-menuitem rocket data-id="' + element.id + '">' +
                    '<i class="fas fa-pencil-ruler"></i>' +
                    '  <x-label> ' + element.name + '</x-label>' +
                    '  <label> ' + element.route + '</label>' +
                    '</x-menuitem>'
                target.append(card)

            })
            callback()
        } else {
            alerta("Token inválido! refaça o login para acessar o RocketData", true)
        }
    })
}

$(document).on('click', '#btnNewRocket', function() {
    var nome = $('sub-header>x-input').val()
    if (nome.length > 2) {
        rocketNetwork('post', '/+' + nome, {}, function(status, data) {
            console.log(data)
            if (status) {
                $('.rocket').animate({
                    height: '0px',
                    'opacity': '0'
                })
                $('[x-menu-database]').click()

                rocketNetwork('get', '/rocket/routes', {}, function(status, data) {
                    setRocketData(JSON.stringify(data))
                })
            } else {
                alerta("Token inválido! refaça o login para acessar o RocketData", true)
            }
        })
    } else {
        alerta("O nome deve conter no minimo 3 letras", true)

    }
})


$(document).on('click', '#addDataBase', function() {
    $('#btnCancelFase3').click()
    $("#btnSaveFase3").removeClass("saveMode")
    $("#btnSaveFase3").text("CONCLUIR")
    $('x-layouts-view').fadeIn(100)
    $('create-view[default]>div>div[popnotff]').remove()
})
$(document).on('click', 'x-layout-header>x-close', function() {
    $('x-layouts-view').fadeOut(100)
})

$(document).on('click', 'x-container-database>x-card>header >x-button', function() {
    $('x-container-database').fadeOut(200)
    $('x-menu-vs').find('i').removeClass('x-menu-vs-i-active')
    $('x-menu-vs').find('img').removeClass('x-menu-vs-i-active')
})

$(document).on('click', '#addContainer', function() {
    $('x-container-dialog').css('display', 'flex')
    $('x-container-dialog').fadeIn()
})

$(document).on('click', 'x-container-dialog>x-card>header>x-button[close]', function() {
    $('x-container-dialog').fadeOut(200)
})

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        alerta('Copiado para área de transferência');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

$(document).on('click', 'x-access-key-body>.close', function() {
    $('x-access-key').fadeOut(200)
})

$(document).on('click', 'x-menuitem.secrets-key', function() {

    if (JSON.parse(getKeyData()).success) {
        var data = JSON.parse(getKeyData()).data[0]
        $('x-button[apikeylabel]').attr('data-apikey', data.apiKey)
        $('x-button[apikeylabel]').text(data.apiKey)
        $('x-button[secretlabel]').attr('data-secret', data.secret)
        $('x-button[secretlabel]').text(data.secret)
        $('x-access-key').fadeIn(200)
    } else {
        alerta("Estamos com dificuldades de acessar suas Keys, por favor refaça o login...", true)
    }


})

$(document).on("click", "#button-test-transaction", function() {
    testAdapter()
})

$(document).on("click", "x-json-pre>.string, x-json-pre>.number, x-json-pre>.boolean", function() {
    $("x-json-pre>.string, x-json-pre>.number, x-json-pre>.boolean").removeClass("json-pre-selected")
        // $("x-json-pre>.string, x-json-pre>.number, x-json-pre>.boolean").removeAttr('contenteditable')

    $(this).attr('contenteditable', true)
    $(this).addClass('json-pre-selected')
})

function testAdapter() {
    if (FIRST_OPEN) {
        FIRST_OPEN = false
        alerta("Atenção, fique sempre atento aos filtros  e configurações do BODY JSON (parte de cima)")
    }
    var rota = $('x-label[select_transation]>input').val().replace("@", "")
    var body = JSON.parse($('x-json-pre').text())

    rocketNetwork("POST", '/@' + rota, body, function(status, data, timer) {
        document.querySelector('x-json-pre-result').innerHTML = "";
        $('x-json-pre-result').append(
            syntaxHighlight(JSON.stringify(data, undefined, 4))
        );
        var center = '  display: flex;  align-items: center;  justify-content: center;'
        $('x-label[time-request-testar]').html('<i class="far fa-clock" style=" ' + center + ' font-size: 11px;  margin-right: 5px;"></i>' + ' ' + timer)

    })
}

$(document).on('click', '[apikeylabel]', function(e) {
    copyTextToClipboard($(this).attr('data-apikey'))
    $(this).text($(this).attr('data-apikey'))
})

$(document).on('click', '[secretlabel]', function(e) {
    copyTextToClipboard($(this).attr('data-secret'))
    $(this).text($(this).attr('data-secret'))
})

function applyJsonPreForAdapter() {
    var filter = 'id is not null'
    var include = '*'
    var order = 'id'
    var group = ''
    var join = ''

    var pagination = {}
    pagination.rows = 10
    pagination.page = 1
    var bodyData = {}
    bodyData.filter = filter
    bodyData.include = include
    bodyData.order = order
    bodyData.group = group
    bodyData.join = join
    bodyData.pagination = pagination


    $('x-json-pre').html("")
    $('x-json-pre').append(
        syntaxHighlight(JSON.stringify(bodyData, undefined, 4))
    );
}

$(document).on('click', 'x-contextmenu-rocket>x-menuitem', function(e) {
    $($(this).attr('target')).val("@" + $(this).attr('data-route'))
    $('x-contextmenu-rocket').fadeOut(100)
    $('x-label[select_transation]>input').focusout()
})

$(document).on('click', ' x-card[adapter-manager]>x-contents>x-label>input', function(e) {
    $('x-contextmenu-rocket').fadeOut(100)
})

var colunaAfterShimmer = ''
$(document).on('focusout', 'x-label[select_transation]>input', function(e) {
    var lista = JSON.parse(getRocketData()).data.filter(function(item) {
        return item.route.toLowerCase().includes($('x-label[select_transation]>input').val().toLowerCase().replace("@", ""));
    });
    if (lista.length == 1) {
        $('x-contents').addClass('linear-shimmer')
        $($(this).attr('target')).val("@" + lista[0].route)
        rocketNetwork('get', '/~/@' + lista[0].route, {}, function(status, data) {
            setRocketColunas(JSON.stringify(data))
            var colunasRe = ''
            JSON.parse(JSON.stringify(data)).data.forEach(coluna => {
                colunasRe = coluna.Field + ', ' + colunasRe
            })
            colunasRe = colunasRe.trim().slice(0, -1)
            colunaAfterShimmer = colunasRe
            $('x-contents').removeClass('linear-shimmer')
            applyJsonPreForAdapter()
        })

    } else {

    }
})


$(document).on('focusout', 'x-label[select_view]>input', function(e) {
    var lista = JSON.parse(getRocketData()).data.filter(function(item) {
        console.log(item);
        console.log($('x-label[select_view]>input').val());
        return item.route.toLowerCase().includes($('x-label[select_view]>input').val().toLowerCase().replace("@", ""));
    });
    if (lista.length > 0) {
        $($(this).attr('target')).val(lista[0].name)
        $('x-label[select_transation]>input').val(lista[0].route)
    }
})


$(document).on('click', 'x-label[define_campos]>input', function(e) {
    if ($(this).hasClass('route-column-disable-input')) {
        if (confirm("Tem certeza que deseja alerar a seleção do serviço?")) {
            $('x-label[select_transation]>input').removeAttr('disabled')
            $('x-label[select_transation]>input').removeClass('route-column-disable-input')
            $('x-contents>x-label>input').val("")
        }
    }
})


$(document).on('mouseleave', 'x-label[select_transation]>input', function(e) {
    $(this).removeClass("roketTransationError")
    var lista = JSON.parse(getRocketData()).data.filter(function(item) {
        return item.route.toLowerCase().includes($('x-label[select_transation]>input').val().toLowerCase());
    });
    if (lista.length == 1) {
        //  $('x-label[select_transation]>input').removeClass("roketTransationError")
        $('x-label[select_transation]>input').val("@" + lista[0].route)
    } else {
        //  $('x-label[select_transation]>input').addClass("roketTransationError")
    }
})

$(document).on('mouseleave', 'x-label[select_view]>input', function(e) {
    var lista = JSON.parse(getRocketData()).data.filter(function(item) {
        console.log(item);
        console.log($('x-label[select_view]>input').val());
        return item.route.toLowerCase().includes($('x-label[select_view]>input').val().toLowerCase().replace("@", ""));
    });
    if (lista.length == 1) {
        //  $('x-label[select_transation]>input').removeClass("roketTransationError")
        $('x-label[select_view]>input').val(lista[0].route)
    } else {
        //  $('x-label[select_transation]>input').addClass("roketTransationError")
    }
})

$(document).on('keydown', 'x-label[select_transation]>input', function(e) {
    var lista = JSON.parse(getRocketData()).data.filter(function(item) {
        return item.route.toLowerCase().includes($('x-label[select_transation]>input').val().toLowerCase().replace("@", ""));
    });
    autocompleteRocket(e, lista, "fas fa-rocket", 'x-label[select_transation]>input')
})


$(document).on('click', 'x-contextmenu-view>x-menuitem', function(e) {
    var theName = $(this).attr('data-name')
    $($(this).attr('target')).val(theName)
    $('x-contextmenu-view').fadeOut(100)

    $('x-label[select_transation]>input').val($(this).attr('data-route'))

})

$(document).on('click', ' x-card[adapter-manager]>x-contents>x-label[select_view]>input', function(e) {
    $('x-contextmenu-view').fadeOut(100)
})

$(document).on('keydown', 'x-label[select_view]>input', function(e) {
    var lista = JSON.parse(getRocketData()).data.filter(function(item) {
        console.log(item);
        console.log($('x-label[select_view]>input').val());
        return item.route.toLowerCase().includes($('x-label[select_view]>input').val().toLowerCase().replace("@", ""));
    });

    if (getRocketData() != null && getRocketData() != undefined && JSON.parse(getRocketData()).data.length > 0) {
        autocompleteView(e, lista, "fas fa-pencil-ruler", 'x-label[select_view]>input')
    } else {
        rocketNetwork('get', '/rocket/routes', {}, function(status, data) {
            setRocketData(JSON.stringify(data))
            if (status) {

                autocompleteView(e, getRocketData(), "fas fa-pencil-ruler", 'x-label[select_view]>input')

            } else {
                alerta("Token inválido! refaça o login para acessar o RocketData", true)
            }
        })
    }

})




// .kotlin
// .kotlin
// .kotlin
// .kotlin
// .kotlin
// .kotlin


$(document).on('focusout', '.kotlin', function(e) {
    var textFinal = $(this).text()
    $(this).text(lTrim(rTrim(textFinal)))

    var novoText = ""
    $(this).text().split("}").forEach(ele => {
        if (novoText == "") {
            novoText = novoText + ele
        } else {
            novoText = "\n\n" + novoText + ele
        }
    })

    $('x-contextmenu-code').fadeOut()
})

$(document).on('change', '.kotlin', function(e) {
    $('row[fun]>pre>span').text("")
    var lines = $('.kotlin').val().split('\n');
    for (var i = 0; i < lines.length; i++) {
        $('row[fun]>pre>span').text($('row[fun]>pre>span').text() + "" + i + "\n")
    }
})

$(document).on('keyup', '.kotlin', function(e) {
    if (e.which == 32) {
        var words = $('.kotlin').val().trim().split(' ');
        var lastWord = words[words.length - 1];
        console.log(lastWord);
    }

    $('.kotlin').change()
})


$(document).on('keydown', '.kotlin', function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 9 && $('x-contextmenu-code').css("display") != "none") {
        $('x-contextmenu-code>x-menuitem:first').click()
        $('.kotlin').focus()
    }
})

$(document).on('click', '.kotlin', function(event) {

})


function RetornaDataHoraAtual() {
    var dNow = new Date();
    var localdate = dNow.getDate() + '/' + (dNow.getMonth() + 1) + '/' + dNow.getFullYear() + ' ' + dNow.getHours() + ':' + dNow.getMinutes();
    return localdate;
}



GLOBAL_CODE_HISTORICO = []
$(document).on('click', 'x-contextmenu-code>x-menuitem', function(e) {
    GLOBAL_CODE_HISTORICO.push({
        code: $('.kotlin').val(),
        timer: RetornaDataHoraAtual()
    })
    var sufix = "*----*"
    var words = $('.kotlin').val().trim().split(' ');
    var lastWord = words[words.length - 1];
    $('.kotlin').val(lastWord + sufix)


    if ($(this).attr("data-class") == "fun") {
        var core = $('.kotlin').val().split("}")
        if (core.length > 0) {
            var a = $(this).attr("data-name") + ")"

            $('.kotlin').val($('.kotlin').val().replace(lastWord + sufix, a))

        } else {
            var t = $(this).attr("data-name") + ")"
            $('.kotlin').val($('.kotlin').replace(lastWord + sufix, t))
        }

        $('.kotlin').highlightWithinTextarea('update');
        $('textarea').highlightWithinTextarea('update');

    } else {
        var core = $('.kotlin').val().split("}")
        if (core.length > 0) {
            var a = $(this).attr("data-name") + "\n\n\n}"

            $('.kotlin').val($('.kotlin').val().replace(lastWord + sufix, a))

        } else {
            var t = $(this).attr("data-name") + "\n\n\n}"
            $('.kotlin').val($('.kotlin').replace(lastWord + sufix, t))
        }

        $('.kotlin').highlightWithinTextarea('update');
        $('textarea').highlightWithinTextarea('update');
    }

    $('.kotlin').val($('.kotlin').val().replace("{{", "{"))
    $('.kotlin').val($('.kotlin').val().replace("((", "("))
    $('.kotlin').val($('.kotlin').val().replace("}}", "}"))
    $('.kotlin').val($('.kotlin').val().replace("))", ")"))
    $('.kotlin').val($('.kotlin').val().replace(";;", ";"))
    $('.kotlin').text($('.kotlin').val())

    $('x-contextmenu-code').fadeOut()
    $('.kotlin').change()
    $('.kotlin').highlightWithinTextarea('update');
    $('textarea').highlightWithinTextarea('update');

})


$(document).on('click', 'fun-historico>x-menuitem', function(e) {

})

LAST_GLOBAL = ""
$(document).on('keyup', '.kotlin', function(e) {
    var mousePostion = e
    var ignoreContext = false
    var words = $('.kotlin').val().trim().split(' ');
    var lastWord = words[words.length - 1];
    console.log(lastWord);

    if (lastWord.indexOf("{") != -1) {
        // OnClick(){
        // teste}
        lastWord = lastWord.split("}")[0].split("{")[1].trim()
    }


    if (lastWord.indexOf("}") != -1) {
        //     teste
        // }teste
        lastWord = lastWord.split("}")[1].trim()
    }


    console.log("<------->");
    console.log(lastWord);
    console.log("<------->");
    LAST_GLOBAL = lastWord
    $('.kotlin').change()
    console.log(ignoreContext);

    var eventsStrings = configCode.highlight[0].highlight
    var methodsStrings = configCode.highlight[6].highlight

    var newString = []
    console.log(lastWord)
    eventsStrings.forEach(function(item) {
        if (item.toLowerCase().includes(lastWord.toLowerCase())) {
            newString.push({
                type: 1,
                name: item,
                class: 'event',
                icon: "fas fa-code",
                charStart: "{",
                charEnd: "}",
                iconBg: "4caf504a"
            })
        }
    });

    methodsStrings.forEach(function(item) {
        if (item.toLowerCase().includes(lastWord.toLowerCase())) {
            newString.push({
                type: 2,
                name: item,
                class: 'fun',
                icon: "fas fa-arrow-right",
                charStart: "",
                charEnd: ");",
                iconBg: "#673ab75e"
            })
        }
    });


    autoCompleteCodes(newString, mousePostion, '.kotlin')

})


$(document).on('click', '#btnSaveCode', function() {
    if (parseInt($('.sidebar-R').css('width')) > 1) {

        var hashCode = GLOBAL_ENCRIPTA($('.hwt-highlights').text())
        var data = JSON.parse($(GLOBAL_COMPONENT_ID).attr("data"))
        var ok = false
        data.forEach(d => {
            if (d.el.toLowerCase() == "functions") {
                d.value = hashCode
                ok = true
            }
        })
        if (!ok) {
            data.push({
                id: data[(data.length - 1)].id + 1,
                el: "functions",
                type: "TEXT",
                value: hashCode
            })
        }

        console.log($('.hwt-highlights').text())
        $('x-box[functions]>x-input').val(hashCode)
        $(GLOBAL_COMPONENT_ID).attr("data", JSON.stringify(data))
        alerta("Salvando alterações, aguarde ...")
        updateButton()
            //closeFunctions()
    }
})



$(document).on('click', 'fun-header>x-label>x-button', function() {
    $('fun-header>x-button[close]').click();
})

function autoCompleteCodes(lista, e, targetInput) {
    var code = (e.keyCode ? e.keyCode : e.which);

    $('x-contextmenu-code').attr('style',
        'z-index:99999999; right:20px; top:80px;'
    )

    $('x-contextmenu-code').fadeIn()
    var icon = "fas fa-code"
    console.log(lista)
    $('x-contextmenu-code>x-menuitem').remove()
    lista.forEach(e => {
        var card = '  <x-menuitem data-function="false"  target="' + targetInput + '"  data-class="' + e.class + '" data-start="' + e.charStart + '" data-end="' + e.charEnd + '" data-type="' + e.type + '" data-name="' + e.name + '"><i style="background:' + e.iconBg + ' !important;" class="' + e.icon + '"></i>' + e.name + '</x-menuitem>'
        $('x-contextmenu-code').append(card)
    })
    if (lista.length > 0) {
        $('x-contextmenu-code').css('display', 'block')
    }

}


// FIM   .kotlin
// FIM   .kotlin
// FIM   .kotlin
// FIM   .kotlin
// FIM   .kotlin
// FIM   .kotlin

function autocompleteView(e, lista, icon, targetInput) {
    var code = (e.keyCode ? e.keyCode : e.which);
    $('x-contextmenu-rocket').fadeOut()
    console.log(lista)
    $('x-contextmenu-view>x-menuitem').remove()
    lista.forEach(e => {
        var card = '  <x-menuitem target="' + targetInput + '" view-id="' + e.id + '" data-route="' + e.route + '" data-name="' + e.route + '"><i class="' + icon + '"></i>' + e.route + '</x-menuitem>'
        $('x-contextmenu-view').append(card)
    })
    if (lista.length > 0) {
        $('x-contextmenu-view').css('display', 'block')
    }

    if (code == 13 || code == 9 && lista.length > 0) {
        $(targetInput).val(lista[0].route)
        $('x-contextmenu-view').fadeOut()
        $('x-label[select_view]>input').focusout()
    }
}


function autocompleteRocket(e, lista, icon, targetInput) {
    var code = (e.keyCode ? e.keyCode : e.which);

    console.log(lista)
    $('x-contextmenu-rocket>x-menuitem').remove()
    lista.forEach(e => {
        var card = '  <x-menuitem target="' + targetInput + '" data-route="' + e.route + '"><i class="' + icon + '"></i>@' + e.route + '</x-menuitem>'
        $('x-contextmenu-rocket').append(card)
    })
    if (lista.length > 0) {
        $('x-contextmenu-rocket').css('display', 'block')
    }

    if (code == 13 || code == 9 && lista.length > 0) {
        $(targetInput).val(lista[0].route)
        $('x-contextmenu-rocket').fadeOut()
        $('x-label[select_transation]>input').focusout()
    }
}

$(document).on('click', 'x-button[componentcreated]', function() {
    if (cntrlIsPressed) {

    }
})

var grid = 20

$(document).keydown(function(event) {
    if (event.which == "17") {
        grid = 0
        cntrlIsPressed = true;
    } else {
        grid = 20
    }
});

$(document).keyup(function() {
    cntrlIsPressed = false;
    grid = 20
});

var cntrlIsPressed = false;

$(document).keydown(function(e) {
    var key = undefined;
    var possible = [e.key, e.keyIdentifier, e.keyCode, e.which];
    console.log(key)
    while (key === undefined && possible.length > 0) {
        key = possible.pop();
    }

    if (key && (key == '27')) {
        $('x-contextmenu-code').fadeOut(100)
    }

    if (key && (key == '115' || key == '83') && (e.ctrlKey || e.metaKey) && !(e.altKey)) {
        e.preventDefault();
        saveCtrlS()
        return false;
    }
    return true;
});

function saveCtrlS() {
    if ($('back-shadow').css('display') == "block") {
        $('#btnSaveCode').click()
    } else {
        updateButton()
    }
}

function updateButton() {

    $('x-parent-box>div[shimmer-load]').fadeIn()

    var continerId = $('x-menuitem[container].x-menu-selected').attr('data-id')

    $('x-body>x-button[componentcreated]').each(function(i, obj) {
        requestGet('get', '/components/?containerId=' + continerId + "&uid=" + $(obj).attr('id') + "&_sort=index:ASC", function(statusa, dataa) {
            console.log(dataa)
            if (statusa) {
                request('put', '/components/' + dataa[0].id, {
                    "params": JSON.parse($(obj).attr('data'))
                }, function(status, data) {
                    console.log(data)
                    if (status) {
                        $("#notification").animate({
                            left: "100%"
                        }).promise().done(function() {
                            $("#notification").animate({
                                'bottom': '-100px'
                            }).promise().done(function() {
                                $(this).attr('style', '')
                            });
                        });
                        saveTheme()
                        alerta("Container " + $('x-menuitem[container].selected').text() + " salvo com sucesso!")
                        $('x-body').fadeIn()
                        $('x-body').css('display', 'flow-root');
                        $('x-parent-box>div[shimmer-load]').fadeOut()
                    } else {
                        alerta("Falha ao salvar Container!", true)
                    }
                })
            } else {
                alerta("Falha ao salvar Container!", true)
            }
        })

    });
}





$(document).on('keydown', 'x-layout-fase2>input', function(e) {
    var lista = JSON.parse(getRocketData()).data.filter(function(item) {
        return item.route.toLowerCase().includes($('x-layout-fase2>input').val().toLowerCase().replace("@", ""));
    });

    autocompleteFase2(e, lista, "fas fa-rocket", 'x-layout-fase2>input')
})

function autocompleteFase2(e, lista, icon, targetInput) {
    var code = (e.keyCode ? e.keyCode : e.which);

    console.log(lista)
    $('x-contextmenu-fase2>x-menuitem').remove()
    lista.forEach(e => {
        var card = '  <x-menuitem target="' + targetInput + '" data-route="' + e.route + '"><i class="' + icon + '"></i>@' + e.route + '</x-menuitem>'
        $('x-contextmenu-fase2').append(card)
    })
    if (lista.length > 0) {
        $('x-contextmenu-fase2').css('display', 'block')
    }

    if (code == 13 || code == 9 && lista.length > 0) {
        $(targetInput).val(lista[0].route)
        $('x-contextmenu-fase2').fadeOut()
        $('x-layout-fase2>input').focusout()
    }
}
$(document).on('click', 'x-contextmenu-fase2>x-menuitem', function(e) {
    $($(this).attr('target')).val("@" + $(this).attr('data-route'))
    $('x-layout-fase2>input').focusout()
    $('x-contextmenu-fase2').fadeOut()
})




$(document).on('click', '.rocket-empty', function() {

    $('.rocket').animate({
        height: '50px',
        'opacity': '1'
    })
    $('.rocket').addClass('rocket-open')
})

$(document).on('click', 'x-card[rocket] ', function() {
    $('label[x-add-rocker-col]').text($(this).attr('data-route'))
    $('label[x-add-rocker-col]').val($(this).attr('data-route'))
    $('x-container-database>x-card>header').animate({
        'opacity': '0.2'
    })
    $('.mode-code, pre[action-body]').html(" ")
    $('.back').css("display", "block")
    initJsonBody()
    rendererDataBaseItens($(this).attr('data-route'))
    callServiveRocket()

})


function rendererDataBaseItens(route) {
    rocketNetwork('get', '/~/' + route, {}, function(status, data) {
        console.log("A:" + status)
        console.log("B:" + JSON.stringify(data))
        if (status) {
            $('x-rocker-opened').fadeIn(200)
            $('x-rocker-panel').animate({
                'margin-top': '-50px'
            }, 200)
            $('x-panel-two>x-item[sidel]>x-card[database]').remove()
            if (data.data.length > 0) {
                $('x-panel-two>x-item[sideL]>x-label').css('display', 'none')
            } else {
                $('x-panel-two>x-item[sideL]>x-label').css('display', 'block')
            }

            $('x-item[sideTop]>.front>x-campo-api[data-id]').remove()

            data.data.forEach(el => {
                var cards = '<x-card database data-field="' + el.Field + '" role="menuitem" aria-disabled="false" tabindex="0">' +
                    '  <x-menuitem class="db-field"> <i class="fas fa-pen" style="margin-right: 10px"></i>' + el.Field + '</x-menuitem>' +
                    '    <x-menuitem class="db-type">SMART DATA</x-menuitem>' +
                    '  <x-menuitem class="db-default">' + el.Default + '</x-menuitem>' +
                    '  <x-action data-item="' + el.Field + '"> <i class="fas fa-plus"></i> </x-action>   </x-card>'
                $('x-panel-two>x-item[sidel]').append(cards)
            })

        } else {
            alerta("Token inválido! refaça o login para acessar o RocketData", true)
        }
    })
}
$(document).on('click', 'x-container-dialog>x-card>header>x-button', function() {
    $('x-container-dialog').fadeOut(200)
})

$(document).on('mouseenter', 'x-card[database]', function() {
    $(this).find('x-action').css('display', 'flex')
})


$(document).on('mouseleave', 'x-card[database]', function() {
    $(this).find('x-action').css('display', 'none')
})


$(document).on('click', 'x-icon[name="close"]', function() {
    $('x-rocker-opened').fadeOut(200)
    $('x-container-database>x-card>header').animate({
        'opacity': '1'
    })
    $('x-rocker-panel').animate({
        'margin-top': '50px'
    })
})


$(document).on('keydown', 'sub-header>x-input', function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {

    } else if (code == 27) {
        $('.rocket').animate({
            height: '0px',
            'opacity': '0'
        })
    }
});



$(document).on('keydown', ".json-pre-selected", function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {
        $(this).removeClass('json-pre-selected')
        e.preventDefault();
        return false;
    } else if (code == 27) {
        $(this).removeClass('json-pre-selected')
        e.preventDefault();
        return false;
    }
});


$(document).on('click', 'x-action', function(e) {
    var card = '   <x-campo-api data-id="' + $(this).attr('data-item') + '">' +
        '   <x-title-sidetop>' +
        '    <x-icon name="close" style="display: none"></x-icon>' +
        '    <i class="fas fa-database" style="margin-right: 4px;" aria-hidden="true"></i>' +
        '   <p>' + $(this).attr('data-item') + '</p>' +
        '   </x-title-sidetop>' +
        '  <label data-type="EQUAL" data-value="=" equal-sql ><i class="fas fa-equals"></i></label>' +
        '  <xline></xline> <x-expresion placeholder="expression" contenteditable="true"> </x-expresion>' +
        '<label onclick="labelClicOrAnd(this)" data-type="OR" x-and-or>OR</label>' +
        '   </x-campo-api>'
    $('x-item[sideTop]>.front').append(card)
});

$(document).on('click', 'label[equal-sql]', function(e) {
    var equal = '<i class="fas fa-equals"></i></label>'
    var diferente = '<i class="fas fa-not-equal"></i></label>'
    var maior = '<i class="fas fa-greater-than-equal"></i></label>'
    var menor = '<i class="fas fa-less-than-equal"></i></label>'
    var like = '<i style="color:#961313 !important" class="fas fa-heart"></i></label>'

    if ($(this).attr('data-type').toUpperCase() == "EQUAL") {
        $(this).attr('data-type', 'NOT-EQUAL')
        $(this).attr('data-value', '!=')
        $(this).html(diferente)
    } else if ($(this).attr('data-type').toUpperCase() == "NOT-EQUAL") {
        $(this).attr('data-type', 'LESS-EQUAL')
        $(this).attr('data-value', '<=')
        $(this).html(menor)
    } else if ($(this).attr('data-type').toUpperCase() == "LESS-EQUAL") {
        $(this).attr('data-type', 'GREATER-EQUAL')
        $(this).attr('data-value', '>=')
        $(this).html(maior)
    } else if ($(this).attr('data-type').toUpperCase() == "GREATER-EQUAL") {
        $(this).attr('data-type', 'LIKE')
        $(this).attr('data-value', 'LIKE')
        $(this).html(like)
    } else if ($(this).attr('data-type').toUpperCase() == "LIKE") {
        $(this).attr('data-type', 'EQUAL')
        $(this).attr('data-value', '=')
        $(this).html(equal)
    }
})


function labelClicOrAnd(eee) {
    if ($(eee).attr('data-type').toUpperCase() == "AND") {
        $(eee).attr('data-type', 'OR')
        $(eee).html("OR")
    } else {
        $(eee).attr('data-type', 'AND')
        $(eee).html("AND")
    }
}



$(document).on('click', '.executeJsonLocal', function(e) {

    if (methodRequest == "PUT") {
        if (confirm("EXECUTANDO SERVIÇOS DE INSERT/UPDATE, OK?")) {
            callServiveRocket()
        }
    } else {
        callServiveRocket()

    }
})

function callServiveRocket(button) {

    var sendWhere = ""

    $('x-item[sidetop]>.front>x-').each(function(index) {
        if ($(this).find('x-expresion').text().trim().length > 0) {
            sendWhere = "  " + sendWhere +
                "  " + $(this).attr('data-id') +
                "  " + $(this).find('label[equal-sql]').attr('data-value').trim() +
                "  '" + $(this).find('x-expresion').text().trim() + "'" +
                "  " + $(this).find('label[x-and-or]').attr('data-type').trim()

        }
    });

    var dataFilterAndOption = sendWhere.slice(0, -3)
    var bodyData = {
        "filter": dataFilterAndOption,
        "pagination": {
            "rows": 10,
            "page": 1
        }
    }

    console.log(bodyData);

    console.log($('.mode-code').text());

    if ($('div.back>back-body').hasClass('mode-code') && $('.mode-code').text().length > 3) {
        var obj = JSON.parse($('.mode-code').text())
        bodyData = obj
    }

    console.log(bodyData);


    rocketNetwork(methodRequest, '/' + $('label[x-add-rocker-col]').text(), bodyData, function(status, data) {

        document.querySelector('pre[action-body]').innerHTML = "";
        $('pre[action-body]').append(

            syntaxHighlight(JSON.stringify(data, undefined, 4))

        );

        if (data.success) {
            if (methodRequest == "PUT") {
                $('.rocket-rowlist-opend-endpoint').click()
            }
        }

    })
}

$(document).on('click', '.mode-code>.string, .mode-code>.number, .mode-code>.boolean ', function(e) {
    $(this).attr("contenteditable", true)
})

$(document).on('click', 'i[fixe_form]', function(e) {
    if ($(this).hasClass("fa-lock-open")) {
        $(this).removeClass("fa-lock-open")
        $(this).addClass("fa-lock")
        $(this).attr('style', 'color: #350a0aa3 !important;')
        $(this).attr('data-locked', true)
    } else {
        $(this).addClass("fa-lock-open")
        $(this).removeClass("fa-lock")
        $(this).attr('style', 'color: #ffffff61 !important;')
        $(this).attr('data-locked', false)
    }
})

$(document).on('click', 'x-card[database]>x-menuitem[class="db-field"]', function(e) {
    var coluna = $(this).text().trim()
    $(".selected-collum").removeClass("selected-collum")
    if (coluna != "id") {
        $('x-box[default]').css('display', 'flow-root')
        $('x-menuitem[addnewcampo]').css('display', 'none')
        $('x-input[namecampo]').find('label').text(coluna)
        $('x-input[namecampo]').focus()
        $('x-input[namecampo]').attr('data-mode', 'change')
        $('#cmdEditNameTitle').text("RENOMEAR COLUNA " + coluna)

        $('x-menuitem[deleteCampo]').css('display', 'block')
        $(this).addClass("selected-collum")

        $('x-box[default]').addClass('renomeando-xbox')
        $('.renomeando-xbox>div>x-input').val(coluna)


    }
})

$(document).on('click', '.exIncludeButton', function(e) {
    var json = $('.mode-code').text()
    var jsonParseable = JSON.parse(json)
    var includeAble = "*"
    $('x-card[database]>x-menuitem[class="db-field"]').each(function(index) {
        includeAble = includeAble + ", " + $(this).text()

    })

    jsonParseable.include = includeAble.replace('*,', '')

    $('.mode-code').html(" ")
    $('.mode-code').html(syntaxHighlight(JSON.stringify(jsonParseable, undefined, 4)))

})


$(document).on('click', '.exJoinButton', function(e) {
    var json = $('.mode-code').text()
    var jsonParseable = JSON.parse(json)
    var includeAble = ""
    $('x-card[database]>x-menuitem[class="db-field"]').each(function(index) {
        if ($(this).text().indexOf("_id")) {
            includeAble = "+" + $(this).text().trim().replace("_", ".")
        }
        if (index == $('x-card[database]>x-menuitem[class="db-field"]').length - 1 && includeAble == "") {
            includeAble = "+" + $(this).text().trim()
        }
    })

    jsonParseable.join = includeAble.replace('*,', '')

    $('.mode-code').html(" ")
    $('.mode-code').html(syntaxHighlight(JSON.stringify(jsonParseable, undefined, 4)))

})

$(document).on('click', '.exExpressionButton', function(e) {
    var json = $('.mode-code').text()
    var jsonParseable = JSON.parse(json)
    var includeAble = ""
    $('x-card[database]>x-menuitem[class="db-field"]').each(function(index) {
        if (index == 1) {
            if ($(this).text().trim() != "reg_date") {
                includeAble = $(this).text().trim() + " LIKE 'a%'"
            }
        }
        if (index == 2) {
            if (includeAble.length < 3) {
                includeAble = $(this).text().trim() + " LIKE 'a%'"
            }
        }
    })

    jsonParseable.filter = includeAble

    $('.mode-code').html("")
    $('.mode-code').html(syntaxHighlight(JSON.stringify(jsonParseable, undefined, 4)))

})

function initJsonBody() {
    $('x-item[sideTop]>.back>back-body').addClass('mode-code');
    $('x-item[sideTop]>.front').fadeOut(50)
    $('x-item[sideTop]>.back').fadeIn(50)
    $(this).html('  <x-label style="display: block;"><i class="far fa-eye"></i> Detalhes  </x-label>')

    var sendWhere = ""

    $('x-item[sidetop]>.front>x-').each(function(index) {
        if ($(this).find('x-expresion').text().trim().length > 0) {
            sendWhere = "  " + sendWhere +
                "  " + $(this).attr('data-id') +
                "  " + $(this).find('label[equal-sql]').attr('data-value').trim() +
                "  '" + $(this).find('x-expresion').text().trim() + "'" +
                "  " + $(this).find('label[x-and-or]').attr('data-type').trim()

        }
    });

    var dataFilterAndOption = sendWhere.slice(0, -3)
    var bodyData = {
        "filter": dataFilterAndOption,
        "pagination": {
            "rows": 10,
            "page": 1
        }
    }

    console.log(dataFilterAndOption);
    $('.mode-code').html(" ")
    $('.mode-code').html(syntaxHighlight(JSON.stringify(bodyData, undefined, 4)))
}

$(document).on('mouseenter', 'x-box[json]>pre', function() {
    xBoxJson(this, (status, value) => {

    })
})

$(document).on('mouseleave', 'x-box[json]>pre', function() {
    xBoxJson(this, (status, value) => {
        if (status) {
            var addItem = true
            var newData = JSON.parse($(GLOBAL_COMPONENT_ID).attr('data'))
            newData.forEach(element => {
                if (element.el.toLowerCase().trim() == "json") {
                    element.value = value
                    addItem = false
                }
            });

            if (addItem) {
                newData.push({
                    id: 37,
                    el: "json",
                    type: "JSON",
                    value: value
                })
            }

            $(GLOBAL_COMPONENT_ID).attr('data', JSON.stringify(newData))
        }
    })
})

function xBoxJson(element, callback) {
    var conteudo = rTrim(lTrim($(element).text()));
    $(element).removeClass("JsonParseError")
    $(GLOBAL_COMPONENT_ID).removeClass("JsonParseError")
    $(GLOBAL_COMPONENT_ID).find('i').removeClass("JsonParseError")
    $(GLOBAL_COMPONENT_ID).find('p').removeClass("JsonParseError")
    $('span[x-error-json]').remove()
    if (conteudo.length > 0) {
        try {
            // var jsParse = $.parseJSON($(element).text());
            var jsParse = JSON.parse(conteudo)
            var jsonContent = syntaxHighlight(JSON.stringify(jsParse, undefined, 4))
            $(element).html(jsonContent)
            callback(true, JSON.stringify(jsParse))
        } catch (err) {
            $(element).addClass("JsonParseError")
            $(GLOBAL_COMPONENT_ID).addClass("JsonParseError")
            $(GLOBAL_COMPONENT_ID).find('i').addClass("JsonParseError")
            $(GLOBAL_COMPONENT_ID).find('p').addClass("JsonParseError")
            $('body').append('       <span x-error-json> <strong>' + GLOBAL_COMPONENT_ID + '</strong> <br> ' + err + '             </span>')
            callback(false, "")
        }
    }
}

$(document).on('keydown', 'x-expresion[placeholder="expression"]', function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {

    } else if (code == 27) {
        $(this).parent().remove()
    }
    if (e.ctrlKey && e.keyCode == 13) {
        //  $('.executeJsonLocal').click()
        //    e.preventDefault();
        //  return false;
    }
});

$(document).on('click', 'x-menuitem[addNewCampo]', function(e) {
    $('x-box[default]').css('display', 'flow-root')
    $(this).css('display', 'none')
    $('x-input[namecampo]').focus()
    $('x-input[namecampo]').attr('data-mode', 'add')
    $('x-menuitem[deleteCampo]').css('display', 'none')
    $('#cmdEditNameTitle').text("ADICIONAR NOVO CAMPO")

    $('x-input[namecampo]').attr('data-mode', 'add')
    $('x-menuitem[addNewCampo]').css('display', 'flow-root')
    $('x-card[database]>x-menuitem').removeClass("selected-collum")

    $('x-input[namecampo]>label').text("Nome do campo")

    $('x-box[default]').removeClass('renomeando-xbox')
    $(this).css('display', 'none')
});

$(document).on('click', 'x-menuitem[deleteCampo]', function(e) {
    var campName = '{ ' +
        '  "table": "' + $('label[x-add-rocker-col]').text().replace("@", "") + '", ' +
        '  "name": "' + $('x-input[namecampo]>label').text() + '"   }'


    console.log(JSON.parse(campName))
    if (confirm("Tem certeza que deseja deletar a coluna " + $('x-input[namecampo]>label').text() + "?")) {
        rocketNetwork('PATCH', '/@SQL/delete-col', JSON.parse(campName), function(status, data) {
            if (data.success) {
                $('x-card[data-field="' + $('.selected-collum').text().trim() + '"]').remove()
            } else {
                alerta("Oops, algo deu errado, tente novamente mais tarde...", true)
            }
            if (strToBoolean($('i[fixe_form]').attr('data-locked')) != true) {
                $('x-box[default]').css('display', 'none')
            }
        })
    }

});


$(document).on('click', 'x-box[default] i[close]', function(e) {
    $('x-menuitem[addNewCampo]').css('display', 'flow-root')
    if (strToBoolean($('i[fixe_form]').attr('data-locked')) != true) {
        $('x-box[default]').css('display', 'none')
    }
});


$(document).on('dblclick', 'span[data-campo]', function(e) {
    var json = JSON.parse($('back-body').text())
    var nameJson = $(this).attr('data-campo')
    delete json[nameJson]

    $('.mode-code').html(" ")
    $('.mode-code').html(syntaxHighlight(JSON.stringify(json, undefined, 4)))

});


methodRequest = "POST"
$(document).on('click', '.rocket-rowlist-opend-endpoint[write]', function(e) {
    methodRequest = "PUT"
    $('.blobs-container[right]').fadeIn()
    $('.blobs-container[left]').fadeOut()
    $('label[mode]').attr('mode', 'write')
    $('label[mode]').text("WRITE")

    json = {}
    $('x-card[database]>x-menuitem[class="db-field"]').each(function(index) {
        //  if ($(this).text().trim() != "id") {
        json[$(this).text().trim()] = ''
            //  }
    });


    $('.mode-code').html(" ")

    $('.mode-code').html(syntaxHighlight(JSON.stringify(json, undefined, 4)))

});
$(document).on('click', '.rocket-rowlist-opend-endpoint[read]', function(e) {
    methodRequest = "POST"
    $('.blobs-container[right]').fadeOut()
    $('.blobs-container[left]').fadeIn()
    $('back-body').removeAttr('contenteditable')
    $('label[mode]').attr('mode', 'read')
    $('label[mode]').text("READ")

    var json = {
        "filter": "",
        "pagination": {
            "rows": 10,
            "page": 1
        }
    }


    $('.mode-code').html(" ")

    $('.mode-code').html(syntaxHighlight(JSON.stringify(json, undefined, 4)))

});

$(document).on('click', '#deleteRouteHow', function(e) {

    if (confirm("Tem certeza que deseja deletar o serviço " + $('label[x-add-rocker-col]').text() + "?")) {
        rocketNetwork('DELETE', '/-' + $('label[x-add-rocker-col]').text().replace("@", ""), {}, function(status, data) {
            if (data.success) {
                $('x-rocker-opened').fadeOut(200)
                $('x-container-database>x-card>header').animate({
                    'opacity': '1'
                })
                $('x-rocker-panel').animate({
                    'margin-top': '50px'
                })
                $('x-card[data-route="' + $('label[x-add-rocker-col]').text() + '"]').remove()
            } else {
                alerta("Oops, algo deu errado, tente novamente mais tarde...", true)
            }
        })
    }
});


$(document).on('click', 'x-button[button-nomecampo]', function(e) {
    if ($('x-input[namecampo]').val().length < 2) {
        alerta("O campo deve ter ao menos 2 letras", true)
    } else {

        $(this).removeClass("selected-collum")
        if ($('x-input[namecampo]').attr('data-mode') == "add") {
            var campName = '{ "' + $('x-input[namecampo]').val().toString().trim() + '": "String" }'
            console.log(JSON.parse(campName))
            rocketNetwork('PUT', '/+' + $('label[x-add-rocker-col]').text().replace("@", ""), JSON.parse(campName), function(status, data) {
                rendererDataBaseItens($('label[x-add-rocker-col]').text())
                $('x-input[namecampo]').val("")
                $('x-menuitem[addNewCampo]').css('display', 'flow-root')
                if (strToBoolean($('i[fixe_form]').attr('data-locked')) != true) {
                    $('x-box[default]').css('display', 'none')
                }
            })
        } else {
            var campName = '{ ' +
                '  "table": "' + $('label[x-add-rocker-col]').text().replace("@", "") + '", ' +
                '  "name": "' + $('x-input[namecampo]>label').text() + '",' +
                '  "newName": "' + $('x-input[namecampo]').val().toString().trim() + '" }'

            console.log(JSON.parse(campName))

            rocketNetwork('PATCH', '/@SQL/rename', JSON.parse(campName), function(status, data) {
                rendererDataBaseItens($('label[x-add-rocker-col]').text())
                $('x-input[namecampo]').val("")
                $('x-menuitem[addNewCampo]').css('display', 'flow-root')
                if (strToBoolean($('i[fixe_form]').attr('data-locked')) != true) {
                    $('x-box[default]').css('display', 'none')
                }
            })
        }
    }
});

$(document).on('keydown', '.mode-code', function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {
        // $('.executeJsonLocal').click()
        // e.preventDefault();
        // return false;
    }
});

function getTheme() {

    var continerId = $('x-menuitem[container].x-menu-selected').attr('data-id')

    if (continerId != null && continerId != undefined && parseInt(continerId) > 0) {

        let containerJson = getHomeData().filter((d) => {
            return d.id == parseInt(continerId);
        })

        var myContainer = containerJson[0].json


        var continerName = $('x-menuitem[container].x-menu-selected').find('x-label').text().trim()

        $('.statusbar-title').text(continerName)


        if (myContainer == null || myContainer == undefined || myContainer.text == null || myContainer.text == undefined) {

        } else {

            $('.statusbar-title').text(myContainer.title)
            $('x-actionbar').css('background', myContainer.primary)
            $('x-statusbar').css('background', myContainer.secundary)
            $('x-footerbar').css('background', myContainer.secundary)
            $('x-body').attr('style', 'background-color:' + myContainer.background + " !important;")
            $('x-actionbar>x-label').css('color', myContainer.text)
            $('x-actionbar>i-icon').css('background', myContainer.text)

            $('x-button[gravity-change]').attr('mode', myContainer.gravity)
            $('x-button[gravity-change]').find('strong').text(myContainer.gravity)


            $('x-colorselect[target="color-primary"]').val(hex2rgba_convert(myContainer.primary))
            $('x-colorselect[target="color-secundary"]').val(hex2rgba_convert(myContainer.secundary))
            $('x-colorselect[target="color-accent"]').val(hex2rgba_convert(myContainer.accent))
            $('x-colorselect[target="color-background"]').val(hex2rgba_convert(myContainer.background))
            $('x-colorselect[target="color-text"]').val(hex2rgba_convert(myContainer.text))

            $('#color-primary').val(myContainer.primary)
            $('#color-secundary').val(myContainer.secundary)
            $('#color-accent').val(myContainer.accent)
            $('#config-title').val(myContainer.title)
            $('#color-background').val(myContainer.background)
            $('#color-text').val(myContainer.text)

            $('#config-radius').val(myContainer.radius)
            $('#config-elevation').val(myContainer.elevation)

            var homeItem = getHomeData().filter(function(item) {
                return item.id === parseInt($('x-menuitem[container].x-menu-selected').attr('data-id'))
            })

            if (homeItem.size > 0 && homeItem[0].isCard != null && homeItem[0].isCard) {
                var css = 'height: ' + h + '; max-height: ' + h + '; min-height: ' + h + ';' +
                    'width: ' + w + '; max-width: ' + w + '; min-width: ' + w + ';'
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = 'x-parent-box[iscard]>x-body { ' + css + ' }';
                document.getElementsByTagName('head')[0].appendChild(style);

                $('x-parent-box').addClass('iscard')
                $('x-parent-box').attr('iscard', true)

                homeItem[0].cardSize

                var w = cardSize.split("x")[0] + "% "
                var h = cardSize.split("x")[1] + "% "

                //   $('x-parent-box').attr('style',
                //       'height: ' + h + '!important; max-height: ' + h + '!important; min-height: ' + h + '!important;' +
                //     'width: ' + w + ' !important; max-width: ' + w + '!important; min-width: ' + w + '!important;')


            }
        }

    }
}

function newContainer() {
    $('#labelNewContainer').val($('#labelNewContainer').val().replace(' ', '_'))
    if ($('#labelNewContainer').val().length > 2) {
        var continerId = $('x-menuitem[container].x-menu-selected').attr('data-id')
        var json = {
            "id": 1,
            "projectId": getCurrentProjectData().id,
            "userId": getUserData().user.id,
            "json": '{"elevation":"0","radius":"4","primary":"#550155FF", "background":"#ffffffFF", "secundary":"#550155FF","accent":"#000000FF","text":"#FFFFFF","title":"AppDock","darkicons":","gravity":"center" }',
            "alias": $('#labelNewContainer').val(),
            "clientId": getUserData().user.id,
            "containerId": continerId,
            "created_at": "2019-12-08T23:41:01.276Z",
            "updated_at": "2019-12-12T00:46:45.897Z"
        }
        request('post', '/homes/', json, function(status, data) {
            console.log("=================")
            console.log(data)
            if (status) {
                openProject(getCurrentProjectData().id)
                $('x-container-dialog').fadeOut(200)
            } else {
                alerta('Algo deu errado, tente novamente mais tarde!', true)
            }
        })
    } else {
        alerta('Oops, digite ao menos 3 letras para o nome...', true)
    }
}

$(document).on('click', '#btnNewContainer', function() {
    newContainer()
})

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

$(document).on('change', '#color-background', function() {
    $('x-colorselect[target="color-background"]').val(hex2rgba_convert($(this).val()))
})

$(document).on('change', '#color-text', function() {
    $('x-colorselect[target="color-text"]').val(hex2rgba_convert($(this).val()))
})

$(document).on('click', '#principal-menu-open-project', function() {
    $('x-project-select').fadeIn(100)
})

$(document).on('click', '#principal-menu-new-project', function() {
    $('x-project-form-body > x-tabs > x-tab[new]').click()
    $('x-project-select').fadeIn(100)
})

$(document).on('click', '#principal-menu-save-project', function() {
    saveCtrlS()
})

function saveTheme() {
    var continerId = $('x-menuitem[container].x-menu-selected').attr('data-id')
    var continerName = $('x-menuitem[container].x-menu-selected').find('x-label').text().trim()
    var primary = $('#color-primary').val()
    var secundary = $('#color-secundary').val()
    var background = $('#color-background').val()
    var textColor = $('#color-text').val()
    var accent = $('#color-accent').val()
    var title = $('#config-title').val()
    var gravity = $('x-button[gravity-change]').attr('mode')
    var darkicons = ""

    var radius = $('#config-radius').val()
    var elevation = $('#config-elevation').val()

    $('.statusbar-title').text(title)
    $('x-actionbar').css('background', primary)
    $('x-statusbar').css('background', secundary)
    $('x-body').attr('style', 'background-color:' + background + " !important;")

    var theme = '{"elevation":"' + elevation + '","radius":"' + radius + '","primary":"' + primary + '", "background":"' + background + '", "secundary":"' + secundary + '",' +
        '"accent":"' + accent + '", "text":"' + textColor + '", "title":"' + title + '","darkicons":"' + darkicons + '" ,"gravity":"' + gravity + '" ' +
        '}'


    request('put', '/homes/' + continerId, {
        "json": JSON.parse(theme)
    }, function(status, data) {
        console.log(data)
        if (status) {
            document.documentElement.style.setProperty('--accent-color-blue', accent);

            var clientId = getUserData().user.id
            requestGet('get', '/homes/?clientId=' + clientId, function(status, data) {
                if (status) {
                    var newData = []
                    data.forEach(element => {
                        element.containerId = element.id
                        newData.push(element)
                    })
                    setHomeData(newData)
                }
            })
            $('x-theme-dialog').fadeOut(100)
            $('x-menu-vs').find('i').removeClass('x-menu-vs-i-active')
            $('x-menu-vs').find('img').removeClass('x-menu-vs-i-active')

            $('x-body').css(' display', 'flow-root');
            $('x-parent-box>div[shimmer-load]').fadeOut()

        } else {
            alerta("Oops, algo deu errado, tente novamente mais tarde...", true)
        }
    })
}

$(document).on('mouseenter', '.label-item-title', function() {
    var item = $("#" + $(this).attr('target'))

    item.css('display', 'flex')
    item.mouseenter(function() {
        item.css('display', 'flex')
    })
})

$(document).on('mouseleave', '.label-item-title', function() {
    $("#" + $(this).attr('target')).css('display', 'none')
})

$(document).on('mouseenter', '.toast-container', function() {
    $(this).find('x-toast').fadeIn(200)
})

$(document).on('mouseleave', '.toast-container', function() {
    //  $(this).find('x-toast').animate({
    //     zoom: '0.5'
    //}, 200)
    $(this).find('x-toast').fadeOut(200)
})


$(document).on('click', 'x-layout-selector>x-menuitem', function() {
    var cardSize = $(this).attr('data-size')
    rendererCard(cardSize)
})

function rendererCard(cardSize) {
    var w = cardSize.split("x")[0] + "%"
    var h = cardSize.split("x")[1] + "%"

    $('x-layout-selector> x-menuitem').removeClass('LayoutSelectorSelected')
    $('x-layout-selector> x-menuitem[data-size="' + cardSize + '"]').addClass('LayoutSelectorSelected')

    $('v-size-x').fadeIn()
    $('v-size-y').fadeIn()
    $('v-size-x').css('display', 'block')
    $('v-size-y').css('display', 'block')


    $('v-size-x>label').text(w)
    $('v-size-y>label').text(h)

    $('create-view').animate({
        width: w,
        height: h
    })

    console.log(w + " " + h)
}


$(document).on('click', 'x-project-form-body > x-tabs > x-tab[projects]', function() {
    $('x-project-form-projects').css('display', 'grid')
    $('x-project-form-new').css('display', 'none')
    listProject()
})

$(document).on('click', 'x-project-form-body > x-tabs > x-tab[new]', function() {
    $('x-project-form-projects').css('display', 'none')
    $('x-project-form-new').css('display', 'flex')
})

$(document).on('click', 'x-button[form-new-cancel]', function() {
    $('x-project-form-body > x-tabs > x-tab[projects]').click()
})

$(document).on('keyup', 'div[form-new-card]>x-input', function(e) {
    if ($('div[form-new-card]>x-input').val().trim().length < 3) {
        alerta("O nome deve conter ao menos 3 letras...")
        $('x-button[form-new-criar]').attr('disabled', 'disabled')
    } else {
        $('x-button[form-new-criar]').removeAttr('disabled')
    }
})


$(document).on('click', 'x-button[form-new-criar]', function(e) {
    createProject()
})

//x-project-item>.fa-trash-alt
$(document).on('mouseenter', 'x-project-item', function(e) {
    $(this).find('.fa-trash-alt').css('display', 'block')
})
$(document).on('mouseleave', 'x-project-item', function(e) {
    $(this).find('.fa-trash-alt').css('display', 'none')
    $('x-project-item>p').removeAttr('contenteditable')

})

$(document).on('mouseenter', 'x-project-item>.fa-trash-alt', function(e) {
    $(this).parent().css('box-shadow', '0 0 5px #d5000082')
})

$(document).on('mouseleave', 'x-project-item>.fa-trash-alt', function(e) {
    $(this).parent().removeAttr('style')
})


$(document).on('mouseenter', 'x-project-item>p', function(e) {
    $(this).attr('style', 'background: #2196f31c; border-radius: 5px;  border: 1px solid #2196f31c;')
})

$(document).on('mouseleave', 'x-project-item>p', function(e) {
    $(this).removeAttr('style')
})

$(document).on('click', 'x-project-item>p', function(e) {
    $(this).attr('contenteditable', true)
    $(this).focus()
    e.preventDefault
    return false
})


$(document).on('keydown', 'x-project-item>p', function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {
        renameProject($(this).attr('data-id'), lTrim(rTrim($(this).text())))
    }
})


$(document).on('click', 'x-project-item>.fa-trash-alt', function(e) {
    if (confirm("Tem certeza que deseja deletar o projeto " + $(this).parent().find('p').text())) {
        deleteProject($(this).attr('data-id'))
    }
})

function deleteProject(id) {
    requestGet('delete', '/projects/' + id, function(status, data) {
        if (status) {
            $('x-project-form-body > x-tabs > x-tab[projects]').click()
            $('div[form-new-card]>x-input').val("")
            $('x-project-item[data-id="' + id + '"').remove()
        } else {
            alerta("Oops, algo deu errado, tente novamente mais tarde...", true)
        }
    })
}

function renameProject(id, newName) {
    var dataReq = {
        name: newName
    }
    request('put', '/projects/' + id, dataReq, function(status, data) {
        if (status) {
            $('x-project-form-body > x-tabs > x-tab[projects]').click()
            $('div[form-new-card]>x-input').val("")
            $('x-project-item[data-id="' + id + '"').find('p').text(newName)
        } else {
            alerta("Oops, algo deu errado, tente novamente mais tarde...", true)
        }
    })
}

function createProject() {
    dataRequest = {
        name: $('div[form-new-card]>x-input').val(),
        userId: getUserData().user.id
    }

    request('post', '/projects', dataRequest, function(status, data) {
        if (status) {
            alerta("Projeto " + dataRequest.name + " criado com sucesso!")
            $('x-project-form-body > x-tabs > x-tab[projects]').click()
            $('div[form-new-card]>x-input').val("")
        } else {
            alerta("Oops, algo deu errado, tente novamente mais tarde...", true)
        }
    })
}


$(document).on('click', 'x-project-item', function(e) {
    openProject($(this).attr('data-id'))
})


function openProject(projectId) {
    if (getUserData().success == undefined) {

        var clientId = getUserData().user.id
        console.log(clientId)
        requestGet('get', '/homes/?clientId=' + clientId + "&projectId=" + projectId, function(status, data) {
            if (status) {
                $('.welcome').css('display', 'flex')
                var newData = []
                data.forEach(element => {
                    element.containerId = element.id
                    newData.push(element)
                })
                setHomeData(newData)
                initHome(newData)
                $('x-project-select').fadeOut(100)

                var current = getProjectData().filter(function(item) {
                    return item.id === parseInt(projectId);
                })[0]

                setCurrentProjectData(current)

                $('.name-project-inmenu').text(current.name)
                $('.name-project-inmenu2').text("ID: " + current.id)

                trackDevices()
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

function listProject() {
    dataRequest = {
        name: $('div[form-new-card]>x-input').val(),
        userId: getUserData().user.id
    }

    requestGet('get', '/projects?userId=' + getUserData().user.id, function(status, data) {
        if (status) {
            $('x-project-form-projects').html(" ")
            setProjectData(data)
            data.forEach(projetos => {
                var item = '<x-project-item data-id="' + projetos.id + '">' +
                    '<i  data-id="' + projetos.id + '" class="far fa-trash-alt"></i>' +
                    '<i class="fas fa-box x-project-item-icon" aria-hidden="true"></i>' +
                    '  <p  data-id="' + projetos.id + '"> ' + projetos.name + ' </p></x-project-item>'

                $('x-project-form-projects').append(item)

            })
        } else {
            alerta("Oops, falha ao tentar acessar projetos, tente novamente mais tarde...", true)
        }
    })
}


$(document).on('click', 'x-button[openqrcode]', function(e) {
    qrCodeRefresh()
})
$(document).on('click', '#gobackQrcode', function(e) {
    $('x-qr-code').css('display', 'none')
})


function qrCodeRefresh() {
    $('#qrcode').html("")
    var qrcode = new QRCode("qrcode");
    var hashString = getCurrentProjectData().id + "|" + getCurrentProjectData().userId + "|" + getCurrentProjectData().name
    var elText = GLOBAL_ENCRIPTA(hashString);
    qrcode.makeCode(elText);
    $('x-qr-code').css('display', 'flex')
}

$(document).on('click', 'x-project-form-title', function() {

})

function trackDevices() {
    var Promise = require('bluebird')
    var adb = require('adbkit')
    var client = adb.createClient()

    client.trackDevices()
        .then(function(tracker) {
            tracker.on('add', function(device) {
                console.log('Device %s was plugged in', device.id)
                $('#deviceConnected').text(device.id)
                $('#deviceConnected').css("color", "#ffffff")
                $('#deviceConnectedIcon').css("color", "#FFFFFF")
                alerta('Device <strong>' + device.id + '</strong>  foi <span style="color:green">conectado</span>')
            })
            tracker.on('remove', function(device) {
                console.log('Device %s was unplugged', device.id)
                $('#deviceConnected').text("desconetado")
                $('#deviceConnected').css("color", "rgba(255, 255, 255, 0.3)")
                $('#deviceConnectedIcon').css("color", "rgba(255, 255, 255, 0.3)")
                alerta('Device <strong>' + device.id + '</strong> foi <span style="color:#541717">removido</span>')
            })
            tracker.on('end', function() {
                console.log('Tracking stopped')
                $('#deviceConnected').text("desconetado")
                $('#deviceConnected').css("color", "rgba(255, 255, 255, 0.3)")
                $('#deviceConnectedIcon').css("color", "rgba(255, 255, 255, 0.3)")

                alerta('Device <strong>' + device.id + '</strong> foi <span style="color:#ff980033">desconectado</span>', true)
            })
        })
        .catch(function(err) {
            console.error('Something went wrong:', err.stack)
        })
}