// ## tooltip 
var tips_node = d3.tip().attr('class', 'd3-tip').html(function(d) { 
    
    string = "";
    // safe to assume the following attributes
    if (typeof d.name != "undefined") {
        string += "NCBI accesion:  " + d.name;
    }

    for (i = 0; i < meta_types.length; i++) {
        var meta_category = meta_types[i];
        if (typeof d[meta_category] != "undefined") {
            string += "<br/>" + meta_category + ":  " + d[meta_category];
        }
    }

    if (typeof d.ann != "undefined") {
        string += "<br/>" + "annotation:  " + d.ann;
        }
    if (typeof d.muts != "undefined") {
        var muts_str=d.muts
        if (muts_str.length>50) { muts_str=muts_str.substr(0,50)+'...'}
        string += "<br/>" + "nucleotide mutations:  " + muts_str
        }
    if (typeof d.aa_muts != "undefined") {
        var aa_muts_str=d.aa_muts
        if (aa_muts_str.length>50) { aa_muts_str=aa_muts_str.substr(0,50)+'...'}        
        string += "<br/>" + "amino acid mutations:  " + aa_muts_str;
        }     
    string += "<div class=\"smallspacer\"></div>";

    return string; 
});

var tips_link = d3.tip().attr('class', 'd3-tip').html(function(d) { 
    
    string = "";
    if (typeof d.target.muts != "undefined") {
        var muts_str=d.target.muts
        if (muts_str.length>50) { muts_str=muts_str.substr(0,50)+'...'}
        string += "<br/>" + "nucleotide mutations:  " + muts_str
        }
    if (typeof d.target.aa_muts != "undefined") {
        var aa_muts_str=d.target.aa_muts
        if (aa_muts_str.length>50) { aa_muts_str=aa_muts_str.substr(0,50)+'...'}        
        string += "<br/>" + "amino acid mutations:  " + aa_muts_str;
        } 
    if (typeof d.target.ann != "undefined") {
        string += "<br/>" + "annotation:  " + d.target.ann;
        } 
    string += "<div class=\"smallspacer\"></div>";

    return string; 
});