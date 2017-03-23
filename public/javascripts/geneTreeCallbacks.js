const onTipHover = function(d){
  console.log(d.n.name, d.strain);
  d.strain.attr("r",10).style("fill","#3E4");
};

const onTipLeave = function(d){
  console.log(d.n.name, d.strain);
  d.strain.attr("r",5).style("fill","#BBB");
};


const geneTreeCallbacks = {
  onBranchClick:function(d){console.log(d.n.name);},
  onBranchHover:function(d){console.log(d.n.name);},
  onBranchLeave:function(d){console.log(d.n.name);},
  onTipHover:onTipHover,
  onTipLeave:onTipLeave
};

export default geneTreeCallbacks;