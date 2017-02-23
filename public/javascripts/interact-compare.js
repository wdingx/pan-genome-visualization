var init_core_threshold=0.99;

/** dc_data_table_registered: flag to record the first loaded dashboard.
 *  important for distinguishing between comparative datatables
 *  otherwise dc cross filtering works only for one dashboard.
 */
var dc_data_table_registered=0;
var first_registered_list=[];
var Initial_MsaGV='';
var geneId_GV='', geneclusterID_GV='';
var ann_majority= '';
var chart_width=winInnerWidth/4.5,//(winInnerWidth/4.5>255) ? winInnerWidth/4.5 : 255,
    chart_width_sm=winInnerWidth/30;
var lineChart_width=chart_width, lineChart_height=150;
var barChart_width=chart_width,  barChart_height=150;
var pie_width=chart_width_sm, pie_height=chart_width_sm,
    pie_outer_radius=chart_width_sm/2, pie_inner_radius=chart_width_sm/8;

//## core_genome threshold slider
function slider_coreThreshold_init(coreThreshold_slider_id){
    var tooltipSlider = document.getElementById(coreThreshold_slider_id);
    noUiSlider.create(tooltipSlider, {
        start:  0.99,
        behaviour: 'tap',
        connect: 'upper',//'lower',/**/
        range: {
            'min': 0,
            'max': 1
        }
        //, tooltips: [  wNumb({ decimals: 2 }) ]
    });
    return tooltipSlider;
};

//## make dropdown_menu
var creat_dropdown_menu = function (div, species_dt) {
    var menu = d3.select(div);
    var seletor = menu
        .append("select")
        .attr("class", "form-control")
        .attr("id", "sel1")
        .attr("onchange", "location = this.options[this.selectedIndex].value;");

    seletor.append("option")
        .attr("value", speciesAbbr)
        .text(species_dt[speciesAbbr]);

    for(var key in species_dt) {
        var value = species_dt[key];
        if (key!=speciesAbbr) {
            seletor.append("option")
                .attr("value", key)
                .text(value);
        }
    }
};
creat_dropdown_menu('#species-selector', species_dt)

//## create charts and load geneCluster dataTable
var render_chart_table = {
    initChart: function (data, table_id, col_select_id,
        count_id, chart1_id, chart2_id, chart3_id,
        coreThreshold_slider_id, coreThreshold_text_id,
        strain_tree_id, gene_tree_id, tool_side) {
        /*"use strict";*/
        var lineChart = dc.lineChart('#'+chart1_id)
                        .xAxisLabel('gene')
                        .yAxisLabel('strain count');
        var geneLengthBarChart = dc.barChart('#'+chart2_id)
                        .yAxisLabel('gene count')
                        .xAxisLabel('gene length');
        var coreYesNoPieChart = dc.pieChart('#'+chart3_id);

        //# Create Crossfilter Dimensions and Groups
        var ndx = crossfilter(data);
        var all = ndx.groupAll();

        // count all the genes
        dc.dataCount('#'+count_id)
            .dimension(ndx)
            .group(all);

        // Dimension by geneId
        var geneCountDimension = ndx.dimension(function (d) {
            return d.geneId;});
        // Group by geneCount
        var geneCountGroup = geneCountDimension.group()
            .reduceSum(function (d) {return d.count;});

        // Dimension by geneLength
        var geneLengthValue = ndx.dimension(function (d) {
            return d.geneLen;});
        //Group by total movement within month
        var geneLengthGroup = geneLengthValue.group()

        //##  pie chart
        // reusable function to create threshold dimension
        function coreCount_from_threshold() {
            var totalStrainNumber=data[1].count;
            var coreThreshold=document.getElementById(coreThreshold_text_id).value;
            coreThreshold=parseFloat(coreThreshold);
            if (isNaN(coreThreshold)) {
                coreThreshold=init_core_threshold
            }
            return ndx.dimension(function (d) {
                if (d.count >= totalStrainNumber*coreThreshold){
                    return 'Core';
                }
                else {
                    return 'Acc';
                }
            });
        };
        // categorical dimension (pie chart) by coreGene count
        var coreCount = coreCount_from_threshold();
        // core/non-core gene counts records in the dimension
        var coreCountGroup = coreCount.group();

        var totalGeneNumber= Object.keys(data).length;

        lineChart
            .width(lineChart_width).height(lineChart_height) //4.5
            .x(d3.scale.linear().domain([1,totalGeneNumber] ))
            //.x(d3.scale.log().base(10).domain([1,totalGeneNumber] ))
            .transitionDuration(500)
            .dimension(geneCountDimension)
            .group(geneCountGroup)
            .renderArea(true)
            .renderHorizontalGridLines(true)
            .elasticY(true)
            .xAxis().ticks(5);
            //.ticks(10, ",.0f") //???
            //.tickSize(5, 0);
            //.tickFormat(function(v) {return v;});
            //.mouseZoomable(true)
            //.interpolate('step-before')
            //.brushOn(false)
            //.renderDataPoints(true)
            //.clipPadding(10)

        var geneLengthMax=Math.max.apply(Math,data.map(function(o){return o.geneLen;}))
        geneLengthBarChart
            .width(barChart_width).height(barChart_height) //winInnerWidth/3.5
            //.margins({top: 10, right: 10, bottom: 20, left: 40})
            .dimension(geneLengthValue)
            .group(geneLengthGroup)
            .transitionDuration(500)
            .centerBar(true)
            .gap(1) // bar width Keep increasing to get right then back off.
            .x(d3.scale.linear().domain([0, geneLengthMax]))
            //.x(d3.scale.linear().clamp(true).domain([0, 5000]))
            .elasticY(true)
            //.mouseZoomable(true)
            .renderHorizontalGridLines(true)
            //.brushOn(false)
            .xAxis().tickFormat(function(v) {return v;}).ticks(5);

        coreYesNoPieChart
            .width(pie_width)
            .height(pie_height)
            .radius(pie_outer_radius)
            .innerRadius(pie_inner_radius)
            .dimension(coreCount)
            .title(function(d){return d.value;})
            .group(coreCountGroup)
            .label(function (d) {
                if (coreYesNoPieChart.hasFilter() && !coreYesNoPieChart.hasFilter(d.key)) {
                    return d.key + '(0%)';
                }
                var label = d.key;
                if (all.value()) {
                    label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
                }
                return label;
            })
            //.legend(dc.legend());

        //## using core threshold in slider to re-distribute pie chart data
        // update the field
        var tooltipSlider=slider_coreThreshold_init(coreThreshold_slider_id);
        var coreThresholdField = document.getElementById(coreThreshold_text_id);
        tooltipSlider.noUiSlider.on('update', function( values, handle ){
            if ( parseFloat(values[handle]) !== init_core_threshold) {
                coreThresholdField.value = parseFloat(values[handle]);
                coreThresholdField.innerHTML = 'cutoff:' + values[handle];
                coreCount.dispose();
                coreCount = coreCount_from_threshold();
                coreCountGroup = coreCount.group();

                coreYesNoPieChart
                  .dimension(coreCount)
                  .group(coreCountGroup);
                dc.redrawAll();}
        });

        //## data count records (selected records and all records)
        var nasdaqCount = dc.dataCount('.'+count_id);
        nasdaqCount
            .dimension(ndx)
            .group(all)
            // (_optional_) `.html` sets different html when some records or all records are selected.
            // `.html` replaces everything in the anchor with the html given using the following function.
            // `%filter-count` and `%total-count` are replaced with the values obtained.
            .html({
                some: '<strong>%filter-count</strong> genes selected from <strong>%total-count</strong> total genes' +
                    ' <br/> <a href="javascript:dc.filterAll(); dc.renderAll();"" style="font-size:20px"> Clear filters </a>',
                all: 'All records selected. Please click on the graph to apply filters.'
            });

        var buttonCommon = {
            exportOptions: {
                format: {
                    body: function ( data, column, row, node ) {
                        // Strip $ from salary column to make it numeric
                        return column === 5 ?
                            data.replace( /[$,]/g, '' ) :
                            data;
                    }
                }
            }
        };

        creat_dataTable('#'+table_id,geneCluster_table_columns);

        button_tooltip('#'+table_id+' tr th',clusterTable_tooltip_dict );

        var datatable=datatable_configuration(geneCountDimension.top(Infinity), table_id, col_select_id);

        /*var trigger_action_table_each= new trigger_action_table();
        trigger_action_table_each.init_action(datatable,table_id,strain_tree_id, gene_tree_id,tool_side);*/
        trigger_action_table.init_action(datatable,table_id,strain_tree_id, gene_tree_id,tool_side);

        function RefreshTable() {
            dc.events.trigger(function () {
                alldata = geneCountDimension.top(Infinity);
                $('#'+table_id).dataTable().fnClearTable();
                $('#'+table_id).dataTable().fnAddData(alldata);
                $('#'+table_id).dataTable().fnDraw();
                //click_table_show_AlnTree(datatable);
            });
        }

        /** when no table registered */
        if (!dc_data_table_registered) {
            dc_data_table_registered=1;
            var mylist= dc.chartRegistry.list();
            first_registered_list=dc.chartRegistry.list();
            first_registered_list_len=first_registered_list.length;
        } else {
            var mylist=dc.chartRegistry.list().slice(first_registered_list_len);
        }

        for (var i = 0; i < mylist.length; i++) {
            var chartI = mylist[i];
            chartI.on('filtered', RefreshTable);
        }

        //## Rendering: render all charts on the page
        dc.renderAll();

    },
    initData: function (path_datatable1, table_id, col_select_id,
        count_id, chart1_id, chart2_id, chart3_id,
        coreThreshold_slider_id, coreThreshold_text_id,
        strain_tree_id,gene_tree_id, tool_side) {
        //## load the data, charts and MSA
        d3.json(path_datatable1, function(error, data) {
            Initial_MsaGV=data[0].msa;
            geneId_GV=data[0].geneId;
            ann_majority=data[0].ann;
            render_chart_table.initChart(data, table_id, col_select_id,
                count_id, chart1_id, chart2_id, chart3_id,
                coreThreshold_slider_id, coreThreshold_text_id,
                strain_tree_id,gene_tree_id, tool_side);
            var aln_path= (tool_side===0) ? aln_file_path : aln_file_path_B;
            msaLoad(aln_path+Initial_MsaGV+'_aa.aln','taylor');
            console.log(Initial_MsaGV+'_aa.aln');
            var clusterID=Initial_MsaGV;
            var geneTree_name=clusterID+'_tree.json';
            render_tree(1,gene_tree_id,aln_path+geneTree_name,tool_side);
            //## download-link
            var download_geneTree=d3.select('#download-geneTree');
            download_geneTree.append('a')
                .attr('id','download_geneTree_href')
                .attr('href','/download/dataset/'+speciesAbbr+'/geneCluster/'+clusterID+'.nwk')
                .append('i')
                .attr('class','glyphicon glyphicon-download-alt')
                //.attr('class','fa fa-arrow-circle-down fa-5')
                .attr('aria-hidden','true')
        })
    }
};

render_chart_table.initData(path_datatable1,'dc_data_table1', 'GC_tablecol_select',
    'dc_data_count','dc_straincount_chart','dc_geneLength_chart','dc_coreAcc_piechart',
    'changeCoreThreshold','coreThreshold',
    'mytree1','mytree2', 0);
render_chart_table.initData(path_datatable11,'dc_data_table2', 'GC_tablecol_select2',
    'dc_data_count2','dc_straincount_chart2','dc_geneLength_chart2','dc_coreAcc_piechart2',
    'changeCoreThreshold2','coreThreshold2',
    'compare_tree1','compare_tree2',1);

/**
 * Module for initializing trigger actions in cluster datatable. It includes:
 * click the Plus/Minus button to unfold/fold annotation/geneName/etc details,
 * click aa/na alignment button to show MSA and linked trees.
 */
var trigger_action_table= function(){

    /** called by wrapper function updatePresence */
    function call_updatePresence(geneGainLoss_Dt,geneIndex,strain_tree_id) {
        var svg= d3.select('#'+strain_tree_id),
            node = svg.selectAll('circle'),
            link = svg.selectAll('path.tnt_tree_link'),
            text = svg.selectAll("text");

        node.style('fill', function(d) {
            if ((d.name.indexOf('NODE_')!=0) && (d.name!='')) {
                var presence_flag;
                if (pxTree.large_output==false) { // large_output false
                    d.genePattern=d.genePresence[parseInt(geneIndex)-1];
                    //presence_flag= (d.genePattern=='1') ? 1 : 0;
                    /** calculated from gain/loss pattern */
                    presence_flag= ((d.genePattern=='1')|| (d.genePattern=='3')) ? 1 : 0;
                } else if (pxTree.gain_loss_enabled==true) {
                    d.genePattern=geneGainLoss_Dt[d.name];
                    presence_flag= (d.genePattern%2==1) ? 1 : 0;
                } else if (pxTree.gain_loss_enabled==false) {
                    d.genePattern= geneGainLoss_Dt[d.name];
                    presence_flag= (d.genePattern=='0') ? 0 : 1;
                };

                if (presence_flag==1) {
                    pxTree.node_color_mem[d.name]= pxTree.col_pres;
                    return pxTree.col_pres;
                }
                else {
                    pxTree.node_color_mem[d.name]=pxTree.col_abse;
                    return pxTree.col_abse;
                }
            }
        });

        text.style("fill", function(d) {
            if (d!==undefined && d.name!='' ) {
                return pxTree.node_color_mem[d.name];
            }
        });
    }

    /** update gene presence/absence pattern */
    function updatePresence(geneGainLoss_Dt, geneIndex, clusterID, strain_tree_id) {
        if (pxTree.large_output==true) {
            d3.json(aln_file_path+clusterID+'_patterns.json', function (error,data) {
                geneGainLoss_Dt=data;
                call_updatePresence(geneGainLoss_Dt,geneIndex, strain_tree_id);
            });
        } else {call_updatePresence(geneGainLoss_Dt,geneIndex, strain_tree_id)};
    }

    /** ascertain event_type in different input scenarios */
    function gain_loss_link_attr(d,geneGainLoss_Dt,gindex) {
        if (pxTree.large_output==true) {
            //event_type = geneGainLoss_Dt[d.target.name];
        } else {
            //event_type = geneGainLoss_Dt[d.target.name][gindex];
            event_type = d.target.genePresence[gindex];
        };
        return event_type
    }

    /** called by wrapper function updateGainLossEvent */
    function call_updateGainLoss(geneGainLoss_Dt, geneIndex, strain_tree_id) {
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
            var event_type;
            event_type= gain_loss_link_attr(d,geneGainLoss_Dt,gindex);
            //console.log(event_type,d.target.name);
            if (event_type==='0' || event_type=='2') {return pxTree.col_abse}
            else {return pxTree.col_pres};
        })
        .style("stroke-width", function (d) {
            var event_type;
            event_type= gain_loss_link_attr(d,geneGainLoss_Dt,gindex);
            if (event_type=='1' || event_type=='2') {return pxTree.wid_gloss}
            else {return pxTree.wid_link}
        })
        .style("stroke-dasharray", function(d) {
            var event_type;
            event_type=gain_loss_link_attr(d,geneGainLoss_Dt,gindex);
            if (event_type=='2'){ return (d.source.parent) ? "6,6" : "1,0"; }
            else {return 'none' }
        });
    }

    /** update gene gain/loss pattern */
    function updateGainLossEvent(geneGainLoss_Dt, geneIndex, clusterID, strain_tree_id) {
        if (pxTree.large_output==true) {
            //use separated gain/loss pattern if geneGainLossEvent.json not found
            d3.json(aln_file_path+clusterID+'_patterns.json', function (error,data) {
                //if both json files are missing, set it to empty
                if (error===null) { geneGainLoss_Dt=data };
                call_updateGainLoss(geneGainLoss_Dt, geneIndex, strain_tree_id);
            });
        } else {
            call_updateGainLoss(geneGainLoss_Dt, geneIndex, strain_tree_id);
        }
    }

    /**
     * extract all annotations by processing inital condensed all_annotation string
     * e.g.: allAnn='arginine/ornithine_transporter_AotQ#36@arginine/ornithine_transport_protein_AotQ#2@arginine/ornithine_ABC_transporter_permease_AotQ:1'
     * @param  {Object} d : object loaded from datatable json file
     * @return {str}      : all annotation details in HTML format
     */
    function format_annotation(d) {
        // 'd' is the original data object for the row
        // Example: allAnn='arginine/ornithine_transporter_AotQ#36@arginine/ornithine_transport_protein_AotQ#2@arginine/ornithine_ABC_transporter_permease_AotQ:1'
        var annSplit = d.allAnn.split("@");
        var ann_Table_Str='<table cellpadding="5" cellspacing="0" border="0" style="padding-right:50px;">'+
            '<tr><td>Annotation detail:</td> <td>Counts:</td></tr>';
        for (var i=0;i<annSplit.length;i++) {
            var annCountSplit=annSplit[i].split("#");
            var annInfo=annCountSplit[0];
            var annCount=annCountSplit[1];
            ann_Table_Str+='<tr><td>'+annInfo+'</td> <td>'+annCount+'</td>'+'</tr>';
        }
        ann_Table_Str+='</table>';
        return ann_Table_Str;
        /** HTML structure when unfolding the Plus button in table
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            '<tr>'+
                '<td>Full name:</td>'+
                '<td>'+d.ann+'</td>'+
            '</tr>'+
        '</table>';
         */
    }

    /**
     * extract duplicated strain name by processing inital condensed duplication-info string
     * e.g.: dup_detail='gene1#2@gene12#1'
     * @param  {Object} d : object loaded from datatable json file
     * @return {str}      : duplicated strain details in HTML format
     */
    function format_dup_detail(d) {
        //
        var dupSplit = d.dup_detail.split("@");
        var dup_Table_Str='<table cellpadding="5" cellspacing="0" border="0" style="padding-right:50px;">'+
            '<tr><td>strain name:</td> <td>Counts:</td></tr>';
        for (var i=0;i<dupSplit.length;i++) {
            var dupCountSplit=dupSplit[i].split("#");
            var strainName =dupCountSplit[0];
            var geneCount=dupCountSplit[1];
            if (geneCount==undefined) {
                geneCount='';
            }
            dup_Table_Str+='<tr><td>'+strainName+'</td> <td>'+geneCount+'</td>'+'</tr>';
        }
        dup_Table_Str+='</table>';
        return dup_Table_Str;
    }

    /**
     * process all annotation details from inital condensed annotation string
     * e.g.: allGName='arginine/ornithine_transporter_AotQ#36@arginine/ornithine_transport_protein_AotQ#2@arginine/ornithine_ABC_transporter_permease_AotQ:1'
     * @param  {object} d : object loaded from datatable json file
     * @return {str}      : gene name details in HTML format
     */
    function format_geneNames(d) {
        var geneName_Split = d.allGName.split("@");
        var geneName_Table_Str='<table cellpadding="5" cellspacing="0" border="0" style="padding-right:50px;">'+
                                '<tr><td>geneName detail:</td> <td>Counts:</td></tr>';
        for (var i=0;i<geneName_Split.length;i++) {
            var geneName_CountSplit=geneName_Split[i].split("#");
            var geneName_Info=geneName_CountSplit[0];
            var geneName_Count=geneName_CountSplit[1];
            geneName_Table_Str+='<tr><td>'+geneName_Info+'</td> <td>'+geneName_Count+'</td>'+'</tr>';
        }
        geneName_Table_Str+='</table>';
        return geneName_Table_Str;
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
        var aln_path= (tool_side===0) ? aln_file_path : aln_file_path_B;
        render_tree(1,gene_tree_id, aln_path+geneTree_name, tool_side);
        d3.select('#download_geneTree_href')
            .attr('href', '/download/dataset/'+speciesAbbr+'/geneCluster/'+clusterID+'.nwk')
    }

    /**
     * update the gene tree color via selected metadata from dropdown list
     * @param  {str} div_id        : div ID for metadata_selection dropdown (dropdown_select)
     * @param  {str} valueToSelect : metadata type(e.g.: 'genePresence')
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
        msaLoad(aln_file_path+data['msa']+'_'+aln_type+'.aln',msa_colorScheme);
        console.log(data['msa']);

        geneId_GV = data['geneId'];
        /** majority annotaion */
        ann_majority = data['ann'];
        var clusterID=data['msa'];
        /** call functions to update tree pattern */
        updatePresence(geneGainLoss_Dt,geneId_GV, clusterID, strain_tree_id);
        update_geneTree(data, gene_tree_id,tool_side);
        updateGainLossEvent(geneGainLoss_Dt, geneId_GV, clusterID, strain_tree_id);
        $('#tree-rotate').bootstrapToggle('off');
        selectElement("dropdown_select",'genePresence');
        /** remove metadata legend and set legend_option_value to empty */
        removeLegend(); legendOptionValue='';
    }

    /**
     * load gene gain/loss event json and pass it to row-clicking trigger
     * @param: see function init_action
     */
    var init_loading_geneEvent= function (datatable, table_id, strain_tree_id, gene_tree_id, tool_side){
        var geneGainLoss_Dt = {};
        //geneEvent_path= geneEvent_path_A;
        geneEvent_path= (tool_side===0) ? geneEvent_path_A : geneEvent_path_B;
        d3.json(geneEvent_path, function(error, geneGainLoss_input) {
            var geneGainLoss_Dt = {};
            /** if geneGainLossEvent.json does not exist */
            if (error!==null) { pxTree.large_output=true}
            else { geneGainLoss_Dt=geneGainLoss_input}

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
            $('#'+table_id+' tbody').on('click', '.btn.btn-primary.btn-xs', function (e) {
                var data = datatable.row( $(this).parents('tr') ).data();
                trigger_aln_tree(data, geneGainLoss_Dt, 'na', strain_tree_id, gene_tree_id, tool_side);
                /** avoid to activate row clicking */
                e.stopPropagation();
            });
        });
    };

    /**
     * add event listener for Plus/Minus(Unfold/Fold) button in cluster table
     * @param: see function init_action
     */
    var init_folding_listener= function(datatable, table_id) {
        /** unfold and fold annotation column in cluster datatable */
        $('#'+table_id+' tbody').on('click', 'td.ann-details-control', function (e) {
            var tr = $(this).closest('tr');
            var row = datatable.row( tr );
            if ( row.child.isShown() ) {
                /** close the row, if it's already open */
                row.child.hide();
                tr.removeClass('shown');
            } else {
                /** Open the row */
                row.child( format_annotation(row.data()) ).show();
                tr.addClass('shown');
            };
            e.stopPropagation();
        });

        /** unfold and fold duplication column in cluster datatable */
        $('#'+table_id+' tbody').on('click', 'td.dup-details-control', function (e) {
            var tr = $(this).closest('tr');
            var row = datatable.row( tr );
            if ( row.child.isShown() ) {
                /** close the row, if it's already open*/
                row.child.hide();
                tr.removeClass('shown');
            } else {
                /** Open the row */
                row.child( format_dup_detail(row.data()) ).show();
                tr.addClass('shown');
            };
            e.stopPropagation();
        });

        /** unfold and fold gene_name column in cluster datatable */
        $('#'+table_id+' tbody').on('click', 'td.geneName-details-control', function (e) {
            var tr = $(this).closest('tr');
            var row = datatable.row( tr );
            if ( row.child.isShown() ) {
                /** close the row, if it's already open*/
                row.child.hide();
                tr.removeClass('shown');
            } else {
                /** Open the row */
                row.child( format_geneNames(row.data()) ).show();
                tr.addClass('shown');
            };
            e.stopPropagation();
        });
    };

    /**
     * wrapper function for all initial actions
     * @param  {object} datatable      : object loaded from datatable json file
     * @param  {str} table_id          : div ID for datatable
     * @param  {str} strain_tree_id    : div ID for strain tree
     * @param  {str} gene_tree_id      : div ID for gene tree
     * @param  {int} tool_side         : flag for tool side (0:left; 1:right)
     */
    var init_action= function (datatable, table_id, strain_tree_id, gene_tree_id, tool_side) {
        init_loading_geneEvent(datatable, table_id, strain_tree_id, gene_tree_id, tool_side);
        init_folding_listener(datatable, table_id);
    }
    return { init_action:init_action}
}();

var msa = require('msa');//var aln_path='';
function msaLoad (aln_path,scheme_type) {
    var rootDiv = document.getElementById('snippetDiv');
    /* global rootDiv */
    var msa = require('msa');
    var opts = {
      el: rootDiv,
      importURL: aln_path,
    };

    opts.vis = {conserv: false, overviewbox: false, labelId: false};
    opts.zoomer = {alignmentWidth:'auto',alignmentHeight: 250,rowHeight: 18,
                    labelWidth: 100, labelNameLength: 150,
                    labelNameFontsize: '10px',labelIdLength: 20, menuFontsize: '12px',
                    menuMarginLeft: '3px', menuPadding: '3px 4px 3px 4px', menuItemFontsize: '14px', menuItemLineHeight: '14px',
        //boxRectHeight: 2,boxRectWidth: 0.1,overviewboxPaddingTop: 20
    };
    opts.colorscheme={scheme: scheme_type}; //{scheme: 'taylor'};//{scheme: 'nucleotide'};
    opts.config={};
    var m =  msa(opts);    //JSON.stringify
    //m.g.on('row:click', function(data){ console.log(data) });
    //m.g.on('column:click', function(data){ console.log(data) });

    /*m.g.on('all',function(name,data){
        var obj = {name: name, data:data};
        //if(inIframe()){ parent.postMessage(obj, "*") }
        parent.postMessage(obj, "*")
    });
    m.g.on("column:click", function(data){
        colorBy = "genotype";
        colorByGenotypePosition([data['rowPos']]);});
    m.g.on("residue:click", function(data)
        {console.log(data);});*/

    var menuOpts = {};
    menuOpts.msa = m;
    var defMenu = new msa.menu.defaultmenu(menuOpts);
    m.addView('menu', defMenu);
};//msaLoad(aln_file_path+Initial_MsaGV);

