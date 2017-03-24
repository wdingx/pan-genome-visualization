import {changeLayout, changeDistance} from "../phyloTree/src/updateTree";
import {zoomInY, zoomIntoClade} from "../phyloTree/src/zoom";
import {removeLabels, tipLabels}  from "../phyloTree/src/labels";

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

export const treeProp = {genePresentFill:"#1A3",
                         genePresentR:4,
                         geneAbsentFill:"#CCC",
                         geneAbsentR:3}


export const branchText = function(d){
    if (d.n.muts){
        const tmp = d.n.muts.join(',').slice(0,20);
        return tmp;
    }else{
        return "";
    }
}
export const branchFontSize = function(d){return d.stats.leafCount>2?3:0;}
export const tipText = function(d){
    if (d.n.strain && d.terminal){
        return d.n.strain;
    }else{
        return "";
    }
}
export const tipFontSize = function(d){return 12.0;}


export const attachButtons = function(myTree, buttons){
    if (buttons.layout){
        console.log("button:", buttons.TreeViewSelect_id);
        $('#'+buttons.layout).change(function() {
            myTree.layout =  (d3.select(this).property('checked')==false) ? 'rect' : 'radial';
            removeLabels(myTree);
            changeLayout(myTree, 1000);
            if (myTree.showTipLabels){
                tipLabels(myTree, tipText, tipFontSize, 5, 3);
            };
        });
    }
    if (buttons.zoomInY){
        $('#'+buttons.zoomInY).click(function() {
            removeLabels(myTree);
            zoomInY(myTree,1.4,1000);
            if (myTree.showTipLabels){
                tipLabels(myTree, tipText, tipFontSize, 5, 3);
            };
        });
    }
    if (buttons.zoomOutY){
        $('#'+buttons.zoomOutY).click(function() {
            removeLabels(myTree);
            zoomInY(myTree,0.7,1000);
            if (myTree.showTipLabels){
                tipLabels(myTree, tipText, tipFontSize, 5, 3);
            };
        });
    }
    if (buttons.zoomReset){
        $('#'+buttons.zoomReset).click(function() {
            console.log("reset zom");
            removeLabels(myTree);
            zoomIntoClade(myTree, myTree.nodes[0],1000);
            if (myTree.showTipLabels){
                tipLabels(myTree, tipText, tipFontSize, 5, 5);
            };
        });
    }
    if (buttons.tipLabels){
        $('#'+buttons.tipLabels).change(function() {
            myTree.showTipLabels = d3.select(this).property('checked')
            console.log("tipLabels");
            if (myTree.showTipLabels){
                tipLabels(myTree, tipText, tipFontSize, 5, 3);
            }else{
                removeLabels(myTree);
            }
        });
    }
    if (buttons.scale){
        $('#'+buttons.scale).change(function() {
            myTree.distance = (d3.select(this).property('checked')===false) ? "level":"div";
            removeLabels(myTree);
            changeDistance(myTree, 1000);
            if (myTree.showTipLabels){
                tipLabels(myTree, tipText, tipFontSize, 5, 5);
            };
        });
    }
}