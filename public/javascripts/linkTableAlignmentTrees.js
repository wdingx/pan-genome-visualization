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

//**change select dropdown value to 'genePattern'(presence/absence) when clicking msa button
const change_select_dropdown_value = function(div_id,valueToSelect) {
    var element = document.getElementById(div_id);
    if (element!=null){
        element.value = valueToSelect;
        d3.select('#colorblind_div').style('visibility','hidden');
    }
}

//** show MSA/Gene tree title with geneCluster Id
const showViewerTitle = function(genetree_title_id,message,ann_majority) {
    var genetree_viewer=d3.select('#'+genetree_title_id);/*genetree_title*/
    genetree_viewer.html('Gene tree | ' +ann_majority);
    //genetree_viewer.html('Gene tree | ' +ann_majority+ ' | '+message.split('/').pop().replace('_tree.json', ''));
    var sequence_viewer=d3.select('#sequence_viewer_title');
    sequence_viewer.html(' Sequence alignment | ' +ann_majority)
};

export const loadNewGeneCluster = function(data, handleGeneTree, seqType){
    const clusterID=data.msa,
          ann_majority=data.ann;
    panXTree.currentClusterID=clusterID;
    console.log("loadNewGeneCluster", clusterID, seqType);
    msaLoad(aln_file_path+clusterID+'_'+seqType+'_aln.fa',(seqType=='aa')?'taylor':'nucleotide');
    var geneTree_name=aln_file_path + clusterID+'_tree.json';
    // if it is a gene tree, show the title with geneCluster Id
    if (geneTree_name.indexOf('tree.json') !== -1) {
        showViewerTitle("genetree_title",geneTree_name,ann_majority);
    };
    var myGeneTree=geneTree("geneTree", geneTree_name, handleGeneTree, panXTree.currentTreeLayout);
    attachButtons(myGeneTree, { download_geneTree:"download_geneTree",
                                clusterID:clusterID });
    change_select_dropdown_value("dropdown_select",'genePattern');
}

const table_select_tip_annotation= function (input_annotation,myGeneTree) {
    /*var tree_index=1;*/
    var searchStr = input_annotation.toLowerCase();
    function nodeMatch(d, treeType){
        var annotation=d.n.annotation.toLowerCase();
        return ((annotation.indexOf(searchStr) > -1 ) && (input_annotation.length != 0));
    };

    if (input_annotation=='') {
        undoHideNonSelected(myGeneTree);
    }else{
        myGeneTree.tips.forEach(function(d){
            d.state.selected=(nodeMatch(d,'geneTree'))?true:false;
        })
        hideNonSelected(myGeneTree);
    }
};

export const linkTableAlignmentTrees = function(tableID, datatable, speciesTree, handleGeneTree){
    /** row-clicking trigger: update MSA amino_acid alignment when clicking datatable row*/
    $('#'+tableID+' tbody').on('click', 'tr', function (e) {
        var data = datatable.row($(this)).data();
        if (data){ //** fetch alignment filename from the table row
            loadNewGeneCluster(data, handleGeneTree, 'aa');
            $('#'+tableID+' tbody tr').removeClass('row_selected');
            $(this).addClass('row_selected');
        } else{ //** when rows in nested table cliked
            const myGeneTree=panXTree.currentGeneTree;
            const row_index=$(this).index(),
                  cell=$(this).find('td').first(),
                  cell_text=cell.text(),
                  is_colspan=cell.attr('colspan');
            //** when clicking data cells (not the title & not the entire expanded cell)
            if ( row_index!==0 && !is_colspan){
                const is_annotation=$(this).parents('tr').text().startsWith('Annotation');
                if (!$(this).hasClass("row_selected")){
                    $('#'+tableID+' tbody tr').removeClass('row_selected');
                    $(this).addClass('row_selected');
                    //** select related tips in geneTree with the same annotation
                    if (is_annotation){
                        table_select_tip_annotation(cell_text,myGeneTree);
                    }
                }else{
                    $('#'+tableID+' tbody tr').removeClass('row_selected');
                    if (is_annotation){
                        undoHideNonSelected(myGeneTree);
                    }
                }
                e.stopPropagation();
            }
        }
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

