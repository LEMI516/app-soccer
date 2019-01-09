var db;
var torneo;
var teamsArray;
var teamsCompetenciaArray;
var fasesArray;
var groupSelected=-1;

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
                html+='<tr><td>'+t.name+' '+icon_add('agregar_equipo(\''+t.abre+'\')')+'</td></tr>';
            }
        }

    }
    inyHtml('teamsSearch',html);
}

function agregar_equipo(abre){
    if(isValidTeamAdd(abre)){
        var nameobjectStore='competencia_team';
        var comp_team={id_comp:torneo.id,team:abre,fasep:0};
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
            var teamComp={id:cursor.value.id,team:team,pos:cursor.value.fasep};
            teamsCompetenciaArray.push(teamComp);
            cursor.continue();
        }else{
            onloadTeamsCompetencia();
            buildFixture();
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
        html+='<tr><td>'+(parseInt(i)+1)+'.'+t.name+'<b>('+t.parent+')</b> '+icon_elim('dialogEliminarTeam('+x.id+',\''+t.name+'\')')+'</td></tr>';  
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

function buildFixture(){
    var html='',html2='';
    fasesArray=new Array();
    if(torneo.plantilla.typeTorneo=='CGI'){
        var f=torneo.plantilla.cff.split(':');
        html+='<div class="fases" >FASE GRUPOS</div>';
        html2+=innerOption('','FASE...');
        html2+=innerOption('FG','FASE GRUPOS');
        fasesArray.push({id:'FG',pos:0,name:'FASE GRUPOS',n:torneo.plantilla.cantTeamxGru,n2:torneo.plantilla.cantGru});
        for(i in f){
            var id=parseInt(i)+1;
            html+='<div class="fases" >FASE #'+(id)+'</div>';
            html2+=innerOption('F'+id,'FASE '+id);
            fasesArray.push({id:'F'+id,pos:id,name:'FASE '+id,n:f[i],n2:0});
        }
    }
    inyHtml('divFixChild',html);
    inyHtml('selFases',html2);
}

function iniFase(){
    var idfase=ItmV('selFases');
    if(idfase!=undefined && idfase!=''){
        var fase=findEntityBy(idfase,fasesArray);
        if(fase.id=='FG'){
            var teamsFase=findTeamsforFase(fase.pos,teamsCompetenciaArray);
            var html='';
            var i=0;
            for(i in teamsFase){
                var x=teamsFase[i];
                var t=x.team;
                html+='<tr id="tr_ttff_'+t.abre+'" ><td>'+t.name+'<b>('+t.parent+')</b> '+icon_add('agregar_equipo_fase(\''+t.abre+'\')')+'</td></tr>';  
            }    
            $('#tableTeamsforFase').html(html);
            var html2='';var k=0;
            for(i=1;i<=parseInt(fase.n2);i++){
                html2+='<tr id="GP'+i+'" onclick="selectedGroup(this.id)" ><td><b>GRUPO '+i+'</b></td></tr>';  
            }
            $('#teamsTemasFase').html(html2);
        }
    }
}

function selectedGroup(id){
    groupSelected=id;
}

function agregar_equipo_fase(abre){
    var t=findTeamByAbre(abre,teamsArray);
    var idfase=ItmV('selFases');
    var fase=findEntityBy(idfase,fasesArray);
    if(fase.id=='FG'){
        if(groupSelected!=-1){
            $('#tr_ttff_'+abre).hide();
            var html='';
            html='<tr id="tr_tf_'+t.abre+'" name="tr_tfs" data-subfase="'+groupSelected+'" data-value="'+t.abre+'" ><td>'+t.name+'<b>('+t.parent+')</b> '+icon_elim('eliminarTeaminFase(\''+t.abre+'\')')+'</td></tr>';  
            $(html).insertAfter($("#"+groupSelected));
        }
    }

}

function eliminarTeaminFase(abre){
    $('#tr_tf_'+abre).remove();
    $('#tr_ttff_'+abre).show();
}

function createFixture(){
    var teams=Itms('tr_tfs');
    var idfase=ItmV('selFases');
    for(var i=0;i<teams.length;i++){
        var abre=teams[i].dataset.value;
        var idsubfase=teams[i].dataset.subfase;
        var comp_fix={id_comp:torneo.id,team:abre,idfase:idfase,idsubfase:idsubfase};
        db.transaction(['competencia_fixture'], "readwrite").objectStore('competencia_fixture').add(comp_fix);
    }
    $('#teamsTemasFase').html('');
}

