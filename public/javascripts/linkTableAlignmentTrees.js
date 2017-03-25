
/**
 * Module for initializing trigger actions in cluster datatable. It includes:
 * click the Plus/Minus button to unfold/fold annotation/geneName/etc details,
 * click aa/na alignment button to show MSA and linked trees.
 */

export const loadNewGeneCluster = function(data, speciesTree, geneTree){
    console.log("loadNewGeneCluster", data);
}

export const linkTableAlignmentTrees = function(tableID, datatable, speciesTree, geneTree){
    /** row-clicking trigger: update MSA amino_acid alignment when clicking datatable row*/
    $('#'+tableID+' tbody').on('click', 'tr', function (e) {
        var data = datatable.row( $(this) ).data();
        loadNewGeneCluster(data, 'aa', speciesTree, geneTree);
        $('#'+table_id+' tbody tr').removeClass('row_selected');
        $(this).addClass('row_selected');
    });

};

export default linkTableAlignmentTrees;

