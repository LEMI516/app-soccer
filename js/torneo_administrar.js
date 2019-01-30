var executeFun=new Array(); 
var torneo;
var fasesArray;
var teamsBaseArrayFase;
var loadteamsBaseArrayFase;

$( document ).ready(function() {
    torneo=JSON.parse(localStorage.getItem('torneo'));
    executeFun.push("readTeams(1)");
    executeFun.push("onloadAddTeam();readCompetenciaTeam('"+torneo.pk+"',2)");
    executeFun.push("onloadTeamsCompetencia();");
    executeFun.push("buildFixture()");
    $('#h1PageTorneoAdmon').html(torneo.competencia+" "+torneo.edicion);    
    SQL_DATA_BASE_UPLOADED(0);
});

function onloadAddTeam(){
    var txtypeTeam=ItmV('txtypeTeam');
    if(txtypeTeam==='CLUB'){
        $('#parent').show();
        var teamSel=findTeamsBy('type_conf',['SEL',torneo.plantilla.confederation],teamsArray);
        var html='',abrefault='';
        var l=0;
        for(l in teamSel){
            var t=teamSel[l];
            html+=innerOption(t.abre,t.name);
            if(parseInt(l)===0) abrefault=t.abre;
        }
        inyHtml('parent',html);
        $("#parent").prev().html(abrefault);
        serachTeams(1);
    }else{
        $('#parent').hide();
        serachTeams(2);
    }
 }

 function serachTeams(caso){
    var txtypeTeam=ItmV('txtypeTeam'); 
    var parent=ItmV('parent');
    var html='';
    for(i in teamsArray){
        var t=teamsArray[i];
        var name=t.name;
        var scl=scaleTxt(name);
        var cls='';
        if(scl.is)  cls='style="letter-spacing: '+scl.scl+'px;"';        
        if(caso===1){
            if(t.type===txtypeTeam && t.parent===parent){
                html+='<li >'
                        +'<a data-icon="plus" onclick="agregar_equipo(\''+t.abre+'\')" href="#"><font '+cls+' >'+t.name+'</font></a>'
                    +'</li>';                 
            }
        }else if(caso===2){
            if(t.type===txtypeTeam && t.parent===torneo.plantilla.confederation){
                html+='<li >'
                        +'<a data-icon="plus" onclick="agregar_equipo(\''+t.abre+'\')" href="#"><font '+cls+' >'+t.name+'</font></a>'
                    +'</li>'; 
            }
        }

    }
    inyHtml('teamsSearch',html);
    $("#teamsSearch").listview('refresh');
}


function agregar_equipo(abre){
    if(isValidTeamAdd(abre)){
        var comp_team={id_comp:torneo.pk,team:abre,fasep:0};
        add("competencia_team",comp_team,"readCompetenciaTeam('"+torneo.pk+"',2)");
    }
}

function isValidTeamAdd(abre){
    for(i in teamsCompetenciaArray) if(teamsCompetenciaArray[i].team.abre===abre) return false;
    return true;   
}

function onloadTeamsCompetencia(){
    var i=0;var list=teamsArray;var html=''; var i=0;
    for(i in teamsCompetenciaArray){
        var x=teamsCompetenciaArray[i];
        var t=x.team;
        html+='<li >'
            +'<a href="#">'+(parseInt(i)+1)+'.'+logo(t.color)+t.name+'<b>('+t.parent+')</b></a>'
            +'<a data-icon="delete" onclick="dialogEliminarTeam('+x.id+',\''+t.name+'\')" href="#"></a>'
        +'</li>';        
    }    
    $('#teams').html(html); 
    $("#teams").listview('refresh');
    readCompetenciaFixture(torneo.pk,3);
}

function dialogEliminarTeam(id,name){
    dialog_confirm('¿Esta seguro que desea eliminar a '+name+'?','eliminarTeam('+id+')');
}

function eliminarTeam(id){
    deleteById("competencia_team",id,"readCompetenciaTeam('"+torneo.pk+"',2)");
}

function buildFixture(){
    var html='',html2='';
    fasesArray=new Array();
    var isFasePrevia=false,isFaseGrupo=false,isFaseFinal=false,isUnico=true;
    var fasePrevia='',faseFinal;
    var i=0,j=0,k=0;
    html2+=innerOption('','FASE...');
    if(torneo.plantilla.typeTorneo=='CGI'){
        faseFinal=torneo.plantilla.cff.split(':');
        isFaseGrupo=true;isFaseFinal=true;
    }else if(torneo.plantilla.typeTorneo=='CE') {
        faseFinal=torneo.plantilla.cff.split(':');
        isFaseFinal=true;
    }else if(torneo.plantilla.typeTorneo=='CGFP') {
        faseFinal=torneo.plantilla.cff.split(':');
        fasePrevia=torneo.plantilla.cfp.split(':');
        isFaseFinal=true;isFaseGrupo=true;isFasePrevia=true;
    }
    if(torneo.plantilla.typeMatch=='LOCVIS') isUnico=false;
    if(isFaseFinal){
        for(i=faseFinal.length-1;i>=0;i--){
            var id=parseInt(i)+1;
            var pkfase='F'+id;
            html2+=innerOption('F'+id,'FASE '+id);
            fasesArray.push({id:'F'+id,pos:id,name:'FASE '+id,n:faseFinal[i],n2:0,type:'FE'}); 
                   
            j++;
            var n=parseInt(faseFinal[i]);
            html+='<li data-role="list-divider">Ronda Final '+(i+1)+'<span class="ui-li-count">'+(n/2)+'</span></li>';
            for(k=0;k<(n/2);k++){
                var fkfase='FE'+pkfase+(k+1);
                var fixComp=findTeamForFixtureGenAux(teamsCompFixtureArray,fkfase);
                if(fixComp.length>0){
                    var t1=fixComp[0];
                    var t2=fixComp[1];
                    var marcadorIda='';
                    var marcadorVuelta='';
                    var marcadorFinal='';        
                    var t1gl=parseInt(t1.fix.gl);
                    var t1gv=parseInt(t1.fix.gv);
                    var t2gl=parseInt(t2.fix.gl);
                    var t2gv=parseInt(t2.fix.gv);
                    if(!isUnico){
                        marcadorIda=t1gl+'-'+t2gv;
                        marcadorVuelta='<br>'+t2gl+'-'+t1gv;  
                        marcadorFinal=(t1gl+t1gv)+'-'+(t2gl+t2gv);
                    }else{
                        marcadorIda=t1gl+'-'+t2gv;
                    }        
                    var ind=(isUnico)?1:0;                        
                    html+='<li><a onclick="dialog_add_marcador(\''+t1.team.abre+'\',\''+t2.team.abre+'\',\''+t1.fix.id+'\',\''+t2.fix.id+'\','+ind+')">'
                    +'<h2>'+logo(t1.team.color)+t1.team.name+'('+t1.team.parent+')</h2><span class="ui-li-count">'+marcadorIda+marcadorVuelta+'</span>'
                    +'<h2>'+logo(t2.team.color)+t2.team.name+'('+t2.team.parent+')</h2>'
                    +((!isUnico)?'<p class="ui-li-aside"><strong>'+marcadorFinal+'</strong></p>':'')
                +'</a></li>';
                }else{
                    html+='<li><a>'
                    +'<h2> - - - </h2><span class="ui-li-count"> - </span>'
                    +'<h2> - - - </h2>'
                +'</a></li>';
                }
            }
        }
    }
    if(isFaseGrupo){
        html2+=innerOption('FG','FASE GRUPOS');
        fasesArray.push({id:'FG',pos:0,name:'FASE GRUPOS',n:torneo.plantilla.cantTeamxGru,n2:torneo.plantilla.cantGru,type:'FG'});
        for(i=1;i<=parseInt(torneo.plantilla.cantGru);i++){
            html+='<li data-role="list-divider"><b>GRUPO '+i+'</b><span class="ui-li-count">Gd/Pts</span></li>';
            var n=parseInt(torneo.plantilla.cantTeamxGru);
            var fixComp=findTeamForFixtureGen(teamsCompFixtureArray,'G'+i);
            if(fixComp.length>0){
                fixComp=orderTeamsFixtureByPunGd(fixComp);
                for(var x=1;x<=fixComp.length;x++){
                    var t=fixComp[x-1];
                    html+='<li><a onclick="dialog_add_puntaje(\''+t.team.abre+'\',\''+t.fix.id+'\');" >'
                        +'<h2>'+(x)+'.'+logo(t.team.color)+t.team.name+'('+t.team.parent+')</h2><span class="ui-li-count">'+t.fix.pun+'</span>'
                        +((parseInt(t.fix.gd)>0)?'<p class="ui-li-aside"><strong>'+t.fix.gd+'<br></strong></p>':'')
                    +'</a></li>';
                }
            }else{
                for(k=0;k<parseInt(torneo.plantilla.cantTeamxGru);k++){
                    html+='<li><a>'
                        +'<h2> - - - </h2><span class="ui-li-count"> - </span>'
                        +'</a></li>';
                }                
            }
        }
    }
    if(isFasePrevia){
        for(i=fasePrevia.length-1;i>=0;i--){
            var id=parseInt(i)+1;
            var pkfase='FP'+id;
            html2+=innerOption('FP'+id,'FASE PREVIA '+id);
            fasesArray.push({id:'FP'+id,pos:id,name:'FASE PREVIA '+id,n:fasePrevia[i],n2:0,type:'FE'});            
            j++;
            var n=parseInt(fasePrevia[i]);
            html+='<li data-role="list-divider">Fase Previa '+(i+1)+'<span class="ui-li-count">'+(n/2)+'</span></li>';
            for(k=0;k<(n/2);k++){
                var fkfase='FE'+pkfase+(k+1);
                var fixComp=findTeamForFixtureGenAux(teamsCompFixtureArray,fkfase);
                if(fixComp.length>0){
                    var t1=fixComp[0];
                    var t2=fixComp[1];
                    var marcadorIda='';
                    var marcadorVuelta='';
                    var marcadorFinal='';        
                    var t1gl=parseInt(t1.fix.gl);
                    var t1gv=parseInt(t1.fix.gv);
                    var t2gl=parseInt(t2.fix.gl);
                    var t2gv=parseInt(t2.fix.gv);
                    if(!isUnico){
                        marcadorIda=t1gl+'-'+t2gv;
                        marcadorVuelta='<br>'+t2gl+'-'+t1gv;  
                        marcadorFinal=(t1gl+t1gv)+'-'+(t2gl+t2gv);
                    }else{
                        marcadorIda=t1gl+'-'+t2gv;
                    }        
                    var ind=(isUnico)?1:0;                        
                    html+='<li><a onclick="dialog_add_marcador(\''+t1.team.abre+'\',\''+t2.team.abre+'\',\''+t1.fix.id+'\',\''+t2.fix.id+'\','+ind+')">'
                    +'<h2>'+logo(t1.team.color)+t1.team.name+'('+t1.team.parent+')</h2><span class="ui-li-count">'+marcadorIda+marcadorVuelta+'</span>'
                    +'<h2>'+logo(t1.team.color)+t2.team.name+'('+t2.team.parent+')</h2>'
                    +((!isUnico)?'<p class="ui-li-aside"><strong>'+marcadorFinal+'</strong></p>':'')
                +'</a></li>';
                }else{
                    html+='<li><a>'
                    +'<h2> - - - </h2><span class="ui-li-count"> - </span>'
                    +'<h2> - - - </h2>'
                +'</a></li>';
                }
            }
        }
    }    
    inyHtml('fixture',html); 
    inyHtml('selFases',html2);
    $("#selFases").prev().html('FASE...');
    $("#fixture").listview('refresh');
}

function initFase(state){
    var idfase=ItmV('selFases');
    if(state=='I') teamsBaseArrayFase=new Array();
    if(state=='I') loadTeamBaseArray();
    var html='';
    inyHtml('contentFase',''); 
    var label=Itm('innerAleatorioSorteo');
    label.innerHTML='';
    if(idfase!=''){
        var fase=findEntityBy(idfase,fasesArray);
        if(fase.id=='FG'){
            var fixComp=findTeamForFixtureGen(teamsCompFixtureArray,'G'+i);
            if(fixComp.length>0){
                
            }            
            for(i=1;i<=parseInt(fase.n2);i++){
                html+='<li data-role="list-divider"><b>GRUPO '+i+'</b></li>';
                for(k=0;k<parseInt(fase.n);k++){
                    var fk='G'+(i)+(k+1);
                    var fk2='G'+i;
                    var ts=findTeamForFase(unionTeamsBaseArray(),fk);
                    if(ts.length>0){
                        var t=ts[0];
                        html+='<li><a><h2>'+t.name+'('+t.parent+')</h2></a>'
                        +'<a data-icon="delete" onclick="deleteTeamforBase(\''+t.abre+'\')" href="#"></a>'
                        +'</li>';
                    }else{
                        html+='<li><a onclick="agregar_equipo_fase(\''+fk+'\',\''+fk2+'\')" >'
                            +'<h2> - - -</h2>'
                        +'</a>'
                        +'<a data-icon="delete" onclick="" href="#"></a>'
                        +'</li>';
                    }
                }            
            }
        }else if(fase.type=='FE'){
            var n=parseInt(fase.n);
            html+='<li data-role="list-divider">FASE '+fase.pos+'<span class="ui-li-count">'+(n/2)+'</span></li>';
            label.innerHTML=shuffle(n);
            for(k=0;k<(n/2);k++){
                var fk='FE'+fase.id+(k+1);
                var ts=findTeamForFase(unionTeamsBaseArray(),fk);
                if(ts.length>0){
                    var t1=' - - - ',t2=' - - - ',fun='',abre1='',abre2='';
                    if(ts.length==1 || ts.length>1){ t1=ts[0].name+'('+ts[0].parent+')';abre1=ts[0].abre; }
                    if(ts.length>1){ t2=ts[1].name+'('+ts[1].parent+')'; abre2=ts[1].abre}
                    if(ts.length<=1) fun='agregar_equipo_fase(\''+fk+'\',\''+fase.id+'\')';
                    html+='<li><a onclick="'+fun+'">'
                        +'<h2>'+t1+'</h2><h2>'+t2+'</h2>'
                        +'</a>'
                        +'<a data-icon="delete" onclick="deleteTeamforBaseTwo(\''+abre1+'\',\''+abre2+'\')" href="#"></a>'
                    +'</li>';
                }else{
                    html+='<li><a onclick="agregar_equipo_fase(\''+fk+'\',\''+fase.id+'\')">'
                        +'<h2> - - - </h2>'
                        +'<h2> - - - </h2>'
                        +'</a>'
                        +'<a data-icon="delete" onclick="" href="#"></a>'
                    +'</li>';
                }

            }
        }
        inyHtml('contentFase',html); 
        $("#contentFase").listview('refresh');
    }else{
        inyHtml('contentFase',''); 
    }
}

function agregar_equipo_fase(idf,idf2){
    var i=0;var html='';
    var teamsList=teamsCompetenciaforFase();
    var l=clasificadosArrayMethod();
    var teamClasifiqued=teamsCompetenciaforFaseClasified(l,idf2);

    if(teamClasifiqued.length>0){
        html+='<li data-role="list-divider">CLASEFICIADOS FASE ANT<span class="ui-li-count">'+(teamClasifiqued.length)+'</span></li>';
    }
    for(i in teamClasifiqued){
        var x=teamClasifiqued[i];
        var t=x.c.team;
        html+='<li >'
            +'<a onclick="agregar_equipo_en_fase(\''+t.abre+'\',\''+idf+'\',\''+idf2+'\')" href="#">'+(parseInt(i)+1)+'.'+t.name+'<b>('+t.parent+')</b></a>'
        +'</li>';        
    }
    i=0;
    if(teamsList.length>0){
        html+='<li data-role="list-divider">COMPETENCIA<span class="ui-li-count">'+(teamsList.length)+'</span></li>';
    }
    for(i in teamsList){
        var x=teamsList[i];
        var t=x.team;
        html+='<li >'
            +'<a onclick="agregar_equipo_en_fase(\''+t.abre+'\',\''+idf+'\',\''+idf2+'\')" href="#">'+(parseInt(i)+1)+'.'+t.name+'<b>('+t.parent+')</b></a>'
        +'</li>';        
    }    
    $('#teamsCompetenciaList').html(html); 
    $("#teamsCompetenciaList").listview('refresh');    
    dialog('dialog_team_configure');
}

function agregar_equipo_en_fase(abre,idf,idf2){
    var idfase=ItmV('selFases');
    var fase=findEntityBy(idfase,fasesArray);
    var team=findTeamByAbre(abre,teamsArray);
    var entity;
    entity={fase:fase,team:team,pk:idf,pk2:idf2};
    teamsBaseArrayFase.push(entity);
    close_dialog();
    initFase('EC');
}

function teamsCompetenciaforFase(){
    var teams=new Array();
    var isExiste=false;
    var i=0;
    for(i in teamsCompetenciaArray){
        var x=teamsCompetenciaArray[i];
        var t=x.team;
        k=0;
        isExiste=false;
        var tl=unionTeamsBaseArray();
        for(k in tl){
            var tm=tl[k].team;
            if(t.abre==tm.abre){
                isExiste=true;
                break; 
            }
        }
        if(!isExiste){
            teams.push(x);
        }
    }    
    var faseAnt=faseAnterior(ItmV('selFases'));
    if(faseAnt!=null){
        if(faseAnt.type=='FE'){
            var i=0;
            var lclasi=clasificadosArrayMethodByIdFase(faseAnt.id);
            for(i in lclasi){
                var x=lclasi[i];
                var t=x.c.team;
                var entity={fase:faseAnt,team:t,pk:faseAnt.id,pk2:faseAnt.type};
                var k=0;
                var count=0;
                isExiste=false
                var tl=unionTeamsBaseArray();
                for(k in tl){
                    var tm=tl[k].team;
                    var fs=tl[k].fase;
                    if(fs.id==faseAnt.id || fs.id==ItmV('selFases')){
                        count++;
                        if(t.abre==tm.abre){
                            isExiste=true;
                            break; 
                        }
                    }
                }
                if(!isExiste && count>0){
                    teams.push(entity);
                }
            }
        }
    }
    return teams;
}

function unionTeamsBaseArray(){
    var t=new Array();
    var i=0,j=0;
    for(i in teamsBaseArrayFase) t.push(teamsBaseArrayFase[i])
    for(j in loadteamsBaseArrayFase) t.push(loadteamsBaseArrayFase[j]) 
    return t;
} 

function teamsCompetenciaforFaseClasified(clasifiedList,idfase){
    var teams=new Array();
    var isExiste=false;
    var i=0;
    for(i in clasifiedList){
        var x=clasifiedList[i];
        var t=x.c.team;
        k=0;
        isExiste=false;
        var tl=unionTeamsBaseArray();
        for(k in tl){
            var tm=tl[k].team;
            if(t.abre==tm.abre && tl[k].pk2==idfase){
                isExiste=true;
                break; 
            }
        }
        if(!isExiste){
            teams.push(x);
        }
    }    
    return teams;
}

function deleteTeamforBase(abre){
    var aux=teamsBaseArrayFase;
    teamsBaseArrayFase=new Array();
    var k=0;
    for(k in aux){
        var tm=aux[k].team;
        if(abre!=tm.abre){
            teamsBaseArrayFase.push(aux[k]);
        }
    }
    initFase('EC');
}

function deleteTeamforBaseTwo(abre1,abre2){
    var aux=teamsBaseArrayFase;
    teamsBaseArrayFase=new Array();
    var k=0;
    for(k in aux){
        var tm=aux[k].team;
        if(abre1!=tm.abre && abre2!=tm.abre ){
            teamsBaseArrayFase.push(aux[k]);
        }
    }
    initFase('EC');
}

function guardarConfiguraciondeFase(){
    var k=0;
    for(k in teamsBaseArrayFase){
        var t=teamsBaseArrayFase[k];
        var objectStore={id_comp:torneo.pk,team:t.team.abre,fase:t.fase,pkf:t.pk,fk:t.pk2,pun:0,gd:0,gl:0,gv:0};
        addSimple('competencia_fixture',objectStore);
    } 
    Tooltip('Fase configurada exitosamente');   
    inyHtml('contentFase',''); 
    Itm('selFases').value='';
    $("#selFases").prev().html('FASE...');  
    readCompetenciaFixture(torneo.pk,3);  
}

function loadTeamBaseArray(){
    loadteamsBaseArrayFase=new Array();
    var i=0;
    for(i in teamsCompFixtureArray){
        var ent=teamsCompFixtureArray[i];
        entity={fase:ent.fix.fase,team:ent.team,pk:ent.fix.pkf,pk2:ent.fix.fk};
        loadteamsBaseArrayFase.push(entity);        
    }
}