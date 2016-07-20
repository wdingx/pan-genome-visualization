var winInnerWidth = window.innerWidth;
var init_core_threshold=0.99;
//## tree style tmp
var node_color_tmp={},
    link_color_tmp={}, 
    link_width_tmp={}, 
    link_dasharray_tmp={},
    Initial_MsaGV='';
var geneId_GV='';
var ann_majority= '';

//## core_genome threshold slider
var tooltipSlider = document.getElementById('changeCoreThreshold');
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

}
creat_dropdown_menu('#species-selector', species_dt)

//## dc_DataTables configuration
var dc_dataTable_columnDefs_config=[ 
    {'targets': 0,'defaultContent': '<button type="button" class="btn btn-info btn-xs" >aa </button>'},
    {'targets': 1,'defaultContent': '<button type="button" class="btn btn-primary btn-xs" >nuc</button>'},
    {'targets': 2,'data':'count'},
    {'targets': 3,'defaultContent': '','data':null, 'className': 'dup-details-control', 'orderable': false},
    {'targets': 4,'data':'dupli'},
    {'targets': 5,'data':'divers'},
    {'targets': 6,'data':'geneLen'},
    {'targets': 7,'defaultContent': '','data':null, 'className': 'ann-details-control', 'orderable': false},
    {'targets': 8,'data':'ann'},
    {'targets': 9,'data':'geneId','visible': false},
    {'targets': 10,'data':'allAnn','visible': false},
    {'targets': 11,'defaultContent': '','data':'locus','visible': false}
];

var creat_dataTable = function (div, columns_set) {
    var datatable = d3.select(div);
    var thead = datatable.append("thead")
        .attr("align", "left");

    thead.append("tr")
        .selectAll("th")
        .data( columns_set )
        .enter()
        .append("th")
        .text(function(d) { return d; });
}

//## create GC table 
var geneCluster_table_columns=['msa','msa','count','','duplicated','diversity','geneLen','','annotation','Id','allAnn','locus']
creat_dataTable("#dc-data-table",geneCluster_table_columns);

//## create meta table
var meta_table_columns= Object.keys(meta_display_set);
meta_table_columns.unshift('accession');
creat_dataTable("#dc-data-table2",meta_table_columns);

//## update gene presence/absence pattern
function updatePresence(geneIndex) {
    var svg=d3.select('#mytree1');
    var node = svg.selectAll('circle')
    var link = svg.selectAll('path.tnt_tree_link')
    var text = svg_all.selectAll("text")
    node.style('fill', function(d) {
        if ( (d.name.indexOf('NODE_')!=0) && (d.name!='')) {
            if (d.genePresence[parseInt(geneIndex)-1]=='1') {
            //console.log(d.genePresence[geneIndex]);
                node_color_tmp[d.name]='blue';
                return 'blue';
            }
            else {
                node_color_tmp[d.name]='red';
                return 'red';
            }
        }
    });

    link.style("stroke", function(d){ 
        if (  (d.target.name.indexOf('NODE_')!=0) && d.target.name!='') { 
            return node_color_tmp[d.target.name]; 
        }
        else {
            return 'gray';
        }
    });

    text.style("fill", function(d) {
        if (d!==undefined && d.name!='' ) {
            return node_color_tmp[d.name];
        }
    });
};

//## update gene gain/loss pattern
function updateGainLossEvent(geneIndex) {
    var geneEvent_arr=genePresence_Dt[geneIndex];        
    var svg=d3.select('#mytree1');
    var link = svg.selectAll('path.tnt_tree_link')
    link
        .style("stroke-width",'1px')
        .style("stroke-dasharray", 'none');
    for (var ind in geneEvent_arr) {
        var tmp_event=geneEvent_arr[ind] // ["NODE_0000035", "1-0"]
        var strainName_geneEvent = tmp_event[0]
        var event_type=tmp_event[1]
        //console.log(strainName_geneEvent,event_type)         

        var selected = link.filter(function (d, i) {
            if (d.target.name == strainName_geneEvent){
                return d.target
            }
        });

        selected
        .style("stroke", function () {
            if (event_type=='1-0') {return "red"}
            else if (event_type=='0-0') {return "red"}
            else if (event_type=='0-1') {return "blue"}
            else if (event_type=='1-1') {return "blue"}
            }) 
        .style("stroke-width", function () {
            if (event_type=='1-0') {return '3px'}
            else if (event_type=='0-0') {return '1px'}
            else if (event_type=='0-1') {return '3px'}
            else if (event_type=='1-1') {return '1px'}
            })
        .style("stroke-dasharray", function(d) {
            if (event_type=='1-0'){ return (d.source.parent) ? "6,6" : "1,0"; }
            else if (event_type=='0-0') {return 'none' }
            else if (event_type=='0-1') {return 'none' }
            else if (event_type=='1-1') {return 'none' }
            });
    }
};

//## create charts and load geneCluster dataTable 
var chartExample = {
    initChart: function (data) {

        var lineChart = dc.lineChart('#dc-straincount-chart')
                        .xAxisLabel('gene')
                        .yAxisLabel('strain count');
        var geneLengthBarChart = dc.barChart('#dc-geneLength-chart')
                        .yAxisLabel('gene count')
                        .xAxisLabel('gene length');
        var coreYesNoPieChart = dc.pieChart('#dc-coreAcc-piechart');
        
        //# Create Crossfilter Dimensions and Groups
        var ndx = crossfilter(data);
        var all = ndx.groupAll();

        // count all the genes
        dc.dataCount('#dc-data-count')
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
            var coreThreshold=document.getElementById('coreThreshold').value;
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
            .width(winInnerWidth/4.5).height(150) //4.5
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
            .width(winInnerWidth/4.5).height(150) //winInnerWidth/3.5
            //.margins({top: 10, right: 10, bottom: 20, left: 40})
            .dimension(geneLengthValue)
            .group(geneLengthGroup)
            .transitionDuration(500)
            .centerBar(true)  
            .gap(1) // bar width Keep increasing to get right then back off.
            .x(d3.scale.linear().domain([0, geneLengthMax]))
            //.x(d3.scale.linear().clamp(true).domain([0, 5000])) 
            .elasticY(true)
            .mouseZoomable(true)
            .renderHorizontalGridLines(true)
            //.brushOn(false)
            .xAxis().tickFormat(function(v) {return v;}).ticks(5);

        coreYesNoPieChart
            .width(winInnerWidth/8)//.width(120)
            .height(120)//150
            .radius(60)
            .innerRadius(12.5)
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
        var coreThresholdField = document.getElementById("coreThreshold");
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
        var nasdaqCount = dc.dataCount('.dc-data-count');
        nasdaqCount
            .dimension(ndx)
            .group(all)
            // (_optional_) `.html` sets different html when some records or all records are selected.
            // `.html` replaces everything in the anchor with the html given using the following function.
            // `%filter-count` and `%total-count` are replaced with the values obtained.
            .html({
                some: '<strong>%filter-count</strong> genes selected from <strong>%total-count</strong> total genes' +
                    ' | <a href="javascript:dc.filterAll(); dc.renderAll();"">Reset All</a>',
                all: 'All records selected. Please click on the graph to apply filters.'
            });

        //## datatable configuration
        datatable = $('#dc-data-table').DataTable({         
            responsive: true,
            //buttons: [ 'copyHtml5','excelHtml5','csvHtml5','pdfHtml5'],//
            'search': true,
            'paging': true,
            //'pagingType': 'full_numbers',
            'scrollX': true,
            'scrollY': '200px',//'30vh',
            'bAutoWidth': true,
            'bDeferRender': true,
            'aaData': geneCountDimension.top(Infinity),
            //'bDestroy': true,
            /*"processing": true,
            "serverSide": true,*/
            'columnDefs': dc_dataTable_columnDefs_config,
            // order by count (desc) and geneId (asc)
            "order": [[2, 'desc' ],[9, 'asc' ]]
        });

        var tableTools = new $.fn.dataTable.TableTools( datatable, {
            sRowSelect: "os",
            aButtons: []
        } );

        $( tableTools.fnContainer() ).insertBefore('div.dataTables_wrapper');

        // display sequence alignment
        clickShowMsa(datatable);

        function RefreshTable() {
            dc.events.trigger(function () {
                alldata = geneCountDimension.top(Infinity);
                $('#dc-data-table').dataTable().fnClearTable();
                $('#dc-data-table').dataTable().fnAddData(alldata);
                $('#dc-data-table').dataTable().fnDraw();
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
    initData: function () {
        //## load the data, charts and MSA 
        d3.json(path_datatable1, function(error, data) {
            Initial_MsaGV=data[0].msa; //console.log(Initial_MsaGV)
            geneId_GV=data[0].geneId;
            ann_majority=data[0].ann;
            chartExample.initChart(data);
            msaLoad(aln_file_path+Initial_MsaGV,'taylor'); //msaLoad(aln_file_path+speciesAbbr+'-SNP_whole_matrix.aln');
            render ( 'mytree2',aln_file_path+Initial_MsaGV.split('.')[0]+'.tree.json',svg2);

        })
    }
};
chartExample.initData();

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

//## load genePresence data
var genePresence_Dt = {}; 
d3.json('./dataset/'+speciesAbbr+'-genePresence.json', function(error, data) {
    for ( var id_data in data ) {
        genePresence_Dt[id_data]=data[id_data];
    }
});

function clickShowMsa (datatable) {
    // unfold and fold annotation column
    $('#dc-data-table tbody').on('click', 'td.ann-details-control', function () {
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
    });  

    // unfold and fold duplication column
    $('#dc-data-table tbody').on('click', 'td.dup-details-control', function () {
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
    } );

    function updateTree(data) {
        var svg2=d3.select('#mytree2');
        svg2.selectAll("*")
            .remove();
        svg2 = d3.select('#mytree2')
        render ('mytree2',aln_file_path+data['msa'].split('.')[0]+'.tree.json',svg2);
    };


    //## update the selection in dropdown list
    function selectElement(div_id,valueToSelect) {    
        var element = document.getElementById(div_id);
        element.value = valueToSelect;
    }
    
    //## nu.aln
    $('#dc-data-table tbody').on('click', '.btn.btn-primary.btn-xs', function () {
        var data = datatable.row( $(this).parents('tr') ).data();
        console.log(data['msa']);
        msaLoad(aln_file_path+data['msa'].split('.aa')[0]+'.nu.aln','nucleotide');
        ann_majority = data['ann'];
        updateTree(data);
        updatePresence(data['geneId']);
        updateGainLossEvent(data['geneId']);
        $('#tree-rotate').bootstrapToggle('off');
        selectElement("dropdown_select",'genePresence');
        removeLegend(); legendOptionValue='';
        
    } );

    //## aa.aln
    $('#dc-data-table tbody').on('click', '.btn.btn-info.btn-xs', function () {
        var data = datatable.row( $(this).parents('tr') ).data();
        console.log(data['msa']);
        msaLoad(aln_file_path+data['msa'],'taylor');
        ann_majority = data['ann'];
        updateTree(data);
        geneId_GV = data['geneId']
        updatePresence(data['geneId']);
        updateGainLossEvent(data['geneId']);
        $('#tree-rotate').bootstrapToggle('off');
        selectElement("dropdown_select",'genePresence');
        removeLegend(); legendOptionValue='';

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
    opts.zoomer = {alignmentWidth:'auto',alignmentHeight: 250,rowHeight: 18, labelWidth: 100, labelNameLength: 150,
                   labelNameFontsize: '10px',labelIdLength: 20, menuFontsize: '12px',
                   menuMarginLeft: '3px', menuPadding: '3px 4px 3px 4px', menuItemFontsize: '14px', menuItemLineHeight: '14px',
        //boxRectHeight: 2,boxRectWidth: 0.1,overviewboxPaddingTop: 20
    };
    opts.colorscheme={scheme: scheme_type} //{scheme: 'taylor'};//{scheme: 'nucleotide'};
    opts.config={}
    var m =  msa(opts);    //JSON.stringify
    m.g.on('row:click', function(data){ console.log(data) });
    m.g.on('column:click', function(data){ console.log(data) });

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

//#DataTable for meta-info
var chartExample2 = {
    dataTable2Fun: function () {
        
        var columnDefs_list=[];
        for (i = 0; i < meta_table_columns.length; i++) { 
            columnDefs_list.push({
                'targets': i,
                'data': meta_table_columns[i]      
            });
        }

        datatable2= $('#dc-data-table2').DataTable({
                'ajax': path_datatable2,
                'responsive': true,
                'search':true,
                'paging':true,
                //'autoFill': {focus: 'click'},
                //'pagingType': 'full_numbers',
                //'bSort': true,
                'scrollX': true,
                'scrollY': '200px',//'30vh',
                'bAutoWidth': true,
                'bDeferRender': true,
                //'aaData':  geneCountDimension.top(Infinity),
                //'bDestroy': true, 
                'columnDefs': columnDefs_list
            });
    }
};
chartExample2.dataTable2Fun();/**/

var tableTools = new $.fn.dataTable.TableTools( datatable2, {
    sRowSelect: "os",
    aButtons: []
} );

$( tableTools.fnContainer() ).insertBefore('div.dataTables_wrapper');