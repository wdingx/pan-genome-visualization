import './third_party/msa-new.js';
var msa=call_msa('msa');

const msaLoad = function (aln_path,scheme_type) {
    var rootDiv = document.getElementById('snippetDiv');
    /* global rootDiv */
    var opts = {
      el: rootDiv,
      importURL: aln_path,
    };

    opts.vis = {conserv: false, overviewbox: false, labelId: false};
    /*opts.zoomer = {alignmentWidth:'auto',alignmentHeight: 250,rowHeight: 18,
                    labelWidth: 100, labelNameLength: 150,
                    labelNameFontsize: '10px',labelIdLength: 20, menuFontsize: '12px',
                    menuMarginLeft: '3px', menuPadding: '3px 4px 3px 4px', menuItemFontsize: '14px', menuItemLineHeight: '14px',
        //boxRectHeight: 2,boxRectWidth: 0.1,overviewboxPaddingTop: 20
    };*/
    opts.colorscheme={scheme: scheme_type}; //{scheme: 'taylor'};//{scheme: 'nucleotide'};
    opts.config={};
    var m =  msa(opts);    //JSON.stringify
    //m.g.on('row:click', function(data){ console.log(data) });
    //m.g.on('column:click', function(data){ console.log(data) });

    /*m.g.on('all',function(name,data){
        var obj = {name: name, data:data};
        //if(inIframe()){ parent.postMessage(obj, "*") }
        parent.postMessage(obj, "*")
    });
    m.g.on("column:click", function(data){
        colorBy = "genotype";
        colorByGenotypePosition([data['rowPos']]);});
    m.g.on("residue:click", function(data)
        {console.log(data);});*/

    var menuOpts = {};
    menuOpts.msa = m;
    var defMenu = new msa.menu.defaultmenu(menuOpts);
    m.addView('menu', defMenu);
};


export default msaLoad;