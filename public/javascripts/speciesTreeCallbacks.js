const onTipHover = function(d){
  console.log(d.n.name, d.genes);
  for (var gi=0; gi<d.genes.length; gi++){
    d.genes[gi].attr("r",10).style("fill", "#5AE");
  }
};

const onTipLeave = function(d){
  console.log(d.n.name, d.genes);
  for (var gi=0; gi<d.genes.length; gi++){
    d.genes[gi].attr("r",4).style("fill", "#BBB");
  }
};


const speciesTreeCallbacks = {
  onBranchClick:function(d){console.log(d.n.name);},
  onBranchHover:function(d){console.log(d.n.name);},
  onBranchLeave:function(d){console.log(d.n.name);},
  onTipHover:onTipHover,
  onTipLeave:onTipLeave
};

export default speciesTreeCallbacks;