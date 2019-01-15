var db;
var torneo;
var teamsArray;
var teamsCompetenciaArray;
var fasesArray;
var groupSelected=-1;
var compFixtureArray;
var idDivFixtureOpen='';
var teamsTwoArray=new Array();

$( document ).ready(function() {
    tabs(['EQUIPOS','FIXTURE'],['divEqui','divFix']);
    SQL_DATA_BASE_UPLOADED();
});

function SQL_DATA_BASE_UPLOADED(){
    var request = window.indexedDB.open("SoccerDataBase", 2);
    torneo=JSON.parse(localStorage.getItem('torneo'));
    $('#h1PageTorneoAdmon').html(torneo.competencia+" "+torneo.edicion); 

    request.onerror = function(event) {
        console.log("error: ");
    };
 
    request.onsuccess = function(event) {
        db = request.result;
        readTeams();
    };
}

function readTeams() {
    var objectStore = db.transaction(["teams"]).objectStore("teams");
    teamsArray=new Array();
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            teamsArray.push(cursor.value);
            cursor.continue();
        }else{
            onloadAddTeam();
            readCompetenciaTeam();
        }
    };
 }

 function onloadAddTeam(){
    var txtypeTeam=ItmV('txtypeTeam');
    if(txtypeTeam==='CLUB'){
        $('#parent').show();
        var teamSel=findTeamsBy('type_conf',['SEL',torneo.plantilla.confederation],teamsArray);
        var html='';
        for(i in teamSel){
            var t=teamSel[i];
            html+=innerOption(t.abre,t.name);
        }
        inyHtml('parent',html);
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
        if(caso===1){
            if(t.type===txtypeTeam && t.parent===parent){
                html+='<li >'
                        +'<a data-icon="plus" onclick="agregar_equipo(\''+t.abre+'\')" href="#">'+t.name+'</a>'
                    +'</li>';                 
            }
        }else if(caso===2){
            if(t.type===txtypeTeam && t.parent===torneo.plantilla.confederation){
                html+='<li >'
                        +'<a data-icon="plus" onclick="agregar_equipo(\''+t.abre+'\')" href="#">'+t.name+'</a>'
                    +'</li>'; 
            }
        }

    }
    inyHtml('teamsSearch',html);
    $("#teamsSearch").listview('refresh');
}

function agregar_equipo(abre){
    if(isValidTeamAdd(abre)){
        var nameobjectStore='competencia_team';
        var comp_team={id_comp:torneo.id,team:abre,fasep:0};
        var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).add(comp_team);
        request.onsuccess = function(event) {
            readCompetenciaTeam();
        };
        request.onerror = function(event) {
            Tooltip('Ocurrio un error en la base de datos');
        }
    }
}

function isValidTeamAdd(abre){
    for(i in teamsCompetenciaArray){
        var x=teamsCompetenciaArray[i];
        var t=x.team;
        if(t.abre===abre){
            return false;
        }
    } 
    return true;   
}

function readCompetenciaTeam() {
    var objectStore = db.transaction(["competencia_team"]).objectStore("competencia_team");
    var index=objectStore.index('id_comp').openCursor(IDBKeyRange.only(torneo.id));
    teamsCompetenciaArray=new Array();
    index.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            var team=findTeamByAbre(cursor.value.team,teamsArray);
            var teamComp={id:cursor.value.id,team:team,pos:cursor.value.fasep};
            teamsCompetenciaArray.push(teamComp);
            cursor.continue();
        }else{
            onloadTeamsCompetencia();
            readCompetenciaFixture(1);
        }
    };
 }

 function onloadTeamsCompetencia(){
    var html="";
    var i=0;
    var list=teamsArray;
    var html='';
    var i=0;
    for(i in teamsCompetenciaArray){
        var x=teamsCompetenciaArray[i];
        var t=x.team;
        html+='<li >'
            +'<a href="#">'+(parseInt(i)+1)+'.'+t.name+'<b>('+t.parent+')</b></a>'
            +'<a data-icon="delete" onclick="dialogEliminarTeam('+x.id+',\''+t.name+'\')" href="#"></a>'
        +'</li>';        
    }    
    $('#teams').html(html); 
    $("#teams").listview('refresh');
}

function dialogEliminarTeam(id,name){
    dialog_confirm('¿Esta seguro que desea eliminar a '+name+'?','eliminarTeam('+id+')');
}

function eliminarTeam(id){
    deleteTeam('competencia_team',id,'close_dialog_confirm();readCompetenciaTeam()');
}

function deleteTeam(nameobjectStore,id,name_funcion){
    var request = db.transaction([nameobjectStore], "readwrite").objectStore(nameobjectStore).delete(id);
    request.onsuccess = function(event) {
       Tooltip('Operación realizada exitosamente');
       if(name_funcion!= null && name_funcion!= undefined && name_funcion!= '') eval(name_funcion);
    };
    request.onerror = function(event) {
        Tooltip('Ocurrio un error en la base de datos');
    }
}

function onclickDivFases(div){
    var divs=Itms('divFixTablesFases');
    for(var i=0;i<divs.length;i++){
        if(divs[i].id!=div) $(divs[i]).hide();
    }
    $('#'+div).toggle();
    idDivFixtureOpen=div;
}

function dialog_add_puntaje(abre,idfix){
    var comp=findCompetenciFixtureByIdFix(idfix,compFixtureArray);
    dialog('dialog_add_puntaje');
    var team=findTeamByAbre(abre,teamsArray);
    Itm('lblb_equipo_dap').innerHTML=team.name;
    Itm('pun').value=comp.fix.pun;
    Itm('gd').value=comp.fix.gd;
    Itm('btnSaveDialogAddEquipo').setAttribute("onclick", "updateCompetenciaFixture('"+idfix+"')"); 
}

function buildFixture(pro){
    var html='',html2='';
    fasesArray=new Array();
    if(torneo.plantilla.typeTorneo=='CGI'){
        var f=torneo.plantilla.cff.split(':');
        html+='<div class="fases" onclick="onclickDivFases(\'divFixTableFG\')" >FASE GRUPOS</div>';
        var comp_fix=findCompetenciFixtureByIdFase('FG',compFixtureArray);
        comp_fix=orderTeamsFixtureByPunGd(comp_fix);
        if(comp_fix.length>0){
            html+='<table class="teams" name="divFixTablesFases" id="divFixTableFG" style="display:none" >'; 
            for(var x=1;x<=parseInt(torneo.plantilla.cantGru);x++){
                html+='<tr class="tr_class" ><td width="80%"><b>GRUPO '+x+'</b></td><td width="10%"><b>PT</b></td><td width="10%"><b>DG</b></td></tr>';
                var count=0;
                for(j in comp_fix){
                    var t=comp_fix[j].team;
                    var fix=comp_fix[j].fix;
                    if(fix.idsubfase==='GP'+x){
                        count++;
                        html+='<tr onclick="dialog_add_puntaje(\''+t.abre+'\',\''+fix.id+'\');"><td>'+count+'.'+t.name+'<b>('+t.parent+')</b> </td><td align="center">'+fix.pun+'</td><td align="center">'+fix.gd+'</td></tr>'; 
                    }else{
                        count=0;
                    }
                }                
            }
            html+='</table>';
        }
        html2+=innerOption('','FASE...');
        html2+=innerOption('FG','FASE GRUPOS');
        fasesArray.push({id:'FG',pos:0,name:'FASE GRUPOS',n:torneo.plantilla.cantTeamxGru,n2:torneo.plantilla.cantGru,type:'FG'});
        for(var i=0;i<f.length;i++){
            var id=parseInt(i)+1;
            html+='<div class="fases" onclick="onclickDivFases(\'divFixTableF'+id+'\')" >FASE #'+(id)+'</div>';
            html2+=innerOption('F'+id,'FASE '+id);
            fasesArray.push({id:'F'+id,pos:id,name:'FASE '+id,n:f[i],n2:0,type:'FE'});
            ///////////////////////////////////////////////////
            var comp_fix=findCompetenciFixtureByIdFase('F'+id,compFixtureArray);
            if(comp_fix.length>0){
                html+='<table class="teams" name="divFixTablesFases" id="divFixTableF'+id+'" style="display:none" >'; 
                for(var x=1;x<=parseInt(f[i])/2;x++){
                    var auxTeamsArray=new Array();
                    for(j in comp_fix){
                        var t=comp_fix[j].team;
                        var fix=comp_fix[j].fix;
                        if(fix.idsubfase==='E'+x){
                            auxTeamsArray.push(t);
                        }
                    }
                    var t1=auxTeamsArray[0];
                    var t2=auxTeamsArray[1];
                    html+='<tr onclick="">'
                            +'<td width="30%" align="left">'+t1.name+'<b>('+t1.parent+')</b></td>'
                            +'<td width="20%" align="center">0-0</td>'
                            +'<td width="30%" align="right">'+t2.name+'<b>('+t1.parent+')</b></td>'
                        +'</tr>';                 
                }
                html+='</table>';                
            }
        }
    }
    inyHtml('divFixChild',html);
    inyHtml('selFases',html2);
    if(pro===3){
        $('#'+idDivFixtureOpen).show();
    }    
}

function iniFase(){
    var idfase=ItmV('selFases');
    var comp_fix=findCompetenciFixtureByIdFase(idfase,compFixtureArray);
    if(comp_fix.length>0){
        Tooltip('La fase ya fue configurada');
        Itm('btnNextFase').disabled=false;
    }else{
        Itm('btnNextFase').disabled=true;
        if(idfase!=undefined && idfase!=''){
            var fase=findEntityBy(idfase,fasesArray);
            if(fase.id=='FG'){
                var teamsFase=findTeamsforFase(fase.pos,teamsCompetenciaArray);
                var html='';
                var i=0;
                for(i in teamsFase){
                    var x=teamsFase[i];
                    var t=x.team;
                    html+='<tr id="tr_ttff_'+t.abre+'" name="tr_ttff_s" data-team="'+t.abre+'" ><td>'+t.name+'<b>('+t.parent+')</b> '+icon_add('agregar_equipo_fase(\''+t.abre+'\')')+'</td></tr>';  
                }    
                $('#tableTeamsforFase').html(html);
                var html2='';var k=0;
                for(i=1;i<=parseInt(fase.n2);i++){
                    html2+='<tr id="GP'+i+'" onclick="selectedGroup(this.id)" ><td><b>GRUPO '+i+'</b></td></tr>';  
                }
                $('#teamsTemasFase').html(html2);
            }
        }
    }
}

function selectedGroup(id){
    groupSelected=id;
}

function initVariablesDialogBuildFase(){
    teamsTwoArray=new Array();
}

function agregar_equipo_fase(abre){
    var t=findTeamByAbre(abre,teamsArray);
    var idfase=ItmV('selFases');
    var fase=findEntityBy(idfase,fasesArray);
    if(fase.type=='FG'){
        if(groupSelected!=-1){
            $('#tr_ttff_'+abre).hide();
            var html='';
            html='<tr id="tr_tf_'+t.abre+'" name="tr_tfs" data-subfase="'+groupSelected+'" data-value="'+t.abre+'" ><td>'+t.name+'<b>('+t.parent+')</b> '+icon_elim('eliminarTeaminFase(\''+t.abre+'\')')+'</td></tr>';  
            $(html).insertAfter($("#"+groupSelected));
        }
    }else if(fase.type=='FE'){
        teamsTwoArray.push(t);
        var html='';
        if(teamsTwoArray.length==2){
            var t1=teamsTwoArray[0];
            var t2=teamsTwoArray[1];
            var e=Itms('tr_tfs_mach').length+1;
            html='<tr name="tr_tfs_mach">'
                    +'<td id="tr_tf_'+t1.abre+'" name="tr_tfs" data-subfase="E'+e+'" data-value="'+t1.abre+'" align="center"><b>'+t1.abre+'('+t1.parent+')</b></td>'
                    +'<td id="tr_tf_'+t2.abre+'" name="tr_tfs" data-subfase="E'+e+'" data-value="'+t2.abre+'" align="center"><b>'+t2.abre+'('+t2.parent+')</b></td>'
                +'</tr>';
            $('#teamsTemasFase').append(html);            
            teamsTwoArray=new Array();
            $('#tr_ttff_'+t1.abre).hide();
            $('#tr_ttff_'+t2.abre).hide();
        }
    }

}

function eliminarTeaminFase(abre){
    $('#tr_tf_'+abre).remove();
    $('#tr_ttff_'+abre).show();
}

function createFixture(){
    var teams=Itms('tr_tfs');
    var idfase=ItmV('selFases');
    for(var i=0;i<teams.length;i++){
        var abre=teams[i].dataset.value;
        var idsubfase=teams[i].dataset.subfase;
        var comp_fix={id_comp:torneo.id,team:abre,idfase:idfase,idsubfase:idsubfase,pun:0,gd:0,gl:0,gv:0};
        db.transaction(['competencia_fixture'], "readwrite").objectStore('competencia_fixture').add(comp_fix);
    }
    $('#teamsTemasFase').html('');
    readCompetenciaFixture(2);
}

function readCompetenciaFixture(pro) {
    var objectStore = db.transaction(["competencia_fixture"]).objectStore("competencia_fixture");
    var index =  objectStore.index('id_comp').openCursor(IDBKeyRange.only(torneo.id));
    compFixtureArray=new Array();
    index.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            var team=findTeamByAbre(cursor.value.team,teamsArray);
            var teamCompFix={fix:cursor.value,team:team};
            compFixtureArray.push(teamCompFix);
            cursor.continue();
        }else{
           buildFixture(pro); 
        }
    };
 }

 function updateCompetenciaFixture(id) {
    var comFix=findCompetenciFixtureByIdFix(id,compFixtureArray);
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
            close_dialog_confirm();
            readCompetenciaFixture(3);
        }
    };
 }

 function nextFase(){
    var idfase=ItmV('selFases');
    var comp_fix=findCompetenciFixtureByIdFase(idfase,compFixtureArray);
    if(comp_fix.length<=0){
        Tooltip('La fase no ha sido configurada');
        Itm('selFases').value='';
    }else{
        if(idfase!=undefined && idfase!=''){
            var l=0,pos=0;
            for(l in fasesArray){
                if(fasesArray[l].id==idfase){
                    pos=parseInt(l);break;
                }
            }


            var fase=findEntityBy(idfase,fasesArray);
            var clasificadosArray=new Array();
            var clasificadosArrayTerceros=new Array();
            if(fase.id=='FG'){
                var cantClaxGru=torneo.plantilla.cantClaxGru;
                var cantGru=torneo.plantilla.cantGru;
                var cantMejTerceros=torneo.plantilla.cantMejTerceros;
                cantClaxGru=parseInt(cantClaxGru);
                cantGru=parseInt(cantGru);
                cantMejTerceros=parseInt((cantMejTerceros=='')?0:cantMejTerceros);
                var comp_fix=findCompetenciFixtureByIdFase(fase.id,compFixtureArray);
                comp_fix=orderTeamsFixtureByPunGd(comp_fix); 
                var isMejTer=(cantMejTerceros>0)?1:0;
                for(var x=1;x<=parseInt(torneo.plantilla.cantGru);x++){
                    var count=0;
                    for(j in comp_fix){
                        var fix=comp_fix[j].fix;
                        if(fix.idsubfase==='GP'+x){
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
                var html='';
                var i=0;
                clasificadosArray=orderTeamsFixtureByPosPunGd(clasificadosArray); 
                for(i in clasificadosArray){
                    var x=clasificadosArray[i];
                    var t=x.c.team;
                    html+='<tr id="tr_ttff_'+t.abre+'" name="tr_ttff_s" data-team="'+t.abre+'" ><td><b>'+(parseInt(i)+1)+'.'+t.name+'('+t.parent+')</b> '+icon_add('agregar_equipo_fase(\''+t.abre+'\')')+'</td></tr>';  
                }    
                $('#tableTeamsforFase').html(html);  
                Itm('selFases').value=fasesArray[pos+1].id;                                          

            }
        }
    }
 }

function organizeFixtureAutmatic(){
    var idfase=ItmV('selFases');
    var fase=findEntityBy(idfase,fasesArray);
    if(fase.type=='FE'){
        var teams=Itms('tr_ttff_s');
        var i=0,e=0;
        do{
            var html='';
            var t1=findTeamByAbre(teams[i].dataset.team,teamsArray);
            var t2=findTeamByAbre(teams[i+1].dataset.team,teamsArray);
            html='<tr>'
                    +'<td id="tr_tf_'+t1.abre+'" name="tr_tfs" data-subfase="E'+e+'" data-value="'+t1.abre+'" align="center"><b>'+t1.abre+'('+t1.parent+')</b></td>'
                    +'<td id="tr_tf_'+t2.abre+'" name="tr_tfs" data-subfase="E'+e+'" data-value="'+t2.abre+'" align="center"><b>'+t2.abre+'('+t2.parent+')</b></td>'
                +'</tr>';
                $('#teamsTemasFase').append(html); 
            i=i+2;  
            e++;      
        }while(i<teams.length);
    }     
}


