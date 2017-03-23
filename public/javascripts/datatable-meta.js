//# create meta table
var meta_table_id='dc_data_table_meta'
var meta_table_columns= Object.keys(meta_display_set);
meta_table_columns.unshift('accession');
creat_dataTable('#'+meta_table_id,meta_table_columns);

//#DataTable for meta-info
var chartExample2 = {
    dataTable2Fun: function (meta_table_id) {

        var columnDefs_list=[];
        for (i = 0; i < meta_table_columns.length; i++) {
            columnDefs_list.push({
                'targets': i,
                'data': meta_table_columns[i]
            });
        }

        datatable2= $('#'+meta_table_id).DataTable({
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
chartExample2.dataTable2Fun(meta_table_id);
