import $ from 'jquery';
window.$ = $;
window.jQuery = $;
import DataTable from 'datatables.net';
import './third_party/table_plugin/dataTables.bootstrap.min.js';
require("bootstrap");
/*bootstrap-toggle for switch button*/
require('bootstrap-toggle');
/*import multiselect from "bootstrap-multiselect";*/
var multiselect = require('bootstrap-multiselect');
$.multiselect = multiselect;

//## dc_DataTables configuration
export const dc_dataTable_columnDefs_config=[
    {'targets': 0,'defaultContent': '<button type="button" class="btn btn-info btn-xs" data-toggle="tooltip"  data-placement="bottom"  title="amino acid alignment" >aa </button>'},
    {'targets': 1,'defaultContent': '<button type="button" class="btn btn-primary btn-xs" data-toggle="tooltip"  data-placement="bottom"  title="nucleotide alignment" >na </button>'},
    {'targets': 2,'data':'count'},
    {'targets': 3,'defaultContent': '','data':null, 'className': 'dup-details-control', 'orderable': false},
    {'targets': 4,'data':'dupli'},
    {'targets': 5,'data':'event'},
    {'targets': 6,'data':'divers'},
    {'targets': 7,'data':'geneLen'},
    {'targets': 8,'defaultContent': '','data':null, 'className': 'geneName-details-control', 'orderable': false},
    {'targets': 9,'data':'GName'},
    {'targets': 10,'defaultContent': '','data':null, 'className': 'ann-details-control', 'orderable': false},
    {'targets': 11,'data':'ann'},
    {'targets': 12,'data':'geneId','visible': false},
    {'targets': 13,'data':'allAnn','visible': false},
    {'targets': 14,'data':'allGName','visible': false},
    {'targets': 15,'defaultContent': '','data':'locus','visible': false},
    {'targets': 16,'data':'msa','visible': false}

];


export const create_dataTable = function (div, columns_set) {
    var datatable_div = d3.select(div);
    var thead = datatable_div.append("thead")
        .attr("align", "left");

    thead.append("tr")
        .selectAll("th")
        .data( columns_set )
        .enter()
        .append("th")
        .text(function(d) { return d.charAt(0).toUpperCase()+ d.slice(1); });
};


//# create GC table
export const geneCluster_table_columns=['MSA','MSA','#Strain','','Duplicated','Events','Diversity','Length','','Name','','Annotation','Id','allAnn','allGName','locus']

export const clusterTable_tooltip_dict= {
    'MSA':'multiple sequence alignment','MSA':'multiple sequence alignment',
    '#Strain':'strain count','Duplicated':'whether duplicated and duplication count in each strain',
    'Diversity':'gene diversity', 'Events':'gene gain/loss events count',
    'Length':'average gene length', 'Name':'gene name','Annotation':'gene annotation'}

//## pay attention to GC table column order
export const GC_table_dropdown_columns=['amino_acid aln','nucleotide aln','#strain','duplicated', 'gene gain/loss events','diversity','gene length','geneName','annotation'];

//## creat multiselect dropdown for dataTables
export const create_multiselect = function (div, columns_set) {
    var select_panel = d3.select(div);

    for (var i = 0; i < columns_set.length; i++) {
        select_panel.append("option")
            .attr("value", columns_set[i])
            .attr("selected", "selected")
            .text(columns_set[i]);
    }
};


export const datatable_configuration = function(table_input, table_id, col_select_id) {
    "use strict";
    //GC_tablecol_select
    //## datatable configuration
    var datatable = $('#'+table_id).DataTable({
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

    // disable warning
    $.fn.dataTable.ext.errMode = 'none';
    if (1) {
        $('#'+table_id).on('error.dt', function(e, settings, techNote, message) { console.log(message); });
    }

    //# append multiselect button to gene cluster datatable
    $('<span style="display:inline-block; width: 10px;"></span>').appendTo('div#'+table_id+'_length.dataTables_length');
    $('<select id="'+col_select_id+'" multiple="multiple" ></select>').appendTo('div#'+table_id+'_length.dataTables_length');

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

    create_multiselect('#'+col_select_id,GC_table_dropdown_columns);
    $('#'+col_select_id).multiselect({
        //enableFiltering: true,
        onChange: function(element, checked) {
            //console.log(col_select_id,datatable,element,checked);
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

    return datatable;
};