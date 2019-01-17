var confederaciones=["UEFA","CONMEBOL","CONCACAF","CAF","AFC","OFC"];
var typeTeamList=["CLUB","SELECCION"];
var puntajesGeneral=[100,70,40,30];
var version=2.1;

function icon_elim(fun){
    return '<img class="img_elim" src="../img/icon_delete.png" onclick="'+fun+'" >';
}

function icon_edit(fun){
    return '<img class="img_edit" src="../img/icon_edit.png" onclick="'+fun+'" >';
}

function icon_add(fun){
    return '<img class="img_elim" src="../img/icon_add.png" onclick="'+fun+'" >';
}

function name_torneo(id){
    var name='';
    if(id=='LC') name='LIGA COLOMBIANA';
    else if(id=='CL') name='COPA LIBERTADORES';
    else if(id=='UCL') name='CHAMPIONS LEAGUE';
    else if(id=='CS') name='COPA SURAMERICANA';
    else if(id=='UEL') name='EUROPA LEAGUE';
    else if(id=='CM') name='COPA MUNDIAL';
    else if(id=='CMC') name='COPA MUNDIAL DE CLUBES';
    return name;
}

function name_type_torneo(id){
    var name='';
    if(id=='LG') name='LIGA';
    else if(id=='CE') name='COPA - ELIMINATORIA';
    else if(id=='CGI') name='COPA - GRUPOS (INI)';
    else if(id=='CGFP') name='COPA - GRUPOS (FP)';
    return name;
}

function name_type_match(id){
    var name='';
    if(id=='UNI') name='UNICO';
    else if(id=='LOCVIS') name='LOCAL - VISITANTE';
    return name;
}


function import_id_torneo(id){
    var name='';
    id=parseInt(id);
    if(id==1) name='LC';
    else if(id==2) name='CL';
    else if(id==4) name='UCL';
    else if(id==3) name='CS';
    else if(id==5) name='UEL';
    else if(id==7) name='CM';
    else if(id==6) name='CMC';
    else name=null;
    return name;
}


