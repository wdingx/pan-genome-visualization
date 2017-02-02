//# create meta table
var meta_table_columns= Object.keys(meta_display_set);
meta_table_columns.unshift('accession');
creat_dataTable("#dc-data-table2",meta_table_columns);

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
chartExample2.dataTable2Fun();
