var pgModule = function(){
    var current = null;
    var labels = {'home':'home'};
    var init = function(){
    };

    function hasOwnProperty(obj, prop){
        return (obj[prop] !== undefined);
    }
    
   /*function hasOwnProperty(obj, prop) {
        var proto = obj.__proto__ || obj.constructor.prototype;
        return (prop in obj) &&
            (!(prop in proto) || proto[prop] !== obj[prop]);
    }*/

    function isEmptyObj(obj) {
        for (var key in obj) { 
            if (obj.hasOwnProperty(key)) { return false; }
        }
        return true;
    }

   return{ hasOwnProperty:hasOwnProperty, isEmptyObj:isEmptyObj }
}();

var pgDashbord = {
    winInnerWidth: window.innerWidth,
};

var pxTree = {
    large_output: true, //if true, use separated pattern instead of entire pattern
    gain_loss_enabled: true,
    id: 5,
    collapsed_node_size: 4.5,
    collapsed_node_fill: '#26B629', //'steelblue',
    collapsed_node_stroke:'steelblue',
    branch_col: '#4A4A4A', 
    branch_col_highlight: '#2D59B1',
    branch_wid_highlight: '3px',
    link_width: '1px',
    link_dasharray: '1px, 0px',
    col_pres: '#005BCC',//'#3A89EA' '#1F69C4' gene presence
    col_abse: '#E01F1F', // '#D82400' '#EA5833'; gene absence
    col_node_stroke:'#fff',
    node_color_mem: {},
    link_color_mem: {}, 
    link_width_mem: {}, 
    link_dash_mem: {},
    wid_link: '1.2px',
    wid_gloss: '3px',//gain loss highlight
};
var treeSwitch= {
    layout_vertical: 'false',
};

var backup_var= {
stroke: '#999',
'stroke-opacity': .6,
color_node_stroke:'steelblue',
color_node_fill:'white',
}