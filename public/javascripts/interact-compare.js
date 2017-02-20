var init_core_threshold=0.99;

//## tree style tmp
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
function coreThreshold_slider_init(coreThreshold_slider_id){
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

//## load genePresence data
var geneGainLoss_Dt = {};
d3.json('./dataset/'+speciesAbbr+'/geneGainLossEvent.json', function(error, data) {
    // if geneGainLossEvent.json exists
    if (error!==null) { pxTree.large_output=true}
    else {geneGainLoss_Dt=data}
});

function call_updatePresence(geneIndex) {
    var svg= d3.select('#mytree1'),
    node = svg.selectAll('circle'),
    link = svg.selectAll('path.tnt_tree_link'),
    text = svg_all.selectAll("text");

    node.style('fill', function(d) {
        if ((d.name.indexOf('NODE_')!=0) && (d.name!='')) {
            var presence_flag;
            if (pxTree.large_output==false) { // large_output false
                d.genePattern=d.genePresence[parseInt(geneIndex)-1];
                presence_flag= (d.genePattern=='1') ? 1 : 0;
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
    /*link.style("stroke", function(d){
        if (  (d.target.name.indexOf('NODE_')!=0) && d.target.name!='') {
            return pxTree.node_color_mem[d.target.name];
        }
        else {console.log(d.target.name);return pxTree.branch_col}
    });*/
    text.style("fill", function(d) {
        if (d!==undefined && d.name!='' ) {
            return pxTree.node_color_mem[d.name];
        }
    });
};

//## update gene presence/absence pattern
function updatePresence(geneIndex, clusterID) {
    if (pxTree.large_output==true) {
        d3.json(aln_file_path+clusterID+'_patterns.json', function (error,data) {
            geneGainLoss_Dt=data;
            call_updatePresence(geneIndex);
        });
    } else {call_updatePresence(geneIndex)};
};

function gain_loss_link_attr(d,gindex) {
    if (pxTree.large_output==true) {
        event_type = geneGainLoss_Dt[d.target.name];
    } else {
        event_type = geneGainLoss_Dt[d.target.name][gindex];
    };
    return event_type;
};

function call_updateGainLoss(geneIndex) {
    var gindex= parseInt(geneIndex)-1;
    var svg=d3.select('#mytree1');
    var gainloss_disabled=0;
    var link = svg.selectAll('path.tnt_tree_link')
                .filter(function(d) {
                if (geneGainLoss_Dt[d.target.name]!==undefined) {return true}
                else if (gainloss_disabled==0) {gainloss_disabled=1; return false}
                else { return false};
            });
    if (gainloss_disabled==1) { pxTree.wid_gloss=pxTree.wid_link};

    link.style('stroke', function(d) {
        var event_type;
        event_type= gain_loss_link_attr(d,gindex);
        //console.log(event_type,d.target.name);
        if (event_type==='0' || event_type=='2') {return pxTree.col_abse}
        else {return pxTree.col_pres};
    })
    .style("stroke-width", function (d) {
        var event_type;
        event_type= gain_loss_link_attr(d,gindex);
        if (event_type=='1' || event_type=='2') {return pxTree.wid_gloss}
        else {return pxTree.wid_link}
    })
    .style("stroke-dasharray", function(d) {
        var event_type;
        event_type=gain_loss_link_attr(d,gindex);
        if (event_type=='2'){ return (d.source.parent) ? "6,6" : "1,0"; }
        else {return 'none' }
    });
};

//## update gene gain/loss pattern
function updateGainLossEvent(geneIndex, clusterID) {
    if  (pxTree.large_output==true) {
        //use separated gain/loss pattern if geneGainLossEvent.json not found
        d3.json(aln_file_path+clusterID+'_patterns.json', function (error,data) {
            //if both json files are missing, set it to empty
            if (error===null) { geneGainLoss_Dt=data };
            call_updateGainLoss(geneIndex);
        });
    } else {
        call_updateGainLoss(geneIndex);
    }
};

//## create charts and load geneCluster dataTable
var chartExample = {
    initChart: function (data, table_id, col_select_id,
        count_id, chart1_id, chart2_id, chart3_id,
        coreThreshold_slider_id, coreThreshold_text_id) {
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
        var tooltipSlider=coreThreshold_slider_init(coreThreshold_slider_id);
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

        clickShowMsa(datatable,table_id);

        function RefreshTable() {
            dc.events.trigger(function () {
                alldata = geneCountDimension.top(Infinity);
                $('#'+table_id).dataTable().fnClearTable();
                $('#'+table_id).dataTable().fnAddData(alldata);
                $('#'+table_id).dataTable().fnDraw();
                //clickShowMsa(datatable);
            });
        }

        for (var i = 0; i < dc.chartRegistry.list().length; i++) {
            var chartI = dc.chartRegistry.list()[i];
            chartI.on('filtered', RefreshTable);
        }

        //## Rendering: render all charts on the page
        dc.renderAll();

    },
    initData: function (path_datatable1, table_id, col_select_id,
        count_id, chart1_id, chart2_id, chart3_id,
        coreThreshold_slider_id, coreThreshold_text_id,
        gene_tree_id ) {
        //## load the data, charts and MSA
        d3.json(path_datatable1, function(error, data) {
            Initial_MsaGV=data[0].msa;
            geneId_GV=data[0].geneId;
            ann_majority=data[0].ann;
            chartExample.initChart(data, table_id, col_select_id,
                count_id, chart1_id, chart2_id, chart3_id,
                coreThreshold_slider_id, coreThreshold_text_id);
            msaLoad(aln_file_path+Initial_MsaGV+'_aa.aln','taylor');
            console.log(Initial_MsaGV+'_aa.aln');
            var clusterID=Initial_MsaGV;
            var geneTree_name=clusterID+'_tree.json';
            if ('mytree2'==gene_tree_id){
                render_tree(1,gene_tree_id,aln_file_path+geneTree_name,0);
            } else {
                render_tree(1,gene_tree_id,aln_file_path+geneTree_name,1);
            };
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

chartExample.initData(path_datatable1,'dc-data-table', 'GC_tablecol_select',
    'dc-data-count','dc-straincount-chart','dc-geneLength-chart','dc-coreAcc-piechart',
    'changeCoreThreshold','coreThreshold',
    'mytree2');
chartExample.initData(path_datatable11,'dc-data-table11', 'GC_tablecol_select2',
    'dc-data-count2','dc-straincount-chart2','dc-geneLength-chart2','dc-coreAcc-piechart2',
    'changeCoreThreshold2','coreThreshold2',
    'compare_tree2');
/**/
//## extract all annotations
function format_annotation ( d ) {
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
    /*return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td>Full name:</td>'+
            '<td>'+d.ann+'</td>'+
        '</tr>'+
    '</table>';*/
}

//## extract duplicated strain name
function format_dup_detail ( d ) {
    // Example: dup_detail='gene1#2@gene12#1'
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

//## extract all annotations
function format_geneNames ( d ) {
    // 'd' is the original data object for the row
    // Example: allGName='arginine/ornithine_transporter_AotQ#36@arginine/ornithine_transport_protein_AotQ#2@arginine/ornithine_ABC_transporter_permease_AotQ:1'
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

function clickShowMsa (datatable,table_id) {

    // unfold and fold annotation column
    $('#'+table_id+' tbody').on('click', 'td.ann-details-control', function (e) {
        var tr = $(this).closest('tr');
        var row = datatable.row( tr );

        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format_annotation(row.data()) ).show();
            tr.addClass('shown');
        }

        e.stopPropagation();
    });

    // unfold and fold duplication column
    $('#'+table_id+' tbody').on('click', 'td.dup-details-control', function (e) {
        var tr = $(this).closest('tr');
        var row = datatable.row( tr );

        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format_dup_detail(row.data()) ).show();
            tr.addClass('shown');
        }

        e.stopPropagation();
    } );

    // unfold and fold duplication column
    $('#'+table_id+' tbody').on('click', 'td.geneName-details-control', function (e) {
        var tr = $(this).closest('tr');
        var row = datatable.row( tr );

        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format_geneNames(row.data()) ).show();
            tr.addClass('shown');
        }

        e.stopPropagation();
    } );

    function updateTree(data) {
        var svg2=d3.select('#mytree2');
        svg2.selectAll("*").remove();
        var clusterID=data['msa'];
        var geneTree_name=clusterID+'_tree.json';
        render_tree(1,'mytree2', aln_file_path+geneTree_name);
        d3.select('#download_geneTree_href')
            .attr('href', '/download/dataset/'+speciesAbbr+'/geneCluster/'+clusterID+'.nwk')
    };

    //## update the selection in dropdown list
    function selectElement(div_id,valueToSelect) {
        var element = document.getElementById(div_id);
        element.value = valueToSelect;
    }

    function trigger_aln_tree(data, aln_type) {
        if (aln_type=='aa') {
            msaLoad(aln_file_path+data['msa']+'_aa.aln','taylor')
        } else if (aln_type=='nu') {
            msaLoad(aln_file_path+data['msa']+'_na.aln','nucleotide')
        };
        console.log(data['msa']);

        geneId_GV = data['geneId'];
        ann_majority = data['ann'];
        var clusterID=data['msa'];
        updatePresence(geneId_GV,clusterID);
        updateTree(data);
        updateGainLossEvent(geneId_GV,clusterID);

        $('#tree-rotate').bootstrapToggle('off');/**/
        selectElement("dropdown_select",'genePresence');
        removeLegend(); legendOptionValue='';
    }

    //## row-clicking trigger
    $('#'+table_id+' tbody').on('click', 'tr', function (e) {
        //trigger aln_tree when clicked
        var data = datatable.row( $(this) ).data();
        trigger_aln_tree(data, 'aa');
        //highlight when clicked/selected
        $('#'+table_id+' tbody tr').removeClass('row_selected');
        $(this).addClass('row_selected');
    });

    //## aa.aln
    $('#'+table_id+' tbody').on('click', '.btn.btn-info.btn-xs', function (e) {
        var data = datatable.row( $(this).parents('tr') ).data();
        trigger_aln_tree(data, 'aa');
        e.stopPropagation();
    });

    //## nu.aln
    $('#'+table_id+' tbody').on('click', '.btn.btn-primary.btn-xs', function (e) {
        var data = datatable.row( $(this).parents('tr') ).data();
        trigger_aln_tree(data, 'nu');
        //## avoid to activate row clicking
        e.stopPropagation();
    });

};
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

