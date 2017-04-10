import {discrete_color_set, continuous_color_set} from "./colors";

export const panXTree = {
    /**if true, use separated pattern instead of entire pattern */
    currentClusterID: '',
    currentGeneTree: {},
    speciesTree: {},
    large_output: false,
    gain_loss_enabled: true,
    collapsed_node_size: 4.5,
    collapsed_node_fill: '#26B629', //'steelblue',
    collapsed_node_stroke:'steelblue',
    branch_col: '#4A4A4A',
    branch_col_highlight: '#2D59B1',
    branch_wid_highlight: '3px',
    link_width: '1px',
    link_dasharray: '1px, 0px',
    genePresentFill: '#3A89EA',//'#3A89EA' '#1F69C4' gene presence
    geneAbsentFill: '#CCC', // '#D82400' '#EA5833'; gene absence
    genePresentR: 4, // tip radius
    geneAbsentR:  3,
    strokeToFill: 0.4,  //brightness difference between stroke and fill
    node_metaunknown_stroke:'#FFFFFF',
    wid_link: '1.2px',
    wid_gloss: '3px',//gain loss highlight
    genePattern_tool1: {
        node_color_mem: {}, link_color_mem: {},
        link_width_mem: {}, link_dash_mem:  {}
    },
    genePattern_tool2: {
        node_color_mem: {}, link_color_mem: {},
        link_width_mem: {}, link_dash_mem:  {}
    },
    treeStyle_tool1: {
        node_color_mem: {}, link_color_mem: {},
        link_width_mem: {}, link_dash_mem:  {}
    },
    treeStyle_tool2: {
        node_color_mem: {}, link_color_mem: {},
        link_width_mem: {}, link_dash_mem:  {}
    },
    legend_width:100,
    legend_height:380
};


export const panXDashboard = {
    winInnerWidth: window.innerWidth,
};

export const metaLegend = {
    discrete_colorSet: discrete_color_set,
    continuous_colorSet: continuous_color_set
}

export const tableAccessories = {
    meta_table_unselect: "meta_table_unselect"
};

export const msaViewerAsset = {
    selected_rows_set: new Set()
};