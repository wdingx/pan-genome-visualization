import $ from 'jquery';
window.$ = $;
window.jQuery = $;
import DataTable from 'datatables.net';
import './third_party/table_plugin/dataTables.bootstrap.min.js';
require('datatables.net-colreorder');
require("bootstrap");
/*bootstrap-toggle for switch button*/
require('bootstrap-toggle');
/*import multiselect from "bootstrap-multiselect";*/
var multiselect = require('bootstrap-multiselect');
$.multiselect = multiselect;

//## dc_DataTables configuration <div style="display:inline-block" ></div>
var table_columns= [
    {'defaultContent': '<button type="button" class="btn btn-info btn-xs" data-toggle="tooltip"  data-placement="bottom"  title="amino acid alignment" >aa </button> <button type="button" class="btn btn-primary btn-xs" data-toggle="tooltip"  data-placement="bottom"  title="nucleotide alignment" >na </button> ',  'header':'Alignment','tooltip':'multiple sequence alignment'},
    {'defaultContent': '','data':null, 'className': 'geneName-details-control', 'orderable': false,  'header':''},//geneName expand
    {'data':'GName',  'header':'Name','tooltip':'gene name'},//geneName
    {'defaultContent': '','data':null, 'className': 'ann-details-control', 'orderable': false,  'header':''},//annotation expand
    {'data':'ann',  'header':'Annotation','tooltip':'gene annotation'},//annotation    //'width':10,
    {'data':'count',  'header':'#Strain','tooltip':'strain count'},//count
    {'defaultContent': '','data':null, 'className': 'dup-details-control', 'orderable': false,  'header':''},//duplication expand
    {'data':'dupli',  'header':'Duplicated','tooltip':'whether duplicated and duplication count in each strain'},//duplication
    {'data':'event',  'header':'Events','tooltip':'gene gain/loss events count'},
    {'data':'divers',  'header':'Diversity','tooltip':'gene diversity'},
    {'data':'geneLen',  'header':'Length','tooltip':'average gene length'},
    {'data':'geneId','visible': false,  'header':'','tooltip':''},
    {'data':'allAnn','visible': false,  'header':'','tooltip':''},
    {'data':'allGName','visible': false,  'header':'','tooltip':''},
    {'defaultContent': '','data':'locus','visible': false,  'header':'','tooltip':''}
    //{'data':'msa','visible': false}
];

//** column header title for display
export var geneCluster_table_columns=[];
//** column title tooltip
export const clusterTable_tooltip_dict= {};
var header, column_data;
for (let i=0, len=table_columns.length ; i<len; i++) {
    column_data= table_columns[i];
    header=column_data['header'];
    //** header for display
    geneCluster_table_columns.push(header);
    //** header tooltip
    if (header.length!=0){
        clusterTable_tooltip_dict[header]=column_data['tooltip']
    }
}

//** if new_column_config.js is given, add new column to the cluster table
//** insert the column after insertion_position (insertion_pos)
//** e.g.: col_header:'PAO1'
var insertion_index, new_column_header, new_column_data;
if (typeof new_columns_config!= "undefined"){
    for (let new_column_config of new_columns_config) {
        new_column_header=new_column_config.col_header;
        new_column_data=new_column_config.new_col;
        insertion_index= geneCluster_table_columns.indexOf(new_column_config.insertion_pos)+1;
        //** insert new header and related tooltip
        geneCluster_table_columns.splice(insertion_index, 0, new_column_header);
        clusterTable_tooltip_dict[new_column_header]=new_column_data['tooltip']
        //** insert data linked with new header for datatable initialization (column_config)
        table_columns.splice(insertion_index, 0, new_column_data);
    }
}

//** prepare column configuration for cluster datatable
var column_data, column_config=[];
for (let i=0, len=table_columns.length ; i<len; i++) {
    column_data= table_columns[i];
    //** push index in targets
    column_data['targets']=i;
    column_config.push(column_data); //width:60,
}

//** column descend/ascend sorting order
const column_desc= '#Strain',
      column_asc= 'Name',
      column_desc_index= geneCluster_table_columns.indexOf(column_desc),
      column_asc_index= geneCluster_table_columns.indexOf(column_asc);
//const table_sort_order= [[, 'desc' ],[8, 'asc' ]];
//console.log(column_desc_index,column_asc_index)
const table_sort_order= [[column_desc_index, 'desc' ],[column_asc_index, 'asc' ]];

//** button for showing/hiding columns in table
//## pay attention to GC table column order
//export const GC_table_dropdown_columns=['multiple sequence alignment','geneName','annotation','#strain','duplicated', 'gene gain/loss events','diversity','gene length'];
export const GC_table_dropdown_columns= geneCluster_table_columns.filter(function(n){ return n != '' });

//** create GC table HTML structure
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

//** creat multiselect dropdown for dataTables
export const create_multiselect = function (div, columns_set) {
    var select_panel = d3.select(div);

    for (var i = 0; i < columns_set.length; i++) {
        select_panel.append("option")
            .attr("value", columns_set[i])
            .attr("selected", "selected")
            .text(columns_set[i]);
    }
};

//** column configuration for datatables
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
        'columnDefs': column_config,//dc_dataTable_columnDefs_config,
        // order by count (desc) and geneId (asc)
        "order": table_sort_order
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