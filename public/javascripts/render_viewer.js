import {render_chart_table} from "./chartsAndClusterTable";
import * as datapath from "./data_path";
import speciesTree from "./speciesTree";
import  {metaDataTable} from "./datatable-meta";
import {buttons, pxTree, attachButtons, tipText, tipFontSize, attachPanzoom, connectTrees,applyChangeToTree} from "./tree-init";
import {updateGeometry} from "../phyloTree/src/updateTree";
import {linkTableAlignmentTrees, linkMetaTableTree} from "./linkTableAlignmentTrees";
import {create_dropdown, updateData} from "./meta-color-legend";

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
                                  layout_radial:"speciesTreeRadial",
                                  layout_vertical:"speciesTreeVertical",
                                  layout_unroot:"speciesTreeUnroot",
                                  zoomInY:"speciesTree_height_plus",
                                  zoomOutY:"speciesTree_height_minus",
                                  scale:"speciesTreeScale",
                                  tipLabels:"speciesTreeLabels",
                                  zoomReset:"speciesTreeZoomReset"});
    console.log("render_viewer:",mySpeciesTree);
}
const handleGeneTree = function(newTree){
    myGeneTree = newTree;
    connectTrees(mySpeciesTree, myGeneTree);
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
        linkMetaTableTree(meta_table_id, myMetaDatatable,mySpeciesTree);
        var menu_panel = d3.select("#dropdown_select")
        menu_panel.on("change", function(d) {
            if (this.value!='Meta-info') {
                console.log("trigger meta data color change", this.value, d, menu_panel);
                updateData(this.value, mySpeciesTree, myGeneTree, 'coreTree_legend', 0);
            }
        });
        attachPanzoom("speciesTree", mySpeciesTree);
        attachPanzoom("geneTree", myGeneTree);

    }else{
        console.log("trees not available yet, retry", mySpeciesTree, myGeneTree);
        setTimeout(tryConnectTrees, 1000);
    }
}

const triplet_button_geneTree = function(){
    $('.triplet-button-toggle.geneTree').on("click", function () {
        $(this).toggleClass('open');
        $('.option.geneTree').toggleClass('scale-on');
    });
}
triplet_button_geneTree();

/** create metadata dropdown list */
create_dropdown("#dropdown_list",mySpeciesTree,'geneTree','coreTree_legend',null);
speciesTree("speciesTree", datapath.coreTree_path, handleSpeciesTree);
// /** tree rotate listener */
// rotate_monitor('tree_rotate','mytree2');



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
var myMetaDatatable = metaDataTable.dataTable2Fun(meta_table_id);


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

