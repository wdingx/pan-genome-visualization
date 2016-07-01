var svg1 = d3.select('#mytree1');
var svg2 = d3.select('#mytree2');
//var svg_all = d3.select('#all_tree');
var svg_all = d3.select('#mytree1,#mytree2');

//# node/label size
var size_node_leaf=3.5,
    size_node_inner=2,
    size_node_leaf_highlight = 8;
var size_font_inner_label=10,
    size_font_leaf_label=12;
var height_nodeLabel=12;

//# label- and node-color (fill,stroke)
var color_leaf_label='steelblue',
    color_internal_label='steelblue';
var color_node_stroke='steelblue',
    color_node_fill='white',
    color_inner_node='black';
var color_leaf_node_highlight="#EE6363",
    color_inner_node_highlight="steelblue";
var branch_color="#4A4A4A",
    branch_color_highlight="#2D59B1";
var link_width='1px',
    link_dasharray='1px, 0px';

//# subtree coloring
var subtree_node_colorSet = d3.scale.category20c();

//## render the tree viewer
var render = function (div,treeJsonPath,svg) {
    "use strict";
    var tree_vis = tnt.tree();
    var width = winInnerWidth/3; //600; //var height = 360;
    var set_rotate = 'right-left'
    //## initial layout/scale options
    var scale_layout = $('#ScalesToggle').prop('checked');
    if ($('#TreeViewSelect').prop('checked')==false) {
        var setLayout='vertical'
    }
    else { var setLayout='radial'}

    //## show MSA/Gene tree title with geneCluster Id
    function showAlert(message) {
          $('#genetree_title').html("<div class='alert alert-info' role='alert'>Gene tree viewer | "+message.split('/').pop().replace(/.tree.json/, "")+ ' | ' +ann_majority +" </div>");
          $('#genetree_title').show();

          $('#sequence_viewer_title').html("<div class='alert alert-info' role='alert'> Sequence alignment viewer | "+message.split('/').pop().replace(/.tree.json/, "")+ ' | ' +ann_majority +" </div>");
          $('#sequence_viewer_title').show();          
        }
    // if tree file exists, show the title with geneCluster Id
    if (treeJsonPath.indexOf('tree.json') !== -1) {
        showAlert(treeJsonPath);
    }

    //## actions on tree (tooltips, select subtree by nodes/links)
    var svgAction= function() {

        function hasOwnProperty(obj, prop) {
            var proto = obj.__proto__ || obj.constructor.prototype;
            return (prop in obj) &&
                (!(prop in proto) || proto[prop] !== obj[prop]);
        }

        //## leaf nodes tooltip
        function tooltip_node (){
            svg.selectAll("g.tnt_tree_node.leaf")
                .on('mouseover', tips_node.show)
                .on('mouseout', tips_node.hide)
                .call(tips_node);
        } 
        tooltip_node();

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
                    
                    link_color_tmp[this.id]=this.style.stroke;
                    link_width_tmp[this.id]=this.style['stroke-width'];
                    link_dasharray_tmp[this.id]=this.style['stroke-dasharray'];
                    //console.log(this.style,this.style['stroke-width'],this.style['stroke-dasharray']);
                    d3.select(this)
                        .style("stroke", branch_color_highlight) //"steelblue"
                        .style("stroke-width",'3px'); //'5px'
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
                    .style("fill", node_color_tmp[d.name])
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
                            if (link_color_tmp[this.id]!=undefined ) {
                                return link_color_tmp[this.id];
                            } else { return branch_color;}
                        }) 
                        .style("stroke-width", function () {
                            if (link_width_tmp[this.id]!=undefined ) {
                                return link_width_tmp[this.id];
                            } else { return link_width;}
                        })
                        .style("stroke-dasharray",function () {
                            if (link_dasharray_tmp[this.id]!=undefined ) {
                                return link_dasharray_tmp[this.id];
                            } else { return link_dasharray;}
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
                            return node_color_tmp[d.name]
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
            d3.json(nodeAttriPath, function(error, data) {
                var newdata={};

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
        node_showSubtree_trace();

        //## select link to show sub-tree
        function link_showSubtree_trace() {
            svg.selectAll('path.tnt_tree_link')
                .on("mouseover", mouseover_show_subTree )
                .on("mouseout", mouseout_hide_sub_highlight )
                .call(tips_link)
                .on("click", click_show_sub_metaTable );
        }
        link_showSubtree_trace();
    };
    
    //## load tree data and draw the initial tree
    d3.json (treeJsonPath, function (error,data) {
        //d3.text("./dataset/SNP_whole_matrix.newick", function(newick_file){});
        //var tree_data = tnt.tree.parse_newick(newick_file);
        //console.log(JSON.stringify(tree_data));
        
        var tree_data = data;

        var internal_label = tnt.tree.label.text()
            .text(function (node) {
                var branch_length_origin = node.data().branch_length;
                var branch_length_treated = branch_length_origin.toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)[0];
                if ( $('#TreeViewSelect').prop('checked')==true || branch_length_treated==0 ) {return ""}
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
            /*function (node) { //xx
                if (Object.keys(node_color_tmp).length !== 0) {
                    return node_color_tmp[node.name]
                }
                else {return color_leaf_label}
            }*/

        /*var node_label=tnt.tree.label.text()
            .fontsize(function (node) {
                    if (node.is_leaf()) {return 14; } 
                    else {return 5;}
                })
            .color(function (node) {
                    if (node.is_leaf()) {return color_leaf_label; } 
                    else {return 'red';}
                })
            .text(function (node) {
                    if (node.is_leaf()) {return node.data().name; } 
                    else {
                        var branch_length_origin = node.data().branch_length;
                        var branch_length_treated = branch_length_origin.toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)[0];
                        return branch_length_treated;}
                })
            .transform(function (node) {
                if (node.is_leaf()) {
                    return node_label.transform().call(this, node, "radial");
                } else {
                    if ($('#TreeViewSelect').prop('checked')==true) {return transform().call(this, node, "vertical");}
                    else{return transform().call(this, node, "vertical");}
                } 
                })*/               

        var node_label = tnt.tree.label()
            .width(leaf_label.width())
            .height(height_nodeLabel)//30
            .display(function (node) {
                if (node.is_leaf()) {
                    if ($('#TreeViewSelect').prop('checked')==false){
                        return leaf_label.display().call(this, node, "vertical");
                    }  
                    else {return leaf_label.display().call(this, node, "radial");
                    }
                }
                else{ 
                    if ($('#TreeViewSelect').prop('checked')==false) {
                        return internal_label.display().call(this, node, "vertical")
                    }
                    else {
                        return internal_label.display().call(this, node, "radial")
                    }
                } 
            })
            .transform(function (node) {
                if (node.is_leaf()) {
                    if ($('#TreeViewSelect').prop('checked')==false){
                        return leaf_label.transform().call(this, node, "vertical");
                    }
                    else {return leaf_label.transform().call(this, node, "radial");
                    }
                } else {
                    if ($('#TreeViewSelect').prop('checked')==false) {return internal_label.transform().call(this, node, "vertical");
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
                        if (Object.keys(node_color_tmp).length !== 0) {
                            return node_color_tmp[node.node_name()];
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
            .branch_color(branch_color)
            .node_display(node_display)
            .label(node_label)//.label(tnt.tree.label.text().height(2).fontsize(fontSize).color('steelblue'))
            .data(tree_data)
            .layout(tnt.tree.layout[setLayout]()
            //...layout.radial()... or.vertical()
            .width(width).scale(scale_layout)
            )
            .duration(500)//2000

        //## The visualization is started at this point
        tree_vis(document.getElementById(div));

        var links = svg.selectAll("g.tnt_tree_link")
        links.style("stroke-width",'5px')

        //## make scale bar
        var scaleBar = tree_vis.scale_bar(50, "pixel").toFixed(3);
        var legend = d3.select("#"+div);

        legend
            .append("div")
            .style({
                width:"50px",
                height:"4px",
                "background-color":"steelblue",
                margin:"6px 5px 5px 25px",
                float: "left"
            });

        legend
            .append("text")
            .style({
                "font-size": "12px"
            })
            .text(scaleBar);

        svgAction ();
        
        rotate_tree(svg2,set_rotate);
    });

    //## tree displaying options 
    //# Layout transition between a radial and a vertical tree
    $('#TreeViewSelect').change(function() {
        if ($('#TreeViewSelect').prop('checked')==false) {
            var setLayout='vertical';
            document.getElementById('tree-rotate-div').style.visibility='visible';
        }
        else {  
            var setLayout='radial';
            document.getElementById('tree-rotate-div').style.visibility='hidden';
            
        }
        var layout = tnt.tree.layout[setLayout]().width(width).scale($('#ScalesToggle').prop('checked'))
        tree_vis.layout(layout);
        tree_vis.update();
        svgAction ();
    });

    //# Enable label or not 
    $('#LabelsToggle').change(function() {
        if ($('#LabelsToggle').prop('checked')==false) {  
            svg.selectAll("text").style("visibility", "hidden");
        } 
        else {  
            svg.selectAll("text").style("visibility", "visible");
        } 
    });

    // ## Enable scale or not 
    $('#ScalesToggle').change(function() {
        if ($('#TreeViewSelect').prop('checked')==false) 
            {var setLayout='vertical' } 
        else {  var setLayout='radial'} 
        var layout = tnt.tree.layout[setLayout]().width(width).scale( $(this).prop('checked'))
        tree_vis.layout(layout)
        tree_vis.update();
        svgAction ();
        //console.log(set_rotate);
        //set_rotate='left-right';
        //rotate_tree(svg2,set_rotate);
    });

    // ## Enable selection of subtree by clicking innerNode  
    $('#InnerNodeToggle').change(function() {
        if ($(this).prop('checked')==false) { var setInnerNode='hidden' } 
        else { var setInnerNode='visible'} 
        
        svg.selectAll("circle")//.selectAll("g.tnt_tree_node.inner")
            .style("visibility", function(d)
            {if ((d.name.indexOf('NODE_')==0)) {return setInnerNode} })
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

        function elbow(d, i) {
        return "M" + d.source.y + "," + d.source.x
            + "V" + d.target.x + "H" + d.target.y;
        }

        svg.selectAll(".tnt_tree_link")//link
          .attr("d", elbow );
    }

    //## toggle tree-rotate
    $('#tree-rotate').change(function() {
        var svg2 = d3.select('#mytree2')
        if ($(this).prop('checked')==false) { 
            var set_rotate='right-left';        
        }
        else { var set_rotate='left-right';}
        //## call rotate function
        rotate_tree(svg2,set_rotate);
    });


render( "mytree1",treeJsonPath,svg1);
//render ( 'mytree2',aln_file_path+'NZ_CP012001-1-1834888-1835742.tree.json',svg2);

//console.log(Initial_MsaGV)
//console.log(aln_file_path+Initial_MsaGV.split('.')[0]+'.tree.json');
//render ( 'mytree2', aln_file_path+Initial_MsaGV.split('.')[0]+'.tree.json',svg2); 
//render (document.getElementById("mytree2"),treeJsonPath,svg2);

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