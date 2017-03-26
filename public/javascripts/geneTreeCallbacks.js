import {preOrderIteration} from "../phyloTree/src/treeHelpers";

const onTipHover = function(d){
  d.elem.attr("r",10).style("fill", "#5AE");
  d.strainTip.attr("r",10).style("fill", function(x){return d3.rgb(x.tipAttributes.fill).brighter();});
  for (var gi=0; gi<d.paralogs.length; gi++){
    d.paralogs[gi].elem
      .attr("r",10)
      .style("fill","#81E");
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
};



const onBranchHover = function(d){
  preOrderIteration(d, function(x){if (x.terminal){onTipHover(x);}});
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