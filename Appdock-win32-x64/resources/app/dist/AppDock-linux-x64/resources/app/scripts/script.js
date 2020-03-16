 $(document).ready(function() {


 })

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