var db=null;

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
        console.log("success: "+ db);
    };

    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        //Table teams
        var objectStore = db.createObjectStore("teams", {keyPath: "id", autoIncrement:true});
        objectStore.createIndex("id", "id", { unique: true });    
        objectStore.createIndex("abre", "abre", { unique: true });
        objectStore.createIndex("id_parent", "id_parent", { unique: false });
        //Table historial
        objectStore = db.createObjectStore("history", {keyPath: "id", autoIncrement:true});
        objectStore.createIndex("id", "id", { unique: true });
        objectStore.createIndex("idteam", "idteam", { unique: false });
        objectStore.createIndex("idparent", "idparent", { unique: false });   
        //Table plantilla
        objectStore = db.createObjectStore("plantilla", {keyPath: "id", autoIncrement:true});
        objectStore.createIndex("id", "id", { unique: true });         
        //Table competencia
        objectStore = db.createObjectStore("competencia", {keyPath: "id", autoIncrement:true});
        objectStore.createIndex("id", "id", { unique: true });
        //Table competencia equipo
        objectStore = db.createObjectStore("competencia_team", {keyPath: "id", autoIncrement:true});
        objectStore.createIndex("id", "id", { unique: true });
        objectStore.createIndex("id_comp", "id_comp", { unique: false });
        //Table competencia fixture
        objectStore = db.createObjectStore("competencia_fixture", {keyPath: "id", autoIncrement:true});
        objectStore.createIndex("id", "id", { unique: true });
        objectStore.createIndex("id_comp", "id_comp", { unique: false });              
        console.log("tablas creadas exitosamente");
    }
}



 function add(nameobjectStore,objectStore) {
    var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).add(objectStore);
    request.onsuccess = function(event) {
       alert("Operación realizada exitosamente");
    };
    request.onerror = function(event) {
       alert("Opps, ocurrio un error al realizar la operación");
    }
 }

 function readTeams(opc) {
    var objectStore = db.transaction(["teams"]).objectStore("teams");
    var teamsArray=new Array();
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            teamsArray.push(cursor.value);
            cursor.continue();
        }else{
            if(opc==='1') loadTeams(teamsArray);
        } 
    };
 }


 /*function loadTeamDataBase(){
    var list=load_teams(1);
    for(i in list.teams){
        var t=list.teams[i];
        var team={ conf:t.confederacion,type:'SEL',parent:t.confederacion,name:t.nombre,abre:t.abreviatura };
        add("teams",team);
    }
    var list=load_teams(2);
    for(i in list.teams){
        var t=list.teams[i];
        var sel=findSelectionById(t.id_seleccion);
        var team={ conf:sel.confederacion,type:'CLUB',parent:sel.abreviatura,name:t.nombre,abre:t.abreviatura };
        add("teams",team);        
    }    
    
 }*/