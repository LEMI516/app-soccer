var db;
var teamsArray;
var HistoricoTeamsArray;


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
        readTeams();
    };
}

function autoCompletarTeams(obj){
    autocmp(obj,convertListAuto(teamsArray)); 
}

function addHistorico(){
    var torneo=$('#txtypeTorneo').val(); 
    var cam=Itm('txCam').dataset.autoid;
    var sub=Itm('txSub').dataset.autoid;
    var ter=Itm('txTer').dataset.autoid;
    var cuar=Itm('txCuar').dataset.autoid;
    var valores=[torneo,cam,sub,ter,cuar];
    var isValid=isValidValuesElements(valores);
    if(isValid){
        var historico={ torn:torneo,cam:cam,sub:sub,ter:ter,cuar:cuar };
        add("history",historico,'cleanValues();');
    }else{
        Tooltip('Debe ingresar todos los datos');
    }
}

function cleanValues(){
    cleanFields('txtypeTorneo|txCam|txSub|txTer|txCuar');
}

function add(nameobjectStore,objectStore,name_funcion) {
    var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).add(objectStore);
    request.onsuccess = function(event) {
       Tooltip('Operación realizada exitosamente');
       if(name_funcion!= null && name_funcion!= undefined && name_funcion!= '') eval(name_funcion);
       readHistoricoTeams();
    };
    request.onerror = function(event) {
        Tooltip('Ocurrio un error en la base de datos');
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
        }else{
            readHistoricoTeams()
        }
    };
 }

function convertListAuto(list){
    var autoList=new Array();
    for(i in list){
        var ele=list[i];
        var auto={value:ele.abre,text:ele.name}
        autoList.push(auto);
    } 
    return autoList;
}

function readHistoricoTeams() {
    var objectStore = db.transaction(["history"]).objectStore("history");
    HistoricoTeamsArray=new Array();
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            var val=cursor.value;
            var tgan=findTeamByAbre(val.cam,teamsArray);
            var tsub=findTeamByAbre(val.sub,teamsArray);
            var tter=findTeamByAbre(val.ter,teamsArray);
            var tcuar=findTeamByAbre(val.cuar,teamsArray);
            var history={id:val.id,tor:val.torn,cam:tgan,sub:tsub,ter:tter,cuar:tcuar};
            HistoricoTeamsArray.push(history);
            cursor.continue();
        }else{
            buildListHistory();
        }
    };
 }

function buildListHistory(){
    var tor=ItmV('txtTorneoHistory');
    var html='';
    var j=0;
    if(tor!=''){
        for(var i=HistoricoTeamsArray.length-1;i>=0;i--){
            var his=HistoricoTeamsArray[i];
            if(his.tor===tor){
                j++ 
                html+='<div >'
                        +'<h3>Edicion '+j+'</h3>'
                        +'<h1>'+his.cam.name+' ('+his.cam.parent+')<img src="../img/icon_trofeo.png" class="img_tro" /></h1>'
                        +'<h2>'+his.sub.name+'('+his.sub.parent+')</h2>'
                        +'<h4>'+his.ter.name+'('+his.ter.parent+') - '+his.cuar.name+'('+his.cuar.parent+')</h4>'
                    +'</div>';
            }
        }
    }
    $('#history').html(html); 
   // $("#history").listview('refresh');    
}