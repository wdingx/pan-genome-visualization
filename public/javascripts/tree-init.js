import {changeLayout, changeDistance, updateTips} from "../phyloTree/src/updateTree";
import {zoomInY, zoomIntoClade} from "../phyloTree/src/zoom";
import {removeLabels, tipLabels}  from "../phyloTree/src/labels";
import panzoom from "jquery.panzoom";

console.log("panzoom", panzoom);

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

export const pxTree = {
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
    genePresentFill: '#005BCC',//'#3A89EA' '#1F69C4' gene presence
    geneAbsentFill: '#E01F1F', // '#D82400' '#EA5833'; gene absence
    genePresentR: 4, // tip radius
    geneAbsentR:  3,
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
export const tipFontSize = function(tree){
    return function(d){
        const nTips = tree.visibleTips.length;
        if (nTips<20){
            return 14.0;
        }else if (nTips<100){
            return 14 - 8*((nTips-20)/80.);
        }else{return 0;}
    };
}


export const applyChangeToTree = function(myTree, func, dt){
    removeLabels(myTree);
    func();
    if (myTree.showTipLabels){
        setTimeout(function() {tipLabels(myTree, tipText, tipFontSize(myTree), 3,8);}, dt?dt:1000);
    };
}


export const attachButtons = function(myTree, buttons){
    const dt = 1000;
    if (buttons.layout){
        console.log("button:", buttons.TreeViewSelect_id);
        $('#'+buttons.layout).change(function() {
            myTree.layout =  (d3.select(this).property('checked')==false) ? 'rect' : 'radial';
            applyChangeToTree(myTree, function(){changeLayout(myTree, dt);}, dt);
        });
    }
    if (buttons.zoomInY){
        $('#'+buttons.zoomInY).click(function() {
            applyChangeToTree(myTree, function(){zoomInY(myTree,1.4,dt);},dt);
        });
    }
    if (buttons.zoomOutY){
        $('#'+buttons.zoomOutY).click(function() {
            applyChangeToTree(myTree, function(){zoomInY(myTree,0.7,dt);},dt);
        });
    }
    if (buttons.zoomReset){
        $('#'+buttons.zoomReset).click(function() {
            applyChangeToTree(myTree, function(){zoomIntoClade(myTree, myTree.nodes[0],dt);},dt);
        });
    }
    if (buttons.tipLabels){
        $('#'+buttons.tipLabels).change(function() {
            myTree.showTipLabels = d3.select(this).property('checked')
            console.log("tipLabels");
            if (myTree.showTipLabels){
                tipLabels(myTree, tipText, tipFontSize(myTree),  3,8);
            }else{
                removeLabels(myTree);
            }
        });
    }
    if (buttons.scale){
        $('#'+buttons.scale).change(function() {
            myTree.distance = (d3.select(this).property('checked')===false) ? "level":"div";
            applyChangeToTree(myTree, function(){changeDistance(myTree, dt);},dt);
        });
    }
}


export const attachPanzoom = function(treeID){
    $("#"+treeID).panzoom({
        transition: true,
        increment: 0.1,
        minScale: 0.7,
        maxScale: 1.5,
        duration: 50,
    });
}


export const connectTrees = function(speciesTree, geneTree){
    if (!(speciesTree&&geneTree)){
        console.log("trees are not yet in place");
        return;
    }
    console.log("connecting trees");
    geneTree.paralogs = {}
    for (var ti =0; ti<geneTree.tips.length; ti++){
        var tip = geneTree.tips[ti];
        tip.name = tip.n.name;
        tip.accession = tip.n.accession;
        tip.elem = geneTree.svg.selectAll("#"+tip.tipAttributes.id);
        tip.strainTip = speciesTree.svg.selectAll("#"+speciesTree.namesToTips[tip.accession].tipAttributes.id);
        if (geneTree.paralogs[tip.accession]){
            geneTree.paralogs[tip.accession].push(tip);
        }else{
            geneTree.paralogs[tip.accession] = [tip];
        }
    }

    for (var ti =0; ti<geneTree.tips.length; ti++){
        var tip = geneTree.tips[ti];
        tip.paralogs = geneTree.paralogs[tip.accession].filter(function(d){return d.name!==tip.name;});
    }


    for (var ti =0; ti<speciesTree.tips.length; ti++){
        var species = speciesTree.tips[ti];
        species.genes = [];
        species.elem = speciesTree.svg.selectAll("#"+species.tipAttributes.id);
        for (var gi=0; gi<geneTree.paralogs[species.name].length; gi++){
            species.genes.push(geneTree.paralogs[species.name][gi]);
        }
        if (geneTree.paralogs[species.name]){
            species.genePresent = true;
            species.tipAttributes.fill = pxTree.genePresentFill;
            species.tipAttributes.r = pxTree.genePresentR;
        }else{
            species.genePresent = false;
            species.tipAttributes.fill = pxTree.geneAbsentFill;
            species.tipAttributes.r = pxTree.geneAbsentR;
        }
    }
    updateTips(speciesTree,['r'],['fill'],200);
}

