function Itm(id){
    return document.getElementById(id);
}

function Itms(name){
    return document.getElementsByName(name);
}

function ItmV(id){
    return document.getElementById(id).value.trim();
}

function innerSelect(id,array){
    var html='';
    for(var i=0;i<array.length;i++){
        html+='<option value="'+array[i].id+'" >'+array[i].value+'</option>';
    }
    $('#'+id).html(html);
}

function innerSelectSimple(id,array){
    var html='';
    for(var i=0;i<array.length;i++){
        html+='<option value="'+array[i]+'" >'+array[i]+'</option>';
    }
    $('#'+id).html(html);
}

function innerOption(id,value){
    return '<option value="'+id+'" >'+value+'</option>';
}

function values(elements){
    var array=new Array();
    var elemts=elements.split('|');
    for(var i=0;i<elemts.length;i++){
        array.push($('#'+elemts[i]).val());
    }
    return array;
}

function isValidValues(elements){
    var array=new Array();
    var elemts=elements.split('|');
    for(var i=0;i<elemts.length;i++){
        var val=$('#'+elemts[i]).val();
        val=val.trim();
        if(val===""){
            return false;
        }
    }
    return true;
}

function isValidValuesElements(elemts){
    for(var i=0;i<elemts.length;i++){
        var ele=elemts[i];
        if(ele===undefined || ele==null || ele==''){
            return false;
        }
    }
    return true;
}

function Tooltip(msj){
    $('<div>'+msj+'</div>')
	.css({ 
        "position" : "fixed",
        "bottom": 0,
        "background-color":"#515050",
        "color": "white",
        "font-size": "1em",
        "height": "auto",
        "width": "90%",
        "border-radius": "5px",
        "padding": "5px",
        "margin-bottom": "2%",
        "margin-left": "4%",
        "margin-right": "2%", 
        "text-align": "center",
        "z-index": "3000"
    })
	.appendTo( $.mobile.pageContainer ).delay( 1500 )
	.fadeOut( 400, function(){
		$(this).remove();
    });    
}
  
function selectContainer(id){
    var containers=Itms('containers');
    for(var i=0;i<containers.length;i++){
        $(containers[i]).hide();
    }
    $(Itm(id)).show();
    onclickMenu(0);
}

function cleanFields(elements){
    var elemts=elements.split('|');
    for(var i=0;i<elemts.length;i++){
       $('#'+elemts[i]).val('');
    }
}

function dialog_confirm(msj,funsi){
    Itm('popupDialogConfirmMsj').innerHTML=msj;
    Itm('popupDialogConfirBtnFunsi').setAttribute('onclick',funsi);
    $( "#popupDialogConfirm" ).popup("open");
}

function dialog(idContainer){
    $( "#"+idContainer ).popup("open");
}

function onclickMenu(state){
    Itm('mnu_closed').click();
}

function depureArray(list){
    var newArray=new Array();
    for(i in list){
        var l=list[i];
        var existe=false;
        for(j in newArray){
            var n=newArray[j];
            if(parseInt(l.id)===parseInt(n.id)){
                existe=true;
                break;
            }
        } 
        if(!existe){
            newArray.push(l);
        }       
    }
    return newArray;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function findById(list,id){
    for(i in list){
        var l=list[i];
        if(parseInt(l.id)===parseInt(id))
            return l;
    }
    return null;
}

function groupShow(ids){
    var elements=ids.split('|');
    for(var i=0;i<elements.length;i++){
        $('#'+elements[i]).show();
    }
}

function groupHide(ids){
    var elements=ids.split('|');
    for(var i=0;i<elements.length;i++){
        $('#'+elements[i]).hide();
    }
}

function inyHtml(id,html){
   Itm(id).innerHTML=html;
}

function tabs(name,ids){
    var tam=name.length;
    var width=parseFloat(99/tam);
    var html='';
    for(var i=0;i<tam;i++){
        html+='<div class="tabp_opc" onclick="onclikTabs('+i+')" style="width:'+width+'%" data-container="'+ids[i]+'" ><div name="tabs" class="tab_p '+((i==0)?'tab_selected':'')+'"><div class="tab_c">'+name[i]+'</div></div></div>';
    }
    $('#tab').html(html);
    $('#tab').css({"display": "inline-block"});
    onclikTabs(0);
}

function onclikTabs(pos){
    var tabs=Itms('tabs');
    var tab,tabc;
    for(var i=0;i<tabs.length;i++){
        $(tabs[i]).removeClass('tab_selected');
        if(i==pos) tab=tabs[i];
    }
    var tab_cont=Itms('tab_containers');
    i=0;
    for(i in tab_cont){
        $(tab_cont[i]).hide();
        if(i==pos) tabc=tab_cont[i];
    }
    $(tab).addClass('tab_selected'); 
    $(tabc).show();
}

function findTeamsBy(param,value,list){
    var newArray=new Array();
    for(i in list){
        var t=list[i];
        if(param==='conf' && t.conf==value[0]){
            newArray.push(t);
        }else if(param==='type' && t.type==value[0]){
            newArray.push(t);
        }else if(param==="parent" && t.parent==value[0]){
            newArray.push(t);
        }else if(param==='type_conf' && t.type==value[0] && (t.conf==value[1] || value[1]=='MUN')){
            newArray.push(t);
        }else if(param==='aux' && parseInt(t.aux)==parseInt(value[0])){
            newArray.push(t);
        }
    }
    return newArray;
}

function findTeamByAbre(abre,list){
    for(i in list){
        var t=list[i];
        if(t.abre==abre){
            return t;
        }
    }
    return null;
}

function findTeamByName(name,list){
    for(i in list){
        var t=list[i];
        if(t.name.toLowerCase()==name.toLowerCase()){
            return t;
        }
    }
    return null;
}

function findEntityBy(id,list){
    for(i in list){
        var t=list[i];
        if(t.id==id){
            return t;
        }
    }
    return null;
}

function findTeamsforFase(pos,list){
    var newArray=new Array();
    for(i in list){
        var t=list[i];
        if(parseInt(t.pos)===parseInt(pos)){
            newArray.push(t);
        }
    }
    return newArray;
}

function findCompetenciFixtureByIdFase(idfase,list){
    var newArray=new Array();
    for(i in list){
        var t=list[i];
        if(t.fix.idfase===idfase){
            newArray.push(t);
        }
    }
    return newArray;
}

function findCompetenciFixtureByIdFaseAux(idfase,list){
    var newArray=new Array();
    for(i in list){
        var t=list[i];
        if(t.fix.fase.id===idfase){
            newArray.push(t);
        }
    }
    return newArray;
}

function findCompetenciFixtureByIdFix(id,list){
    var newArray=new Array();
    for(i in list){
        var t=list[i];
        if(parseInt(t.fix.id)===parseInt(id)){
            return t;
        }
    }
    return null;
}

function orderTeamsFixtureByPunGd(listTeams){
    listTeams.sort(function(a, b) {
        var fixa = a.fix
        var fixb = b.fix
        if (fixa.fk == fixb.fk) {
            var puna=parseInt(fixa.pun);
            var gda=parseInt(fixa.gd);
            var punb=parseInt(fixb.pun);
            var gdb=parseInt(fixb.gd);            
            if(puna==punb){
                if(gda>gdb) return -1;
                else if (gda<gdb) return 1;
                else return 0;
            }else if(puna > punb){
                return -1;
            }else{
                return 1;
            }
        }
    });
    return  listTeams;
}

function orderTeamsFixtureByPosPunGd(listTeams){
    listTeams.sort(function(a, b) {
        var posa=parseInt(a.pos);
        var posb=parseInt(b.pos);
        var fixa = a.c.fix
        var fixb = b.c.fix
        var puna=parseInt(fixa.pun);
        var gda=parseInt(fixa.gd);
        var punb=parseInt(fixb.pun);
        var gdb=parseInt(fixb.gd);            
        if(posa == posb){
            if(puna==punb){
                if(gda>gdb) return -1;
                else if (gda<gdb) return 1;
                else return 0;
            }else if(puna > punb){
                return -1;
            }else{
                return 1;
            }
        }else{
            return posa-posb;
        }

        
    });
    return  listTeams;
}

function close_dialog(){
    var btns=Itms('btnClosedDialogApp');
    for(var i=0;i<btns.length;i++){
        btns[i].click();
        break;
    }
}

function teamsByHistorialComp(list){
    var teamsHistorial=new Array();
    var i=0;
    for(i in list){
        var h=list[i];
        if(!findTeamHistoriaList(h.cam.abre,teamsHistorial) && h.cam.abre!='FIFA') teamsHistorial.push({t:h.cam,pun:0,p:0,s:0,tr:0,c:0});
        if(!findTeamHistoriaList(h.sub.abre,teamsHistorial) && h.sub.abre!='FIFA') teamsHistorial.push({t:h.sub,pun:0,p:0,s:0,tr:0,c:0});
        if(!findTeamHistoriaList(h.ter.abre,teamsHistorial) && h.ter.abre!='FIFA') teamsHistorial.push({t:h.ter,pun:0,p:0,s:0,tr:0,c:0});
        if(!findTeamHistoriaList(h.cuar.abre,teamsHistorial) && h.cuar.abre!='FIFA') teamsHistorial.push({t:h.cuar,pun:0,p:0,s:0,tr:0,c:0});
    }
    return teamsHistorial;
}

function findTeamHistoriaList(abre,list){
    var i=0;
    for(i in list){
        var t=list[i];
        if(t.t.abre===abre){
            return true;
        }
    }
    return false;
}

function orderTeamsHistorialByCompetencia(listTeams){
    listTeams.sort(function(a, b) {
        var puna=parseInt(a.pun);
        var punb=parseInt(b.pun);
        return punb-puna;
    });
    return  listTeams;
}

function scaleTxt(texto){
    var is=false;
    var scale=0;
    if(texto.length>=24){
        scale=-2;
        is=true;
    }else if(texto.length>20){
        scale=-1;
        is=true;
    }
    return {is:is,scl:scale};
}

function filterHistoricoTeamsByTorneo(list,torn){
    var i=0;
    var rList=new Array();
    for(i=0;i<list.length;i++){
        var h=list[i];
        if(h.tor==torn) rList.push(h);
    }
    return rList;
}

function findTeamForFase(list,idf){
    var i=0;
    var aux=new Array();
    for(i in list){
        var f=list[i].fase;
        var t=list[i].team;
        if(list[i].pk==idf){
            aux.push(t);
        }
    }
    return aux;
}

function findTeamForFixture(list,idf){
    var i=0;
    var aux=new Array();
    for(i in list){
        var c=list[i];
        var t=c.team;
        if(c.fix.pkf==idf){
            aux.push(c);
        }
    }
    return aux;
}

function findTeamForFixtureGen(list,idf){
    var i=0;
    var aux=new Array();
    for(i in list){
        var c=list[i];
        if(c.fix.fk==idf){
            aux.push(c);
        }
    }
    return aux;
}

function findTeamForFixtureGenAux(list,idf){
    var i=0;
    var aux=new Array();
    for(i in list){
        var c=list[i];
        if(c.fix.pkf==idf){
            aux.push(c);
        }
    }
    return aux;
}

function convertConfFase(faseAnt){
    if(faseAnt.trim()!=''){
        var fase=faseAnt.split(';');
        var concat='';
        for(var i=0;i<fase.length;i++){
            var f=fase[i].split(':');
            concat+=(concat=='')?f[1]:':'+f[1];
        }
        return concat;
    }else{
        return '';
    }

}

function getCompetenciasFixtureJson(lista){
    var aux=new Array();
    for(var i=0;i<lista.length;i++){
        var obj=lista[i];
        var isExiste=false;
        for(var j=0;j<aux.length;j++){
            var obj2=aux[j];
            if(obj.ID_COMPETENCIA==obj2.ID_COMPETENCIA){ isExiste=true; break;}
        }
        if(!isExiste){
            aux.push(obj);
        }
    }
    return aux;
}

function getTeamsCompetenciasJson(idcomp,lista){
    var aux=new Array(),aux2=new Array();
    for(var i=0;i<lista.length;i++){
        var obj=lista[i];
        if(obj.ID_COMPETENCIA==idcomp){ 
            if(obj.NOM_FASE=='FG'){
                aux.push({id:obj.ID_EQUIPO_I});
            }else if(obj.NOM_FASE=='FF' || obj.NOM_FASE=='FP'){
                aux.push({id:obj.ID_EQUIPO_I});
                aux.push({id:obj.ID_EQUIPO_II});
            }
        }
    }

    for(var i=0;i<aux.length;i++){
        var obj=aux[i];
        var isExiste=false;
        for(var j=0;j<aux2.length;j++){
            var obj2=aux2[j];
            if(parseInt(obj.id)==parseInt(obj2.id)){ isExiste=true; break;}
        }
        if(!isExiste){
            if(parseInt(obj.id)!=-1) aux.push(obj);
        }
    }    
    return aux2;
}

function shuffle(n) {
    var a=new Array();
    for(var l=1;l<=n;l++) a.push(l);

    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    var result='';
    for(var l=0;l<a.length;l++)
        result+=(result=='')?a[l]:'-'+a[l];
    return result;
}

function filterTeamsSelectionisHaveClub(listBase,teamsArray){
    var aux=new Array();
    var i=0;
    for(i in listBase){
        var t=listBase[i];
        var list=findTeamsBy('parent',[t.abre],teamsArray);
        if(list.length>0){
            aux.push(t);
        }
    }
    return aux;
}
