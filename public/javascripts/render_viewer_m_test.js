/** strain_tree processing */
render_tree(0, "mytree1", coreTree_path, clusterID=null, null);

/** tree rotate listener */
rotate_monitor('tree_rotate_01','mytree2');

/** create metadata dropdown list */
creat_dropdown("#dropdown_list",'mytree1','mytree2','coreTree_legend',null);

/** render interactive charts and datatables */
render_chart_table.initData(path_datatable1,'dc_data_table', 'GC_tablecol_select',
    'dc_data_count','dc_straincount_chart','dc_geneLength_chart','dc_coreAcc_piechart',
    'changeCoreThreshold','coreThreshold',
    'mytree1','mytree2', null);
