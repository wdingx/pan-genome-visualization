import {panXTree,metaLegend} from "./global";
import chroma from 'chroma-js';

export var metaColor_dicts = {},//** {'host':hostColor,'country':countryColor}
       metaColor_dicts_keys = {}, //** keep the original key order
       metaColor_reference_dicts= {};

const assign_discrete_color = function(metaColor_dicts,metaColor_dicts_keys, metaType_key, meta_detail,color_set) {
    var tmp_meta_color_dict = {};
    var index = meta_detail.indexOf('unknown');
    if (index > -1) { //** assign color to unknown item
        meta_detail.splice(index, 1);
        tmp_meta_color_dict['unknown']=panXTree.metaUnknown;
    }
    //** create a list of legend values and corresponding colors
    var tmp_meta_color_dict_keys = meta_detail.map(function(item,ind){
        tmp_meta_color_dict[item]=color_set[ind];
        return item;
    });
    if (tmp_meta_color_dict['unknown']!=undefined){
            tmp_meta_color_dict_keys.push('unknown');
    }
    metaColor_dicts[metaType_key] = tmp_meta_color_dict;
    metaColor_dicts_keys[metaType_key] = tmp_meta_color_dict_keys;
}

const assign_continuous_color = function(metaColor_dicts,metaColor_dicts_keys,metaColor_reference_dicts,metaType_key,meta_detail) {
    var tmp_meta_color_dict= {},
        tmp_meta_color_dict_keys= [],
        tmp_meta_color_reference_dicts= {};
    const index = meta_detail.indexOf('unknown');
    if (index > -1) { //** assign color to unknown item
        meta_detail.splice(index, 1);
        tmp_meta_color_dict['unknown']=panXTree.node_metaunknown_stroke;
    }

    /*var regEx = /<|>|=/g;
    var testString = "<test><=";
    console.log(testString.replace(regEx,''));*/

    const min_val= parseFloat(d3.min(meta_detail)),
          max_val= parseFloat(d3.max(meta_detail)),
          distance = max_val - min_val,
          num_interval = 10,
          interval= distance/num_interval;

    //** create a list of legend values and corresponding colors
    const tmp_num_list = d3.range(num_interval+1).map(function(i){
        const legend_value= parseFloat(min_val+interval*i).toFixed(2);
        tmp_meta_color_dict[legend_value]=metaLegend.continuous_colorSet[i];
        return legend_value;
    });

    //** create upper-/lower-bound for each legend value
    var tmp_bound_list = [];
    tmp_num_list.forEach(function(item,ind) {
        const result=(tmp_num_list[ind-1]!==undefined) ? [tmp_num_list[ind-1],item] : ['0',item]
        tmp_bound_list.push(result);
    });

    //** link original value to each legend value
    meta_detail.forEach(function(meta_item){
        tmp_bound_list.forEach(function(bound_item){
            if (meta_item==bound_item[0]){
                tmp_meta_color_reference_dicts[meta_item]=bound_item[1]
            }
            if (meta_item>bound_item[0] && meta_item<=bound_item[1]){
                tmp_meta_color_reference_dicts[meta_item]=bound_item[1]
            }
        })
    });

    metaColor_dicts[metaType_key] = tmp_meta_color_dict;
    metaColor_dicts_keys[metaType_key] = tmp_num_list;
    metaColor_reference_dicts[metaType_key] = tmp_meta_color_reference_dicts;
}

const assign_mixed_continuous_color = function(metaColor_dicts,metaColor_dicts_keys,metaColor_reference_dicts,metaType_key,raw_meta_detail) {
    var tmp_meta_color_dict= {},
        tmp_meta_color_dict_keys= [],
        tmp_meta_color_reference_dicts= {};
    var meta_detail= [];
    for (var i=0,len=raw_meta_detail.length; i < len; i++) {
        meta_detail.push(raw_meta_detail[i][1]);
    }
    //console.log(0,raw_meta_detail,meta_detail)
    const index = meta_detail.indexOf('unknown');
    if (index > -1) { //** assign color to unknown item
        meta_detail.splice(index, 1);
        raw_meta_detail.splice(index, 1);
        tmp_meta_color_dict['unknown']=panXTree.node_metaunknown_stroke;
    }

    const min_val= parseFloat(d3.min(meta_detail)),
          max_val= parseFloat(d3.max(meta_detail)),
          distance = max_val - min_val,
          num_interval = 10,
          interval= distance/num_interval;

    //** create a list of legend values and corresponding colors
    const tmp_num_list = d3.range(num_interval+1).map(function(i){
        const legend_value= parseFloat(min_val+interval*i).toFixed(2);
        tmp_meta_color_dict[legend_value]=metaLegend.continuous_colorSet[i];
        return legend_value;
    });

    //** create upper-/lower-bound for each legend value
    var tmp_bound_list = [];
    tmp_num_list.forEach(function(item,ind) {
        const result=(tmp_num_list[ind-1]!==undefined) ? [tmp_num_list[ind-1],item] : ['0',item]
        tmp_bound_list.push(result);
    });

    //** link original value to each legend value
    meta_detail.forEach(function(meta_item,ind){
        for (var i=0,len=tmp_bound_list.length; i < len; i++) {
            const bound_item=tmp_bound_list[i];
            if (meta_item==bound_item[0]){
                tmp_meta_color_reference_dicts[raw_meta_detail[ind][0]]=bound_item[1];
                break;
            }else if (meta_item>bound_item[0] && meta_item<=bound_item[1]){
                tmp_meta_color_reference_dicts[raw_meta_detail[ind][0]]=bound_item[1];
                break;
            }
        }
    });
    metaColor_dicts[metaType_key] = tmp_meta_color_dict;
    metaColor_dicts_keys[metaType_key] = tmp_num_list;
    metaColor_reference_dicts[metaType_key] = tmp_meta_color_reference_dicts;
}

export const assign_metadata_color = function(meta_details,meta_display){
    const metaTypes= meta_display["meta_display_order"];

    for (var j = 0; j < metaTypes.length; j++) {
        var metaType_key = metaTypes[j]; //**'host'
        var meta_detail = meta_details[metaType_key]; //** ["human", "rice"]
        const meta_coloring_type= meta_display['color_options'][metaType_key]['type'];
        if (meta_coloring_type=='continuous') {
            assign_continuous_color(metaColor_dicts,metaColor_dicts_keys,metaColor_reference_dicts,metaType_key,meta_detail)
        } else if (meta_coloring_type=='discrete') {
            const discret_color_set=chroma.scale(metaLegend.discrete_colorSet).colors(meta_detail.length);
            assign_discrete_color(metaColor_dicts,metaColor_dicts_keys,metaType_key,meta_detail, discret_color_set);
        } else if (meta_coloring_type=='mixed_continuous') {
            var raw_meta_detail=meta_detail;
            assign_mixed_continuous_color(metaColor_dicts,metaColor_dicts_keys,metaColor_reference_dicts,metaType_key,raw_meta_detail)
        }
    }
}