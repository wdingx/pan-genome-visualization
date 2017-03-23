import phyloTree from "../phyloTree/src/phyloTree";
import drawTree from "../phyloTree/src/drawTree";
import {zoomIntoClade, zoomIn} from "../phyloTree/src/zoom";
import {changeLayout, changeDistance, updateGeometry,
        updateTipAttribute, updateTipStyle, updateTips,
        updateBranchAttribute, updateBranchStyle, updateBranches} from "../phyloTree/src/updateTree";
import {branchLabels, tipLabels, removeLabels} from "../phyloTree/src/labels";
import d3 from "d3";

//import speciesTreeCallbacks from "./speciesTreeBehavior";

const speciesTreeCallbacks = {onBranchClick:function(d){console.log(d.n.strain);},
                        onBranchHover:function(d){console.log(d.n.strain);},
                        onBranchLeave:function(d){console.log(d.n.strain);},
                        onTipHover:function(d){console.log(d.n.strain);},
                        onTipLeave:function(d){console.log(d.n.strain);}
                        }

const speciesTree = function(tree_svg,treeJsonPath, handleResult){
    var treeplot = d3.select("#"+tree_svg);
    treeplot.attr("width", 500);
    treeplot.attr("height", 500);
    var myTree;
    d3.json(treeJsonPath, function(err, data){
        if (data){
            myTree = phyloTree(data, {svg:treeplot, margins:{top:10, bottom:10, left:10, right:10},
                                      callbacks:speciesTreeCallbacks, orientation:{x:1, y:1}}
                               );
        }else{
            console.log("error loading data",err);
        }
        drawTree(myTree);
        const branchText = function(d){
            if (d.n.muts){
                const tmp = d.n.muts.join(',').slice(0,20);
                return tmp;
            }else{
                return "";
            }
        }
        const branchFontSize = function(d){return d.stats.leafCount>2?3:0;}
        const tipText = function(d){
            if (d.n.strain && d.terminal){
                return d.n.strain;
            }else{
                return "";
            }
        }
        const tipFontSize = function(d){return 4.0;}
        //branchLabels(myTree, branchText, branchFontSize, -5, -5);
        tipLabels(myTree, tipText, tipFontSize, 5, 3);
        handleResult(myTree);
    });
}

export default speciesTree;