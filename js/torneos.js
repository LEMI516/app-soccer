var db;
var torneosArray;
var plantillasArray;

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
        readPlantillas(); 
    };
}

function addTorneo(){
    var elements='competencia|plantilla';
    var isValid=isValidValues(elements);
    if(isValid){
        var v=values(elements);
        var p=findById(plantillasArray,v[1]);
        var torneo={pk:v[0]+(torneosArray.length+1),competencia:v[0],edicion:torneosArray.length+1,name:name_torneo(v[0]),plantilla:p };
        add("competencia",torneo,'cleanValues()');
    }else{
        Tooltip('Debe ingresar todos los datos');
    }
}

function cleanValues(){
    cleanFields('competencia|plantilla');
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

 function innerSelectPlantillas(){
    var array=new Array();
    array.push({id:'',value:'PLANTILLA...'});
    for(i in plantillasArray){
        var p=plantillasArray[i];
        array.push({id:p.id,value:p.name});
    }    
    innerSelect('plantilla',array);
    readTorneos();
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
            torneosArray=depureArray(torneosArray);
            searchGeneral('0')
        }
    };
 }

 function readPlantillas() {
    var objectStore = db.transaction(["plantilla"]).objectStore("plantilla");
    plantillasArray=new Array();
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            plantillasArray.push(cursor.value);
            cursor.continue();
        }else{
            plantillasArray=depureArray(plantillasArray);
            innerSelectPlantillas();
        }
    };    
 }

 function searchGeneral(opc){
    var html="";
    var i=0;
    var type=$('#txtypeTorneo').val();
    var list=torneosArray;
    var html='';
    var i=0;
    for(i in list){
        var t=list[i];
        //OPCION 0 - TODOS
        if(opc==='0'){
            var pk=parseInt(t.id);
            if(t.competencia===type || type==='ALL'){
                html+='<li >'
                        +'<a onclick="onclickTorneoAdm('+pk+')" href="#">'+t.name+' '+t.edicion+'°</a>'
                        +'<a data-icon="delete" onclick="dialogEliminarTorneo('+t.id+',\''+t.name+'\')" href="#"></a>'
                      +'</li>';                 
            }
        }        
    }    
    $('#torneos').html(html); 
    $("#torneos").listview('refresh');
}

function dialogEliminarTorneo(id,name){
    dialog_confirm('¿Esta seguro que desea eliminar el torneo '+name+' ?','eliminarTorneo('+id+')');
}

function eliminarTorneo(id){
    deleteTorneo('competencia',id,'');
}

function deleteTorneo(nameobjectStore,id,name_funcion){
    var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).delete(id);
    request.onsuccess = function(event) {
       Tooltip('Operación realizada exitosamente');
       if(name_funcion!= null && name_funcion!= undefined && name_funcion!= '') eval(name_funcion);
       readTorneos();
    };
    request.onerror = function(event) {
        Tooltip('Ocurrio un error en la base de datos');
    }
}

function onclickTorneoAdm(id){
    var t=findById(torneosArray,id);
    localStorage.setItem('torneo', JSON.stringify(t));
    var uri="torneo_adm.html?";
    location.href=uri; 
}