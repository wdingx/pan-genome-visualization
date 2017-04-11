import {updateTips,updateBranches} from "../phyloTree/src/updateTree";
import {panXTree} from "./global";
import {colorPresenceAbsence} from "./tree-init";
import {assign_metadata_color} from './meta-color-assignment'

const metaTypes = Object.keys(meta_set);
var metaColor_dicts = {},//# {'host':hostColor,'country':countryColor}
    metaColor_dicts_keys = {}, //# keep the original key order
    metaColor_reference_dicts= {};
assign_metadata_color(metaColor_dicts,metaColor_dicts_keys,metaColor_reference_dicts,metaTypes);

//## legend configuration
var legendRectSize = 15;
var legendSpacing = 4;

//## clean legend
const removeLegend = function(coreTree_legend_id) {
    var legend= d3.select('#'+coreTree_legend_id);
    legend.selectAll('.legend')
        .remove();
}

const metaUnknown=panXTree.metaUnknown,
      strokeToFill = panXTree.strokeToFill;
//## create legend
const makeLegend = function(metaType,speciesTree, geneTree,coreTree_legend_id){ // && legendOptionValue!= "Meta-info"
    console.log(metaType);
    if (metaType==="genePattern"){
        var node,strain, fill;
        for (var i=0; i<speciesTree.tips.length; i++){
            node = speciesTree.tips[i];
            node.tipAttributes.r = node.genePresent?5:3;
            fill = node.genePresent?panXTree.genePresentFill:panXTree.geneAbsentFill
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
            if (meta_display_set['color_options'][metaType]['type']=='discrete'){
                const fill=metaColor_dicts[metaType][node.n.attr[metaType]];
                node.tipAttributes.fill =fill;
                node.branchAttributes["stroke"] = fill || metaUnknown;
            }else{//** continuous
                const lengend_value= metaColor_reference_dicts[metaType][node.n.attr[metaType]];
                const fill=metaColor_dicts[metaType][lengend_value];
                node.tipAttributes.fill = fill;
                node.branchAttributes["stroke"] = fill || metaUnknown;
            }
            node.tipAttributes.stroke = d3.rgb(node.tipAttributes.fill).darker(strokeToFill).toString();
        }

        for (var i=0; i<geneTree.tips.length; i++){
            const node = geneTree.tips[i];
            const strain = speciesTree.namesToTips[node.n.accession];
            if(meta_display_set['color_options'][metaType]['type']=='discrete'){
                node.tipAttributes.fill = d3.rgb(metaColor_dicts[metaType][strain.n.attr[metaType]]).toString()
            }else{//** continuous
                const lengend_value= metaColor_reference_dicts[metaType][strain.n.attr[metaType]];
                node.tipAttributes.fill = d3.rgb(metaColor_dicts[metaType][lengend_value]).toString()
            }
            node.tipAttributes.stroke = d3.rgb(node.tipAttributes.fill).darker(strokeToFill).toString();
        }
        updateTips(geneTree, [], ["fill", "stroke"], 0);
        updateTips(speciesTree, [], ["fill", "stroke"], 0);
        updateBranches(speciesTree, [], ["stroke"], 0);

        var legend= d3.select('#'+coreTree_legend_id)
            .attr('width', panXTree.legend_width)
            .attr('height', panXTree.legend_height);
        var tmp_leg = legend.selectAll(".legend")
            .data( metaColor_dicts_keys[metaType] )
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
                    if ((d.n.attr[metaType] == metaField)||((metaColor_reference_dicts[metaType]!== undefined)&&(metaColor_reference_dicts[metaType][d.n.attr[metaType]] == metaField))){
                        return d.tipAttributes.r*2;
                    }else{
                        return d.tipAttributes.r;
                    }
                })
            .style('fill', function(d){
                if ((d.n.attr[metaType] == metaField)||((metaColor_reference_dicts[metaType]!== undefined)&&(metaColor_reference_dicts[metaType][d.n.attr[metaType]] == metaField))) {
                    return d3.rgb(d.tipAttributes.fill).brighter(strokeToFill);
                }else{
                    return d.tipAttributes.fill;
                }
            });
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
                var col = metaColor_dicts[metaType][d];
                return d3.rgb(col).toString();
            })
            .attr('stroke', function (d) {
                var col = metaColor_dicts[metaType][d];
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
    var metaColorSet=metaColor_dicts[metaType];
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

    dropdown_meta.append("option")
        .attr("value", "Meta-info")
        .attr("selected", 1)
        .text("Meta-info");

    dropdown_meta.append("option")
        .attr("value", "genePattern")
        .text("gene presence/absence");

    var meta_display_order = meta_display_set['meta_display_order'];
    for (var i = 0, len = meta_display_order.length; i < len; i++) {
        dropdown_meta.append("option")
            .attr("value", metaTypes[i])
            .text(meta_display_order[i]);
    }
}
