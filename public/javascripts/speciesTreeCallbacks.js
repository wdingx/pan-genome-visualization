import {preOrderIteration} from "../phyloTree/src/treeHelpers";

const onTipHover = function(d){
  d.elem.attr("r",10).style("fill", "#5AE");
  for (var gi=0; gi<d.genes.length; gi++){
    d.genes[gi].elem.attr("r",10).style("fill", "#5AE");
  }
};

const onTipLeave = function(d){
  d.elem
    .attr("r",function(x){return x.tipAttributes.r;})
    .style("fill",function(x){return x.tipAttributes.fill;});
  for (var gi=0; gi<d.genes.length; gi++){
    d.genes[gi].elem
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


const speciesTreeCallbacks = {
  onBranchClick:function(d){console.log(d.n.name);},
  onBranchHover:onBranchHover,
  onBranchLeave:onBranchLeave,
  onTipHover:onTipHover,
  onTipLeave:onTipLeave
};

export default speciesTreeCallbacks;