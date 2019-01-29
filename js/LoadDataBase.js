
 function loadCompetenciaDataBase(){
    var json_txt=Itm('container_json_import').value.trim(); 
    var barLoad=Itm('bar_load');
    var barLoadChild=Itm('bar_load_child');
    $(barLoad).hide();
    if(json_txt!=''){
        var list=JSON.parse(json_txt);
        $(barLoad).show();
        var tam=list.length;
        var count=0;
        Tooltip('Total a procesar '+tam);
        for(var i=0;i<list.length-1;i++){
            var ent=list[i];
            var torneo=import_id_torneo(ent.id_torneo);
            if(torneo==null) continue;
            var confederation,typeTorneo; 
            if(torneo=='CL' || torneo=='CS') confederation='CONMEBOL';
            else if(torneo=='UCL' || torneo=='UEL') confederation='UEFA';
            else confederation='MUNDO';

            if(ent.tipo_competencia=='Liga' && ent.conf_fase_previa.trim()==''){
                typeTorneo='CGI';
            }else if(ent.tipo_competencia=='Liga' && ent.conf_fase_previa.trim()!=''){
                typeTorneo='CGFP';
            }else{
                typeTorneo='CE';
            }

            var competencia={ 
                competencia: torneo,
                edicion: parseInt(ent.edicion),
                name: name_torneo(torneo),
                pk: torneo+ent.edicion,
                plantilla:{
                    cantClaxGru: ent.clasf_grupo,
                    cantGru: ent.num_grupos,
                    cantMejTerceros: ent.clasf_mejores_terceros,
                    cantTeam: ent.num_equipos,
                    cantTeamxGru: ent.num_equi_x_gru,
                    cff: convertConfFase(ent.conf_competencia),
                    cfp: convertConfFase(ent.conf_fase_previa),
                    confederation: confederation,
                    id: parseInt(ent.id),
                    name: torneo,
                    typeMatch: "UNI",
                    typeTeam: ((ent.tipo_equipos=='Clubes')?"CLUB":"SEL") ,
                    typeTorneo: typeTorneo,                    
                }
            };

            add("competencia",competencia,'','');
            count++;
            var porcentaje=parseFloat((100*count)/tam);
            var resultado = Math.round(porcentaje*Math.pow(10,2))/Math.pow(10,2);            
            $(barLoadChild).css({"width": porcentaje+"%"});
            $(barLoadChild).html(resultado+"%");
        }
        Itm('container_json_import').value='';
        Tooltip('Total procesados '+count);
    }
}