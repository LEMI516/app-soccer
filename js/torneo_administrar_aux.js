function dialog_add_puntaje(abre,idfix){
    var comp=findCompetenciFixtureByIdFix(idfix,teamsCompFixtureArray);
    var team=findTeamByAbre(abre,teamsArray);
    Itm('lblb_equipo_dap').innerHTML=team.name;
    Itm('pun').value=comp.fix.pun;
    Itm('gd').value=comp.fix.gd;
    Itm('btnSaveDialogAddEquipo').setAttribute("onclick", "updateCompetenciaFixture('"+idfix+"')"); 
    dialog('dialog_add_puntaje');
}

function updateCompetenciaFixture(id) {
    var comFix=findCompetenciFixtureByIdFix(id,teamsCompFixtureArray);
    var pun=ItmV('pun');
    var gd=ItmV('gd');
    if(pun==='') pun='0';
    if(gd==='') gd='0';
    pun=parseInt(pun);
    gd=parseInt(gd);
    var objectStore = db.transaction(["competencia_fixture"],"readwrite").objectStore("competencia_fixture");
    var index =  objectStore.index('id').openCursor(IDBKeyRange.only(comFix.fix.id));
    index.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            var object=cursor.value;
            object.pun=pun;
            object.gd=gd; 
            var res = cursor.update(object);
            cursor.continue();
        }else{
            close_dialog();
            readCompetenciaFixture(torneo.pk,3);
        }
    };
 }