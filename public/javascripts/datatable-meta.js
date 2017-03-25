import {create_dataTable} from "./datatable-gc";
import {path_datatable_meta} from './data_path';
//#DataTable for meta-info
export const metaDataTable = {
    dataTable2Fun: function (meta_table_id) {

        //# create meta table
        var meta_table_columns= Object.keys(meta_display_set);
        meta_table_columns.unshift('accession');
        create_dataTable('#'+meta_table_id,meta_table_columns);

        //# assign data to each column
        var columnDefs_list=[];
        for (var i = 0; i < meta_table_columns.length; i++) {
            columnDefs_list.push({
                'targets': i,
                'data': meta_table_columns[i]
            });
        }

        var datatable2= $('#'+meta_table_id).DataTable({
                'ajax': path_datatable_meta,
                'responsive': true,
                'search':true,
                'paging':true,
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
