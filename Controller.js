
function cargar_teams(valor){
    var list=load_teams(1);
    var html='';
    var sel=document.getElementById('sel_paises');
    var option_defect='<option value="" >Seleccionar Pais...</option>';
    if(valor.trim()!==''){
        var i=0;
        for(i in list.teams){
            var t=list.teams[i];
            if(t.confederacion===valor){
                if(isHaveClub(t.id)){
                    html+='<option value="'+t.id+'" >'+t.nombre+'</option>';
                }
            }
        }
    }
    sel.innerHTML=option_defect+html;
}


function load_teams(type){
    var txt=(type===1)?json_txt_teams_selections:json_txt_teams_clubs;
    var json_txt='{ "teams" : ' + txt + ' } ';
    var list_teams=JSON.parse(json_txt);
    return list_teams; 
}

function isHaveClub(id){
    var list=load_teams(2);
    var i=0;
    for(i in list.teams){
        var t=list.teams[i];
        if(parseInt(t.id_seleccion)===parseInt(id)){
            return true;
        }
    }
    return false;
}

function cargar_clubes(valor){
    var list=load_teams(2);
    var html='';
    var table=document.getElementById('teams');
    if(valor.trim()!==''){
        var i=0;
        for(i in list.teams){
            var t=list.teams[i];
            if(parseInt(t.id_seleccion)===parseInt(valor)){
                html+='<tr onclick="onClickTableSelected('+t.id+')" ><td>'+t.nombre+'</td></tr>';
            }
        }
    }
    table.innerHTML=html;
}

function onClickMenu(id){
    var containers=document.getElementsByName('containers');
    for(var i=0;i<containers.length;i++){
        containers[i].style.display='none';
    }
    document.getElementById(id).style.display='';
}

function onClickTableSelected(id_team){
    if(findTeamSelectedById(id_team)===null){
        var team=findTeamById(id_team);
        addTeam(team.id,team.nombre,team.id_seleccion);
        orderByTeamsName()
    }
}

function findTeamById(id_team){
    var list=load_teams(2);
    var i=0;
    for(i in list.teams){
        var t=list.teams[i];
        if(parseInt(t.id)===parseInt(id_team)){
            return t;
        }
    }
    return null;    
}

function findSelectionById(id_team){
    var list=load_teams(1);
    var i=0;
    for(i in list.teams){
        var t=list.teams[i];
        if(parseInt(t.id)===parseInt(id_team)){
            return t;
        }
    }
    return null;    
}

function getTeamsSelected(){
    var elements=document.getElementsByName('teams_selected');
    return elements;
}

function findTeamSelectedById(id){
    var elements=getTeamsSelected();
    for(var i=0;i<elements.length;i++){
        var ele=elements[i];
        if(parseInt(id)===parseInt(ele.dataset.id)){
            return ele;
        }
    }
    return null;
}

