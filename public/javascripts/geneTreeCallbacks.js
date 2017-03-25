const onTipHover = function(d){
  d.elem.attr("r",10).style("fill", "#5AE");
  d.strainTip.attr("r",10).style("fill","#3E4");
};

const onTipLeave = function(d){
  d.elem
    .attr("r",function(x){return x.tipAttributes.r;})
    .style("fill",function(x){return x.tipAttributes.fill;});
  d.strainTip
    .attr("r",function(x){console.log(x); return x.tipAttributes.r;})
    .style("fill",function(x){return x.tipAttributes.fill;});
};


const geneTreeCallbacks = {
  onBranchClick:function(d){console.log(d.n.name);},
  onBranchHover:function(d){console.log(d.n.name);},
  onBranchLeave:function(d){console.log(d.n.name);},
  onTipHover:onTipHover,
  onTipLeave:onTipLeave
};

export default geneTreeCallbacks;