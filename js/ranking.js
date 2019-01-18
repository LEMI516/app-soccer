var executeFun=["readTeams(1)","cargarRanking()","calcularRankingHistorialSimple()","initializeCalculeRankingSub()","initializeCalculeRankingEur()"];

$( document ).ready(function() {
    SQL_DATA_BASE_UPLOADED(0);
});

function cargarRanking(){
    var tor=ItmV('tiposRanking');
    if(tor=='SUB'){
        readHistoricoTeams(3);
    }else if(tor=='EUR'){
        readHistoricoTeams(4);
    }else{
        readHistoricoTeamsByTorneo('torn',tor,2);
    }
}

function initializeCalculeRankingSub(){
    var rankCL=filterHistoricoTeamsByTorneo(HistoricoTeamsArray,'CL');
    var rankCS=filterHistoricoTeamsByTorneo(HistoricoTeamsArray,'CS');
    var rankSub=new Array();
    var i=0;
    for(i=0;i<rankCL.length;i++) rankSub.push(rankCL[i]);
    for(i=0;i<rankCS.length;i++) rankSub.push(rankCS[i]);
    calcularRankingHistorialCombinado(rankSub);
}

function initializeCalculeRankingEur(){
    var rankCL=filterHistoricoTeamsByTorneo(HistoricoTeamsArray,'UCL');
    var rankCS=filterHistoricoTeamsByTorneo(HistoricoTeamsArray,'UEL');
    var rankSub=new Array();
    var i=0;
    for(i=0;i<rankCL.length;i++) rankSub.push(rankCL[i]);
    for(i=0;i<rankCS.length;i++) rankSub.push(rankCS[i]);
    calcularRankingHistorialCombinado(rankSub);
}

function calcularRankingHistorialCombinado(rankingHistorico){
    var teamsHistorial=teamsByHistorialComp(rankingHistorico);
    var teamsHistorialResul=new Array();
    var i=0,j=0;
    for(i=0;i<teamsHistorial.length;i++){
        var t=teamsHistorial[i];
        for(j=0;j<rankingHistorico.length;j++){
            var h=rankingHistorico[j];
            if(t.t.name===h.cam.name){
                t.pun=parseInt(t.pun)+puntajesGeneral[0];
                t.p=parseInt(t.p)+1;
            }else if(t.t.name===h.sub.name){
                t.pun=parseInt(t.pun)+puntajesGeneral[1];
                t.s=parseInt(t.s)+1;
            }else if(t.t.name===h.ter.name){
                t.pun=parseInt(t.pun)+puntajesGeneral[2];
                t.tr=parseInt(t.tr)+1;
            }else if(t.t.name===h.cuar.name){
                t.pun=parseInt(t.pun)+puntajesGeneral[3];
                t.c=parseInt(t.c)+1;
            } 
        }
        teamsHistorialResul.push(t);
    }
    var teamsOrderHistorial=orderTeamsHistorialByCompetencia(teamsHistorialResul);
    html='';
    for(var i=1;i<=teamsOrderHistorial.length;i++){
        var t=teamsOrderHistorial[i-1];
        var name=t.t.name+'('+t.t.parent+')';
        var scl=scaleTxt(name);
        var cls='';
        if(scl.is)  cls='style="letter-spacing: '+scl.scl+'px;"';
        html+='<tr>'
              +'<td>'+i+'.<font '+cls+' >'+name+'</font></td>'
              +'<td>'+t.p+'</td>'
              +'<td>'+t.s+'</td>'
              +'<td>'+(parseInt(t.tr)+parseInt(t.c))+'</td>'
              +'<td>'+t.pun+'</td>'
            +'</tr>';
    }
    $('#ranking').html(html);     
}

function calcularRankingHistorialSimple(){
    var teamsHistorial=teamsByHistorialComp(HistoricoTeamsArray);
    var teamsHistorialResul=new Array();
    var i=0,j=0;
    for(i=0;i<teamsHistorial.length;i++){
        var t=teamsHistorial[i];
        for(j=0;j<HistoricoTeamsArray.length;j++){
            var h=HistoricoTeamsArray[j];
            if(t.t.name===h.cam.name){
                t.pun=parseInt(t.pun)+puntajesGeneral[0];
                t.p=parseInt(t.p)+1;
            }else if(t.t.name===h.sub.name){
                t.pun=parseInt(t.pun)+puntajesGeneral[1];
                t.s=parseInt(t.s)+1;
            }else if(t.t.name===h.ter.name){
                t.pun=parseInt(t.pun)+puntajesGeneral[2];
                t.tr=parseInt(t.tr)+1;
            }else if(t.t.name===h.cuar.name){
                t.pun=parseInt(t.pun)+puntajesGeneral[3];
                t.c=parseInt(t.c)+1;
            } 
        }
        teamsHistorialResul.push(t);
    }
    var teamsOrderHistorial=orderTeamsHistorialByCompetencia(teamsHistorialResul);
    html='';
    for(var i=1;i<=teamsOrderHistorial.length;i++){
        var t=teamsOrderHistorial[i-1];
        var name=t.t.name+'('+t.t.parent+')';
        var scl=scaleTxt(name);
        var cls='';
        if(scl.is)  cls='style="letter-spacing: '+scl.scl+'px;"';
        html+='<tr>'
              +'<td>'+i+'.<font '+cls+' >'+name+'</font></td>'
              +'<td>'+t.p+'</td>'
              +'<td>'+t.s+'</td>'
              +'<td>'+(parseInt(t.tr)+parseInt(t.c))+'</td>'
              +'<td>'+t.pun+'</td>'
            +'</tr>';
    }
    $('#ranking').html(html);     
}
