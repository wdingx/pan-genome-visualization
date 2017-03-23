import {render_chart_table} from "./interact";
//import {create_dropdown} from "./meta-color-legend";
import * as datapath from "./data_path";
import speciesTree from "./speciesTree";
import  {chartExample2} from "./datatable-meta";
import {changeLayout} from "../phyloTree/src/updateTree";
import {buttons} from "./tree-init";

// /** strain_tree processing */
//render_tree(0, "mytree1", coreTree_path, clusterID=null, null);

var mySpeciesTree;
const handleSpeciesTree = function(newTree){
    newTree.namesToTips = {};
    for (var ti =0; ti<newTree.tips.length; ti++){
        var tip = newTree.tips[ti];
        tip.name = tip.n.name;
        tip.genes = [];
        newTree.namesToTips[tip.name] = tip;
    }
    mySpeciesTree = newTree;
    console.log("button:", buttons.TreeViewSelect_id);
    $('#'+buttons.TreeViewSelect_id).change(function() {
        mySpeciesTree.layout =  (d3.select(this).property('checked')==false) ? 'rect' : 'radial';
        console.log(mySpeciesTree)
        changeLayout(mySpeciesTree, 1000);
    });

    console.log("render_viewer:",mySpeciesTree);
}
var myGeneTree;
const handleGeneTree = function(newTree){
    myGeneTree = newTree;
    console.log("render_viewer:",myGeneTree);
}


const connectTrees = function(){
    if (mySpeciesTree&&myGeneTree){
        console.log("connecting trees");
        myGeneTree.namesToTips = {};
        myGeneTree.paralogs = {}
        for (var ti =0; ti<myGeneTree.tips.length; ti++){
            var tip = myGeneTree.tips[ti];
            tip.name = tip.n.name;
            tip.strain = mySpeciesTree.svg.selectAll("#"+mySpeciesTree.namesToTips[tip.name].tipAttributes.id);
            myGeneTree.namesToTips[tip.name] = tip;
            if (myGeneTree.paralogs[tip.name]){
                myGeneTree.paralogs[tip.name].push(tip);
            }else{
                myGeneTree.paralogs[tip.name] = [tip];
            }
        }
        for (var ti =0; ti<mySpeciesTree.tips.length; ti++){
            var species = mySpeciesTree.tips[ti];
            species.genes = [];
            for (var gi=0; gi<myGeneTree.paralogs[species.name].length; gi++){
                species.genes.push(myGeneTree.svg.selectAll("#"+myGeneTree.paralogs[species.name][gi].tipAttributes.id));
            }
        }

    }else{
        console.log("trees not available yet, retry", mySpeciesTree, myGeneTree);
        setTimeout(connectTrees, 1000);
    }
}


speciesTree("speciesTree", datapath.coreTree_path, handleSpeciesTree);


// /** tree rotate listener */
// rotate_monitor('tree_rotate','mytree2');

/** create metadata dropdown list */
//create_dropdown("#dropdown_list",'mytree1','mytree2','coreTree_legend',null);

/** render interactive charts and gene-cluster datatable */
//console.log("render_viewer:",datapath);
render_chart_table.initData(datapath.path_datatable1,'dc_data_table', 'GC_tablecol_select',
    'dc_data_count','dc_straincount_chart','dc_geneLength_chart','dc_coreAcc_piechart',
    'changeCoreThreshold','coreThreshold',
    'speciesTreeDiv','geneTreeDiv', null, handleGeneTree);

connectTrees();

/** render meta-data datatable */
var meta_table_id='dc_data_table_meta';
chartExample2.dataTable2Fun(meta_table_id);
