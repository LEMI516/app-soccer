var db;
var teamsArray;
var defaultSelected='';

$( document ).ready(function() {
    innerSelectSimple('confederationTeam',confederaciones);
    innerSelectSimple('confederationTeamUpdate',confederaciones);
    llenarListaColores();
    SQL_DATA_BASE_UPLOADED();
});

function SQL_DATA_BASE_UPLOADED(){
    var request = window.indexedDB.open("SoccerDataBase", version);

    request.onerror = function(event) {
        console.log("error: ");
    };
 
    request.onsuccess = function(event) {
        db = request.result;
        readTeams();
    };
}

function loadParents(){
    var value=$('#typeTeam').val();
    var conf=$('#confederationTeam').val();
    var selParent=Itm('parentTeam');
    var list=teamsArray;
    var html='';
    var i=0;
    for(i in list){
        var t=list[i];
        if(t.conf===conf && t.type==='SEL'){
            html+='<option value="'+t.abre+'" >'+t.name+'</option>';
        }
    }
    selParent.innerHTML=html; 
    selParent.value=defaultSelected;   
}

function typeTeam(value){
    if(value=='CLUB') $('#parentTeam').parent().show();
    else  $('#parentTeam').parent().hide();
}

function readTeams() {
    var objectStore = db.transaction(["teams"]).objectStore("teams");
    teamsArray=new Array();
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            teamsArray.push(cursor.value);
            cursor.continue();
        }else{
            loadParents();
            searchGeneral('0',[$('#txtypeTeam').val()]);
        }
    };
 }

 function addTeam(){
    var type=$('#typeTeam').val(); 
    var elements=(type==='CLUB')?'confederationTeam|typeTeam|parentTeam|name|abreviatura|color':'confederationTeam|typeTeam|name|abreviatura|color';
    var isValid=isValidValues(elements);
    if(isValid){
        var v=values(elements);
        var team;
        if(type==='CLUB') team={ conf:v[0],type:v[1],parent:v[2],name:v[3].toUpperCase(),abre:v[4].toUpperCase(),aux:0,color:v[5] };
        else team={ conf:v[0],type:v[1],parent:v[0],name:v[2].toUpperCase(),abre:v[3].toUpperCase(),aux:0,color:v[4] };
        defaultSelected=v[2];
        add("teams",team,'cleanValues()');
    }else{
        Tooltip('Debe ingresar todos los datos');
    }
}

function cleanValues(){
    cleanFields('name|abreviatura|colorSelect|color');
}

function add(nameobjectStore,objectStore,name_funcion) {
    var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).add(objectStore);
    request.onsuccess = function(event) {
       Tooltip('Operación realizada exitosamente');
       if(name_funcion!= null && name_funcion!= undefined && name_funcion!= '') eval(name_funcion);
       readTeams()
    };
    request.onerror = function(event) {
        Tooltip('Ocurrio un error en la base de datos');
    }
 }

function searchTeams(){
    var txSearch=$('#search_teams').val();
    var txType=$('#txtypeTeam').val();
    if(txSearch.trim()!==''){
        searchGeneral('1',[txSearch,txType]);
    }else{
        searchGeneral('0',[txType]);
    }
}

function searchGeneral(opc,params){
    var html="";
    var i=0;
    var list=teamsArray;
    var html='';
    var i=0,k=0;
    for(i in list){
        var t=list[i];
        //OPCION 0 - TODOS
        if(opc==='0'){
            if(t.type===params[0] || params[0]==='ALL'){
                html+='<li >'
                        +'<a onclick="updateTeam(\''+t.abre+'\')" href="#"><h2>'+(k+1)+'.'+logo(t.color)+t.name+'</h2><p>'+t.abre+' - '+t.parent+'</p></a>'
                        +'<a data-icon="delete" onclick="dialogEliminarTeam('+t.id+',\''+t.name+'\')" href="#"></a>'
                      +'</li>';
                k++;
            }
        }        
        //OPCION 1 - BUSCAR POR TEXTO
        else if(opc==='1'){
            var name=t.name.toLowerCase();
            if(name.indexOf(params[0].toLowerCase())>=0 && (t.type===params[1] || params[1]==='ALL')){
                html+='<li >'
                        +'<a onclick="updateTeam(\''+t.abre+'\')" href="#"><h2>'+(k+1)+'.'+logo(t.color)+t.name+'</h2><p>'+t.abre+' - '+t.parent+'</p></a>'
                        +'<a data-icon="delete" onclick="dialogEliminarTeam('+t.id+',\''+t.name+'\')" href="#"></a>'
                      +'</li>';                
                k++;
            }
        }        
    }    
    $('#teams').html(html); 
    $("#teams").listview('refresh'); 
}

function changeTypeTeams(){
    var type=$('#txtypeTeam').val();
    searchGeneral('0',[type]);
}

function dialogEliminarTeam(id,name){
    dialog_confirm('¿Esta seguro que desea eliminar a '+name+'?','eliminarTeam('+id+')');
}

function eliminarTeam(id){
    deleteTeam('teams',id,'searchTeams();');
}

function deleteTeam(nameobjectStore,id,name_funcion){
    var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).delete(id);
    request.onsuccess = function(event) {
       Tooltip('Operación realizada exitosamente');
       if(name_funcion!= null && name_funcion!= undefined && name_funcion!= '') eval(name_funcion);
       readTeams()
    };
    request.onerror = function(event) {
        Tooltip('Ocurrio un error en la base de datos');
    }
}

function updateTeam(abre){
    var t=findTeamByAbre(abre,teamsArray);
    Itm('hddTypeTeamUpdate').value=t.type;
    Itm('hddAbreviaturaActually').value=t.abre;
    Itm('confederationTeamUpdate').value=t.conf;
    Itm('colorUpdate').value=t.color;
    $("#confederationTeamUpdate").prev().html(t.conf);
    Itm('nameUpdate').value=t.name;
    Itm('abreviaturaUpdate').value=t.abre;
    loadParentsUpdate();
    dialog('dialog_modify_team');
}

function loadParentsUpdate(){
    var value=$('#hddTypeTeamUpdate').val();
    if(value=='SEL'){
        $('#parentTeamUpdate').parent().hide();
    }else{
        $('#parentTeamUpdate').parent().show();
        var t=findTeamByAbre(ItmV('abreviaturaUpdate'),teamsArray);
        var defaultT=t.parent;
        var conf=$('#confederationTeamUpdate').val();
        var selParent=Itm('parentTeamUpdate');
        var list=teamsArray;
        var html='';
        var i=0;
        var isExiste=false;
        var nameParent='';
        for(i in list){
            var t=list[i];
            if(t.conf===conf && t.type==='SEL'){
                html+='<option value="'+t.abre+'" >'+t.name+'</option>';
            }
            if(t.abre==defaultT){
                isExiste=true;
                nameParent=t.name;
            }
        }
        selParent.innerHTML=html; 
        selParent.value=defaultT;
        if(isExiste) $("#parentTeamUpdate").prev().html(nameParent);
    }
   
}

function updateTeamBase() {
    var type=$('#hddTypeTeamUpdate').val(); 
    var conf=ItmV('confederationTeamUpdate');
    var parent=ItmV('parentTeamUpdate');
    var name=ItmV('nameUpdate');
    var abre=ItmV('abreviaturaUpdate');
    var abre=ItmV('abreviaturaUpdate');
    var abraAnt=ItmV('hddAbreviaturaActually');
    var color=ItmV('colorUpdate');
    var elements=(type==='CLUB')?'confederationTeamUpdate|parentTeamUpdate|nameUpdate|abreviaturaUpdate':'confederationTeamUpdate|nameUpdate|abreviaturaUpdate';
    var isValid=isValidValues(elements);
    var team=findTeamByAbre(abraAnt,teamsArray);
    if(isValid){
        var objectStore = db.transaction(["teams"],"readwrite").objectStore("teams");
        var index =  objectStore.index('id').openCursor(IDBKeyRange.only(team.id));
        index.onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                var object=cursor.value;
                if(type==='SEL'){
                    object.conf=conf;
                    object.name=name.toUpperCase();
                    object.abre=abre.toUpperCase();
                    object.color=color;
                    object.parent=conf;
                }else{
                    object.conf=conf;
                    object.name=name.toUpperCase();
                    object.abre=abre.toUpperCase();
                    object.parent=parent;
                    object.color=color;
                }
                var res = cursor.update(object);
                cursor.continue();
            }else{
                Tooltip('Registro Actualizado'); 
                close_dialog();
                readTeams();
            }
        };
    }else{
        Tooltip('Debe ingresar todos los datos');

    }
}

function llenarListaColores(){
    var colores=colours();
    var html='';
    html='<option value="" >Defecto...</option>';
    for(var i=0;i<colores.length;i++){
        html+='<option value="'+colores[i]+'" style="background-color:'+colores[i]+'" >'+colores[i]+'</option>';
    }
    Itm('colorSelect').innerHTML=html; 
}

function onchangeColor(){
    var valcolor=ItmV('colorSelect');
    var obj=Itm('color');
    if(valcolor.trim()!=''){
        obj.value=(obj.value.trim()=='')?valcolor:obj.value.trim()+':'+valcolor
    }else{
        obj.value='';
    }
}