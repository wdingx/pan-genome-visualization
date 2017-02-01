var winInnerWidth = pgDashbord.winInnerWidth;
var svg1 = d3.select('#mytree1');
var svg2 = d3.select('#mytree2');
var svg_all = d3.select('#mytree1,#mytree2');//var svg_all = d3.select('#all_tree');

var times_flag=0;

//# node/label size
var leaf_count_limit=60;
var size_node_leaf_init=3.5, size_node_inner_init=2, size_node_leaf_highlight_init= 8;
var size_font_inner_label_init=10, size_font_leaf_label_init=10;
var height_nodeLabel_init=12;
//# node/label array
var size_node_leaf_arr=[0,0], size_node_inner_arr=[0,0], size_node_leaf_highlight_arr=[0,0];
var size_font_inner_label_arr=[0,0], size_font_leaf_label_arr=[0,0], height_nodeLabel_arr=[0,0];
//# label- and node-color (fill,stroke)
var color_leaf_label='steelblue', color_internal_label='steelblue';
var color_node_stroke='steelblue', color_node_fill='white', color_inner_node='black';
var color_leaf_node_highlight="#EE6363", color_inner_node_highlight="steelblue";
//# subtree coloring
var subtree_node_colorSet = d3.scale.category20c();

/**
 * render the tree viewers
 * @param  {int} ind          index of tree viewers(0:left;1:right)
 * @param  {str} selected_div div_id
 * @param  {str} treeJsonPath path for tree json
 */
var render_tree = function(ind,selected_div,treeJsonPath) {
    //"use strict";
    var leaf_count;
    var size_node_leaf= size_node_leaf_init, size_node_inner= size_node_inner_init,
        size_node_leaf_highlight= size_node_leaf_highlight_init;
    var size_font_inner_label= size_font_inner_label_init, size_font_leaf_label= size_font_leaf_label_init;
    var height_nodeLabel= height_nodeLabel_init;
    var svg= d3.select('#'+selected_div);
    var tree_vis = tnt.tree();
    var width = winInnerWidth/3; //600; //var height = 360;
    //## initial layout/scale options .property('checked', true);
    var setLayout= 'vertical'; 
    var scale_layout= 'true';
    var set_rotate= 'right-left';
    /**
     * adjust node size and label height based on leaf_count
     * @param {int} count leaf_count
     */
    function set_sizes(count){
        height_nodeLabel = (count<leaf_count_limit)?10:(2+540/count);//12:(3+540
        size_font_leaf_label = (count<leaf_count_limit)?10:(8+540/count);//12:(3+540
        //size_font_inner_label= size_font_leaf_label;
        size_node_leaf = (count<leaf_count_limit)?3:3//(3 + leaf_count_limit/count);3.5
        size_node_inner = (count<leaf_count_limit)?2.2:2//(2 + 60/count)
        size_node_leaf_highlight = (count<leaf_count_limit)?8:(4 + 240/count)//(4 + 240/count);
        height_nodeLabel_arr[ind]=height_nodeLabel;
        size_font_leaf_label_arr[ind]=size_font_leaf_label;
        size_node_leaf_arr[ind]=size_node_leaf;
        size_node_inner_arr[ind]=size_node_inner;
        size_node_leaf_highlight_arr[ind]=size_node_leaf_highlight;
        //console.log(height_nodeLabel,size_font_leaf_label,size_node_leaf,size_node_inner,size_node_leaf_highlight)
        //console.log(height_nodeLabel_arr,size_font_leaf_label_arr,size_node_leaf_arr,size_node_inner_arr,size_node_leaf_highlight_arr);
    };
    //## load tree data and draw the initial tree
    d3.json (treeJsonPath, function (error,data) {
        //d3.text("./dataset/SNP_whole_matrix.newick", function(newick_file){});
        //var tree_data = tnt.tree.parse_newick(newick_file);
        //console.log(JSON.stringify(tree_data));
        var tree_data = data;
        tree_initialized(tree_data);
    });

    function tree_initialized(tree_data) {
        function count_leafs(data) {
            if (typeof data.children==='undefined'){
                return 1;
            } else {
                var lc=0;
                for (var ci=0, ch_len=data.children.length; ci<ch_len; ci++){
                    lc+= count_leafs(data.children[ci]);
                }
                return lc;
            }
        };

        leaf_count=count_leafs(tree_data);
        set_sizes(leaf_count);

        var node_label = tnt.tree.label.text()
            .text(function (d){
                if (d.is_leaf()) {
                    d.data().shown_label = (typeof d.data().strainName==='undefined' || d.data().strainName=='' || d.data().strainName=='unknown') ? d.data().name : d.data().strainName;
                    return d.data().shown_label;
                } else {
                    d.data().shown_label="";
                    return d.data().shown_label;}
            })
            .color(color_leaf_label) /*function (node){ if (node.is_leaf()) {return color_leaf_label}}*/
            .fontsize(size_font_leaf_label)
            .height(height_nodeLabel)

        var leaf_node = tnt.tree.node_display.circle()
            .size( function (node){ return (node.is_leaf()) ? size_node_leaf : size_node_inner;}) 
            .stroke( function (node){ if (node.is_leaf()) { return color_node_stroke };})
            .fill( function (node,d){ 
                    if (node.is_leaf()) { 
                        return (pgModule.hasOwnProperty(pxTree.node_color_mem,node.node_name())) ? pxTree.node_color_mem[node.node_name()] : color_node_fill;
                    }
                    else {return color_inner_node} 
                });

        var collapsed_node = tnt.tree.node_display.triangle()
            .size(pxTree.collapsed_node_size)
            .fill(pxTree.collapsed_node_fill)
            .stroke(pxTree.collapsed_node_stroke);

        var node_display = tnt.tree.node_display()
            .size(0.1) // This is used for the layout calculation
            .display (function (node) {
                //leaf_node.display().call(this, node);
                if (node.is_collapsed()) {
                    collapsed_node.display().call(this, node);
                } else {
                    leaf_node.display().call(this, node);
                }                
            });

        tree_vis
            .branch_color(pxTree.branch_col)
            .node_display(node_display)
            .label(node_label)//.label(tnt.tree.label.text().height(2).fontsize(fontSize).color('steelblue'))
            .data(tree_data)
            .layout(tnt.tree.layout[setLayout]().width(width).scale(scale_layout)) //# layout.height
            .duration(0)//2000

        tree_vis.on("click", function(d){
            d3.select(this).style('cursor','pointer');
            svgTree_Module.mouseout_hide_sub_highlight;
            d.toggle();
            tree_vis.update();
            svgAction(ind,svg);
        });

        //## The visualization is started at this point
        tree_vis(document.getElementById(selected_div));

        //## not display labels on large tree
        if (leaf_count>leaf_count_limit) {
            svg.selectAll(".tnt_tree_label").style("visibility", "hidden");
            $('#LabelsToggle').bootstrapToggle('off');
        };

        /*link width*/
        var links = svg.selectAll(".tnt_tree_link")
        links.style("stroke-width",pxTree.wid_link)

        //## make scale bar
        var scaleBar = tree_vis.scale_bar(50, "pixel").toFixed(3);
        var legend = d3.select("#"+selected_div);
        legend.append("div")
            .style({ width:"50px", height:"2px", "background-color":"steelblue",
                    margin:"6px 5px 5px 25px", float: "left"});
            
        legend.append("text")
            .style({"font-size": "12px"})
            .text(scaleBar);

        svgAction(ind,svg);
        if (selected_div=='mytree2') {
            rotate_tree(svg,set_rotate);
        }
    };

    //-------tree displaying options-------//
    //# Layout transition between a radial and a vertical tree
    $('#TreeViewSelect').change(function() {
        var setLayout= (d3.select(this).property('checked')==false) ? 'vertical' : 'radial';
        var rotate_vis_state= (setLayout=='vertical') ? 'visible' : 'hidden';

        d3.select('#tree-rotate-div').style('visibility',rotate_vis_state);

        var layout = tnt.tree.layout[setLayout]().width(width).scale(d3.select('#ScalesToggle').property('checked'))
        
        tree_vis.layout(layout);
        tree_vis.update();
        if (leaf_count>leaf_count_limit) {
            svg.selectAll(".tnt_tree_label").style("visibility", "hidden");
            $('#LabelsToggle').bootstrapToggle('off');
        };
        svgAction(ind,svg);
        if ((setLayout=='vertical') && (selected_div=='mytree2')) {
            rotate_tree(svg,'left-right');
            $('#tree-rotate').bootstrapToggle('on');
        }
        //rotate_tree(svg2,'left-right');
    });

    // ## Enable scale or not 
    $('#ScalesToggle').change(function() {
        var setLayout= (d3.select('#TreeViewSelect').property('checked')==false) ? 'vertical' : 'radial';
        var layout = tnt.tree.layout[setLayout]().width(width).scale( d3.select(this).property('checked'))
        tree_vis.layout(layout);
        tree_vis.update();
        svgAction(ind,svg);
        if ((setLayout=='vertical') && (selected_div=='mytree2')) {
            rotate_tree(svg,'left-right');
            $('#tree-rotate').bootstrapToggle('on');
        }            
    });

    //# Enable label or not
    $('#LabelsToggle').change(function() {
        var text_vis_state = (d3.select('#LabelsToggle').property('checked')==false) ? 'hidden' : 'visible';
        svg.selectAll(".tnt_tree_label").style("visibility", text_vis_state);
    });

    // ## Enable selection of subtree by clicking innerNode  
    $('#InnerNodeToggle').change(function() {
        var setInnerNode=(d3.select(this).property('checked')==false) ? 'hidden' : 'visible';
        svg.selectAll("circle")
            //selectAll(".tnt_tree_node.inner, .tnt_tree_node.root")
            .style("visibility", function(d) {
                if ((d.name.indexOf('NODE_')==0 || d.name=='')) {
                    return setInnerNode} 
            })
    });

    //d3.select('#Height_more_Toggle').on("click", function() {
    $('#Height_plus_Toggle').on("click", function() {
        var text_vis_state = (d3.select('#LabelsToggle').property('checked')==false) ? 'hidden' : 'visible';
        height_nodeLabel+=0.2;
        var node_label = tnt.tree.label.text()
                    .text(function (d) { return d.data().shown_label;})
                    //.fontsize(size_font_leaf_label)
                    .height(height_nodeLabel)
                    .color(color_leaf_label);
        tree_vis.label(node_label);
        tree_vis.update();
        svgAction(ind,svg);
        if (text_vis_state=='hidden') {
            svg.selectAll(".tnt_tree_label").style("visibility", text_vis_state)
        };
        
    });

    $('#Height_minus_Toggle').on("click", function() {
        var text_vis_state = (d3.select('#LabelsToggle').property('checked')==false) ? 'hidden' : 'visible';
        height_nodeLabel-=0.2;
        var node_label = tnt.tree.label.text()
                    .text(function (d) { return d.data().shown_label;})
                    .fontsize(size_font_leaf_label)
                    .height(height_nodeLabel)
                    .color(color_leaf_label);
        tree_vis.label(node_label);
        tree_vis.update();
        svgAction(ind,svg);
        if (text_vis_state=='hidden') {
            console.log(text_vis_state);
            svg.selectAll(".tnt_tree_label").style("visibility", text_vis_state)
        };
    });

    $('#HeightToggle').change(function() {
        var height_state = (d3.select('#HeightToggle').property('checked')==false) ? 'large' : 'small';
        var text_vis_state = (d3.select('#LabelsToggle').property('checked')==false) ? 'hidden' : 'visible';
        var mysize= (height_state =='large') ? 1 : 3;
        var node_label = tnt.tree.label.text()
                    .text(function (d) { return d.data().shown_label;})
                    .fontsize(size_font_leaf_label)
                    .height(mysize).color(color_leaf_label);
        tree_vis.label(node_label);
        tree_vis.update();
        svgAction(ind,svg);
        if (text_vis_state=='hidden') {
            console.log(text_vis_state);
            svg.selectAll(".tnt_tree_label").style("visibility", text_vis_state)
        }; 
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

var svgTree_Module= function(){
    var findChildren =function (array,innerNd_childrenArr) {
        if (array!=undefined) {
            for(var i=0, len=array.length; i<len; i++) {
                if  ( (array[i].name.indexOf('NODE_')!=0) && (array[i].name!='') ) {
                    innerNd_childrenArr.push(array[i].name);
                } else {
                    findChildren(array[i].children,innerNd_childrenArr);
                }
            }
        }
    };

    //## leaf nodes tooltip
    function tooltip_node (svg){
        svg.selectAll(".tnt_tree_node.leaf")
            .on('mouseover', tips_node.show)
            .on('mouseout', tips_node.hide)
            .call(tips_node);
    };

    function mouseover_show_subTree(d, i, ind) {
        console.log(size_node_leaf_highlight_arr[ind]);
        var click_type='';
        if (pgModule.hasOwnProperty(d, 'target' )) {
            click_type='link';
        } else { click_type='node';}

        if (click_type=='link') {
            if (d.target.muts != undefined) { tips_link.show(d);}
            d=d.target;
        }

        removeLegend();

        //if (pgModule.hasOwnProperty(d, 'name') && d.name!='') {
        if ((d.name.indexOf('NODE_')!=0) && (d.name!='')) {
            //console.log(pgModule.hasOwnProperty(d, 'target'));
            d3.selectAll("circle.pt" + d.name)
              .style("fill", color_leaf_node_highlight)
              .attr("r", size_node_leaf_highlight_arr[ind])
        }
        else if ((d.name.indexOf('NODE_')==0) || (d.name=="")) { 
            this.style.cursor='pointer';
            //# highlight selected inner node
            if (click_type=='node') {
                d3.select(this)
                    .style("stroke",color_inner_node_highlight)
                    .style("stroke-width",'20px')
                    .style("fill", "steelblue");
            } else if (click_type=='link') {
                pxTree.link_color_mem[this.id]=this.style.stroke;
                pxTree.link_width_mem[this.id]=this.style['stroke-width'];
                pxTree.link_dash_mem[this.id]=this.style['stroke-dasharray'];
                d3.select(this)
                    .style("stroke", pxTree.branch_col_highlight)
                    .style("stroke-width", pxTree.branch_wid_highlight);
            }

            //# change the color of subtree leaf nodes
            if (pgModule.hasOwnProperty(d, 'toggle_children')==false) {
                var innerNd_childrenArr = [];
                findChildren(d.children,innerNd_childrenArr);
                d.toggle_children=innerNd_childrenArr
            } else {
                var innerNd_childrenArr= d.toggle_children;
            }

            //# highlight all subtree leaf nodes
            for(var i=0;i<innerNd_childrenArr.length;i++) {
                d3.selectAll("circle.pt" + innerNd_childrenArr[i])
                    .style("fill", function(d) {
                        return subtree_node_colorSet(d.name);
                    })
                    .attr("r", size_node_leaf_highlight_arr[ind]);
            }
        }
    };

    function mouseout_hide_sub_highlight(d, i, ind) {
        //console.log(size_node_leaf_arr[ind]);
        var click_type='';
        //d.target!=undefined
        if (pgModule.hasOwnProperty(d, 'target' )) {
            click_type='link';
        } else { click_type='node';}

        if (click_type=='link') {
            tips_link.hide(d);
            d=d.target
        }

        makeLegend(legendOptionValue);
        if ( (d.name.indexOf('NODE_')!=0) && (d.name!='') ) {
            d3.selectAll("circle.pt" + d.name)
                .style("fill", pxTree.node_color_mem[d.name])
                .attr("r", size_node_leaf_arr[ind]);
        }
        else if  ( (d.name.indexOf('NODE_')==0) || (d.name=="") ) {
            //#change the color of selected inner nodes
            if (click_type=='node') { 
                d3.select(this)
                    .style("stroke-width",'0px')
                    .style("fill", color_inner_node)
                    .attr("r", size_node_inner_arr[ind]);
            } else if (click_type=='link') {
                d3.select(this)
                    .style('stroke', function () {
                        if (pxTree.link_color_mem[this.id]!=undefined ) {
                            return pxTree.link_color_mem[this.id];
                        } else { return pxTree.branch_col;}
                    }) 
                    .style("stroke-width", function () {
                        if (pxTree.link_width_mem[this.id]!=undefined ) {
                            return pxTree.link_width_mem[this.id];
                        } else { return pxTree.link_width;}
                    })
                    .style("stroke-dasharray",function () {
                        if (pxTree.link_dash_mem[this.id]!=undefined ) {
                            return pxTree.link_dash_mem[this.id];
                        } else { return pxTree.link_dasharray;}
                    })
            }

            //# change the color of subtree leaf nodes
            if (pgModule.hasOwnProperty(d, 'toggle_children')==false) {
                var innerNd_childrenArr = [];
                findChildren(d.children,innerNd_childrenArr);
                d.toggle_children=innerNd_childrenArr
            } else {
                var innerNd_childrenArr= d.toggle_children;
            }

            for(var i=0;i<innerNd_childrenArr.length;i++) {
                d3.selectAll("circle.pt" + innerNd_childrenArr[i])
                    .style("fill", function(d) {
                        return pxTree.node_color_mem[d.name]
                    })
                    .attr("r", size_node_leaf_arr[ind]);
            }
        }
    };

    function click_show_sub_metaTable(d, i) {
        //d.target!=undefined
        var click_type='';
        if (pgModule.hasOwnProperty(d, 'target' )) {
            click_type='link';
        } else { click_type='node';}

        if (click_type=='link') {d=d.target}

        var innerNd_childrenArr = [];
        if ( (d.name.indexOf('NODE_')==0) || (d.name=="")  ) {
            findChildren(d.children,innerNd_childrenArr);
        }
        else {
            innerNd_childrenArr =[d.name];
        }

        //var nodeAttriPath="./dataset/Sa-tnt-dAttri.json" ;  
        d3.json(path_datatable2, function(error, data) {
            var data=data['data']
            for (var i=0;i<data.length;i++) {
                data[data[i]['accession']]=data[i]
            } 

            function RefreshTreeTable() {
                var n=[];
                for (var i=0;i<innerNd_childrenArr.length;i++) {
                    var tmp = data[innerNd_childrenArr[i]];
                    tmp['accession']=innerNd_childrenArr[i];
                    n.push(tmp);
                }
                $('#dc-data-table2').dataTable().fnClearTable();
                $('#dc-data-table2').dataTable().fnAddData(n);
                $('#dc-data-table2').dataTable().fnDraw();
            }; 
            RefreshTreeTable(); 
        });
    };

    //## find the corresponding node in another tree
    function node_showSubtree_trace(svg){
        svg.selectAll("circle") // nodes tracing trick
            .attr("class", function(d,i) {
                return  "pt" +d.name;
            })
            .on("mouseover", mouseover_show_subTree )
            .on("mouseout", mouseout_hide_sub_highlight)
            .on("click", click_show_sub_metaTable );
    };
    //## select link to show sub-tree
    function link_showSubtree_trace(svg) {
        svg.selectAll('path.tnt_tree_link')
            .on("mouseover", mouseover_show_subTree )
            .on("mouseout", mouseout_hide_sub_highlight )
            .call(tips_link)
            .on("click", click_show_sub_metaTable );
    };

    return{tooltip_node:tooltip_node,
        node_showSubtree_trace:node_showSubtree_trace,
        link_showSubtree_trace:link_showSubtree_trace}
}();

    //## actions on tree (tooltips, select subtree by nodes/links)
var svgAction = function(ind,svg) {
    var t0 = performance.now();
    svgTree_Module.tooltip_node(svg);
    var t1 = performance.now(); 
    if (times_flag==1) {csprint("x0 time: "+ Math.round(t1-t0) +" msec");}

    var t0 = performance.now();
    svgTree_Module.node_showSubtree_trace(svg);
    var t1 = performance.now(); 
    if (times_flag==1) {csprint("x1 time: "+ Math.round(t1-t0) +" msec");} 

    var t0 = performance.now(); 
    svgTree_Module.link_showSubtree_trace(svg);
    var t1 = performance.now(); 
    if (times_flag==1) {csprint("x2 time: "+ Math.round(t1-t0) +" msec");}
};

// ## rotate tree             
function rotate_tree(svg, direction) {
    /*if (direction=="left-right") {
        d3.select('#tree-rotate').attr('checked',true);
    } else {
        d3.select('#tree-rotate').attr('checked',false);
    }*/

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
//## only apply to svg2 (not inside render_tree)
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
render_tree(0,"mytree1",treeJsonPath);
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
        .style("r", function (){return size_node_leaf_highlight_arr[ind];})
    // adjust style of non matches
    d3.selectAll("circle").filter(function(d){return !nodeMatch(d);})
        .style("fill", function (d){return pxTree.node_color_mem[d.name];})
        .style("r", function (){return size_node_leaf_arr[ind];})
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
    .attr('class','glyphicon glyphicon-download-alt')
    //.attr('class','fa fa-arrow-circle-down fa-5')
    .attr('aria-hidden','true')
