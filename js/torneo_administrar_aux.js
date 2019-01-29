function dialog_add_puntaje(abre,idfix){
    var comp=findCompetenciFixtureByIdFix(idfix,teamsCompFixtureArray);
    var team=findTeamByAbre(abre,teamsArray);
    Itm('lblb_equipo_dap').innerHTML=team.name;
    Itm('pun').value=comp.fix.pun;
    Itm('gd').value=comp.fix.gd;
    Itm('btnSaveDialogAddEquipo').setAttribute("onclick", "updateCompetenciaFixture('"+idfix+"')"); 
    dialog('dialog_add_puntaje');
}

function dialog_add_marcador(abre1,abre2,idfix1,idfix2,isUnico){
    var comp1=findCompetenciFixtureByIdFix(idfix1,teamsCompFixtureArray);
    var comp2=findCompetenciFixtureByIdFix(idfix2,teamsCompFixtureArray);
    var team1=findTeamByAbre(abre1,teamsArray);
    var team2=findTeamByAbre(abre2,teamsArray);
    Itm('lblb_equipos_marcador').innerHTML=team1.abre+'-'+team2.abre;
    Itm('mar1').value=comp1.fix.gl+'-'+comp2.fix.gv;
    Itm('mar2').value=comp1.fix.gv+'-'+comp2.fix.gl;
    if(isUnico==1){
        Itm('mar1').setAttribute("placeholder","MARCADOR");
        $('#mar2').hide();
    }else{
        Itm('mar1').setAttribute("placeholder","MARCADOR IDA");
        Itm('mar2').setAttribute("placeholder","MARCADOR VUELTA");
        $('#mar2').show();
    }
    Itm('btnSaveDialogAddEquipoMarcador').setAttribute("onclick", "updateCompetenciaFixtureMarcador('"+idfix1+"','"+idfix2+"',"+isUnico+")"); 
    dialog('dialog_add_marcador');
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

function updateCompetenciaFixtureMarcador(id1,id2,isUnico) {
    id1=parseInt(id1);
    id2=parseInt(id2);
    var mar1=ItmV('mar1');
    var mar2=ItmV('mar2');
    var m1=mar1.split('-');
    var m2=mar2.split('-');
    var gl1=parseInt(m1[0]);
    var gv2=parseInt(m1[1]);
    var gv1=parseInt(m2[0]);
    var gl2=parseInt(m2[1]);   
    var objectStore = db.transaction(["competencia_fixture"],"readwrite").objectStore("competencia_fixture");
    var index =  objectStore.index('id').openCursor(IDBKeyRange.only(id1));
    index.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            var object=cursor.value;
            object.gl=gl1;
            object.gv=gv1; 
            var res = cursor.update(object);
            cursor.continue();
        }else{
            var index2 =  objectStore.index('id').openCursor(IDBKeyRange.only(id2));
            index2.onsuccess = function(event) {
                var cursor2 = event.target.result;
                if (cursor2) {
                    var object2=cursor2.value;
                    object2.gl=gl2;
                    object2.gv=gv2; 
                    var res = cursor2.update(object2);
                    cursor2.continue();
                }else{
                    close_dialog();
                    readCompetenciaFixture(torneo.pk,3);
                }
            }

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
        }else if(faseAnt.type=='FE'){
            var n=parseInt(faseAnt.n);
            for(k=0;k<(n/2);k++){
                var fkfase='FE'+faseAnt.id+(k+1);
                var fixComp=findTeamForFixtureGenAux(teamsCompFixtureArray,fkfase);
                if(fixComp.length>0){
                    var t1=fixComp[0];
                    var t2=fixComp[1];
                    var t1gl=parseInt(t1.fix.gl);
                    var t1gv=parseInt(t1.fix.gv);
                    var t2gl=parseInt(t2.fix.gl);
                    var t2gv=parseInt(t2.fix.gv);
                    var tt1=(t1gl+t1gv);
                    var tt2=(t2gl+t2gv);
                    if(tt2>tt1){
                        clasificadosArray.push({c:t2,pos:0});
                    }else{
                        clasificadosArray.push({c:t1,pos:0});
                    }       
                }
            }
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

function clasificadosArrayMethodByIdFase(idfase){
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
        }else if(faseAnt.type=='FE'){
            var n=parseInt(faseAnt.n);
            for(k=0;k<(n/2);k++){
                var fkfase='FE'+faseAnt.id+(k+1);
                var fixComp=findTeamForFixtureGenAux(teamsCompFixtureArray,fkfase);
                if(fixComp.length>0){
                    var t1=fixComp[0];
                    var t2=fixComp[1];
                    var t1gl=parseInt(t1.fix.gl);
                    var t1gv=parseInt(t1.fix.gv);
                    var t2gl=parseInt(t2.fix.gl);
                    var t2gv=parseInt(t2.fix.gv);
                    var tt1=(t1gl+t1gv);
                    var tt2=(t2gl+t2gv);
                    if(tt2>tt1){
                        clasificadosArray.push({c:t2,pos:0});
                    }else{
                        clasificadosArray.push({c:t1,pos:0});
                    }       
                }
            }
        }   
    }
    return clasificadosArray;
}