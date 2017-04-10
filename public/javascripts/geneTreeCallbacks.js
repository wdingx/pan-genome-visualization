import {preOrderIteration} from "../phyloTree/src/treeHelpers";
import {tooltip_node} from './tooltips';
import {panXTree} from './global';

const tipFillHover = panXTree.tipFillHover,
      tipParalogFillHover = panXTree.tipParalogFillHover;
const subtree_node_colors = d3.scale.category20c();

const onTipsHover = function(d){
  d.elem.attr("r",10)
    .style("fill", function(x){return subtree_node_colors(x.n.accession);});
  d.strainTip.attr("r",10)
    .style("fill", function(x){return subtree_node_colors(x.n.name);});
  for (var gi=0,len=d.paralogs.length; gi<len; gi++){
    d.paralogs[gi].elem.attr("r",10)
      .style("fill", function(x){return subtree_node_colors(x.n.accession);});
    }
};

const onTipHover = function(d){
  d.elem.attr("r",function(x){return x.tipAttributes.r*2;})
    .style("fill", function(x){return x.tipAttributes.fill;});
  d.strainTip.attr("r",function(x){return x.tipAttributes.r*2;})
    .style("fill", function(x){return x.tipAttributes.fill;});
  for (var gi=0,len=d.paralogs.length; gi<len; gi++){
    d.paralogs[gi].elem.attr("r",function(x){return x.tipAttributes.r*2;})
      .style("fill",function(x){return d3.rgb(x.tipAttributes.fill).darker(panXTree.strokeToFill).toString();});//"#81E"
    }
};

const onTipLeave = function(d){
  d.elem
    .attr("r",function(x){return x.tipAttributes.r;})
    .style("fill",function(x){return x.tipAttributes.fill;});
  d.strainTip
    .attr("r",function(x){return x.tipAttributes.r;})
    .style("fill",function(x){return x.tipAttributes.fill;});
  for (var gi=0; gi<d.paralogs.length; gi++){
    d.paralogs[gi].elem
      .attr("r",function(x){return x.tipAttributes.r;})
      .style("fill",function(x){return x.tipAttributes.fill;});
    }
  tooltip_node.hide();
};


const onBranchHover = function(d){
  if (d.n.children==undefined){
    onTipHover(d);
  }else{
    preOrderIteration(d, function(x){if (x.terminal){onTipsHover(x);}});
  }
};

const onBranchLeave = function(d){
  preOrderIteration(d, function(x){if (x.terminal){onTipLeave(x);}});
};

const geneTreeCallbacks = {
  onBranchClick:function(d){console.log(d.n.name);},
  onBranchHover:onBranchHover,
  onBranchLeave:onBranchLeave,
  onTipHover:onTipHover,
  onTipLeave:onTipLeave
};

export default geneTreeCallbacks;