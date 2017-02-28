/** strain_tree processing */
render_tree(0, "mytree1", coreTree_path, clusterID=null, 0);
render_tree(0, "compare_tree1", coreTree_path_B, clusterID=null, 1);

/** tree rotate listener */
rotate_monitor('tree_rotate_01','mytree2');
rotate_monitor('tree_rotate_02','compare_tree2');

/** create metadata dropdown list */
creat_dropdown("#dropdown_list_01",'mytree1','mytree2',0);
creat_dropdown("#dropdown_list_02",'compare_tree1','compare_tree2',1);

/** render interactive charts and datatables */
render_chart_table.initData(path_datatable1,'dc_data_table1', 'GC_tablecol_select',
    'dc_data_count','dc_straincount_chart','dc_geneLength_chart','dc_coreAcc_piechart',
    'changeCoreThreshold','coreThreshold',
    'mytree1','mytree2', 0);
render_chart_table.initData(path_datatable11,'dc_data_table2', 'GC_tablecol_select2',
    'dc_data_count2','dc_straincount_chart2','dc_geneLength_chart2','dc_coreAcc_piechart2',
    'changeCoreThreshold2','coreThreshold2',
    'compare_tree1','compare_tree2',1);