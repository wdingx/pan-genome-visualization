import {more_color_set, safe_color_set} from "./colors";
import {updateTips} from "../phyloTree/src/updateTree";
import {pxTree,colorPresenceAbsence} from "./tree-init";

function isNumeric(num){
    return !isNaN(num)
}

function assign_color(color_set) {
    var index = meta_detail.indexOf('unknown');
    if (index > -1) {
        meta_detail.splice(index, 1);
        tmp_meta_color_set['unknown']=pxTree.node_metaunknown_stroke;
    }
    for (var i = 0; i < meta_detail.length; i++) {
        var legend_value = meta_detail[i];
        tmp_meta_color_set_keys.push(legend_value);
        tmp_meta_color_set[legend_value]=color_set[i];
    }
    if (tmp_meta_color_set['unknown']!=undefined){
            tmp_meta_color_set_keys.push('unknown');
    }
    metaColor_sets[metaType_key] = tmp_meta_color_set;
    metaColor_set_keys[metaType_key] = tmp_meta_color_set_keys;
}

var metaColor_sets = {}; // dict:{ 'host':hostColor,'country':countryColor}
var metaColor_set_keys = {}; //## keep the original key order
//## assign color to each item in each meta-info type
delete meta_set['strainName']
var metaTypes = Object.keys(meta_set); // ['geo','host']
for (var j = 0; j < metaTypes.length; j++) {
    var tmp_meta_color_set = {};
    var tmp_meta_color_set_keys = [];
    var metaType_key = metaTypes[j]; // 'geo'
    var meta_detail = meta_set[metaType_key]; // ["human", "rice"]
    if (isNumeric(meta_detail[0])) {
        var index = meta_detail.indexOf('unknown');
        if (index > -1) {
            meta_detail.splice(index, 1);
            tmp_meta_color_set['unknown']=pxTree.node_metaunknown_stroke;
        }
        var min = Math.min.apply(null, meta_detail),
            max = Math.max.apply(null, meta_detail);
        var distance = max - min;
        var num_interval = 5;
        var interval= distance/num_interval;
        for (var i = 0; i <= num_interval; i++) {
            // one decimal place
            var legend_value = Math.round( (min+interval*i)*10 )/10;
            tmp_meta_color_set_keys.push(legend_value);
            tmp_meta_color_set[legend_value]=safe_color_set[i];
        }
        if (tmp_meta_color_set['unknown']!=undefined){
            tmp_meta_color_set_keys.push('unknown');
        }
        metaColor_sets[metaType_key] = tmp_meta_color_set;
        metaColor_set_keys[metaType_key] = tmp_meta_color_set_keys;
    }
    else {
        assign_color(more_color_set);
        /*if (meta_detail.length < more_color_set.length ) {
            assign_color(more_color_set);
        }*/
    }
}

//## legend configuration
var legendRectSize = 15;
var legendSpacing = 4;

//## clean legend
function removeLegend(coreTree_legend_id) {
    var legend= d3.select('#'+coreTree_legend_id);
    legend.selectAll('.legend')
        .remove();
}

//## create legend
function makeLegend(metaType,speciesTree, geneTree,coreTree_legend_id){ // && legendOptionValue!= "Meta-info"
    const strokeToFill = pxTree.strokeToFill;
    console.log(metaType);
    if (metaType==="genePattern"){
        var node,strain, fill;
        for (var i=0; i<speciesTree.tips.length; i++){
            node = speciesTree.tips[i];
            node.tipAttributes.r = node.genePresent?5:3;
            fill = node.genePresent?pxTree.genePresentFill:pxTree.geneAbsentFill
            node.tipAttributes.fill = fill;
            node.tipAttributes.stroke = d3.rgb(fill).darker(strokeToFill).toString();
        }
        colorPresenceAbsence(speciesTree);
        for (var i=0; i<geneTree.tips.length; i++){
            node = geneTree.tips[i];
            strain = speciesTree.namesToTips[node.n.accession];
            node.tipAttributes.fill = "#AAA";
            node.tipAttributes.stroke = d3.rgb(node.tipAttributes.fill).darker(strokeToFill).toString();
        }
        updateTips(geneTree, [], ["fill", "stroke"], 0);

    }
    else if (metaType!='') {
        var itemCount = {};
        for (var i=0; i<speciesTree.tips.length; i++){
            const node = speciesTree.tips[i];
            if (itemCount[node.n.attr[metaType]]){
                itemCount[node.n.attr[metaType]]++;
            }else{
                itemCount[node.n.attr[metaType]]=1;
            }
            node.tipAttributes.fill = d3.rgb(metaColor_sets[metaType][node.n.attr[metaType]]).toString()
            node.tipAttributes.stroke = d3.rgb(node.tipAttributes.fill).darker(strokeToFill).toString();
        }
        for (var i=0; i<geneTree.tips.length; i++){
            const node = geneTree.tips[i];
            const strain = speciesTree.namesToTips[node.n.accession];
            node.tipAttributes.fill = d3.rgb(metaColor_sets[metaType][strain.n.attr[metaType]]).toString()
            node.tipAttributes.stroke = d3.rgb(node.tipAttributes.fill).darker(strokeToFill).toString();
        }
        updateTips(geneTree, [], ["fill", "stroke"], 0);
        updateTips(speciesTree, [], ["fill", "stroke"], 0);

        var legend= d3.select('#'+coreTree_legend_id)
            .attr('width', pxTree.legend_width)
            .attr('height', pxTree.legend_height);
        var tmp_leg = legend.selectAll(".legend")
            .data( metaColor_set_keys[metaType] )
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

        const mouseover_legend = function(metaField, tree){
            tree.tipElements
            .attr('r',
                function(d){
                    if (d.n.attr[metaType] === metaField){
                        return d.tipAttributes.r*2;
                    }else{
                        return d.tipAttributes.r*0.7;
                    }
                })
            .style('fill', function(d){return d3.rgb(d.tipAttributes.fill).brighter(strokeToFill);});
        }
        const mouseout_legend = function(metaField, tree){
            tree.tipElements
                .attr('r', function(d){return d.tipAttributes.r;})
                .style('fill', function(d){return d.tipAttributes.fill;});
        }

        tmp_leg.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .attr('text', function (d) {return d;} )
            .attr('fill', function (d) {
                var col = metaColor_sets[metaType][d];
                return d3.rgb(col).toString();
            })
            .attr('stroke', function (d) {
                var col = metaColor_sets[metaType][d];
                return d3.rgb(col).darker([0.4]).toString();
            })
            .on("mouseover", function(d) {mouseover_legend(d,speciesTree)})
            .on("mouseout",  function(d) {mouseout_legend(d,speciesTree)});

        tmp_leg.append('text')
            .attr('x', legendRectSize + legendSpacing + 5)
            .attr('y', legendRectSize - legendSpacing)
            .attr('text', function (d) {return d;} )
            .text(function(d) {
                return d.toString();
            })
            .on("mouseover", function(d) {mouseover_legend(d,speciesTree)})
            .on("mouseout",  function(d) {mouseout_legend(d,speciesTree)});

        return tmp_leg;
    }
}


//## update legend and coloring nodes by meta-info
export const updateData = function(metaType,speciesTree,geneTree,coreTree_legend_id,tool_side) {
    var metaColorSet=metaColor_sets[metaType];
    removeLegend(coreTree_legend_id);
    makeLegend(metaType,speciesTree,geneTree,coreTree_legend_id, tool_side);
};

//## creat dropdown-list for meta-info
export const create_dropdown = function (div, speciesTree, geneTree, coreTree_legend_id, tool_side) {
    var menu_panel = d3.select(div)

    var dropdown_meta = menu_panel
        .append("select")
        .attr("id","dropdown_select")
        .attr("class","form-control sm-customized")
    var metaTypes = Object.keys(meta_set);

    dropdown_meta.append("option")
        .attr("value", "Meta-info")
        .attr("selected", 1)
        .text("Meta-info");

    dropdown_meta.append("option")
        .attr("value", "genePattern")
        .text("gene presence/absence");

    for (var i = 0; i < metaTypes.length; i++) { // ['geo','host']
        dropdown_meta.append("option")
            .attr("value", metaTypes[i])
            .text(meta_display_set[metaTypes[i]]);
    }
}
