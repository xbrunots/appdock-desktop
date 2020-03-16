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

         //rendererData()

     });
 }

 function openComponents(containerId) {
     var q = "select * from components where containerId = " + containerId + " order by `index` "
     querySql(q, function(data) {

         if (data == undefined || data.success == false) {
             return
         }

         data.data.forEach(element => {
             if (!element.params.includes(':')) {
                 let decodedData = Buffer.from(element.params, 'base64').toString('ascii');
                 element.params = JSON.parse(decodedData)
             }
         });

         setCurrentComponent(data)
         addStructToList(data.data)
         addComponentToList()
         addAttributes()
         console.log(JSON.stringify(data.data))
             //$('.sidebar-internal').find('.body').html('<p style="color: white">' + JSON.stringify(data.data))
     });
 }


 function addStructToList(q) {
     $('x-menuitem[estruct]').remove()
     q.forEach(element => {
         var item = '<x-menuitem estruct class="x-estruct" data-id="' + element.id + '">' +
             '  <x-icon name="layers"> </x-icon> ' +
             '  <x-label> ' + element.name + ' </x-label> ' +
             '  </x-menuitem>'
         $('.sidebar-internal').find('.body').append(item)
     });
 }

 function addComponentToList() {
     loadJSON('./scripts/json/components.json', function(response) {
         $('x-menuitem[components]').remove()
         JSON.parse(response).forEach(element => {
             console.log(element.name)
             var item = '<x-menuitem components class="x-components" data-type="' + element.name + '">' +
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
         JSON.parse(response).forEach(element => {
             console.log(element.name)
             var itemValue = ""
             var item = '<x-box data-list="' + element.value + '" data-id="' + element.id + '" id="attribute' + element.id + '" attributes class="x-attributes" data-type="' + element.type + '">' +
                 '  <x-label> ' + element.name + ' </x-label> '
             if (element.editable) {
                 itemValue = '  <x-input id="attr-' + element.id + '" class="type-' + element.type.toLowerCase() + '" placeholder="' + element.hint + '" value="' + element.value + '">    </x-input> '
             } else {
                 itemValue = '  <x-input id="attr-' + element.id + '" class="type-' + element.type.toLowerCase() + '" disabled="true" placeholder="' + element.hint + '" value="' + element.value + '">    </x-input> '
             }

             if (element.type == "COLOR") {
                 if (element.value == null || element.value.toString().length < 6) {
                     ' <span>' + element.value + '</span> <x-popover modal> ' +
                         '<x-rectcolorpicker alphaslider onchange="xColorSelectChange(this,' + element.id + ')" xColorSelectChange="test(this,' + element.id + ')"></x-rectcolorpicker>' +
                         '</x-popover>' +
                         '</x-colorselect>'
                 } else {
                     itemValue = '<x-colorselect id="colorselect' + element.id + '" value="' + element.value + '" style="margin-top: 10px;">' +
                         ' <span>' + element.value + '</span> <x-popover modal> ' +
                         '<x-rectcolorpicker alphaslider onchange="xColorSelectChange(this,' + element.id + ')" xColorSelectChange="test(this,' + element.id + ')" value="' + element.value + '"></x-rectcolorpicker>' +
                         '</x-popover>' +
                         '</x-colorselect>'
                 }
             } else if (element.type == "NUMBER") {
                 if (element.editable) {
                     itemValue = '  <x-numberinput suffix="px"  style="cursor:pointer" id="attr-' + element.id + '" class="type-' + element.type.toLowerCase() + '" placeholder="' + element.hint + '" value="' + element.response + '">    </x-input> '
                 } else {
                     itemValue = '  <x-numberinput suffix="px"  style="cursor:pointer" id="attr-' + element.id + '" class="type-' + element.type.toLowerCase() + '" disabled="true" placeholder="' + element.hint + '" value="' + element.response + '">    </x-input> '
                 }
             } else if (element.type == "SRC") {

             } else if (element.type == "OPTION") {
                 if (element.editable) {
                     itemValue = '  <x-input  style="cursor:pointer" id="attr-' + element.id + '" class="type-' + element.type.toLowerCase() + '" placeholder="' + element.hint + '" value="' + element.response + '">    </x-input> '
                 } else {
                     itemValue = '  <x-input  style="cursor:pointer" id="attr-' + element.id + '" class="type-' + element.type.toLowerCase() + '" disabled="true" placeholder="' + element.hint + '" value="' + element.response + '">    </x-input> '
                 }
             } else if (element.type == "INPUT_LIST") {

             } else if (element.type == "TEXT") {

             } else {

             }

             item = item + itemValue + '  </x-box>'
             $('.sidebar-R').append(item)
         });
     });
 }

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

 function savePictureInDataBase(foto, alias) {
     showLoading()
     if (alias == undefined) {
         alias = "picture"
     }
     var q = "insert into files(clientId,url,alias) values(" + getUserData().data[0].id + ", '" + foto + "', '" + alias + "')"
     querySql(q, function(data) {
         hideLoading()
         if (data == undefined || data.success == false) {
             alert("Falha ao tentar salvar imagem, tente novamente...")
             return
         } else {

             var item = ' <x-menuitem class="x-tooltip" texto="' + alias + '" fileItem onclick="onFileClick(' + foto + ')" >' +
                 ' <x-label> </x-label> ' +
                 ' <p><strong> </strong>' + alias + $('x-menuitem[fileItem]').length + '</p> ' +
                 '<img src="assets/bg.jpg" />' +
                 '<img style="    position: absolute; background: transparent;' +
                 ' " src="' + foto + '"/>' +
                 ' </x-menuitem> '
             $('ul[x-files]').prepend(item)
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

 function attribSelected(element, id) {
     var action = $(element).attr('type')
     $('#context-attribute').removeClass('context-menu-show')
     if (action == "OPTION") {
         console.log(element)
         $('#attribute' + id).find('x-input').val($(element).find('x-label').text())
     } else {

     }
 }

 function rgb2hex(rgb) {
     rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
     return (rgb && rgb.length === 4) ? "#" +
         ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
         ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
         ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
 }

 function xColorSelectChange(item, id) {
     var cor = $('#colorselect' + id).attr('value')
     $('#colorselect' + id).find('span').html(rgb2hex(cor))
     $('#attribute' + id).attr('data-value', rgb2hex(cor))
     $('#attribute' + id).attr('data-value', rgb2hex(cor))
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
     $('x-footer > x-menuitem').removeClass('footer-selected')
     $(this).addClass('footer-selected')
     $('#sidebar-bottom').css('height', '650px')
     $('x-sidebar-body').find('x-menubar').css('display', 'none')
     if ($(this).hasClass('folder')) {
         $('x-sidebar-body').find('x-menubar').css('display', 'block')
         openFiles()
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

 function onFileClick(t) {
     console.log(t)
 }

 $(document).on('mouseenter', 'ul[x-files]>x-menuitem ', function() {
     // $(this).find('p').animate({ height: '20px' }, function() {
     //    $(this).fadeIn(50)
     // })    
     $(this).find('p').fadeIn()
 })

 $(document).on('mouseleave', 'ul[x-files]>x-menuitem', function() {
     $(this).find('p').fadeOut()
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
         $('#popedit-finder').val($(this).find('p').text())
         $('#popmenu-find').animate({
             'top': '44px'
         })
     }
 })

 function openFiles() {

     //$('#menubar-files>x-menubar').css('display', 'none')
     showLoading()
     var q = "select * from files where clientId = " + getUserData().data[0].id
     querySql(q, function(data) {
         hideLoading()
         if (data == undefined || data.success == false) {
             return
         }

         $('x-menuitem[fileItem]').remove()
         data.data.forEach(element => {
             //    console.log(element)
             var item = '<x-menuitem fileItem class="x-tooltip" texto="' + element.alias + element.id + '"  onclick="onFileClick(' + element + ')" >' +
                 ' <x-label> </x-label> ' +
                 ' <p><strong> </strong>' + element.alias + element.id + '</p> ' +
                 '<img src="assets/bg.jpg" />' +
                 '<img style="    position: absolute; background: transparent;' +
                 ' " src="' + element.url + '"/>' +
                 ' </x-menuitem '
             $('ul[x-files]').append(item)

         });
     });
 }