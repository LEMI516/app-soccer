
function onloadEntityDataBase(objStore,data){
    if(data!=null && data!=undefined && data.length>0){
        var objectStore = db.transaction([objStore], "readwrite").objectStore(objStore);
        var result = objectStore.clear();
        result.onsuccess = function(event) {
            var i=0,count=0;
            for(i in data){
                db.transaction([objStore], "readwrite").objectStore(objStore).add(data[i]);
                count++;
            }
            Tooltip(count+' registros procesados');
        };
    }else{
        Tooltip('No se encontraron datos que procesar');
    }
}

