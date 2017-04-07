import phyloTree from "../phyloTree/src/phyloTree";
import drawTree from "../phyloTree/src/drawTree";
import {zoomIntoClade, zoomIn} from "../phyloTree/src/zoom";
import {changeLayout, changeDistance, updateGeometry,
        updateTipAttribute, updateTipStyle, updateTips,
        updateBranchAttribute, updateBranchStyle, updateBranches} from "../phyloTree/src/updateTree";
import {branchLabels, tipLabels, removeLabels} from "../phyloTree/src/labels";
import speciesTreeCallbacks from "./speciesTreeCallbacks";
import d3 from "d3";
import {pgDashboard, tipText, tipFontSize, applyChangeToTree} from "./tree-init";
import {removeLabels, tipLabels}  from "../phyloTree/src/labels";
import {filterMetaDataTable} from "./datatable-meta";


const speciesTree = function(tree_svg,treeJsonPath, handleResult){
    var treeplot = d3.select("#"+tree_svg);
    treeplot.attr("width", pgDashboard.winInnerWidth/3.);
    treeplot.attr("height", pgDashboard.winInnerWidth/3.);
    var myTree;
    speciesTreeCallbacks.onBranchClick = function (d){
        const dt = 1000;
        if (myTree.panZoom){
            myTree.panZoom.reset();
        }
        applyChangeToTree(myTree,
            function(){zoomIntoClade(myTree, d.terminal?d.parent:d, dt, true);}
            ,dt);
            filterMetaDataTable('dc_data_table_meta', myTree);
    };

    console.log("loading speciesTree", treeJsonPath);
    d3.json(treeJsonPath, function(err, data){
        if (data){
            myTree = phyloTree(data, {svg:treeplot, margins:{top:10, bottom:10, left:10, right:10}, scaleBar:true,
                                      callbacks:speciesTreeCallbacks, orientation:{x:1, y:1}}
                               );
        }else{
            console.log("error loading data",err);
        }
        drawTree(myTree);

        tipLabels(myTree, tipText, tipFontSize(myTree), 3, 8);
        myTree.showTipLabels=true;
        // add a look up for tips
        handleResult(myTree);
    });
}

export default speciesTree;