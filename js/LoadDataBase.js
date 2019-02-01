
function onloadEntityDataBase(objStore,data){
    if(data.object!=null && data.object!=undefined && data.object.length>0){
        var objectStore = db.transaction([objStore], "readwrite").objectStore(objStore);
        var result = objectStore.clear();
        result.onsuccess = function(event) {
            var i=0,count=0;
            for(i in data.object){
                db.transaction([objStore], "readwrite").objectStore(objStore).add(data[i]);
                count++;
            }
            Tooltip(count+' registros procesados');
        };
    }else{
        Tooltip('No se encontraron datos que procesar');
    }
}

