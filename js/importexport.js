var db;
var teamsArray;

$( document ).ready(function() {
    SQL_DATA_BASE_UPLOADED();
});

function SQL_DATA_BASE_UPLOADED(){
    var request = window.indexedDB.open("SoccerDataBase", version);

    request.onerror = function(event) {
        console.log("error: ");
    };
 
    request.onsuccess = function(event) {
        db = request.result;
        console.log("success");
        readTeams();
    };
}

function pasteTxt(){
    var texto=document.execCommand("paste");
    Tooltip('Se ha pegado el texto en portapapeles');
    Itm('container_json_import').innerHTML=texto;
}

function limpiarTexto(){
    Itm('container_json_import').value='';
    var barLoad=Itm('bar_load');
    var barLoadChild=Itm('bar_load_child');
    $(barLoad).hide();   
    $(barLoadChild).css({"width": "0%"});
    $(barLoadChild).html("");     
}

function cargarBaseDatos(){
    var tabla=ItmV('tabla');
    if(tabla==='team'){
        loadTeamDataBase();
    }
}


function loadTeamDataBase(){
    var json_txt=Itm('container_json_import').value.trim(); 
    var barLoad=Itm('bar_load');
    var barLoadChild=Itm('bar_load_child');
    $(barLoad).hide();
    if(json_txt!=''){
        var list=JSON.parse(json_txt);
        $(barLoad).show();
        var tam=list.length;
        var count=0;
        for(var i=0;i<list.length;i++){
            var t=list[i];
            var conf,parent,type='SEL',aux='';
            try {
                conf=t.confederacion;
                conf.trim();
                parent=conf;
                aux=t.id;
            }catch(error){
                type='CLUB';
                var p=findSelectionById(t.id_seleccion,teamsArray);
                if(p===null){
                    conf='';parent='';
                }else{
                    conf=p.conf;
                    parent=p.abre;
                }
                aux=t.id;
            }
            var abreviatura=t.abreviatura.toUpperCase();
            var isTam=isAbreviatura(abreviatura,list);
            var abreTeam=findTeamByAbre(abreviatura,teamsArray);
            if(isTam> 1 || abreTeam!=null){
                abreviatura=abreviatura+''+count;
            }
            var abreTeam=findTeamByAbre(abreviatura,teamsArray);
            count++;
            var porcentaje=parseFloat((100*count)/tam);
            var resultado = Math.round(porcentaje*Math.pow(10,2))/Math.pow(10,2);
            var team={ conf:conf,type:type,parent:parent,name:t.nombre.toUpperCase(),abre:abreviatura,aux:aux };
            add("teams",team,'',t.nombre.toUpperCase());
            $(barLoadChild).css({"width": porcentaje+"%"});
            $(barLoadChild).html(resultado+"%");
        }
        Itm('container_json_import').value='';
        readTeams();
    }
}

function findSelectionById(aux,list){
    for(i in list){
        var t=list[i];
        if(parseInt(t.aux)==parseInt(aux)){
            return t;
        }
    }
    return null;   
}

function isAbreviatura(abre,list){
    var array=new Array();
    var i=0;
    for(i=0;i<list.length;i++){
        var t=list[i];
        if(t.abreviatura===abre){
            array.push(t);
        }
    }
    return array.length;    
}


function add(nameobjectStore,objectStore,name_funcion,msj) {
    var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).add(objectStore);
    request.onsuccess = function(event) {
       if(name_funcion!= null && name_funcion!= undefined && name_funcion!= '') eval(name_funcion);
       
    };
    request.onerror = function(event) {
        console.log('Error '+msj);
    }
 }

 function readTeams() {
    var objectStore = db.transaction(["teams"]).objectStore("teams");
    teamsArray=new Array();
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            teamsArray.push(cursor.value);
            cursor.continue();
        }
    };
 }