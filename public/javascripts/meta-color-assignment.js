import {pxTree} from "./tree-init";
import {sequential_color_set, more_color_set, safe_color_set} from "./colors";
import chroma from 'chroma-js';
/* var scale = chroma.scale(['white', 'red']);
console.log(scale(0.5).hex());*/

const assign_discrete_color = function(metaColor_dicts,metaColor_dicts_keys, metaType_key, meta_detail,color_set) {
    var tmp_meta_color_dict = {};
    var index = meta_detail.indexOf('unknown');
    if (index > -1) { //** assign color to unknown item
        meta_detail.splice(index, 1);
        tmp_meta_color_dict['unknown']=pxTree.node_metaunknown_stroke;
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
        tmp_meta_color_dict['unknown']=pxTree.node_metaunknown_stroke;
    }
    const min= parseInt(d3.min(meta_detail), 10),
          max= parseInt(d3.max(meta_detail), 10),
          distance = max - min,
          num_interval = 10,
          interval= distance/num_interval;

    //** create a list of legend values and corresponding colors
    const tmp_num_list = d3.range(num_interval+1).map(function(i){
        const legend_value= parseFloat((min+interval*i));
        tmp_meta_color_dict[legend_value]=sequential_color_set[i];
        return legend_value;
    });

    //** create upper-/lower-bound for each legend value
    var tmp_bound_list = [];
    tmp_num_list.forEach(function(item,ind) {
        const result=(tmp_num_list[ind-1]!==undefined) ? [tmp_num_list[ind-1],item] : [0,item]
        tmp_bound_list.push(result);
    });

    //** link original value to each legend value
    meta_detail.forEach(function(meta_item){
        tmp_bound_list.forEach(function(bound_item){
            if (meta_item>bound_item[0] && meta_item<=bound_item[1]){
                tmp_meta_color_reference_dicts[meta_item]=bound_item[1]
            }
        })
    });

    metaColor_dicts[metaType_key] = tmp_meta_color_dict;
    metaColor_dicts_keys[metaType_key] = tmp_num_list;
    metaColor_reference_dicts[metaType_key] = tmp_meta_color_reference_dicts;
}

export const assign_metadata_color = function(metaColor_dicts,metaColor_dicts_keys,metaColor_reference_dicts,metaTypes){
    for (var j = 0; j < metaTypes.length; j++) {
        var metaType_key = metaTypes[j]; //'host'
        var meta_detail = meta_set[metaType_key]; // ["human", "rice"]
        if (meta_display_set['color_options'][metaType_key]['type']=='continuous') {
            assign_continuous_color(metaColor_dicts,metaColor_dicts_keys,metaColor_reference_dicts,metaType_key,meta_detail)
        }
        else {
            assign_discrete_color(metaColor_dicts,metaColor_dicts_keys,metaType_key,meta_detail, more_color_set);
            /*if (meta_detail.length < more_color_set.length ) {
                assign_color(more_color_set);
            }*/
        }
    }
}