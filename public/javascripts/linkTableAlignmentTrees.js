import msaLoad from './msaLoad';
import geneTree from "./geneTree";
import {aln_file_path} from "./data_path";

/**
 * Module for initializing trigger actions in cluster datatable. It includes:
 * click the Plus/Minus button to unfold/fold annotation/geneName/etc details,
 * click aa/na alignment button to show MSA and linked trees.
 */

export const loadNewGeneCluster = function(data, handleGeneTree, seqType){
    var clusterID=data.msa;
    console.log("loadNewGeneCluster", clusterID, seqType);
    msaLoad(aln_file_path+clusterID+'_'+seqType+'.aln.fa',(seqType=='aa')?'taylor':'nucleotide');
    var geneTree_name=aln_file_path + clusterID+'_tree.json';
    geneTree("geneTree", geneTree_name, handleGeneTree);
}

export const linkTableAlignmentTrees = function(tableID, datatable, speciesTree, handleGeneTree){
    /** row-clicking trigger: update MSA amino_acid alignment when clicking datatable row*/
    $('#'+tableID+' tbody').on('click', 'tr', function (e) {
        console.log('row');
        var data = datatable.row( $(this) ).data();
        loadNewGeneCluster(data, handleGeneTree, 'aa');
        $('#'+tableID+' tbody tr').removeClass('row_selected');
        $(this).addClass('row_selected');
    });

    $('#'+tableID+' tbody').on('click', '.btn.btn-info.btn-xs', function (e) {
        console.log('aa button');
        var data = datatable.row( $(this).parents('tr') ).data();
        loadNewGeneCluster(data, handleGeneTree, 'aa');
        e.stopPropagation();
    });

    $('#'+tableID+' tbody').on('click', '.btn.btn-primary.btn-xs', function (e) {
        console.log('aa button');
        var data = datatable.row( $(this).parents('tr') ).data();
        loadNewGeneCluster(data, handleGeneTree, 'na');
        e.stopPropagation();
    });

};

export default linkTableAlignmentTrees;

