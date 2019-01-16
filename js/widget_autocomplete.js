
function autocmp(obj,list){
    var container = $(".dvd_autocompletado");
    if(container!=null && container!=undefined && container.length>0) $(".dvd_autocompletado").remove();
    var value=obj.value.toLowerCase();
    if(value.trim()!=''){    
        var html='<div class="dvd_autocompletado" ><table>';
        for(i in list){
            var l=list[i];
            txt=l.text.toLowerCase();
            if(txt.indexOf(value)>=0 ){
                html+='<tr onclick="onk(\''+obj.id+'\',this)" data-id="'+l.value+'" data-text="'+l.text+'"><td>'+l.text+'</td></tr>'
            }           
        }
        html+='</table></div>';
        $(html).insertAfter($("#"+obj.id));
    }
}


$(document).on("click",function(e) {
                    
    var container = $(".dvd_autocompletado");

    if(container!=null && container!=undefined && container.length>0){
        if (!container.is(e.target) && container.has(e.target).length === 0) { 
            $(".dvd_autocompletado").remove();
        }
    }
});

function onk(id,tr){
    var text=tr.dataset.text;
    $("#"+id).val(text);
    document.getElementById(id).dataset.autoid=tr.dataset.id;
    $(".dvd_autocompletado").remove();
}