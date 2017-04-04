import d3 from "d3";
import d3Tip from "d3-tip";
d3.tip = d3Tip;
const meta_types =meta_display_set['meta_display_order'];
var antibiotics_set;
//## tooltip for datatables header
export const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    //.style("z-index", "10")
    .style("color", "white")
    .style("padding","5px")
    .style("border-radius","2px")
    .style("visibility", "hidden")
    .style("background", "rgba(0,0,0,0.5)"); //255,255,255

export const tooltip_button = function(divID, tooltip_dict) {
    console.log('aa',divID,d3.selectAll(divID))
    d3.selectAll(divID)
    .on("mouseover", function(d){
        tooltip.text(tooltip_dict[d]);
        console.log('aa',d,tooltip_dict[d])
        if (tooltip.text()!="") {
            return tooltip.style("visibility", "visible");
        } else {return tooltip.style("visibility", "hidden");}
    })
    .on("mousemove", function(){
        return tooltip.style("top", (d3.event.pageY-40)+"px").style("left",(d3.event.pageX+10)+"px");
    })
    .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
    })
};


//## tooltip for tree nodes and branches
export const tooltip_node = d3.tip().attr('class', 'd3-tip').html(function(d) {
    var string = "";
    //speicesTree tooltip
    string +="<br/> <table rules='cols'> "
    if (typeof d.name != "undefined") {
        //string += "NCBI accesion:  " + d.name;
        string += " <tr> <th class='tooltip_table_th'>NCBI accesion</th> <td class='tooltip_table_td'> " + d.name+" </td> </tr> ";
    }

    for (var i=0, len=meta_types.length; i<len ; i++) {
        var meta_category = meta_types[i];
        if ( antibiotics_set && antibiotics_set.indexOf(meta_category)>=0 ){
                //pass
        }else{
            if ((typeof d.n.attr!= "undefined")&&(typeof d.n.attr[meta_category] != "undefined")&&(d.n.attr[meta_category] !='unknown')) {
                    string += " <tr> <th class='tooltip_table_th'>" + meta_category + "</th> <td class='tooltip_table_td'> " + d.n.attr[meta_category]+" </td> </tr> ";
                }
        }
    }
    string +="</table>"

    if (antibiotics_set) {
        string +="<br/><br/> <table> "
        for (var i = 0; i < antibiotics_set.length; i++){
            if (d[antibiotics_set[i]]!='unknown' && d[antibiotics_set[i]]!='Susceptible' && typeof d[antibiotics_set[i]] != "undefined" ){
                string +=" <tr> <th>"+antibiotics_set[i]+"</th> <td>"+d[antibiotics_set[i]]+"</td> </tr> ";
            }
        }
        string +="</table>"
    }

    //# geneTree tooltip
    if (typeof d.ann != "undefined") {
        //string += " <tr> <th class='tooltip_table_th'>annotation</th> <td class='tooltip_table_td'> " + d.ann+" </td> </tr> ";
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

export const tooltip_link = d3.tip().attr('class', 'd3-tip').html(function(d) {
    var string = "";
    if (typeof d.target.ann != "undefined") {
        string += "<br/>" + "annotation:  " + d.target.ann;
        }
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

    string += "<div class=\"smallspacer\"></div>";

    return string;
});