var db;
var teamsArray;
var HistoricoTeamsArray;

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