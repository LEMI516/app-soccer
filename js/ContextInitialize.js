var db;
var teamsArray;
var HistoricoTeamsArray;
var teamsCompetenciaArray;
var teamsCompFixtureArray;

function SQL_DATA_BASE_UPLOADED(indx){
    var request = window.indexedDB.open("SoccerDataBase", version);

    request.onerror = function(event) {
        console.log("error: ");
    };
 
    request.onsuccess = function(event) {
        db = request.result;
        if(indx!=-1) eval(executeFun[indx]);
    };
}

function readTeams(indx) {
    var objectStore = db.transaction(["teams"]).objectStore("teams");
    teamsArray=new Array();
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            teamsArray.push(cursor.value);
            cursor.continue();
        }else{
            if(indx!=-1) eval(executeFun[indx]);
        }
    };
}

function readHistoricoTeams(indx) {
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
            if(indx!=-1) eval(executeFun[indx]);
        }
    };
} 

function readHistoricoTeamsByTorneo(index,value,indx) {
    var objectStore = db.transaction(["history"]).objectStore("history");
    var index =  objectStore.index(index).openCursor(IDBKeyRange.only(value));
    HistoricoTeamsArray=new Array();
    index.onsuccess = function(event) {
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
            if(indx!=-1) eval(executeFun[indx]);
        }
    };
}

function readCompetenciaTeam(idtorn,indx) {
    var objectStore = db.transaction(["competencia_team"]).objectStore("competencia_team");
    var index=objectStore.index('id_comp').openCursor(IDBKeyRange.only(idtorn));
    teamsCompetenciaArray=new Array();
    index.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            var team=findTeamByAbre(cursor.value.team,teamsArray);
            var teamComp={id:cursor.value.id,team:team,pos:cursor.value.fasep};
            teamsCompetenciaArray.push(teamComp);
            cursor.continue();
        }else{
            if(indx!=-1) eval(executeFun[indx]);
        }
    };
}

function readCompetenciaFixture(idtorn,indx) {
    var objectStore = db.transaction(["competencia_fixture"]).objectStore("competencia_fixture");
    var index =  objectStore.index('id_comp').openCursor(IDBKeyRange.only(idtorn));
    teamsCompFixtureArray=new Array();
    index.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            var c=cursor.value;
            var team=findTeamByAbre(c.team,teamsArray);
            var object={fix:c,team:team};
            teamsCompFixtureArray.push(object);
            cursor.continue();
        }else{
            if(indx!=-1) eval(executeFun[indx]);
        }
    };
 }

function add(nameobjectStore,objectStore,name_funcion) {
    var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).add(objectStore);
    request.onsuccess = function(event) {
       Tooltip('Operación realizada exitosamente');
       if(name_funcion!= null && name_funcion!= undefined && name_funcion!= '') eval(name_funcion);
    };
    request.onerror = function(event) {
        Tooltip('Ocurrio un error en la base de datos');
    }
}

function deleteById(nameobjectStore,id,name_funcion){
    var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).delete(id);
    request.onsuccess = function(event) {
       Tooltip('Operación realizada exitosamente');
       if(name_funcion!= null && name_funcion!= undefined && name_funcion!= '') eval(name_funcion);
    };
    request.onerror = function(event) {
        Tooltip('Ocurrio un error en la base de datos');
    }
}

function addSimple(nameobjectStore,objectStore) {
    var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).add(objectStore);
}