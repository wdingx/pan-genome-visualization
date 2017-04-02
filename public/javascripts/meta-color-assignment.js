import {pxTree} from "./tree-init";
import {sequential_color_set, more_color_set, safe_color_set} from "./colors";
import chroma from 'chroma-js';
/* var scale = chroma.scale(['white', 'red']);
console.log(scale(0.5).hex());*/

const assign_discrete_color = function(metaColor_sets,metaColor_set_keys, metaType_key, meta_detail,color_set) {
    var tmp_meta_color_set = {};
    var tmp_meta_color_set_keys = [];
    var index = meta_detail.indexOf('unknown');
    if (index > -1) { //# assign color to unknown item
        meta_detail.splice(index, 1);
        tmp_meta_color_set['unknown']=pxTree.node_metaunknown_stroke;
    }
    for (var i=0, len=meta_detail.length; i<len ; i++) {
        var legend_value = meta_detail[i];
        tmp_meta_color_set_keys.push(legend_value);
        tmp_meta_color_set[legend_value]=color_set[i];
    }
    if (tmp_meta_color_set['unknown']!=undefined){
            tmp_meta_color_set_keys.push('unknown');
    }
    metaColor_sets[metaType_key] = tmp_meta_color_set;
    metaColor_set_keys[metaType_key] = tmp_meta_color_set_keys;
}

const assign_continuous_color = function(metaColor_sets,metaColor_set_keys,metaType_key,meta_detail) {
    var tmp_meta_color_set = {};
    var tmp_meta_color_set_keys = [];
    var index = meta_detail.indexOf('unknown');
    if (index > -1) { //# assign color to unknown item
        meta_detail.splice(index, 1);
        tmp_meta_color_set['unknown']=pxTree.node_metaunknown_stroke;
    }
    var min = Math.min.apply(null, meta_detail),
        max = Math.max.apply(null, meta_detail);
    var distance = max - min;
    var num_interval = 5;
    var interval= distance/num_interval;
    for (var i = 0; i <= num_interval; i++) {
        // one decimal place
        var legend_value = Math.round( (min+interval*i)*10 )/10;
        tmp_meta_color_set_keys.push(legend_value);
        tmp_meta_color_set[legend_value]=sequential_color_set[i];
    }
    if (tmp_meta_color_set['unknown']!=undefined){
        tmp_meta_color_set_keys.push('unknown');
    }
    metaColor_sets[metaType_key] = tmp_meta_color_set;
    metaColor_set_keys[metaType_key] = tmp_meta_color_set_keys;
}

export const assign_metadata_color = function(metaColor_sets,metaColor_set_keys,metaTypes){
    for (var j = 0; j < metaTypes.length; j++) {
        var metaType_key = metaTypes[j]; //'host'
        var meta_detail = meta_set[metaType_key]; // ["human", "rice"]
        if (meta_display_set['color_options'][metaType_key]['type']=='continuous') {
            assign_continuous_color(metaColor_sets,metaColor_set_keys,metaType_key,meta_detail)
        }
        else {
            assign_discrete_color(metaColor_sets,metaColor_set_keys,metaType_key,meta_detail, more_color_set);
            /*if (meta_detail.length < more_color_set.length ) {
                assign_color(more_color_set);
            }*/
        }
    }
}