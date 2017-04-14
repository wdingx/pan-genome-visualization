import msaLoad from './msaLoad';
import geneTree from "./geneTree";
import {panXTree,tableAccessories} from "./global";
import {aln_file_path} from "./data_path";
import {attachButtons, hideNonSelected, undoHideNonSelected} from "./tree-init";

/**
 * Module for initializing trigger actions in cluster datatable. It includes:
 * click the Plus/Minus button to unfold/fold annotation/geneName/etc details,
 * click aa/na alignment button to show MSA and linked trees.
 */

export const loadNewGeneCluster = function(data, handleGeneTree, seqType){
    var clusterID=data.msa;
    panXTree.currentClusterID=clusterID;
    console.log("loadNewGeneCluster", clusterID, seqType);
    msaLoad(aln_file_path+clusterID+'_'+seqType+'.aln',(seqType=='aa')?'taylor':'nucleotide');
    var geneTree_name=aln_file_path + clusterID+'_tree.json';
    var myGeneTree=geneTree("geneTree", geneTree_name, handleGeneTree);
    attachButtons(myGeneTree, { download_geneTree:"download_geneTree",
                                clusterID:clusterID });
}

export const linkTableAlignmentTrees = function(tableID, datatable, speciesTree, handleGeneTree){
    /** row-clicking trigger: update MSA amino_acid alignment when clicking datatable row*/
    $('#'+tableID+' tbody').on('click', 'tr', function (e) {
        var data = datatable.row( $(this) ).data();
        loadNewGeneCluster(data, handleGeneTree, 'aa');
        $('#'+tableID+' tbody tr').removeClass('row_selected');
        $(this).addClass('row_selected');
    });

    $('#'+tableID+' tbody').on('click', '.btn.btn-info.btn-xs', function (e) {
        var data = datatable.row( $(this).parents('tr') ).data();
        loadNewGeneCluster(data, handleGeneTree, 'aa');
        e.stopPropagation();
    });

    $('#'+tableID+' tbody').on('click', '.btn.btn-primary.btn-xs', function (e) {
        var data = datatable.row( $(this).parents('tr') ).data();
        loadNewGeneCluster(data, handleGeneTree, 'na');
        e.stopPropagation();
    });

};

export const linkMetaTableTree = function(tableID, datatable, speciesTree){
    datatable.on('search.dt', function(){
        if (speciesTree){
            speciesTree.tips.forEach(function(d){d.state.selected=false;});
            var selectedItems = datatable.rows({search:"applied"}).data();
            const count_selectedItems = selectedItems.length;
            selectedItems.each(function(strain,ii){
                if (speciesTree.namesToTips[strain.accession]){
                    speciesTree.namesToTips[strain.accession].state.selected=true;
                }else{
                    console.log("accession not found", strain);
                }
            });
            hideNonSelected(speciesTree);

            if (panXTree.speciesTreeTipCount===count_selectedItems){
                undoHideNonSelected(speciesTree);
            }
        }else{
            console.log("speciesTree not available");
        }
    });

    $('#'+tableID+' tbody').on( 'click', 'tr', function () {

        $(this).toggleClass('active');
        if ($(this).hasClass( "active" )){
            // highlight the row
            $(this).addClass('row_selected');
        }else{
            $(this).removeClass('row_selected');
        }

        if (speciesTree){
            if (datatable.rows('.row_selected').any()) {
                speciesTree.tips.forEach(function(d){d.state.selected=false;});
                var clickedItems= datatable.rows('.active').data();
                clickedItems.each(function(strain,ii){
                    if (speciesTree.namesToTips[strain.accession]){
                        speciesTree.namesToTips[strain.accession].state.selected=true;
                    }else{
                        console.log("accession not found", strain);
                    }
                });
                hideNonSelected(speciesTree);
            }else{
                undoHideNonSelected(speciesTree);
            }
        }else{
            console.log("speciesTree not available");
        }

    } );

    $('#'+tableAccessories.meta_table_unselect).on( 'click', function () {
        $('#'+tableID+' tbody'+' tr').removeClass('active row_selected');
        if (speciesTree){
            undoHideNonSelected(speciesTree);
        }else{
            console.log("speciesTree not available");
        }
    } );

}

