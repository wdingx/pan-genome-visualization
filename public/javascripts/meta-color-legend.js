function isNumeric(num){
    return !isNaN(num)
}

function assign_color(color_set) {
    var index = meta_detail.indexOf('unknown');
    if (index > -1) { 
        meta_detail.splice(index, 1); 
        tmp_meta_color_set['unknown']='#FFFFFF'
    }
    for (i = 0; i < meta_detail.length; i++) {
        var legend_value = meta_detail[i];
        tmp_meta_color_set_keys.push(legend_value);
        tmp_meta_color_set[legend_value]=color_set[i];
    }
    if (tmp_meta_color_set['unknown']!=undefined){
            tmp_meta_color_set_keys.push('unknown');
    }
    metaColor_sets[meta_type_key] = tmp_meta_color_set;
    metaColor_set_keys[meta_type_key] = tmp_meta_color_set_keys;
}

var metaColor_sets = {}; // dict:{ 'host':hostColor,'country':countryColor}
var metaColor_set_keys = {}; //## keep the original key order
//## assign color to each item in each meta-info type
delete meta_set['strainName']
var meta_types = Object.keys(meta_set); // ['geo','host']
for (j = 0; j < meta_types.length; j++) {
    var tmp_meta_color_set = {};
    var tmp_meta_color_set_keys = [];
    var meta_type_key = meta_types[j]; // 'geo'
    var meta_detail = meta_set[meta_type_key]; // ["human", "rice"]
    if (isNumeric(meta_detail[0])) {
        var index = meta_detail.indexOf('unknown');
        if (index > -1) { 
            meta_detail.splice(index, 1); 
            tmp_meta_color_set['unknown']='#FFFFFF'
        }
        var min = Math.min.apply(null, meta_detail),
            max = Math.max.apply(null, meta_detail);
        var distance = max - min;
        var num_interval = 5;
        var interval= distance/num_interval;
        for (i = 0; i <= num_interval; i++) {
            // one decimal place
            var legend_value = Math.round( (min+interval*i)*10 )/10;
            tmp_meta_color_set_keys.push(legend_value);
            tmp_meta_color_set[legend_value]=safe_color_set[i];
        }
        if (tmp_meta_color_set['unknown']!=undefined){
            tmp_meta_color_set_keys.push('unknown');
        }
        metaColor_sets[meta_type_key] = tmp_meta_color_set;
        metaColor_set_keys[meta_type_key] = tmp_meta_color_set_keys;
    }
    else {
        assign_color(more_color_set);
        /*if (meta_detail.length < more_color_set.length ) {
            assign_color(more_color_set);
        }*/
    }
}

//## legend configuration
var legend = d3.select("#legend")
                .attr("width", 100)
                .attr("height", 380);
var legendRectSize = 15;
var legendSpacing = 4;
var legendOptionValue='';

//## clean legend
function removeLegend() {
    legend.selectAll('.legend')
        .remove();
}

//## create legend
function makeLegend(meta_type){ // && legendOptionValue!= "Meta-info"
    if ( legendOptionValue=='genePresence') {
        updatePresence( geneId_GV );
        updateGainLossEvent( geneId_GV );
    } else if (legendOptionValue!='') {
        var tmp_leg = legend.selectAll(".legend")
            .data( metaColor_set_keys[meta_type] )
            .enter().append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                var stack = 20;
                var height = legendRectSize + legendSpacing;
                var fromRight = Math.floor(i / stack);
                var fromTop = i % stack;
                var horz = fromRight * 145 + 5;              
                var vert = fromTop * height + 5;
                return 'translate(' + horz + ',' + vert + ')';
            });

        function mouseover_lengend(d) {
            var text_value = d3.select(this).attr("text");
            svg1.selectAll("circle")
                .filter(function(d) { 
                    if (d[meta_type] === text_value ) {
                        return d;
                    } else if ( isNumeric(text_value) ) {
                        var current_keys = metaColor_set_keys[meta_type];
                        var current_index = current_keys.indexOf(parseFloat(text_value));
                        var current_meta_value = Math.round( (d[meta_type])*10 )/10;
                        if ( current_meta_value > current_keys[current_index-1] && current_meta_value <=  current_keys[current_index] ) {
                            return d;
                        }
                    }
                })
                .attr("r", size_node_leaf_highlight_arr[0]);
        }

        function mouseout_lengend(d) {
            var text_value = d3.select(this).attr("text");
            svg1.selectAll("circle")
                .filter(function(d) { 
                    if (d[meta_type] === text_value ) {
                        return d;
                    } else if ( isNumeric(text_value) ) {
                        var current_keys = metaColor_set_keys[meta_type];
                        var current_index = current_keys.indexOf(parseFloat(text_value));
                        var current_meta_value = Math.round( (d[meta_type])*10 )/10;
                        if ( current_meta_value > current_keys[current_index-1] && current_meta_value <=  current_keys[current_index] ) {
                            return d;
                        }
                    }
                })
                .attr("r", size_node_leaf_arr[0]);
        }

        tmp_leg.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .attr('text', function (d) {return d;} )
            .attr('fill', function (d) {
                var col = metaColor_sets[meta_type][d]; 
                return d3.rgb(col).toString();
            })
            .attr('stroke', function (d) {
                var col = metaColor_sets[meta_type][d];
                return d3.rgb(col).darker([0.4]).toString();
            })
            .on("mouseover", mouseover_lengend)
            .on("mouseout", mouseout_lengend);
            
        tmp_leg.append('text')
            .attr('x', legendRectSize + legendSpacing + 5)
            .attr('y', legendRectSize - legendSpacing)
            .attr('text', function (d) {return d;} )
            .text(function(d) {
                return d.toString();
            })
            .on("mouseover", mouseover_lengend)
            .on("mouseout", mouseout_lengend);            
            
        return tmp_leg;
    }
}


//## update legend and coloring nodes by meta-info
function updateData(meta_type) {
    //## svg1 for core tree, svg_all for both trees
    var node = svg1.selectAll("circle"),
        text = svg1.selectAll("text"),
        link = svg1.selectAll(".tnt_tree_link");
                
    legendOptionValue=meta_type;
    var metaColorSet=metaColor_sets[meta_type];
    removeLegend();
    makeLegend(meta_type);

    if (meta_type != 'genePresence') {
        node.style("fill", function(d) {
            if ( (d.name.indexOf('NODE_')!=0) && d.name!='' ) {
                if ( isNumeric(metaColor_set_keys[meta_type][0])==false ) {
                    var setColor=metaColorSet[d[meta_type]];
                    pxTree.node_color_mem[d.name]=setColor;
                    d3.selectAll("circle.pt" + d.name)
                        .style("fill", setColor);
                    return setColor;
                } else {
                    if (d[meta_type]=='unknown') {
                        var setColor='#FFFFFF';
                        pxTree.node_color_mem[d.name]=setColor;
                        d3.selectAll("circle.pt" + d.name)
                            .style("fill", setColor);
                        return setColor;
                    } else {
                        var current_keys = metaColor_set_keys[meta_type];
                        var current_meta_value = Math.round( (d[meta_type])*10 )/10;
                        for (i = 1; i <= current_keys.length; i++) {
                            if (  current_meta_value >= current_keys[i-1] && current_meta_value <=  current_keys[i] ) {
                                var setColor=metaColorSet[current_keys[i]];
                                pxTree.node_color_mem[d.name]=setColor;
                                d3.selectAll("circle.pt" + d.name)
                                    .style("fill", setColor);
                                return setColor;
                                break;
                            }
                        }
                    }
                }
            }
        });

        link.style("stroke", function(d) {
            if ( (d.target.name.indexOf('NODE_')!=0) && d.target.name!='') {
                if ( isNumeric(metaColor_set_keys[meta_type][0])==false ) {
                    return d3.rgb(metaColorSet[d.target[meta_type]]).darker([0.8]).toString();
                } else {
                    var current_keys = metaColor_set_keys[meta_type];
                    var current_meta_value = Math.round( (d.target[meta_type])*10 )/10;
                    for (i = 1; i <= current_keys.length; i++) {
                        if (  current_meta_value >= current_keys[i-1] && current_meta_value <=  current_keys[i] ) {
                            return d3.rgb(metaColorSet[d.target[meta_type]]).darker([0.8]).toString();
                            break;
                        }
                        // info unknown
                        return pxTree.branch_col;
                    }

                }
            } else { return pxTree.branch_col;}
        });
    } else {
        //## coloring all leaf nodes in gene Tree with blue
        svg2.selectAll('g.tnt_tree_node.leaf')
            .selectAll("circle")
            .style("fill", "blue");
    }
};

//## creat dropdown-list for meta-info
var creat_dropdown = function (div) {
    var menu_panel = d3.select(div)

    var dropdown_meta = menu_panel
        .append("select")
        .attr("id","dropdown_select")
        .attr("class","form-control sm-customized")
    var meta_types = Object.keys(meta_set);
    
    dropdown_meta.on("change", function(d) {
        if (this.value!='Meta-info') {
            updateData(this.value);
        }
    });

    dropdown_meta.append("option")
        .attr("value", "Meta-info")
        .attr("selected", 1)
        .text("Meta-info");

    dropdown_meta.append("option")
        .attr("value", "genePresence")
        .text("gene presence/absence");

    for (i = 0; i < meta_types.length; i++) { // ['geo','host']
        dropdown_meta.append("option")
            .attr("value", meta_types[i])
            .text(meta_display_set[meta_types[i]]);
    }
}
creat_dropdown("#dropdown_list");