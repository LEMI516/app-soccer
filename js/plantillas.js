var db;
var plantillasArray;
var idBtnDialogFase;

$( document ).ready(function() {
    SQL_DATA_BASE_UPLOADED();
});

function SQL_DATA_BASE_UPLOADED(){
    var request = window.indexedDB.open("SoccerDataBase", 2);

    request.onerror = function(event) {
        console.log("error: ");
    };
 
    request.onsuccess = function(event) {
        db = request.result;
        readPlantillas(); 
    };
}

function onchangeCreatePlantillas(){
    var typeTorneo=ItmV('typeTorneo');
    var idsS='',idsH='';
    if(typeTorneo!=''){
        if(typeTorneo=='LG'){
            idsH='cantGru|cantTeamxGru|cantClaxGru|cantMejTerceros|btnCfp|btnCff';
        }else if(typeTorneo=='CE'){
            idsS='btnCff';
        }else if(typeTorneo=='CGI'){
            idsS='cantGru|cantTeamxGru|cantClaxGru|cantMejTerceros|btnCff';
            idsH='btnCfp';
        }else if(typeTorneo=='CGFP'){
            idsS='cantGru|cantTeamxGru|cantClaxGru|cantMejTerceros|btnCff|btnCfp';
        }
    }else{
        idsH='cantGru|cantTeamxGru|cantClaxGru|cantMejTerceros|btnCfp|btnCff';
    }
    if(idsS!='') groupShow(idsS);
    if(idsH!='') groupHide(idsH);    
}

function ConfigurarFases(idBtn){
    var btn=Itm(idBtn);
    idBtnDialogFase=idBtn;
    var valor=btn.dataset.value;
    if(valor==undefined) valor='';
    var des=Itm('description');
    var lbl=Itm('idFase');
    if(valor===''){
        lbl.innerHTML='Fase #1';
        des.innerHTML='';
    }else{
        var f=valor.split(':');
        lbl.innerHTML='Fase #'+(f.length+1);
        var htm='';        
        for(var i=0;i<f.length;i++){
            htm+='Fase '+(i+1)+': '+f[i]+' Equipos <br>';
        }
        des.innerHTML=htm;
    }
}

function addFase(){
    var nequi=ItmV('fase');
    var btn=Itm(idBtnDialogFase);
    var valor=btn.dataset.value;
    if(valor==undefined) valor='';
    if(nequi=='0'){
        Itm(idBtnDialogFase).dataset.value='';
        return;
    }
    if(nequi!=''){
        valor=(valor!='')? valor+':'+nequi:nequi;
        btn.dataset.value=valor;
    }    

}

function addPlantilla(){
    var confederation=ItmV('confederation');
    var typeTeam=ItmV('typeTeam');
    var typeTorneo=ItmV('typeTorneo');
    var typeMatch=ItmV('typeMatch');
    var cantTeam=ItmV('cantTeam');
    var cantGru=ItmV('cantGru');
    var cantTeamxGru=ItmV('cantTeamxGru');
    var cantClaxGru=ItmV('cantClaxGru');
    var cantMejTerceros=ItmV('cantMejTerceros');
    var namePlanti=ItmV('namePlanti').toUpperCase();
    var cff=Itm('btnCff').dataset.value;
    var cfp=Itm('btnCfp').dataset.value;

    var elements='confederation|typeTeam|typeTorneo|typeMatch|cantTeam|namePlanti';
    if(typeTorneo=='CGI') elements+='|cantGru|cantTeamxGru|cantClaxGru';
    else if(typeTorneo=='CGFP') elements+='|cantGru|cantTeamxGru|cantClaxGru';

    var isValid=isValidValues(elements);
    if(isValid){
        if((cff==undefined || cff=='') && (typeTorneo=='CGI' || typeTorneo=='CE' || typeTorneo=='CGFP')){
            Tooltip('Debe configurar la fase final');
            return;
        }
        if((cfp==undefined || cfp=='') && (typeTorneo=='CGFP')){
            Tooltip('Debe configurar la fase previa');
            return;
        }            
        var plantilla={ 
            name:namePlanti,
            confederation:confederation,
            typeTeam:typeTeam,
            typeTorneo:typeTorneo,
            typeMatch:typeMatch,
            cantTeam:cantTeam, 
            cantGru:cantGru,
            cantTeamxGru:cantTeamxGru,
            cantClaxGru:cantClaxGru,
            cantMejTerceros:cantMejTerceros,
            cff:cff,cfp:cfp
        };
        add("plantilla",plantilla,'cleanValues()');        
    }else{
        Tooltip('Debe ingresar todos los datos');
    }
}

function cleanValues(){
    cleanFields('confederation|typeTeam|typeTorneo|typeMatch|cantTeam|cantGru|cantTeamxGru|cantClaxGru|cantMejTerceros|namePlanti');
    Itm('btnCff').dataset.value='';
    Itm('btnCfp').dataset.value='';    
    onchangeCreatePlantillas();
}

function add(nameobjectStore,objectStore,name_funcion) {
    var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).add(objectStore);
    request.onsuccess = function(event) {
       Tooltip('Operación realizada exitosamente');
       if(name_funcion!= null && name_funcion!= undefined && name_funcion!= '') eval(name_funcion);
       readPlantillas()
    };
    request.onerror = function(event) {
        Tooltip('Ocurrio un error en la base de datos');
    }
 }

 function readPlantillas() {
    var objectStore = db.transaction(["plantilla"]).objectStore("plantilla");
    plantillasArray=new Array();
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            plantillasArray.push(cursor.value);
            cursor.continue();
        }else{
            plantillasArray=depureArray(plantillasArray);
            searchGeneral('0');
        }
    };    
 }

 function searchGeneral(opc){
    var html="";
    var i=0;
    var list=plantillasArray;
    var html='';
    var i=0;
    for(i in list){
        var t=list[i];
        //OPCION 0 - TODOS
        if(opc==='0'){
            var c=t;
            var pk=parseInt(c.id);
            var fun="onclickTorneoAdm("+pk+")";
            html+='<li >'
                    +'<a onclick="dialog_show_pla('+pk+')" href="#">'+c.name+'</a>'
                    +'<a data-icon="delete" onclick="dialogEliminarPlantilla('+c.id+',\''+c.name+'\')" href="#"></a>'
                +'</li>';            
        }        
    }    
    $('#torneos').html(html); 
    $("#torneos").listview('refresh');    
}

function dialogEliminarPlantilla(id,name){
    dialog_confirm('¿Esta seguro que desea eliminar la plantilla '+name+' ?','eliminarPlantilla('+id+')');
}

function eliminarPlantilla(id){
    deletePlantilla('plantilla',id,'');
}

function deletePlantilla(nameobjectStore,id,name_funcion){
    var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).delete(id);
    request.onsuccess = function(event) {
       Tooltip('Operación realizada exitosamente');
       if(name_funcion!= null && name_funcion!= undefined && name_funcion!= '') eval(name_funcion);
       readPlantillas();
    };
    request.onerror = function(event) {
        Tooltip('Ocurrio un error en la base de datos');
    }
}

function dialog_show_pla(id){
    showPlantilla(id);
    dialog('dialog_show_plantilla');
}

function showPlantilla(id){
    var p=findById(plantillasArray,id);
    inyHtml('container_show_plantilla',""); 
    var html='<table class="tdialog" style="" >'
               +'<tr><td width="40%" ><b>Nombre:</b></td><td width="60%">'+p.name+'</td></tr>'
               +'<tr><td><b>CONF/ON:</b></td><td>'+p.confederation+'</td></tr>'
               +'<tr><td><b>EQUIPOS:</b></td><td>'+p.typeTeam+'</td></tr>'
               +'<tr><td><b>TIPO:</b></td><td>'+name_type_torneo(p.typeTorneo)+'</td></tr>'
               +'<tr><td><b>PARTIDOS:</b></td><td>'+name_type_match(p.typeMatch)+'</td></tr>'
               +'<tr><td><b>N° EQUIPOS:</b></td><td>'+p.cantTeam+'</td></tr>'
               +'<tr><td><b>N° GRUPOS:</b></td><td>'+p.cantGru+'</td></tr>'
               +'<tr><td><b>N° EQUIxGRU:</b></td><td>'+p.cantTeamxGru+'</td></tr>'
               +'<tr><td><b>N° CLAxGRU:</b></td><td>'+p.cantClaxGru+'</td></tr>'
               +'<tr><td><b>N° MEJTER:</b></td><td>'+p.cantMejTerceros+'</td></tr>'
               +'<tr><td><b>FASE FINAL:</b></td><td>'+p.cff+'</td></tr>'
               +'<tr><td><b>FASE PREVIA:</b></td><td>'+p.cfp+'</td></tr>'
            +'</table>';
    inyHtml('container_show_plantilla',html);       
}