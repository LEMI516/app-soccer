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

function clasificadosArrayMethod(){
    var idfase=ItmV('selFases');
    var fase=findEntityBy(idfase,fasesArray);
    var clasificadosArray=new Array();
    var clasificadosArrayTerceros=new Array();
    var faseAnt=faseAnterior(fase.id);
    if(faseAnt!=null){
        if(faseAnt.id=='FG'){
            var cantClaxGru=torneo.plantilla.cantClaxGru;
            var cantGru=torneo.plantilla.cantGru;
            var cantMejTerceros=torneo.plantilla.cantMejTerceros;
            cantClaxGru=parseInt(cantClaxGru);
            cantGru=parseInt(cantGru);
            cantMejTerceros=parseInt((cantMejTerceros=='')?0:cantMejTerceros);
            var comp_fix=findCompetenciFixtureByIdFaseAux(faseAnt.id,teamsCompFixtureArray);
            comp_fix=orderTeamsFixtureByPunGd(comp_fix); 
            var isMejTer=(cantMejTerceros>0)?1:0;
            for(var x=1;x<=parseInt(torneo.plantilla.cantGru);x++){
                var count=0;
                for(j in comp_fix){
                    var fix=comp_fix[j].fix;
                    if(fix.fk==='G'+x){
                        count++;
                        if(count<=cantClaxGru){
                            clasificadosArray.push({c:comp_fix[j],pos:count});
                        }else if(count<=(cantClaxGru+isMejTer)){
                            clasificadosArrayTerceros.push({c:comp_fix[j],pos:count});
                        }
                    }else{
                        count=0;
                    }
                }                
            }
            var arrayMejoresTerceros=orderTeamsFixtureByPosPunGd(clasificadosArrayTerceros); 
            if(isMejTer==1){
                j=0;
                for(j in arrayMejoresTerceros){
                    if(parseInt(j)<cantMejTerceros){
                        clasificadosArray.push(arrayMejoresTerceros[j]);
                    }
                }
            } 
            clasificadosArray=orderTeamsFixtureByPosPunGd(clasificadosArray);
        }   
    }
    return clasificadosArray;
}

function faseAnterior(idfase){
    var i=0;
    var tam=fasesArray.length;
    for(i in fasesArray){
        var f=fasesArray[i].id;
        if(idfase==f){
            var j=parseInt(i)+1;
            if(j==tam){
                return null;
            }else{
                return fasesArray[j];
            }
        }
    }
    return null;
}