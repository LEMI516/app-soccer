var db;
var torneo;

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
        
    };
}

function onchangetipoFase(){
    var typeFase=$('#tipoFase').val();
    if(typeFase==='ELI'){
        groupShow('nequi');
        groupHide('ngru|nequixgru|nclasi|nmjr3');
    }else{
        groupHide('nequi');
        groupShow('ngru|nequixgru|nclasi|nmjr3');
    }
}

function addFase(){
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