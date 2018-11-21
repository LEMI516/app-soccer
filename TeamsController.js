var teamSelectedGroup=new Array();

function addTeam(id,name,parent){
    var div=document.getElementById('teams_selected_inputs');
    var content_html=div.innerHTML.trim();
    var input_conten='<input id="team_selected_item_'+id+'" type="hidden" name="teams_selected_list" data-id="'+id+'" data-name="'+name+'" data-parent="'+parent+'"  />';
    div.innerHTML=content_html+input_conten;
}

function orderByTeamsName(){
    var listTeams=document.getElementsByName('teams_selected_list');
    var arrayTeams=new Array();
    var i=0,j=0;
    for(i=0;i<listTeams.length;i++) arrayTeams[i]=listTeams[i];
    
    var aux;
    for (i = 0; i < arrayTeams.length - 1; i++) {
        for (j = 0; j < arrayTeams.length - i - 1; j++) {
            if (arrayTeams[j + 1].dataset.name < arrayTeams[j].dataset.name) {
                aux = arrayTeams[j + 1];
                arrayTeams[j + 1] = arrayTeams[j];
                arrayTeams[j] = aux;
            }
        }
    }

    for (i = 0; i < arrayTeams.length - 1; i++) {
        for (j = 0; j < arrayTeams.length - i - 1; j++) {
            if (findSelectionById(arrayTeams[j + 1].dataset.parent).nombre < findSelectionById(arrayTeams[j].dataset.parent).nombre) {
                aux = arrayTeams[j + 1];
                arrayTeams[j + 1] = arrayTeams[j];
                arrayTeams[j] = aux;
            }
        }
    }  
    
    var html_table=document.getElementById('table_selected');
    var html_tr="";
    var count=0;
    var last_count,last_name;
    var html_selected="";
    for (i = 0; i < arrayTeams.length; i++) {
        var team=arrayTeams[i];
        var selection=findSelectionById(team.dataset.parent);
        var next=i+1;
        html_selected="";
        count++;
        if(next<arrayTeams.length-1){
            if(parseInt(team.dataset.parent)!=parseInt(arrayTeams[next].dataset.parent)){
                html_selected="<tr><td><font><b>"+selection.nombre+"("+count+")</b></font></td></tr>";
                count=0;
            }
        }else if(next>=arrayTeams.length-1){
            last_count=count;
            last_name=selection.nombre;
        }
        html_tr+="<tr id='tr_team_selected_"+team.dataset.id+"'><td width='90%'><font data-id='"+team.dataset.id+"' data-name='"+team.dataset.name+"' name='teams_selected' onclick=\"selectedTeamGroup('"+team.dataset.id+"')\" >"+team.dataset.name+"</font></td><td width='10%' align='center' ><font onclick=\"deleteTeamSelected('"+team.dataset.id+"')\" ><b>X</b></font></td></tr>";
        html_tr+=html_selected;
    }
    if(last_name!==undefined && last_count!==undefined)  html_selected="<tr><td colspan='2'><font><b>"+last_name+"("+last_count+")</b></font></td></tr>";
    html_table.innerHTML=html_tr+html_selected;
}

function deleteTeamSelected(id){
    $("#tr_team_selected_"+id).remove(); 
    $("#team_selected_item_"+id).remove();
    orderByTeamsName();
}

function createGroup(){
    var div=document.getElementById('groups_teams_container');
    var group=document.getElementsByName('table_groups');
    var pos=0;
    for(var i=0;i<group.length;i++){
        pos+=parseInt(group[i].dataset.pos);
    }
    pos+=1;
    var pos_name=group.length+1;
    var table='<table id="table_group_'+pos+'" data-pos="'+pos+'" name="table_groups" class="teams2" ><tr><th width="90%" name="name_table_group" onclick="grupoSelected('+pos+')" >GRUPO '+(pos_name)+'</th><th width="10%" align="center" onclick="deleteReorganizeGroup('+pos+')" ><b>X</b></th></tr></table>';
    div.innerHTML=div.innerHTML+table;
}

function deleteReorganizeGroup(pos){
    $("#table_group_"+pos).remove();
    var groups=document.getElementsByName('name_table_group');
    for(var i=0;i<groups.length;i++){
        groups[i].innerHTML='GRUPO '+(i+1);
    }
}

function selectedTeamGroup(id){
    teamSelectedGroup.push(findTeamById(id));
}

function grupoSelected(pos){
    if(teamSelectedGroup.length>0){
        for(var j=0;j<teamSelectedGroup.length;j++){
            if(findTeamtheGroup(teamSelectedGroup[j].id)==null){
                var table=document.getElementById('table_group_'+pos);
                var html=table.innerHTML;
                var tdHTML="<tr id='team_the_group_"+teamSelectedGroup[j].id+"' data-id='"+teamSelectedGroup[j].id+"' name='teams_the_groups' ><td>"+teamSelectedGroup[j].nombre+"</td><td onclick=\"removeTeamTheGroup('"+teamSelectedGroup[j].id+"')\" ><b>X</b></td></tr>";
                table.innerHTML = html + tdHTML;
            }
        }
    }
}

function removeTeamTheGroup(id){
    $("#team_the_group_"+id).remove(); 
}

function findTeamtheGroup(id){
    var items=document.getElementsByName('teams_the_groups');
    for(var i=0;i<items.length;i++){
        if(parseInt(items[i].dataset.id)==parseInt(id)){
            return items[i];
            break;
        }
    }
    return null;
}