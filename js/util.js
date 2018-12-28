function Itm(id){
    return document.getElementById(id);
}

function Itms(name){
    return document.getElementsByName(name);
}

function innerSelect(id,array){
    var html='';
    for(var i=0;i<array.length;i++){
        html+='<option value="'+array[i].id+'" >'+array[i].value+'</option>';
    }
    $('#'+id).inner(html);
}

function innerSelectSimple(id,array){
    var html='';
    for(var i=0;i<array.length;i++){
        html+='<option value="'+array[i]+'" >'+array[i]+'</option>';
    }
    $('#'+id).html(html);
}

function values(elements){
    var array=new Array();
    var elemts=elements.split('|');
    for(var i=0;i<elemts.length;i++){
        array.push($('#'+elemts[i]).val());
    }
    return array;
}

function isValidValues(elements){
    var array=new Array();
    var elemts=elements.split('|');
    for(var i=0;i<elemts.length;i++){
        var val=$('#'+elemts[i]).val();
        val=val.trim();
        if(val===""){
            return false;
        }
    }
    return true;
}

function Tooltip(msj){
    Itm('foter').innerHTML='<div id="msg" class="msg_tool" >'+msj+'</div>';
    setTimeout("OcultarTooltip()", 2000);
}
  
function OcultarTooltip(){
    Itm('foter').innerHTML='';
}

function selectContainer(id){
    var containers=Itms('containers');
    for(var i=0;i<containers.length;i++){
        $(containers[i]).hide();
    }
    $(Itm(id)).show();
    onclickMenu(0);
}

function cleanFields(elements){
    var elemts=elements.split('|');
    for(var i=0;i<elemts.length;i++){
       $('#'+elemts[i]).val('');
    }
}

function dialog_confirm(msj,funsi){
    var html='<div>'+msj+'<br>'
    +'<button class="button_dialog" onclick="'+funsi+'">Si</button>'
    +'<button class="button_dialog" onclick="close_dialog_confirm()">No</button>'
    +'</div>';
    $('#dialog').html(html);
    $('#dialog').show();
}

function close_dialog_confirm(){
    $('#dialog').hide();
}

$(document).on("click",function(e) {
                    
    var container = $("#menu");
    var img = $("#img_menu");
                       
    if (!container.is(e.target) && !img.is(e.target) && container.has(e.target).length === 0) { 
        onclickMenu(0);
    }
});

function onclickMenu(state){
    var element=Itm('menu');
    if(state===1){
        $('#menu').show();
        Itm("img_menu").setAttribute("onclick","onclickMenu(0)");
    }else{
        $('#menu').hide();
        Itm("img_menu").setAttribute("onclick","onclickMenu(1)");
    }
}