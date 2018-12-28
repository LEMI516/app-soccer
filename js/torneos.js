var db;
var torneosArray;

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
        readTorneos(); 
    };
}

function addTorneo(){
    var elements='confederation|torneo|typeTeam|edicion';
    var isValid=isValidValues(elements);
    if(isValid){
        var v=values(elements);
        var torneo={ conf:v[0],torneo:v[1],type:v[2],edicion:v[3],name:name_torneo(v[1]) };
        add("competencia",torneo,'cleanValues()');
    }else{
        Tooltip('Debe ingresar todos los datos');
    }
}

function cleanValues(){
    cleanFields('edicion');
}

function add(nameobjectStore,objectStore,name_funcion) {
    var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).add(objectStore);
    request.onsuccess = function(event) {
       Tooltip('Operación realizada exitosamente');
       if(name_funcion!= null && name_funcion!= undefined && name_funcion!= '') eval(name_funcion);
       readTorneos()
    };
    request.onerror = function(event) {
        Tooltip('Ocurrio un error en la base de datos');
    }
 }

 function readTorneos() {
    var objectStore = db.transaction(["competencia"]).objectStore("competencia");
    torneosArray=new Array();
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            torneosArray.push(cursor.value);
            cursor.continue();
        }else{
            searchGeneral('0',[$('#txtypeTorneo').val()])
        }
    };
 }

 function searchGeneral(opc,params){
    var html="";
    var i=0;
    var list=torneosArray;
    var html='';
    var i=0;
    for(i in list){
        var t=list[i];
        //OPCION 0 - TODOS
        if(opc==='0'){
            if(t.torneo===params[0] || params[0]==='ALL'){
                html+='<tr><td>'+t.name+' '+t.edicion+'° '+icon_elim('dialogEliminarTeam('+t.id+',\''+t.name+'\')')+'</td></tr>';  
            }
        }        
    }    
    $('#torneos').html(html); 
}