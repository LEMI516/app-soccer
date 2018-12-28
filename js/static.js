var confederaciones=["UEFA","CONMEBOL","CONCACAF","CAF","AFC","OFC"];
var typeTeamList=["CLUB","SELECCION"];

function icon_elim(fun){
    return '<img class="img_elim" src="../img/icon_delete.png" onclick="'+fun+'" >';
}

function icon_edit(fun){
    return '<img class="img_edit" src="../img/icon_edit.png" onclick="'+fun+'" >';
}

function name_torneo(id){
    var name='';
    if(id=='LC') name='LIGA COLOMBIANA';
    else if(id=='CL') name='LIGA COLOMBIANA';
    else if(id=='UCL') name='CHAMPIONS LEAGUE';
    else if(id=='CS') name='COPA SURAMERICANA';
    else if(id=='UEL') name='EUROPA LEAGUE';
    else if(id=='CM') name='COPA MUNDIAL';
    else if(id=='CMC') name='COPA MUNDIAL DE CLUBES';
    return name;
}
