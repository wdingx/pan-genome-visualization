function csprint(data) { console.log(data)};

//## dc_DataTables configuration
var dc_dataTable_columnDefs_config=[ 
    {'targets': 0,'defaultContent': '<button type="button" class="btn btn-info btn-xs" data-toggle="tooltip"  data-placement="bottom"  title="amino acid alignment" >aa </button>'},
    {'targets': 1,'defaultContent': '<button type="button" class="btn btn-primary btn-xs" data-toggle="tooltip"  data-placement="bottom"  title="nucleotide alignment" >na </button>'},
    {'targets': 2,'data':'count'},
    {'targets': 3,'defaultContent': '','data':null, 'className': 'dup-details-control', 'orderable': false},
    {'targets': 4,'data':'dupli'},
    {'targets': 5,'data':'divers'},
    {'targets': 6,'data':'event'},
    {'targets': 7,'data':'geneLen'},
    {'targets': 8,'defaultContent': '','data':null, 'className': 'geneName-details-control', 'orderable': false},
    {'targets': 9,'data':'GName'},     
    {'targets': 10,'defaultContent': '','data':null, 'className': 'ann-details-control', 'orderable': false},
    {'targets': 11,'data':'ann'},
    {'targets': 12,'data':'geneId','visible': false},
    {'targets': 13,'data':'allAnn','visible': false},
    {'targets': 14,'data':'allGName','visible': false},    
    {'targets': 15,'defaultContent': '','data':'locus','visible': false}
];


var creat_dataTable = function (div, columns_set, tooltip_dict) {
    var datatable = d3.select(div);
    var thead = datatable.append("thead")
        .attr("align", "left");

    thead.append("tr")
        .selectAll("th")
        .data( columns_set )
        .enter()
        .append("th")
        .text(function(d) { return d; });
};


//# create GC table 
var geneCluster_table_columns=['msa','msa','#strain','','duplicated','diversity','events','geneLen','','geneName','','annotation','Id','allAnn','allGName','locus']

var tooltip_dict= {'msa':'multiple sequence alignment','msa':'multiple sequence alignment',
    '#strain':'strain count','duplicated':'whether duplicated and duplication count in each strain',
    'diversity':'gene diversity', 'events':'gene gain/loss events count',
    'geneLen':'average gene length', 'geneName':'gene name','annotation':'gene annotation'}
creat_dataTable("#dc-data-table",geneCluster_table_columns,tooltip_dict);

//## datatables header tooltip
var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    //.style("z-index", "10")
    .style("color", "white")
    .style("padding","5px")
    .style("border-radius","2px")
    .style("visibility", "hidden")
    .style("background", "rgba(0,0,0,0.5)"); //255,255,255

d3.selectAll("#dc-data-table tr th")
    .on("mouseover", function(d){
        tooltip.text(tooltip_dict[d]);
        if (tooltip.text()!="") {
            return tooltip.style("visibility", "visible");
        }
    })
    .on("mousemove", function(){
        return tooltip.style("top", (event.pageY-40)+"px").style("left",(event.pageX+10)+"px");
    })
    .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
    })

//## pay attention to GC table column order
var GC_table_dropdown_columns=['amino_acid aln','nucleotide aln','#strain','duplicated','diversity', 'gene gain/loss events','gene length','geneName','annotation'];

//## creat multiselect dropdown for dataTables
var creat_multiselect = function (div, columns_set) {
    var select_panel = d3.select(div);

    for (i = 0; i < columns_set.length; i++) {
        select_panel.append("option")
            .attr("value", columns_set[i])
            .attr("selected", "selected")
            .text(columns_set[i]);
    }
};

// disable warning
$.fn.dataTable.ext.errMode = 'none';
if (1) {
    $('#dc-data-table').on('error.dt', function(e, settings, techNote, message) { console.log(message); });
}



function datatable_configuration(table_input) {
    //## datatable configuration
    datatable = $('#dc-data-table').DataTable({
        responsive: true,
        //dom: 'Bfrtip',
        //buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
        'paging': true,
        //'pagingType': 'full_numbers',
        'scrollX': true,
        'scrollY': '200px',//'30vh',
        //'scrollCollapse': true,
        colReorder: true,
        'bAutoWidth': true,
        //'bDeferRender': true,
        'deferRender':    true,
        'aaData': table_input,
        //'bDestroy': true,
        /*"processing": true, "serverSide": true,*/
        'columnDefs': dc_dataTable_columnDefs_config,
        // order by count (desc) and geneId (asc)
        "order": [[2, 'desc' ],[9, 'asc' ]]
    });

    $('<span style="display:inline-block; width: 10px;"></span>').appendTo('div#dc-data-table_length.dataTables_length');
    $('<select id="GC_tablecol_select" multiple="multiple" ></select>').appendTo('div#dc-data-table_length.dataTables_length');

    //## empty and non-empty indexes
    function get_all_Indexes(array) {
        var non_empty_indexes = []; var empty_indexes = []; 
        var dropdown_table_col = []; var i;
        for(i = 0; i < array.length; i++) {
            if (array[i] === '') {empty_indexes.push(i);}
            else { non_empty_indexes.push(i) }
        }
        return [non_empty_indexes, empty_indexes];
    }

    var indexes_list= get_all_Indexes(geneCluster_table_columns, '');
    var non_empty_index_list= indexes_list[0]; 
    var empty_inde_list = indexes_list[1]; 

    creat_multiselect("#GC_tablecol_select",GC_table_dropdown_columns);
    $('#GC_tablecol_select').multiselect({
        //enableFiltering: true,
        onChange: function(element, checked) {

            function element_included (arr, number) {
                return (arr.indexOf(number) != -1)
            }
            var col_index = GC_table_dropdown_columns.indexOf(element.val());
            var original_col_index = non_empty_index_list[col_index];

            if (checked === true) {
                if ( element_included(empty_inde_list,original_col_index-1)==true ) {
                    var column_expand = datatable.column( original_col_index-1 );
                    column_expand.visible( ! column_expand.visible() );}
                var column_normal = datatable.column( original_col_index );
                column_normal.visible( ! column_normal.visible() );
            }
            else if (checked === false) {
                if ( element_included(empty_inde_list,original_col_index-1)==true ) {
                    var column_expand = datatable.column( original_col_index-1 );
                    column_expand.visible( ! column_expand.visible() );}
                var column_normal = datatable.column( original_col_index );
                column_normal.visible( ! column_normal.visible() ); 

            }
        }  
    });
}