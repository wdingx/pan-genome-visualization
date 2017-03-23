export const pgModule = function(){
    var hasOwnProperty= function(obj, prop){
        return (obj[prop] !== undefined);
    }
    /*function hasOwnProperty(obj, prop) {
        var proto = obj.__proto__ || obj.constructor.prototype;
        return (prop in obj) &&
            (!(prop in proto) || proto[prop] !== obj[prop]);
    }*/

    var isEmptyObj= function(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) { return false; }
        }
        return true;
    };

    var store_tree_style= function(tool_side, style_type, target_type, current_style) {
        if (tool_side==1) {//pxTree.genePattern_tool2['node_color_mem'][d.name]=node_color
            pxTree.treeStyle_tool2[style_type][target_type]=current_style
        } else {
            pxTree.treeStyle_tool1[style_type][target_type]=current_style
        }
    }

    var restore_tree_style= function(tool_side, style_type, target_type) {
        return (tool_side==1) ? pxTree.treeStyle_tool2[style_type][target_type] : pxTree.treeStyle_tool1[style_type][target_type];
    }

    var store_genePattern_style= function(tool_side, style_type, target_type, current_style) {
        if (tool_side==1) {
            pxTree.genePattern_tool2[style_type][target_type]=current_style
        } else {
            pxTree.genePattern_tool1[style_type][target_type]=current_style
        }
    }

    var restore_genePattern_style= function(tool_side, style_type, target_type) {
        return (tool_side==1) ? pxTree.genePattern_tool2[style_type][target_type] : pxTree.genePattern_tool1[style_type][target_type];
    }

   return{  hasOwnProperty:hasOwnProperty,
            isEmptyObj:isEmptyObj,
            store_tree_style:store_tree_style,
            restore_tree_style:restore_tree_style,
            store_genePattern_style:store_genePattern_style,
            restore_genePattern_style:restore_genePattern_style,
        }
}();

export const pgDashboard = {
    winInnerWidth: window.innerWidth,
};

export var pxTree = {
    /**if true, use separated pattern instead of entire pattern */
    large_output: false,
    gain_loss_enabled: true,
    id: 5,
    collapsed_node_size: 4.5,
    collapsed_node_fill: '#26B629', //'steelblue',
    collapsed_node_stroke:'steelblue',
    branch_col: '#4A4A4A',
    branch_col_highlight: '#2D59B1',
    branch_wid_highlight: '3px',
    link_width: '1px',
    link_dasharray: '1px, 0px',
    col_pres: '#005BCC',//'#3A89EA' '#1F69C4' gene presence
    col_abse: '#E01F1F', // '#D82400' '#EA5833'; gene absence
    node_metaunknown_stroke:'#FFFFFF',
    wid_link: '1.2px',
    wid_gloss: '3px',//gain loss highlight
    genePattern_tool1: {
        node_color_mem: {}, link_color_mem: {},
        link_width_mem: {}, link_dash_mem:  {}
    },
    genePattern_tool2: {
        node_color_mem: {}, link_color_mem: {},
        link_width_mem: {}, link_dash_mem:  {}
    },
    treeStyle_tool1: {
        node_color_mem: {}, link_color_mem: {},
        link_width_mem: {}, link_dash_mem:  {}
    },
    treeStyle_tool2: {
        node_color_mem: {}, link_color_mem: {},
        link_width_mem: {}, link_dash_mem:  {}
    },
    legend_width:100,
    legend_height:380
};

export var treeSwitch= {
    layout_vertical: 'false',
};

export var backup_var= {
stroke: '#999',
'stroke-opacity': .6,
color_node_stroke:'steelblue',
color_node_fill:'white',
}


export const buttons={
        TreeViewSelect_id:'TreeViewSelect', LabelsToggle_id:'', InnerNodeToggle_id:'',ScalesToggle_id:'',
        Height_plus_Toggle_id:'',Height_minus_Toggle_id:'',
        tree_zoom_range_id:'',tree_zoom_reset_id:'',
        dropdown_list_id:'',download_coreTree_id:'',download_geneTree_id:'',
        tree_rotate_div_id:'',tree_rotate_id:'',
        genetree_title_id:''
        };
