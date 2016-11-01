// ## tooltip
var antibiotics_set = ["amikacin","tigecycline","cefepime" ,"doxycycline","nitrofurantoin","cefoxitin","ampicillin","cefotaxime","ciprofloxacin","imipenem","levofloxacin","ampicillin/sulbactam","trimethoprim/sulfamethoxazole","cephalothin","ertapenem","tetracycline","piperacillin/tazobactam","minocycline","cefazolin","ceftazidime","gentamicin","meropenem"];

var tips_node = d3.tip().attr('class', 'd3-tip').html(function(d) { 
    
    string = "";
    // safe to assume the following attributes
    if (typeof d.name != "undefined") {
        string += "NCBI accesion:  " + d.name;
    }

    for (i = 0; i < meta_types.length; i++) {
        //console.log(meta_types);
        var meta_category = meta_types[i];
        if (antibiotics_set !== undefined) {
            if (antibiotics_set.indexOf(meta_category) >= 0) {
                //pass
            } else {
                if (typeof d[meta_category] != "undefined") {
                    string += "<br/>" + meta_category + ":  " + d[meta_category];
                }  
            }
        }
        else {
            if (typeof d[meta_category] != "undefined") {
                string += "<br/>" + meta_category + ":  " + d[meta_category];
            }
        }
    }

    string +="<br/><br/> <table> "

    for (i = 0; i < antibiotics_set.length; i++) {
        if (d[antibiotics_set[i]]!='unknown' && d[antibiotics_set[i]]!='Susceptible' && typeof d[antibiotics_set[i]] != "undefined" ) {
            //console.log(d[antibiotics_set[i]])
            string +=" <tr> <th>"+antibiotics_set[i]+"</th> <td>"+d[antibiotics_set[i]]+"</td> </tr> "
        } 
    }

    string +="</table>"    

    if (typeof d.ann != "undefined") {
        string += "<br/>" + "annotation:  " + d.ann;
        }
    /*if (typeof d.antibiotics_count!="undefined") {
        
    }*/
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

//## add download button
//# core tree download
$('<a href="/download/dataset/'+speciesAbbr+'/coreGenomeTree.json"><i class="fa fa-arrow-circle-o-down fa-5" aria-hidden="true"></i></a>').appendTo('div#download-coreTree');
//#treeJsonPath.split('/').pop().replace(/_tree.json/, "")
//$('<a href="/download/dataset/'+speciesAbbr+'/geneCluster/'+treeJsonPath.split('/').pop()+'"><i class="fa fa-arrow-circle-o-down fa-5" aria-hidden="true"></i></a>').appendTo('div#download-geneTree');

//console.log(treeJsonPath.split('/').pop());
//console.log(aln_file_path+Initial_MsaGV.split('_aa')[0]+'_tree.json');
//console.log(Initial_MsaGV,1,geneId_GV,2,geneclusterID_GV)
//$('<a href="/download/dataset/'+speciesAbbr+'/geneCluster/'+Initial_MsaGV+'"><i class="fa fa-arrow-circle-o-down fa-5" aria-hidden="true"></i></a>').appendTo('div#download-geneTree');

