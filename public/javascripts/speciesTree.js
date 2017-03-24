import phyloTree from "../phyloTree/src/phyloTree";
import drawTree from "../phyloTree/src/drawTree";
import {zoomIntoClade, zoomIn} from "../phyloTree/src/zoom";
import {changeLayout, changeDistance, updateGeometry,
        updateTipAttribute, updateTipStyle, updateTips,
        updateBranchAttribute, updateBranchStyle, updateBranches} from "../phyloTree/src/updateTree";
import {branchLabels, tipLabels, removeLabels} from "../phyloTree/src/labels";
import speciesTreeCallbacks from "./speciesTreeCallbacks";
import d3 from "d3";
import {pgDashboard, tipText, tipFontSize} from "./tree-init";
import {removeLabels, tipLabels}  from "../phyloTree/src/labels";


const speciesTree = function(tree_svg,treeJsonPath, handleResult){
    var treeplot = d3.select("#"+tree_svg);
    treeplot.attr("width", pgDashboard.winInnerWidth/3.);
    treeplot.attr("height", pgDashboard.winInnerWidth/3.);
    var myTree;
    speciesTreeCallbacks.onBranchClick = function (d){
            removeLabels(myTree);
            zoomIntoClade(myTree, d.terminal?d.parent:d, 500);
            if (myTree.showTipLabels){
                tipLabels(myTree, tipText, tipFontSize, 5, 3);
            };
        };

    d3.json(treeJsonPath, function(err, data){
        if (data){
            myTree = phyloTree(data, {svg:treeplot, margins:{top:10, bottom:10, left:10, right:10},
                                      callbacks:speciesTreeCallbacks, orientation:{x:1, y:1}}
                               );
        }else{
            console.log("error loading data",err);
        }
        drawTree(myTree);

        tipLabels(myTree, tipText, tipFontSize, 5, 3);
        myTree.showTipLabels=true;
        // add a look up for tips
        handleResult(myTree);
    });
}

export default speciesTree;