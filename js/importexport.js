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
    }else if(tabla==='history'){
        loadHistoryDataBase();
    }
}

/* PROCESO DE CARGUE MASIVO DE EQUIPOS ATRAVES DE UN JSON */
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
            var team={ conf:conf,type:type,parent:parent,name:t.nombre.toUpperCase(),abre:abreviatura,aux:aux,color:''};
            add("teams",team,'',t.nombre.toUpperCase());
            $(barLoadChild).css({"width": porcentaje+"%"});
            $(barLoadChild).html(resultado+"%");
        }
        Tooltip('Total procesados '+count+'/'+tam);
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

 /* PROCESO DE CARGUE MASIVO DE HISTORIAL ATRAVES DE UN JSON */
 function loadHistoryDataBase(){
    var json_txt=Itm('container_json_import').value.trim(); 
    var barLoad=Itm('bar_load');
    var barLoadChild=Itm('bar_load_child');
    $(barLoad).hide();
    if(json_txt!=''){
        var list=JSON.parse(json_txt);
        $(barLoad).show();
        var tam=list.length;
        var count=0,noencontrados=0;
        for(var i=list.length-1;i>=0;i--){
            var h=list[i];
            var torneo=import_id_torneo(h.id_torneo);
            if(torneo==null) continue;
            count++;
            var porcentaje=parseFloat((100*count)/tam);
            var resultado = Math.round(porcentaje*Math.pow(10,2))/Math.pow(10,2);
            var Tcam=findTeamByName(h.campeon,teamsArray);
            var Tsub=findTeamByName(h.subcampeon,teamsArray);
            var Tter=findTeamByName(h.tercero,teamsArray);
            var Tcuar=findTeamByName(h.cuarto,teamsArray);
            if(Tcam==null || Tsub==null || Tter==null || Tcuar==null){
                noencontrados++;
                continue
            }
            cam=Tcam.abre;
            sub=Tsub.abre;
            ter=Tter.abre;
            cuar=Tcuar.abre;
            var historico={ torn:torneo,cam:cam,sub:sub,ter:ter,cuar:cuar,comp:'' };
            add("history",historico,'','');
            $(barLoadChild).css({"width": porcentaje+"%"});
            $(barLoadChild).html(resultado+"%");
        }
        Tooltip('Total procesados '+count+'/'+tam);
        Itm('container_json_import').value='';
        if(noencontrados>0) Tooltip('Total '+noencontrados+' no encontrados');
    }
}

function sincronizarData(){
    var table=ItmV('tablaExport');
    var ope=ItmV('operacion');
    var uri;
    
    if(ope==='POST'){
        if(table=='teams') uri='teams/';
        else if(table=='history') uri='historys/';
        else if(table=='plantilla') uri='plantillas/';
        else if(table=='competencia') uri='competencias/';
        else if(table=='competencia_team') uri='competencia_teams/';
        else if(table=='competencia_fixture') uri='competencia_fixtures/';
        else{
            Tooltip('Operación no valida'); 
            return;
        }
        readData(table,uri);
    }else{
        if(table=='teams') uri='allteams/';
        else if(table=='history') uri='allhistorys/';
        else if(table=='plantilla') uri='allplantillas/';
        else{
            Tooltip('Operación no valida'); 
            return;
        }
        receivedData(uri,table);
    }
}

function readData(table,uri) {
    var objectStore = db.transaction([table]).objectStore(table);
    var dataArray=new Array();
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            dataArray.push(cursor.value);
            cursor.continue();
        }else{
            sendDataExport(dataArray,uri); 
        }
    };
 }

var funAnimateVar; 

function sendDataExport(dataArray,uri){
    var ip=ItmV('ipServer').trim();
    if(ip!=''){
        var json=JSON.stringify(dataArray);
        var url=ip+'/apisoccerhistory/'+uri;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Credentials', 'false');
        headers.append('Access-Control-Allow-Methods','POST');

        try {
            $.ajax({
                type: 'POST',
                headers: headers,
                dataType: 'json',
                contentType : "application/json",
                data: json,
                url: url,
                beforeSend: function () {
                    funAnimateVar=setInterval(animate_bar_load, 100); 
                },
                success: function (data) {
                    stop_animate_bar_laod();
                    if(data.result){
                        Tooltip('Proceso realizado exitosamente');
                    }else{
                        Tooltip('Error al enviar datos, causa:'+data.msg);
                    }
                    //console.log(data);
                },
                error : function(data) { 
                    stop_animate_bar_laod();
                    console.log(data);
                    Tooltip('Ocurrio un error al sincronizar datos');
                } 
            });            
        } catch (error) {
            Tooltip('Ocurrio un error al sincronizar datos, causa:'+error);
            stop_animate_bar_laod();
        }
    }
}

function receivedData(uri,type){
    var ip=ItmV('ipServer').trim();
    if(ip!=''){
        var url=ip+'/apisoccerhistory/'+uri;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Credentials', 'false');
        headers.append('Access-Control-Allow-Methods','GET');

        try {
            $.ajax({
                type: 'GET',
                headers: headers,
                dataType: 'json',
                url: url,
                beforeSend: function () {
                    funAnimateVar=setInterval(animate_bar_load, 100); 
                },
                success: function (data) {
                    onloadEntityDataBase(type,data)
                    stop_animate_bar_laod();
                    //console.log(data);
                    //Tooltip('Proceso realizado exitosamente');
                },
                error : function(data) { 
                    stop_animate_bar_laod();
                    console.log(data);
                    Tooltip('Ocurrio un error al sincronizar datos');
                } 
            });            
        } catch (error) {
            Tooltip('Ocurrio un error al sincronizar datos, causa:'+error);
            stop_animate_bar_laod();
        }
    }
}

 function animate_bar_load(){
    var div=Itm('bar_load_ani');
    var bars=Itms('bl');
    if(bars.length>=17){
        div.innerHTML='';
    }else{
        div.innerHTML=div.innerHTML+'<div name="bl"></div>';
    }
}

function stop_animate_bar_laod(){
    clearInterval(funAnimateVar);
    Itm('bar_load_ani').innerHTML='';
}