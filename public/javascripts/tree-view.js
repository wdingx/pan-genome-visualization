var winInnerWidth = pgDashbord.winInnerWidth;
var svg1 = d3.select('#mytree1');
var svg2 = d3.select('#mytree2');
var svg_all = d3.select('#mytree1,#mytree2');//var svg_all = d3.select('#all_tree');

var times_flag=0;

//# node/label size
var size_node_leaf=3.5,
    size_node_inner=2,
    size_node_leaf_highlight = 8;
var size_font_inner_label=10,
    size_font_leaf_label=10;
var height_nodeLabel=12;
//# label- and node-color (fill,stroke)
var color_leaf_label='steelblue',
    color_internal_label='steelblue';
var color_node_stroke='steelblue',
    color_node_fill='white',
    color_inner_node='black';
var color_leaf_node_highlight="#EE6363",
    color_inner_node_highlight="steelblue";
//# subtree coloring
var subtree_node_colorSet = d3.scale.category20c();

//## render the tree viewer
var render_tree = function(div,treeJsonPath,svg) {
    "use strict";
    var tree_vis = tnt.tree();
    var width = winInnerWidth/3; //600; //var height = 360;
    var set_rotate = 'right-left'
    //## initial layout/scale options .property('checked', true);
    var scale_layout = d3.select('#ScalesToggle').property('checked');
    var setLayout= (d3.select('#TreeViewSelect').property('checked')==false) ? 'vertical' : 'radial';

    //## load tree data and draw the initial tree
    d3.json (treeJsonPath, function (error,data) {
        //d3.text("./dataset/SNP_whole_matrix.newick", function(newick_file){});
        //var tree_data = tnt.tree.parse_newick(newick_file);
        //console.log(JSON.stringify(tree_data));
        var tree_data = data;

        function count_leafs(node) {
            if (typeof node.children==='undefined'){
                return 1;
            } else {
                var lc=0;
                for (var ci=0; ci<node.children.length; ci++){
                    lc+= count_leafs(node.children[ci]);
                }
                return lc;
            }
        }

        function set_sizes(count){
            height_nodeLabel = (count<60)?12:(3+540/count);
            size_font_leaf_label = (count<60)?12:(3+540/count);
            size_font_inner_label= size_font_leaf_label;
            size_node_leaf= (count<60)?3:(2 + 60/count);
            size_node_inner= (count<60)?2.2:(180/count);
            size_node_leaf_highlight = (count<60)?8:(4 + 240/count);
        }

        var leaf_count=count_leafs(tree_data);
        set_sizes(leaf_count);

        var internal_label = tnt.tree.label.text()
            .text(function (node) {
                var branch_length_origin = node.data().branch_length;
                var branch_length_treated = branch_length_origin.toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)[0];
                if ( d3.select('#TreeViewSelect').property('checked')==true || branch_length_treated==0 ) {return ""}
                //else {return branch_length_treated}
                else {return ""}
            })
            .fontweight("bold")
            .fontsize(size_font_inner_label)
            .color("red")
            .transform(function (node) {
                return {
                    "translate" : [-50, -5],
                    "rotate" : -0
                };
            });  
        
        var leaf_label = tnt.tree.label.text()
            .fontsize(size_font_leaf_label)
            .color(color_leaf_label)
            //.text(function(d){return (d.strainName=='')?'A':'B';})
            .text(function(d){return (typeof d.data().strainName==='undefined' || d.data().strainName=='' || d.data().strainName=='unknown')?d.data().name:d.data().strainName;})

        var node_label = tnt.tree.label()
            .width(leaf_label.width())
            .height(height_nodeLabel)//30
            .display(function (node) {
                if (node.is_leaf()) {
                    if (d3.select('#TreeViewSelect').property('checked')==false){
                        return leaf_label.display().call(this, node, "vertical");
                    }  
                    else {return leaf_label.display().call(this, node, "radial");
                    }
                }
                else{ 
                    if (d3.select('#TreeViewSelect').property('checked')==false) {
                        return internal_label.display().call(this, node, "vertical")
                    }
                    else {
                        return internal_label.display().call(this, node, "radial")
                    }
                } 
            })
            .transform(function (node) {
                if (node.is_leaf()) {
                    if (d3.select('#TreeViewSelect').property('checked')==false){
                        return leaf_label.transform().call(this, node, "vertical");
                    }
                    else {return leaf_label.transform().call(this, node, "radial");
                    }
                } else {
                    if (d3.select('#TreeViewSelect').property('checked')==false) {return internal_label.transform().call(this, node, "vertical");
                    }
                    else {return internal_label.transform().call(this, node, "radial");
                    }
                } 
            }); 

        var circle_node = tnt.tree.node_display.circle()
            .size( function (node){
                    if (node.is_leaf()) { return size_node_leaf }
                    else {return size_node_inner} 
                }) 
            .stroke( function (node){ 
                    if (node.is_leaf()) { return color_node_stroke }
                })    
            .fill( function (node,d){ 
                    if (node.is_leaf()) { 
                        if (Object.keys(pxtree.node_color_mem).length !== 0) {
                            return pxtree.node_color_mem[node.node_name()];
                        }
                        else {return color_node_fill}
                    }
                    else {return color_inner_node} 
                });

        var node_display = tnt.tree.node_display()
            .size(0.1) // This is used for the layout calculation
            .display (function (node) {
                circle_node.display().call(this, node);
            });
        
        tree_vis
            .branch_color(pxtree.branch_col)
            .node_display(node_display)
            .label(node_label)//.label(tnt.tree.label.text().height(2).fontsize(fontSize).color('steelblue'))
            .data(tree_data)
            .layout(tnt.tree.layout[setLayout]()
            //...layout.radial()... or.vertical()
            .width(width).scale(scale_layout)
            )
            .duration(0)//2000

        //## The visualization is started at this point
        tree_vis(document.getElementById(div));

        /*link width*/
        var links = svg.selectAll(".tnt_tree_link")
        links.style("stroke-width",pxtree.wid_link)

        //## make scale bar
        var scaleBar = tree_vis.scale_bar(50, "pixel").toFixed(3);
        var legend = d3.select("#"+div);
        legend.append("div")
            .style({
                width:"50px",
                height:"2px",
                "background-color":"steelblue",
                margin:"6px 5px 5px 25px",
                float: "left"
            });
        legend.append("text")
            .style({"font-size": "12px"})
            .text(scaleBar);

        svgAction(svg);
        rotate_tree(svg2,set_rotate);
        });
        
        //## tree displaying options 
        //# Layout transition between a radial and a vertical tree
        $('#TreeViewSelect').change(function() {
            var setLayout= (d3.select(this).property('checked')==false) ? 'vertical' : 'radial';
            var rotate_vis_state= (setLayout=='vertical') ? 'visible' : 'hidden';

            document.getElementById('tree-rotate-div').style.visibility=rotate_vis_state;

            var layout = tnt.tree.layout[setLayout]().width(width).scale(d3.select('#ScalesToggle').property('checked'))
            
            var t0 = performance.now();
            tree_vis.layout(layout);
            tree_vis.update();
            var t1 = performance.now();
            if (times_flag==0) { csprint("time 0: "+ Math.round(t1-t0) +" msec");}

            var t0 = performance.now(); svgAction(svg);
            var t1 = performance.now(); 
            if (times_flag==0) { csprint("time 1: "+ Math.round(t1-t0) +" msec");}
        
    });

        //# Enable label or not
        $('#LabelsToggle').change(function() {
            var text_vis_state = (d3.select('#LabelsToggle').property('checked')==false) ? 'hidden' : 'visible';
            svg.selectAll(".tnt_tree_label").style("visibility", text_vis_state);
        }); 

        // ## Enable scale or not 
        $('#ScalesToggle').change(function() {
            var setLayout= (d3.select('#TreeViewSelect').property('checked')==false) ? 'vertical' : 'radial';
            var layout = tnt.tree.layout[setLayout]().width(width).scale( d3.select(this).property('checked'))
            tree_vis.layout(layout);
            tree_vis.update();
            svgAction(svg);
            //console.log(set_rotate);
            //set_rotate='right-left';
            rotate_tree(svg2,'left-right');
        });

        // ## Enable selection of subtree by clicking innerNode  
        $('#InnerNodeToggle').change(function() {
            var setInnerNode=(d3.select(this).property('checked')==false) ? 'hidden' : 'visible';
            svg.selectAll("circle")//.selectAll("g.tnt_tree_node.inner")
                .style("visibility", function(d) {
                    if ((d.name.indexOf('NODE_')==0)) {return setInnerNode} 
                })
        });

        function link_two_trees () {
            //get_leaveName
            function get_leaveName(){
                var nodes = svg.selectAll("circle")
                var leaves_list = [];
                nodes.each(function(d){
                    leaves_list.push(d.name,d.x,d.y); 
                    });
                return leaves_list;
            }; //console.log(get_leaveName());

            //## get_node_coordinates
            function get_coordinates(svg){
                var nodes = svg.selectAll("circle")
                var coordinates_dict = {};
                nodes.each(function(d){
                    if (d.children === undefined) { // leaves
                        coordinates_dict[d.name]=[d.x,d.y]; 
                    }
                });
                return coordinates_dict;
            }; 
            //get_coordinates(svg1);get_coordinates(svg2)
            
            console.log(get_coordinates(svg1));
            console.log(get_coordinates(svg2));        

            /*var lines = svg1.append("svg").append("line") //svg_all
                        .style("stroke", "black")
                        .attr("x1", 22.6)
                        .attr("y1", 12.7)
                        .attr("x2", 50)
                        .attr("y2", 89.7);*/

                        /**/
            //0: 327.69230769230771: 129.7206154676361
            //0: 3061: 391.72450724429393
            //console.log( Object.keys(get_coordinates(svg1)).length );
            //console.log( Object.keys(get_coordinates(svg2)).length );
            //Object.keys(myObj).length;
        }

        //## show MSA/Gene tree title with geneCluster Id
        function showAlert(message) {
            var genetree_viewer=d3.select('#genetree_title');
            genetree_viewer.html('Gene tree | '+message.split('/').pop().replace('_tree.json', '')+ ' | ' +ann_majority);
              
            var sequence_viewer=d3.select('#sequence_viewer_title');  
            sequence_viewer.html(' Sequence alignment | '+message.split('/').pop().replace('_tree.json', '')+ ' | ' +ann_majority)
            }

        // if tree file exists, show the title with geneCluster Id
        if (treeJsonPath.indexOf('tree.json') !== -1) {
            showAlert(treeJsonPath);
        }

};

    //## actions on tree (tooltips, select subtree by nodes/links)
var svgAction= function(svg) {

    /*function hasOwnProperty(obj, prop) {
        var proto = obj.__proto__ || obj.constructor.prototype;
        return (prop in obj) &&
            (!(prop in proto) || proto[prop] !== obj[prop]);
    }*/
    function hasOwnProperty(obj, prop){
        return (obj[prop] !== undefined);
    }

    //## leaf nodes tooltip
    function tooltip_node (){
        svg.selectAll(".tnt_tree_node.leaf")
            .on('mouseover', tips_node.show)
            .on('mouseout', tips_node.hide)
            .call(tips_node);
    }
    var t0 = performance.now();
    tooltip_node();
    var t1 = performance.now(); 
    if (times_flag==1) {csprint("x0 time: "+ Math.round(t1-t0) +" msec");}

    function mouseover_show_subTree(d, i) {
        var click_type='';
        if (hasOwnProperty(d, 'target' )) {
            click_type='link';
        } else { click_type='node';}

        if (click_type=='link') {
            if (d.target.muts != undefined) { tips_link.show(d);}
            d=d.target;
        }

        removeLegend();

        //if (hasOwnProperty(d, 'name') && d.name!='') {
        if ( (d.name.indexOf('NODE_')!=0) && (d.name!='') ) {
            //console.log(hasOwnProperty(d, 'target'));
            d3.selectAll("circle.pt" + d.name)
              .style("fill", color_leaf_node_highlight)
              .attr("r", size_node_leaf_highlight)
        }
        else if  (  (d.name.indexOf('NODE_')==0) || (d.name=="") ){ 
            this.style.cursor='pointer';
            //# highlight selected inner node
            if (click_type=='node') {
                d3.select(this)
                    .style("stroke",color_inner_node_highlight)
                    .style("stroke-width",'20px')
                    .style("fill", "steelblue");
            } else if (click_type=='link') {
                pxtree.link_color_mem[this.id]=this.style.stroke;
                pxtree.link_width_mem[this.id]=this.style['stroke-width'];
                pxtree.link_dash_mem[this.id]=this.style['stroke-dasharray'];
                d3.select(this)
                    .style("stroke", pxtree.branch_col_highlight)
                    .style("stroke-width", pxtree.branch_wid_highlight);
            }

            var result = [];
            var x = d.children;
            var findChildren =function (x) {
                for(var i=0;i<x.length;i++) {
                    if  ((x[i].name.indexOf('NODE_')!=0) && (x[i].name!='')) {
                        result.push(x[i].name);
                    }
                    else {
                        findChildren(x[i].children);
                    }
                }
            }
            findChildren(x);

            //# highlight all subtree leaf nodes
            for(var i=0;i<result.length;i++) {
                d3.selectAll("circle.pt" + result[i])
                    .style("fill", function(d) {
                        return subtree_node_colorSet(d.name);
                    })
                    .attr("r", size_node_leaf_highlight);
            }
        }
    }

    function mouseout_hide_sub_highlight(d, i) {
        var click_type='';
        //d.target!=undefined
        if (hasOwnProperty(d, 'target' )) {
            click_type='link';
        } else { click_type='node';}

        if (click_type=='link') {
            tips_link.hide(d);
            d=d.target
        }

        makeLegend(legendOptionValue);
        if ( (d.name.indexOf('NODE_')!=0) && (d.name!='') ) {
            d3.selectAll("circle.pt" + d.name)
                .style("fill", pxtree.node_color_mem[d.name])
                .attr("r", size_node_leaf);
        }
        else if  ( (d.name.indexOf('NODE_')==0) || (d.name=="") ) {
            //#change the color of selected inner nodes
            if (click_type=='node') { 
                d3.select(this)
                    .style("stroke-width",'0px')
                    .style("fill", color_inner_node)
                    .attr("r", size_node_inner);
            } else if (click_type=='link') {
                d3.select(this)
                    .style('stroke', function () {
                        if (pxtree.link_color_mem[this.id]!=undefined ) {
                            return pxtree.link_color_mem[this.id];
                        } else { return pxtree.branch_col;}
                    }) 
                    .style("stroke-width", function () {
                        if (pxtree.link_width_mem[this.id]!=undefined ) {
                            return pxtree.link_width_mem[this.id];
                        } else { return pxtree.link_width;}
                    })
                    .style("stroke-dasharray",function () {
                        if (pxtree.link_dash_mem[this.id]!=undefined ) {
                            return pxtree.link_dash_mem[this.id];
                        } else { return pxtree.link_dasharray;}
                    })
            }

            
            //# change the color of subtree leaf nodes 
            var result = [];
            var x = d.children;
            var findChildren =function (x) {
                for(var i=0;i<x.length;i++) {
                    if  ( (x[i].name.indexOf('NODE_')!=0) && (x[i].name!='') ) {
                        result.push(x[i].name);
                    }
                    else {
                        findChildren(x[i].children);
                    }
                }
            };
            findChildren(x);

            for(var i=0;i<result.length;i++) {
                d3.selectAll("circle.pt" + result[i])
                    .style("fill", function(d) {
                        return pxtree.node_color_mem[d.name]
                    })
                    .attr("r", size_node_leaf);
            }
        }
    }

    function click_show_sub_metaTable(d, i) {
        //d.target!=undefined
        var click_type='';
        if (hasOwnProperty(d, 'target' )) {
            click_type='link';
        } else { click_type='node';}

        if (click_type=='link') {d=d.target}

        var result = [];
        if ( (d.name.indexOf('NODE_')==0) || (d.name=="")  ) {
            var x = d.children; 
            var findChildren =function (x) {
                for(var i=0;i<x.length;i++) {
                    if  ( x[i].name.indexOf('NODE_')!=0 && x[i].name!='') {
                        result.push(x[i].name);
                    }
                    else {
                        findChildren(x[i].children);
                    }
                }
            };
            findChildren(x);
        }
        else {
            result =[d.name]; //console.log( d.name); 
        }

        //var nodeAttriPath="./dataset/Sa-tnt-dAttri.json" ;  
        d3.json(path_datatable2, function(error, data) {
            var data=data['data']
            for (var i=0;i<data.length;i++) {
                data[data[i]['accession']]=data[i]
            } 

            function RefreshTreeTable() {
                var n=[];
                for (var i=0;i<result.length;i++) {
                    var tmp = data[result[i]];
                    tmp['accession']=result[i];
                    n.push(tmp);
                }
                $('#dc-data-table2').dataTable().fnClearTable();
                $('#dc-data-table2').dataTable().fnAddData(n);
                $('#dc-data-table2').dataTable().fnDraw();
            }; 
            RefreshTreeTable(); 
        });
    }

    //## find the corresponding node in another tree
    function node_showSubtree_trace(){
        svg.selectAll("circle") // nodes tracing trick
            .attr("class", function(d,i) {
                return  "pt" +d.name;
            })
            .on("mouseover", mouseover_show_subTree )
            .on("mouseout", mouseout_hide_sub_highlight)
            .on("click", click_show_sub_metaTable );
    }
    var t0 = performance.now();
    node_showSubtree_trace();
    var t1 = performance.now(); 
    if (times_flag==1) {csprint("x1 time: "+ Math.round(t1-t0) +" msec");} 
    
    //## select link to show sub-tree
    function link_showSubtree_trace() {
        svg.selectAll('path.tnt_tree_link')
            .on("mouseover", mouseover_show_subTree )
            .on("mouseout", mouseout_hide_sub_highlight )
            .call(tips_link)
            .on("click", click_show_sub_metaTable );
    }
    var t0 = performance.now(); 
    link_showSubtree_trace();
    var t1 = performance.now(); 
    if (times_flag==1) {csprint("x2 time: "+ Math.round(t1-t0) +" msec");}

};

// ## rotate tree             
function rotate_tree(svg, direction) {
    svg.selectAll(".tnt_tree_node")
      .attr("transform", function(d) {
              width= winInnerWidth/3.15;
              d.x = d.x;
              d.y = (width -d.y);
              return "translate(" +  d.y  + "," + d.x  + ")"; 
      });

    function elbow(d, i) {
    return "M" + d.source.y + "," + d.source.x
        + "V" + d.target.x + "H" + d.target.y;
    }

    svg.selectAll(".tnt_tree_link")//link
      .attr("d", elbow );

    if (1) {
    svg.selectAll(".tnt_tree_label")
        .attr("transform", function() {
            if (direction=="left-right") {
                return "translate(5,3)" 
            } 
            else { return "translate(-10,3)"}
        })
        .attr("text-anchor", function() {
            if (direction=="left-right") {
                return "start";
            } 
            else { return "end";}
        });
    }
}
//## toggle tree-rotate
$('#tree-rotate').change(function() {
    var svg2 = d3.select('#mytree2')
    if (d3.select(this).property('checked')==false) { 
        var set_rotate='right-left';        
    }
    else { var set_rotate='left-right';}
    //## call rotate function
    //svgAction.rotate_tree(svg2,set_rotate);
    rotate_tree(svg2,set_rotate);
});

//strain_tree_process
render_tree("mytree1",treeJsonPath,svg1);
//render ( 'mytree2',aln_file_path+'NZ_CP012001-1-1834888-1835742_tree.json',svg2);
//render ( 'mytree2', aln_file_path+Initial_MsaGV.split('.')[0]+'_tree.json',svg2); 
//render (document.getElementById("mytree2"),treeJsonPath,svg2);

//## search strain 
function search(val) {
    var searchStr = val.toLowerCase();
    function nodeMatch(d){
    var name = d.name.toLowerCase();
    var strainName = (typeof d.strainName==='undefined')?'':d.strainName.toLowerCase();
    return ((name.indexOf(searchStr) > -1 || strainName.indexOf(searchStr) >-1 ) && val.length != 0);
    }

    // adjust style of matches
    d3.selectAll("circle").filter(function(d){return nodeMatch(d);})
        .style("fill", function (){return color_leaf_node_highlight;})
        .style("r", function (){return size_node_leaf_highlight;})
    // adjust style of non matches
    d3.selectAll("circle").filter(function(d){return !nodeMatch(d);})
        .style("fill", function (d){return pxtree.node_color_mem[d.name];})
        .style("r", function (){return size_node_leaf;})
}
/*
//## search strain 
function search(val) {
    d3.selectAll("circle")
        .style("fill", function (node){ 
            var name = node.name;
            if (name.toLowerCase().indexOf(val.toLowerCase()) > -1 && val.length != 0) { 
                return color_leaf_node_highlight;} 
        })
        .style("r", function (node){ 
            var name = node.name;
            if (name.toLowerCase().indexOf(val.toLowerCase()) > -1 && val.length != 0) { 
                return size_node_leaf_highlight;} 
        })
}
*/
// ## zoom function 
$(window).load(function(){
      //$("#mytree1").panzoom({
      $("#mytree1,#mytree2").panzoom({
          $zoomRange: $(".zoom-range")/*,
          $zoomIn: $(".zoom-in"),
          $zoomOut: $(".zoom-out"),
          $reset: $(".reset")*/
      });
});


//## download strain tree
d3.select('#download-coreTree')
    .append('a')
    .attr('href','/download/dataset/'+speciesAbbr+'/strain_tree.nwk')
    .append('i')
    .attr('class','fa fa-arrow-circle-o-down fa-5')
    .attr('aria-hidden','true')
