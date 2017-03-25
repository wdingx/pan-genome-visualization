/**
 * Module for initializing trigger actions in cluster datatable. It includes:
 * click the Plus/Minus button to unfold/fold annotation/geneName/etc details,
 * click aa/na alignment button to show MSA and linked trees.
 */
const linkTableAlignmentTrees = function(speciesTree, geneTree){

    /** called by wrapper function updatePresence */
    function call_updatePresence(geneGainLoss_Dt,geneIndex,strain_tree_id,tool_side) {
        var svg= d3.select('#'+strain_tree_id),
            node = svg.selectAll('circle'),
            link = svg.selectAll('path.tnt_tree_link'),
            text = svg.selectAll("text");

        node.style('fill', function(d) {
            if ((d.name.indexOf('NODE_')!=0) && (d.name!='')) {
                var node_color, presence_flag, genePattern;
                if (pxTree.large_output==false) {
                    genePattern=d.genePattern[parseInt(geneIndex)-1];
                    /** calculated from gain/loss pattern */
                    presence_flag= ((genePattern=='1')|| (genePattern=='3')) ? 1 : 0;
                } else if (pxTree.gain_loss_enabled==true) {
                    genePattern=geneGainLoss_Dt[d.name];
                    presence_flag= (genePattern%2==1) ? 1 : 0;
                } else if (pxTree.gain_loss_enabled==false) {
                    genePattern= geneGainLoss_Dt[d.name];
                    presence_flag= (genePattern=='0') ? 0 : 1;
                };

                node_color= (presence_flag==1) ? pxTree.col_pres : pxTree.col_abse;

                pgModule.store_genePattern_style(tool_side, 'node_color_mem', d.name, node_color);
                pgModule.store_tree_style(tool_side, 'node_color_mem', d.name, node_color);
                return node_color
            }
        });

        text.style("fill", function(d) {
            if (d!==undefined && d.name!='' ) {
                return pgModule.restore_genePattern_style(tool_side, 'node_color_mem', d.name);
                return pgModule.restore_tree_style(tool_side, 'node_color_mem', d.name);
            }
        });
    }

    /** update gene presence/absence pattern */
    function updatePresence(geneGainLoss_Dt, geneIndex, clusterID, strain_tree_id, tool_side) {
        if (pxTree.large_output==true) {
            d3.json(aln_file_path+clusterID+'_patterns.json', function (error,data) {
                geneGainLoss_Dt=data;
                call_updatePresence(geneGainLoss_Dt, geneIndex, strain_tree_id, tool_side);
            });
        } else {call_updatePresence(geneGainLoss_Dt, geneIndex, strain_tree_id, tool_side)};
    }

    /** ascertain event_type in different input scenarios */
    function gain_loss_link_attr(d,geneGainLoss_Dt,gindex) {
        var event_type='';
        if (pxTree.large_output==true) {
            //event_type = geneGainLoss_Dt[d.target.name];
        } else {
            //event_type = geneGainLoss_Dt[d.target.name][gindex];
            event_type = d.target.genePattern[gindex];
        };
        return event_type
    }

    /** called by wrapper function updateGainLossEvent */
    function call_updateGainLoss(geneGainLoss_Dt, geneIndex, strain_tree_id, tool_side) {
        var gindex= parseInt(geneIndex)-1;
        var svg=d3.select('#'+strain_tree_id);
        var gainloss_disabled=0;
        var nodes = svg.selectAll('circle'),
            link = svg.selectAll('path.tnt_tree_link')
                    .filter(function(d) {
                    if (geneGainLoss_Dt[d.target.name]!==undefined) {return true}
                    else if (gainloss_disabled==0) {gainloss_disabled=1; return false}
                    else { return false};
                });
        if (gainloss_disabled==1) { pxTree.wid_gloss=pxTree.wid_link};

        link.style('stroke', function(d) {
            var event_type, link_stroke;
            event_type= gain_loss_link_attr(d,geneGainLoss_Dt,gindex);
            if (event_type==='0' || event_type=='2') {link_stroke= pxTree.col_abse}
            else {link_stroke= pxTree.col_pres};

            pgModule.store_genePattern_style(tool_side, 'link_color_mem', d.target.name, link_stroke);
            pgModule.store_tree_style(tool_side, 'link_color_mem', d.target.name, link_stroke);
            return link_stroke
        })
        .style("stroke-width", function (d) {
            var event_type, link_width;
            event_type= gain_loss_link_attr(d,geneGainLoss_Dt,gindex);
            if (event_type=='1' || event_type=='2') {link_width= pxTree.wid_gloss}
            else {link_width= pxTree.wid_link};

            pgModule.store_genePattern_style(tool_side, 'link_width_mem', d.target.name, link_width);
            pgModule.store_tree_style(tool_side, 'link_width_mem', d.target.name, link_width);
            return link_width
        })
        .style("stroke-dasharray", function(d) {
            var event_type, link_dash;
            event_type=gain_loss_link_attr(d,geneGainLoss_Dt,gindex);
            if (event_type=='2'){ link_dash= (d.source.parent) ? "6,6" : "1,0"; }
            else {link_dash= 'none'}

            pgModule.store_genePattern_style(tool_side, 'link_dash_mem', d.target.name, link_dash);
            pgModule.store_tree_style(tool_side, 'link_dash_mem', d.target.name, link_dash);
            return link_dash
        });
    }

    /** update gene gain/loss pattern */
    function updateGainLossEvent(geneGainLoss_Dt, geneIndex, clusterID, strain_tree_id, tool_side) {
        if (pxTree.large_output==true) {
            //use separated gain/loss pattern if geneGainLossEvent.json not found
            d3.json(aln_file_path+clusterID+'_patterns.json', function (error,data) {
                //if both json files are missing, set it to empty
                if (error===null) { geneGainLoss_Dt=data };
                call_updateGainLoss(geneGainLoss_Dt, geneIndex, strain_tree_id, tool_side);
            });
        } else {
            call_updateGainLoss(geneGainLoss_Dt, geneIndex, strain_tree_id, tool_side);
        }
    }

    /**
     * [update_geneTree description]
     * @param  {object} data      : object loaded from datatable json file
     * @param  {str} gene_tree_id : div ID for gene tree
     */
    function update_geneTree(data, gene_tree_id, tool_side) {
        var svg2=d3.select('#'+gene_tree_id);
        svg2.selectAll("*").remove();
        var clusterID=data['msa'];
        var geneTree_name=clusterID+'_tree.json';
        /** update gene tree */
        var aln_path= (tool_side==1) ? aln_file_path_B : aln_file_path;
        geneTree("geneTree", geneTree_name, handleGeneTree);
    }

    /**
     * update the gene tree color via selected metadata from dropdown list
     * @param  {str} div_id        : div ID for metadata_selection dropdown (dropdown_select)
     * @param  {str} valueToSelect : metadata type(e.g.: 'genePattern')
     */
    function selectElement(div_id,valueToSelect) {
        var element = document.getElementById(div_id);
        element.value = valueToSelect;
    }

    /**
     * wrapper function for triggering all events linked with alignment button
     * @param  {object} data         : object loaded from datatable json file
     * @param  {str}    aln_type     : type of alignment ('aa' for amino_acid, 'na' for nucleotide)
     */
    function trigger_aln_tree(data, geneGainLoss_Dt, aln_type, strain_tree_id, gene_tree_id, tool_side) {
        var msa_colorScheme =(aln_type=='aa') ? 'taylor' : 'nucleotide';
        /** load MSA alignment */
        msaLoad(aln_file_path+data['msa']+'_'+aln_type+'.aln.fa',msa_colorScheme);
        console.log(data['msa']);

        geneId_GV = data['geneId'];
        /** majority annotaion */
        ann_majority = data['ann'];
        var clusterID=data['msa'];
        /** call functions to update tree pattern */
        updatePresence(geneGainLoss_Dt, geneId_GV, clusterID, strain_tree_id, tool_side);
        update_geneTree(data, gene_tree_id,tool_side);
        updateGainLossEvent(geneGainLoss_Dt, geneId_GV, clusterID, strain_tree_id, tool_side);
        $('#tree-rotate').bootstrapToggle('off');
        selectElement("dropdown_select",'genePattern');
        /** remove metadata legend and set legend_option_value to empty */
        removeLegend(); legendOptionValue='';
    }

    /**
     * load gene gain/loss event json and pass it to row-clicking trigger
     * @param: see function init_action
     */
    var init_loading_geneEvent= function (datatable, table_id, first_cluster, strain_tree_id, gene_tree_id, tool_side){
        var geneGainLoss_Dt = {};
        //geneEvent_path= geneEvent_path_A;
        console.log("LINK ", table_id);
        var geneEvent_path= (tool_side===1) ? geneEvent_path_B : geneEvent_path_A;
        d3.json(geneEvent_path, function(error, geneGainLoss_input) {
            var geneGainLoss_Dt = {};
            /** if geneGainLossEvent.json does not exist */
            if (error!==null) { pxTree.large_output=true}
            else { geneGainLoss_Dt=geneGainLoss_input}

            /** show 1st cluster in table for initial loading */
            trigger_aln_tree(first_cluster, geneGainLoss_Dt, 'aa', strain_tree_id, gene_tree_id, tool_side);

            /** row-clicking trigger: update MSA amino_acid alignment when clicking datatable row*/
            $('#'+table_id+' tbody').on('click', 'tr', function (e) {
                var data = datatable.row( $(this) ).data();
                /** trigger alignment and tree when clicked
                 *  use trigger_action_table.geneGainLoss_Dt to ensure that
                 *  fully d3_loaded json has been passed.
                 */
                trigger_aln_tree(data, geneGainLoss_Dt, 'aa', strain_tree_id, gene_tree_id, tool_side);
                /** highlight the row when clicked/selected  */
                $('#'+table_id+' tbody tr').removeClass('row_selected');
                $(this).addClass('row_selected');
            });

            /** aa button (amino_acid button in table): update MSA amino_acid alignment and tree*/
            $('#'+table_id+' tbody').on('click', '.btn.btn-info.btn-xs', function (e) {
                var data = datatable.row( $(this).parents('tr') ).data();
                trigger_aln_tree(data, geneGainLoss_Dt, 'aa', strain_tree_id, gene_tree_id, tool_side);
                /** avoid to activate row clicking */
                e.stopPropagation();
            });

            /** na button (nucleotide button  in table): update MSA nucleotide alignment and tree*/
            console.log("na button", $('#'+table_id+' tbody'));
            $('#'+table_id+' tbody').on('click', '.btn.btn-primary.btn-xs', function (e) {
                console.log("na button");
                var data = datatable.row( $(this).parents('tr') ).data();
                trigger_aln_tree(data, geneGainLoss_Dt, 'na', strain_tree_id, gene_tree_id, tool_side);
                /** avoid to activate row clicking */
                e.stopPropagation();
            });
        });
    };

    /**
     * wrapper function for all initial actions
     * @param  {object} datatable      : object loaded from datatable json file
     * @param  {str} table_id          : div ID for datatable
     * @param  {str} strain_tree_id    : div ID for strain tree
     * @param  {str} gene_tree_id      : div ID for gene tree
     * @param  {int} tool_side         : flag for comparative tool side (0:left; 1:right)
     */
    var init_action= function (datatable, table_id, first_cluster, strain_tree_id, gene_tree_id, tool_side) {
        init_loading_geneEvent(datatable, table_id, first_cluster, strain_tree_id, gene_tree_id, tool_side);
    }
    return { init_action:init_action}
};

export default linkTableAlignmentTrees;

