import {render_chart_table} from "./interact";
//import {create_dropdown} from "./meta-color-legend";
import * as datapath from "./data_path";
import speciesTree from "./speciesTree";
import  {chartExample2} from "./datatable-meta";
// /** strain_tree processing */
//render_tree(0, "mytree1", coreTree_path, clusterID=null, null);

var mySpeciesTree;
const handleSpeciesTree = function(newTree){
    mySpeciesTree = newTree;
    console.log("render_viewer:",mySpeciesTree);
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
    'speciesTreeDiv','geneTreeDiv', null);

/** render meta-data datatable */
var meta_table_id='dc_data_table_meta';
chartExample2.dataTable2Fun(meta_table_id);
