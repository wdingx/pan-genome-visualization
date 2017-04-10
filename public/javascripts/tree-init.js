import {panXTree} from "./global";
import {changeLayout, changeDistance, updateTips} from "../phyloTree/src/updateTree";
import {zoomInY,  zoomIn, zoomIntoClade} from "../phyloTree/src/zoom";
import {removeLabels, tipLabels}  from "../phyloTree/src/labels";
import svgPanZoom from "svg-pan-zoom";
import {filterMetaDataTable} from "./datatable-meta";
import {updateTipAttribute,updateBranches} from "../phyloTree/src/updateTree";
import {aln_file_path} from "./data_path";

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
        if (tool_side==1) {//panXTree.genePattern_tool2['node_color_mem'][d.name]=node_color
            panXTree.treeStyle_tool2[style_type][target_type]=current_style
        } else {
            panXTree.treeStyle_tool1[style_type][target_type]=current_style
        }
    }

    var restore_tree_style= function(tool_side, style_type, target_type) {
        return (tool_side==1) ? panXTree.treeStyle_tool2[style_type][target_type] : panXTree.treeStyle_tool1[style_type][target_type];
    }

    var store_genePattern_style= function(tool_side, style_type, target_type, current_style) {
        if (tool_side==1) {
            panXTree.genePattern_tool2[style_type][target_type]=current_style
        } else {
            panXTree.genePattern_tool1[style_type][target_type]=current_style
        }
    }

    var restore_genePattern_style= function(tool_side, style_type, target_type) {
        return (tool_side==1) ? panXTree.genePattern_tool2[style_type][target_type] : panXTree.genePattern_tool1[style_type][target_type];
    }

   return{  hasOwnProperty:hasOwnProperty,
            isEmptyObj:isEmptyObj,
            store_tree_style:store_tree_style,
            restore_tree_style:restore_tree_style,
            store_genePattern_style:store_genePattern_style,
            restore_genePattern_style:restore_genePattern_style,
        }
}();

export const hideNonSelected =function(tree){
    tree.tipElements
        .attr('r',function(d){if (d.state.selected){return d.tipAttributes.r*1.5;}
                              else {return d.tipAttributes.r*0.5;}
                             })
        .style('fill',function(d){if (d.state.selected){ return d.tipAttributes.fill;}
                                  else {return "#CCC";}
                            })
        .style('stroke',function(d){if (d.state.selected){ return d.tipAttributes.stroke;}
                              else {return "#CCC";}
                            });
}

export const undoHideNonSelected =function(tree){
    tree.tipElements
        .attr('r',function(d){return d.tipAttributes.r;})
        .style('fill', function(d){return d.tipAttributes.fill;})
        .style('stroke', function(d){return d.tipAttributes.stroke;});
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
    if (d.n.attr.strainName && d.terminal){
        return d.n.attr.strainName;
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
    const updateSelected=false;
    if (buttons.layout){
        //console.log("button:", buttons.TreeViewSelect_id);
        $('#'+buttons.layout).change(function() {
            myTree.layout =  (d3.select(this).property('checked')==false) ? 'rect' : 'radial';
            applyChangeToTree(myTree, function(){changeLayout(myTree, dt);}, dt);
        });
    }
    if (buttons.layout_radial){
        $('#'+buttons.layout_radial).click(function() {
            myTree.layout =  'radial';
            applyChangeToTree(myTree, function(){changeLayout(myTree, dt);}, dt);
            });
    }
    if (buttons.layout_vertical){
        $('#'+buttons.layout_vertical).click(function() {
            myTree.layout =  'rect';
            applyChangeToTree(myTree, function(){changeLayout(myTree, dt);}, dt);
        });
    }
    if (buttons.layout_unroot){
        $('#'+buttons.layout_unroot).click(function() {
            myTree.layout =  'unrooted';
            applyChangeToTree(myTree, function(){changeLayout(myTree, dt);}, dt);
        });
    }
    if (buttons.orientation){
            $('#'+buttons.orientation).change(function() {
            myTree.orientation =  (d3.select(this).property('checked')==true) ? {x:-1, y:1} : {x:1, y:1};
            applyChangeToTree(myTree, function(){changeLayout(myTree, dt);}, dt);
        });
    }
    /*if (buttons.nodeLarge){
        $('#'+buttons.nodeLarge).click(function() {
            const treeNodeSizeEnlarge= function(){
                myTree.tipElements
                    .attr('r',function(d){
                    return d.tipAttributes.r*1.5;})
            }
            applyChangeToTree(myTree, treeNodeSizeEnlarge, 0);
        });
    }*/
    if (buttons.nodeSmaller){
        $('#'+buttons.nodeSmaller).click(function() {
            myTree.tips.forEach(function(d,i){
                d.tipAttributes.r *= 0.5;
            });
            updateTipAttribute(myTree,'r');
        });
    }
    if (buttons.zoomInY){
        $('#'+buttons.zoomInY).click(function() {
            applyChangeToTree(myTree, function(){zoomInY(myTree,1.4,dt, updateSelected);},dt);
            //filterMetaDataTable('dc_data_table_meta', myTree);
        });
    }
    if (buttons.zoomOutY){
        $('#'+buttons.zoomOutY).click(function() {
            applyChangeToTree(myTree, function(){zoomInY(myTree,0.7,dt, updateSelected);},dt);
            //filterMetaDataTable('dc_data_table_meta', myTree);
        });
    }
    if (buttons.zoomReset){
        $('#'+buttons.zoomReset).click(function() {
            if (myTree.panZoom){
                myTree.panZoom.reset();
            }
            applyChangeToTree(myTree, function(){zoomIntoClade(myTree, myTree.nodes[0],dt, true);},dt);
            filterMetaDataTable('dc_data_table_meta', myTree);
        });
    }
    if (buttons.treeSync){
        $('#'+buttons.treeSync).change(function(event) {
            myTree.treeSync =d3.select(this).property('checked')
            if (myTree.treeSync){
                var myGeneTree=panXTree.currentGeneTree;
                attachButtons(myGeneTree, {
                                      layout_radial:"speciesTreeRadial",
                                      layout_vertical:"speciesTreeVertical",
                                      layout_unroot:"speciesTreeUnroot",
                                      scale:"speciesTreeScale"
                                      });
            }else{
                $('#'+buttons.layout_radial).off("click");
                $('#'+buttons.layout_vertical).off("click");
                $('#'+buttons.layout_unroot).off("click");
                $('#'+buttons.scale).off("change");
                event.stopPropagation();
                var mySpeciesTree=panXTree.speciesTree;
                attachButtons(mySpeciesTree, {
                                      layout_radial:"speciesTreeRadial",
                                      layout_vertical:"speciesTreeVertical",
                                      layout_unroot:"speciesTreeUnroot",
                                      zoomInY:"speciesTree_height_plus",
                                      zoomOutY:"speciesTree_height_minus",
                                      scale:"speciesTreeScale",
                                      tipLabels:"speciesTreeLabels",
                                      zoomReset:"speciesTreeZoomReset",
                                      treeSync:"speciesTreeSynchr"});
            }
        });
    }
    if (buttons.tipLabels){
        $('#'+buttons.tipLabels).change(function() {
            myTree.showTipLabels = d3.select(this).property('checked')
            //-console.log("tipLabels", myTree.visibleTips, tipFontSize(myTree)());
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
    if (buttons.download_coreTree){
        d3.select('#'+buttons.download_coreTree)
            .append('a')
            .attr('href','/download/datasets/'+speciesAbbr+'/strain_tree.nwk')
            .append('i')
            .attr('class','glyphicon glyphicon-download-alt')
    }
    if (buttons.download_geneTree&&buttons.clusterID){
        var download_geneTree=d3.select('#'+buttons.download_geneTree);
            download_geneTree.selectAll('a').remove();
            download_geneTree.append('a')
                .attr('id','#'+buttons.download_geneTree_id+'_href')
                .attr('href','/download/datasets/'+speciesAbbr+'/geneCluster/'+buttons.clusterID+'.nwk')
                .append('i')
                .attr('class','glyphicon glyphicon-download-alt')
    }
}

export const attachPanzoom = function(treeID, myTree){
    const dt=0;
    const updateSelected = false;
    myTree.panZoom = svgPanZoom("#"+treeID, {
        beforeZoom: function(newZoom, oldZoom){
            applyChangeToTree(myTree, function(){
                zoomInY(myTree,newZoom/oldZoom,dt, updateSelected);}, dt);
            //filterMetaDataTable('dc_data_table_meta', myTree);
            return false;
        },
        // beforePan: function(oldPan, newPan){
        //     //console.log("panning", oldPan, newPan);
        //     applyChangeToTree(myTree, function(){
        //         pan(myTree, newPan.x-oldPan.x, newPan.y-oldPan.y, updateSelected);},dt);
        //     filterMetaDataTable('dc_data_table_meta', myTree);
        //     return {x:false, y:false};
        // }
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
        if (!geneTree.paralogs[tip.accession]){
            geneTree.paralogs[tip.accession] = [];
        }
        geneTree.paralogs[tip.accession].push(tip);
    }

    for (var ti =0; ti<geneTree.tips.length; ti++){
        var tip = geneTree.tips[ti];
        tip.paralogs = geneTree.paralogs[tip.accession].filter(function(d){return d.name!==tip.name;});
    }


    for (var ti =0; ti<speciesTree.tips.length; ti++){
        var species = speciesTree.tips[ti];
        species.genes = [];
        species.elem = speciesTree.svg.selectAll("#"+species.tipAttributes.id);
        if (!geneTree.paralogs[species.name]){
            geneTree.paralogs[species.name]=[];
        }
        for (var gi=0; gi<geneTree.paralogs[species.name].length; gi++){
            species.genes.push(geneTree.paralogs[species.name][gi]);
        }
        if (geneTree.paralogs[species.name].length){
            species.genePresent = true;
        }else{
            species.genePresent = false;
        }
    }
    colorPresenceAbsence(speciesTree);
    styleGainLoss(speciesTree);
}

export const colorPresenceAbsence = function(speciesTree){
    var node,strain, fill;
    for (var i=0; i<speciesTree.tips.length; i++){
        node = speciesTree.tips[i];
        node.tipAttributes.r = node.genePresent?5:3;
        fill = node.genePresent?panXTree.genePresentFill:panXTree.geneAbsentFill
        node.tipAttributes.fill = fill;
        node.tipAttributes.stroke = d3.rgb(fill).darker(panXTree.strokeToFill).toString();
    }
    updateTips(speciesTree, ["r"], ["fill", "stroke"], 0);
}

export const styleGainLoss = function(speciesTree){
    const patter_path=aln_file_path+panXTree.currentClusterID+'_patterns.json';
    d3.text(patter_path, function(error, data){
        speciesTree.nodes.forEach(function(d,i){
            if (d.n.name!='NODE_0000000'){
                const event_type=data[i-1];
                const stroke=(event_type=='0'||event_type=='2')? panXTree.geneAbsentFill: panXTree.genePresentFill;
                const stroke_width_factor=(event_type=='1'||event_type=='2')? 1.5: 1;
                const stroke_dasharray= (event_type=='2') ?  "6,6" : "1,0";
                d.branchAttributes["stroke"] = stroke;
                d.branchAttributes["stroke-width"] = panXTree.branch_stroke_width*stroke_width_factor;
                d.branchAttributes["stroke-dasharray"] = stroke_dasharray;
                updateBranches(speciesTree, [], ['stroke', 'stroke-width','stroke-dasharray'], 0);
            }
        });
    })
}
