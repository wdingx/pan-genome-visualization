import {render_chart_table} from "./chartsAndClusterTable";
//import {create_dropdown} from "./meta-color-legend";
import * as datapath from "./data_path";
import speciesTree from "./speciesTree";
import  {metaDataTable} from "./datatable-meta";
import {buttons, pxTree, attachButtons, tipText, tipFontSize, attachPanzoom, connectTrees} from "./tree-init";
import linkTableAlignmentTrees from "./linkTableAlignmentTrees";

// /** strain_tree processing */
//render_tree(0, "mytree1", coreTree_path, clusterID=null, null);

var mySpeciesTree;
var myGeneTree;
var myDatatable;

const handleSpeciesTree = function(newTree){
    newTree.namesToTips = {};
    for (var ti =0; ti<newTree.tips.length; ti++){
        var tip = newTree.tips[ti];
        tip.name = tip.n.name;
        tip.genes = [];
        newTree.namesToTips[tip.name] = tip;
    }
    mySpeciesTree = newTree;
    attachButtons(mySpeciesTree, {layout:"TreeViewSelect",
                                  zoomInY:"Height_plus_Toggle",
                                  zoomOutY:"Height_minus_Toggle",
                                  scale:"ScalesToggle",
                                  tipLabels:"InnerNodeToggle",
                                  zoomReset:"tree_zoom_reset"});
    console.log("render_viewer:",mySpeciesTree);
}
const handleGeneTree = function(newTree){
    myGeneTree = newTree;
    console.log("render_viewer:",myGeneTree);
}

const handleDataTable = function(datatable){
    myDatatable = datatable;
    console.log("render_viewer:",myDatatable);
}

const tryConnectTrees = function(){
    if (mySpeciesTree&&myGeneTree&&myDatatable){
        connectTrees(mySpeciesTree, myGeneTree);
        linkTableAlignmentTrees('dc_data_table', myDatatable, mySpeciesTree, handleGeneTree);
    }else{
        console.log("trees not available yet, retry", mySpeciesTree, myGeneTree);
        setTimeout(tryConnectTrees, 1000);
    }
}


speciesTree("speciesTree", datapath.coreTree_path, handleSpeciesTree);
attachPanzoom("speciesTree");
attachPanzoom("geneTree");

// /** tree rotate listener */
// rotate_monitor('tree_rotate','mytree2');

/** create metadata dropdown list */
//create_dropdown("#dropdown_list",'mytree1','mytree2','coreTree_legend',null);

/** render interactive charts and gene-cluster datatable */
//console.log("render_viewer:",datapath);
myDatatable = render_chart_table.initData(datapath.path_datatable1,'dc_data_table', 'GC_tablecol_select',
    'dc_data_count','dc_straincount_chart','dc_geneLength_chart','dc_coreAcc_piechart',
    'changeCoreThreshold','coreThreshold',
    'speciesTreeDiv','geneTreeDiv', null, handleDataTable, handleGeneTree);
console.log(myDatatable);
tryConnectTrees();

/** render meta-data datatable */
var meta_table_id='dc_data_table_meta';
metaDataTable.dataTable2Fun(meta_table_id);


window.addEventListener("resize", function(){
    removeLabels(mySpeciesTree);
    mySpeciesTree.dimensions.width = window.innerWidth/3;
    mySpeciesTree.svg.attr("width", window.innerWidth/3);
    updateGeometry(mySpeciesTree);
    if (mySpeciesTree.showTipLabels){
        tipLabels(mySpeciesTree, tipText, tipFontSize, 5, 5);
    };

    removeLabels(myGeneTree);
    myGeneTree.dimensions.width = window.innerWidth/3;
    myGeneTree.svg.attr("width", window.innerWidth/3);
    updateGeometry(myGeneTree);
    if (myGeneTree.showTipLabels){
        tipLabels(myGeneTree, tipText, tipFontSize, 5, 5);
    };
});

