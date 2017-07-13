var customized_standard_columns= [
    {'defaultContent': '<button type="button" class="btn btn-info btn-xs" data-toggle="tooltip"  data-placement="bottom"  title="amino acid alignment" >aa </button> <button type="button" class="btn btn-primary btn-xs" data-toggle="tooltip"  data-placement="bottom"  title="nucleotide alignment" >na </button> ',  'name':'Alignment','tooltip':'multiple sequence alignment'},
    {'defaultContent': '', 'className': 'geneName-details-control', 'orderable': false,  'name':''},//geneName expand
    {'data':'GName',  'name':'Name','tooltip':'gene name'},//geneName
    {'defaultContent': '', 'className': 'ann-details-control', 'orderable': false,  'name':''},//annotation expand
    {'data':'ann',  'name':'Annotation','tooltip':'gene annotation'},//annotation    //'width':10,
    {'data':'count',  'name':'#Strains','tooltip':'strain count'},//count
    {'defaultContent': '', 'className': 'dup-details-control', 'orderable': false,  'name':''},//duplication expand
    {'data':'dupli',  'name':'Duplicated','tooltip':'whether duplicated and duplication count in each strain'},//duplication
    //{'data':'event',  'name':'Events','tooltip':'gene gain/loss events count'},
    {'data':'divers',  'name':'Diversity','tooltip':'gene diversity'},
    //{'data':'geneLen',  'name':'Length','tooltip':'average gene length'},
    {'data':'geneId','visible': false,  'name':'','tooltip':''},
    {'data':'allAnn','visible': false,  'name':'','tooltip':''},
    {'data':'allGName','visible': false,  'name':'','tooltip':''},
    {'defaultContent': '','data':'locus','visible': false,  'name':'','tooltip':''}
    //{'data':'msa','visible': false}
];