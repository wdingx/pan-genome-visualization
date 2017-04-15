import {render_chart_table} from "./chartsAndClusterTable";
import * as datapath from "./data_path";
import speciesTree from "./speciesTree";
import  {metaDataTable} from "./datatable-meta";
import  {panXTree, tableAccessories} from "./global";
import {attachButtons, tipText, tipFontSize, attachPanzoom, connectTrees, applyChangeToTree, hideNonSelected, undoHideNonSelected} from "./tree-init";
import {updateGeometry} from "../phyloTree/src/updateTree";
import {linkTableAlignmentTrees, linkMetaTableTree} from "./linkTableAlignmentTrees";
import {create_dropdown, updateMetadata} from "./meta-color-legend";
import {assign_metadata_color} from "./meta-color-assignment";
import {tooltip_node} from './tooltips';
import speciesTreeCallbacks from "./speciesTreeCallbacks";
import geneTreeCallbacks from "./geneTreeCallbacks";
// /** strain_tree processing */
//render_tree(0, "mytree1", coreTree_path, clusterID=null, null);

var mySpeciesTree,
    myGeneTree,
    myDatatable,
    myMetaDatatable;

const handleSpeciesTree = function(newTree){
    newTree.namesToTips = {};
    for (var ti =0; ti<newTree.tips.length; ti++){
        var tip = newTree.tips[ti];
        tip.name = tip.n.name;
        tip.genes = [];
        newTree.namesToTips[tip.name] = tip;
        panXTree.speciesTreeTipCount+=1;
    }
    mySpeciesTree = newTree;
    panXTree.speciesTree= mySpeciesTree;
    attachButtons(mySpeciesTree, {
                                  layout_radial:"speciesTreeRadial",
                                  layout_vertical:"speciesTreeVertical",
                                  layout_unroot:"speciesTreeUnroot",
                                  zoomInY:"speciesTree_height_plus",
                                  zoomOutY:"speciesTree_height_minus",
                                  scale:"speciesTreeScale",
                                  tipLabels:"speciesTreeLabels",
                                  zoomReset:"speciesTreeZoomReset",
                                  treeSync:"speciesTreeSynchr",
                                  nodeLarge:"speciesTree_nodePlus",
                                  nodeSmaller:"speciesTree_nodeMinus",
                                  download_coreTree:"download_coreTree"});

    mySpeciesTree.svg
        .selectAll('.tip')
        .on('mouseover', function(d){speciesTreeCallbacks.onTipHover(d);
                                     tooltip_node.show.apply(this, [...arguments, this])});
    mySpeciesTree.svg
        .call(tooltip_node);
    //console.log("render_viewer:mySpeciesTree ",mySpeciesTree);
}
const handleGeneTree = function(newTree){
    myGeneTree = newTree;
    connectTrees(mySpeciesTree, myGeneTree);

    myGeneTree.svg
        .selectAll('.tip')
        .on('mouseover', function(d){geneTreeCallbacks.onTipHover(d);
                                     tooltip_node.show.apply(this, [...arguments, this])});
    myGeneTree.svg
        .call(tooltip_node);
    //console.log("render_viewer:myGeneTree ",myGeneTree);
}

const handleDataTable = function(datatable){
    myDatatable = datatable;
    //console.log("render_viewer:myDatatable ",myDatatable);
}

const handleMetaDataTable = function(metaDatatable){
    myMetaDatatable = metaDatatable;
}

const tryConnectTrees = function(){
    if (mySpeciesTree&&myGeneTree&&myDatatable&&myMetaDatatable){
        //connectTrees(mySpeciesTree, myGeneTree);
        linkTableAlignmentTrees('dc_data_table', myDatatable, mySpeciesTree, handleGeneTree);
        linkMetaTableTree(meta_table_id, myMetaDatatable,mySpeciesTree);
        attachPanzoom("speciesTree", mySpeciesTree);
        //attachPanzoom("geneTree", myGeneTree);
        /** create metadata dropdown list */
        create_dropdown("#dropdown_list",mySpeciesTree,'geneTree',meta_display,'coreTree_legend',null);
        assign_metadata_color(meta_details,meta_display);
        //** monitor metadata selection and make legend
        var menu_panel = d3.select("#dropdown_select")
        menu_panel.on("change", function(d) {
            if (this.value!='Meta-info') {
                //console.log("trigger meta data color change", this.value, d, menu_panel);
                updateMetadata(this.value, mySpeciesTree, myGeneTree, meta_display, 'coreTree_legend', 0);
            }
        });
    }else{
        //console.log("trees not available yet, retry", mySpeciesTree, myGeneTree);
        setTimeout(tryConnectTrees, 1000);
    }
}

//** search strain via accession number
const search_accession= function (input_value) {
    /*var tree_index=1;*/
    var searchStr = input_value.toLowerCase();
    function nodeMatch(d, treeType){
        var name=(treeType=='speciesTree')?d.name.toLowerCase():d.accession.toLowerCase();
        return ((name.indexOf(searchStr) > -1 ) && (input_value.length != 0));
    };

    if (input_value=='') {
        undoHideNonSelected(mySpeciesTree);
        undoHideNonSelected(myGeneTree);
    }else{
        mySpeciesTree.tips.forEach(function(d){
            d.state.selected=(nodeMatch(d,'speciesTree'))?true:false;
        })
        hideNonSelected(mySpeciesTree);

        myGeneTree.tips.forEach(function(d){
            d.state.selected=(nodeMatch(d,'geneTree'))?true:false;
        })
        hideNonSelected(myGeneTree);
    }
};
window.search_accession=search_accession;

const trigger_triplet_button = function(){

    // speciesTree triplet-button-group for 3 types of layouts
    $('.triplet-button-toggle.speciesTree').on("click", function () {
        $(this).toggleClass('open');
        $('.option.speciesTree').toggleClass('scale-on');
    });

    $('.triplet-button-toggle.geneTree').on("click", function () {
        $(this).toggleClass('open');
        $('.option.geneTree').toggleClass('scale-on');
    });
}
trigger_triplet_button();

speciesTree("speciesTree", datapath.coreTree_path, handleSpeciesTree);
// /** tree rotate listener */
// rotate_monitor('tree_rotate','mytree2');



/** render interactive charts and gene-cluster datatable */
//console.log("render_viewer:",datapath);
//myDatatable =
render_chart_table.initData(datapath.path_datatable1,'dc_data_table', 'GC_tablecol_select',
    'dc_data_count','dc_straincount_chart','dc_geneLength_chart','dc_coreAcc_piechart',
    'changeCoreThreshold','coreThreshold',
    'speciesTreeDiv','geneTreeDiv', null, handleDataTable, handleGeneTree);
/** render meta-data datatable */
var meta_table_id='dc_data_table_meta';
metaDataTable.dataTable2Fun(meta_table_id, handleMetaDataTable);
tryConnectTrees();



window.addEventListener("resize", function(){
    const speciesTreeResize = function(){
        mySpeciesTree.dimensions.width = window.innerWidth/3;
        mySpeciesTree.svg.attr("width", window.innerWidth/3);
        updateGeometry(mySpeciesTree);
    };
    applyChangeToTree(mySpeciesTree, speciesTreeResize, 0);

    const geneTreeResize = function(){
        myGeneTree.dimensions.width = window.innerWidth/3;
        myGeneTree.svg.attr("width", window.innerWidth/3);
        updateGeometry(myGeneTree);
    };
    applyChangeToTree(myGeneTree, geneTreeResize, 0);
});

