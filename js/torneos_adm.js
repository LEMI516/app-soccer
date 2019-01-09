var db;
var torneo;
var teamsArray;
var teamsCompetenciaArray;

$( document ).ready(function() {
    tabs(['EQUIPOS','FIXTURE'],['divEqui','divFix']);
    SQL_DATA_BASE_UPLOADED();
});

function SQL_DATA_BASE_UPLOADED(){
    var request = window.indexedDB.open("SoccerDataBase", 2);
    torneo=JSON.parse(localStorage.getItem('torneo'));
    $('#txt_header').html(torneo.name+" "+torneo.edicion); 

    request.onerror = function(event) {
        console.log("error: ");
    };
 
    request.onsuccess = function(event) {
        db = request.result;
        readTeams();
    };
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
            onloadAddTeam();
            readCompetenciaTeam();
        }
    };
 }

 function onloadAddTeam(){
    var txtypeTeam=ItmV('txtypeTeam');
    if(txtypeTeam==='CLUB'){
        $('#parent').show();
        var teamSel=findTeamsBy('type_conf',['SEL',torneo.plantilla.confederation],teamsArray);
        var html='';
        for(i in teamSel){
            var t=teamSel[i];
            html+=innerOption(t.abre,t.name);
        }
        inyHtml('parent',html);
        serachTeams(1);
    }else{
        $('#parent').hide();
        serachTeams(2);
    }
 }

 function serachTeams(caso){
    var txt=ItmV('txtBuscar');
    var txtypeTeam=ItmV('txtypeTeam'); 
    var parent=ItmV('parent');
    var html='';
    for(i in teamsArray){
        var t=teamsArray[i];
        if(caso===1){
            if(t.type===txtypeTeam && t.parent===parent){
                html+='<tr><td>'+t.name+' '+icon_add('agregar_equipo(\''+t.abre+'\')')+'</td></tr>';
            }
        }else if(caso===2){
            if(t.type===txtypeTeam && t.parent===torneo.plantilla.confederation){
                html+='<tr><td>'+t.name+'</td></tr>';
            }
        }

    }
    inyHtml('teamsSearch',html);
}

function agregar_equipo(abre){
    if(isValidTeamAdd(abre)){
        var nameobjectStore='competencia_team';
        var comp_team={id_comp:torneo.id,team:abre};
        var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).add(comp_team);
        request.onsuccess = function(event) {
            readCompetenciaTeam();
        };
        request.onerror = function(event) {
            Tooltip('Ocurrio un error en la base de datos');
        }
    }
}

function isValidTeamAdd(abre){
    for(i in teamsCompetenciaArray){
        var x=teamsCompetenciaArray[i];
        var t=x.team;
        if(t.abre===abre){
            return false;
        }
    } 
    return true;   
}

function readCompetenciaTeam() {
    var objectStore = db.transaction(["competencia_team"]).objectStore("competencia_team");
    teamsCompetenciaArray=new Array();
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            var team=findTeamByAbre(cursor.value.team,teamsArray);
            var teamComp={id:cursor.value.id,team:team};
            teamsCompetenciaArray.push(teamComp);
            cursor.continue();
        }else{
            onloadTeamsCompetencia();
        }
    };
 }

 function onloadTeamsCompetencia(){
    var html="";
    var i=0;
    var list=teamsArray;
    var html='';
    var i=0;
    for(i in teamsCompetenciaArray){
        var x=teamsCompetenciaArray[i];
        var t=x.team;
        html+='<tr><td>'+t.name+'<b>('+t.parent+')</b> '+icon_elim('dialogEliminarTeam('+x.id+',\''+t.name+'\')')+'</td></tr>';  
    }    
    $('#teams').html(html); 
}

function dialogEliminarTeam(id,name){
    dialog_confirm('¿Esta seguro que desea eliminar a '+name+'?','eliminarTeam('+id+')');
}

function eliminarTeam(id){
    deleteTeam('competencia_team',id,'close_dialog_confirm();readCompetenciaTeam()');
}

function deleteTeam(nameobjectStore,id,name_funcion){
    var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).delete(id);
    request.onsuccess = function(event) {
       Tooltip('Operación realizada exitosamente');
       if(name_funcion!= null && name_funcion!= undefined && name_funcion!= '') eval(name_funcion);
    };
    request.onerror = function(event) {
        Tooltip('Ocurrio un error en la base de datos');
    }
}