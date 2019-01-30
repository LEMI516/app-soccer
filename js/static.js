var confederaciones=["UEFA","CONMEBOL","CONCACAF","CAF","AFC","OFC"];
var typeTeamList=["CLUB","SELECCION"];
var puntajesGeneral=[100,70,40,30];
var puntajesCP=[100,70,40,30];
var puntajesSC=[60,30,15,8];
var version=2;

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

function method_uri(caso){
    if(caso='saveTeam') return 'teams/'
    if(caso='saveHistory') return 'historys/'
}

function colours(){
    var r=new Array("00","33","66","99","CC","FF");
    var g=new Array("00","33","66","99","CC","FF");
    var b=new Array("00","33","66","99","CC","FF");
    var result=new Array();
    for (i=0;i<r.length;i++) {
        for (j=0;j<g.length;j++) {
            for (k=0;k<b.length;k++) {
                var nuevoc = "#" + r[i] + g[j] + b[k];
                result.push(nuevoc);
            }
        }
    }
    return result;
}

function logo(color){
    var html='';
    if(color.trim()=='') color='V;#C9C6BD';

    var confcolor=color.split(';');
    var clr=confcolor[1].split(':');
    var tam=clr.length;
    var p1,p2,p3;
    if(confcolor[0]=='h' || confcolor[0]=='H'){
        p1='left';p2='right';p3='1';
    }else{
        p1='top';p2='bottom';p3='0';
    }
    if(tam==1){
        html='<div '
        +'style="'
        +'height: 13px;'
        +'width: 13px;'
        +'border-radius: 50%;'
        +'background: '+clr[0]+';'
        +'border: solid 0.04em black;'
        +'display: inline-block;'
        +'margin: 0px 3px 0px 3px;'
        +'padding: 0;'
        +'" >'
        +'</div>';
    }else if(tam==2){
        html='<div '
        +'style="'
        +'height: 13px;'
        +'width: 13px;  '
        +'margin: 0px 3px 0px 3px ;'
        +'padding: 0;'
        +'display: inline-block;'      
        +'border-radius: 50%;'
        +'background: '+clr[0]+';' 
        +'border: solid 0.04em black;' 
        +'background: -moz-linear-gradient('+p1+', '+clr[0]+' 0%, '+clr[0]+' 50%, '+clr[1]+' 51%, '+clr[1]+' 100%); '
        +'background: -webkit-linear-gradient('+p1+', '+clr[0]+' 0%,'+clr[0]+' 50%,'+clr[1]+' 51%,'+clr[1]+' 100%); '
        +'background: linear-gradient(to '+p2+', '+clr[0]+' 0%,'+clr[0]+' 50%,'+clr[1]+' 51%,'+clr[1]+' 100%); '
        +'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\''+clr[0]+'\', endColorstr=\''+clr[1]+'\',GradientType='+p3+' ); '            
        +'" >'
        +'</div>';
    }else if(tam>2){
        html='<div '
        +'style="'
        +'height: 13px;'
        +'width: 13px;  '
        +'margin: 0px 3px 0px 3px ;'
        +'padding: 0;'
        +'display: inline-block;'      
        +'border-radius: 50%;'
        +'background: '+clr[0]+';' 
        +'border: solid 0.04em black;' 
        +'background: -moz-linear-gradient('+p1+', '+clr[0]+' 35%, '+clr[1]+' 36%, '+clr[1]+' 66%, '+clr[2]+' 67%);'
        +'background: -webkit-linear-gradient('+p1+', '+clr[0]+' 35%,'+clr[1]+' 36%,'+clr[1]+' 66%,'+clr[2]+' 67%); '
        +'background: linear-gradient(to '+p2+', '+clr[0]+' 35%,'+clr[1]+' 36%,'+clr[1]+' 66%,'+clr[2]+' 67%); '
        +'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\''+clr[0]+'\', endColorstr=\''+clr[2]+'\',GradientType='+p3+' );'             
        +'" >'
        +'</div>';
    }
    return html;
}


