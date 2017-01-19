import os

def gather_css(jade_fpath):
    """ """
    gulp_css=[]
    with open(jade_fpath) as infile:
        for iline in infile:
            if iline.strip().startswith('link') and 'image/png' not in iline and 'http' not in iline:
                css_path= iline.split('href=')[1].split(')')[0]
                gulp_css.append('./public/%s'%css_path)
        for i in gulp_css: print i

def gather_js(jade_fpath,gulp_js_list):
    """ """
    gulp_js=[]
    with open(jade_fpath) as infile:
        for iline in infile:
            if iline.strip().startswith('script') and '//' not in iline:#
                js_path= iline.split("src='")[1].split("')")[0]
                gulp_js.append('./public/%s'%js_path)
        for i in gulp_js: 
            pass#print i
        if 1:
            print set(gulp_js_list)-set(gulp_js), '\n'
            print set(gulp_js)-set(gulp_js_list)
               
#gather_css('./views/layout-testa.jade')

gulp_js_list=['./public/javascripts/colors.js',
    './public/javascripts/species-list-info.js',
    './public/javascripts/wNumb.js',
    './public/javascripts/nouislider.min.js',
    './public/javascripts/jquery.min.js',
    './public/javascripts/lodash.min.js',
    './public/javascripts/bootstrap.min.js',
    './public/javascripts/bootstrap-toggle.min.js',
    './public/javascripts/third_party/bootstrap-multiselect.js',
    './public/javascripts/jquery.bootstrap-autohidingnavbar.min.js',
    './public/javascripts/call-autohidingnavbar.js',
    './public/javascripts/d3.min.js',
    './public/javascripts/d3-tip.min.js',
    './public/javascripts/crossfilter.min.js',
    './public/javascripts/dc.min.js',
    './public/javascripts/jquery.dataTables.min.js',
    './public/javascripts/dataTables.tableTools.min.js',
    './public/javascripts/dataTables.scrollingPagination.js',
    './public/javascripts/dataTables.bootstrap.min.js',
    './public/javascripts/dataTables.autoFill.min.js',
    './public/javascripts/msa-new.js',
    './public/javascripts/tnt.tree.min.js',
    './public/javascripts/jquery.panzoom.min.js',
    './public/javascripts/reload.test2-reorg.min.js',
    './public/javascripts/init-homepage-interactiveLoad-reorg.js',
    './public/javascripts/tree-view-new-reorg.js',
    './public/javascripts/meta-color-legend.js',
    './public/javascripts/tooltips.js']

#gulp_js_list=['./public/javascripts/colors.js',
#'./public/javascripts/species-list-info.js',
#'./public/javascripts/third_party/wNumb.js',
#'./public/javascripts/third_party/nouislider.min.js',
#'./public/javascripts/third_party/jquery.min.js',
#'./public/javascripts/third_party/lodash.min.js',
#'./public/javascripts/third_party/bootstrap.min.js',
#'./public/javascripts/third_party/bootstrap-toggle.min.js',
#'./public/javascripts/third_party/bootstrap-multiselect.js',
#'./public/javascripts/third_party/jquery.bootstrap-autohidingnavbar.min.js',
#'./public/javascripts/third_party/call-autohidingnavbar.js',
#'./public/javascripts/third_party/d3.min.js',
#'./public/javascripts/third_party/d3-tip.min.js',
#'./public/javascripts/third_party/crossfilter.min.js',
#'./public/javascripts/third_party/dc.min.js',
#'./public/javascripts/third_party/jquery.dataTables.min.js',
#'./public/javascripts/third_party/dataTables.tableTools.min.js',
#'./public/javascripts/third_party/dataTables.scrollingPagination.js',
#'./public/javascripts/third_party/dataTables.bootstrap.min.js',
#'./public/javascripts/third_party/dataTables.autoFill.min.js',
#'./public/javascripts/third_party/msa-new.js',
#'./public/javascripts/third_party/tnt.tree.min.js',
#'./public/javascripts/third_party/jquery.panzoom.min.js',
#'./public/javascripts/reload.test2.min.js',
#'./public/javascripts/init-homepage-interactiveLoad.js',
#'./public/javascripts/tree-view-new.js',
#'./public/javascripts/meta-color-legend.js',
#'./public/javascripts/tooltips.js']

gather_js('./views/layout-testa.jade',gulp_js_list)