## Usage:
## standard layout (gene cluster table and alignment on the same row):
## python add-new-pages.py -fn your_species
## wide layout (gene cluster table for one row and alignment at the bottom):
## python add-new-pages.py -fn your_species -wl

import os, sys, argparse
parser = argparse.ArgumentParser(description=\
    'Adding a new visualization instance for a custom pan-genome.',
    usage='python ./%(prog)s'+' -h (help)\n\
        standard layout:    python ./%(prog)s'+' -fn E_coli\n\
        wide layout:        python ./%(prog)s'+' -fn E_coli -wl\n\
        association score:  python ./%(prog)s'+' -fn E_coli -sa')
parser.add_argument('-fn', '--folder_name', type = str, required=True,
    help='your folder/species name (without "/", e.g.: E_coli)', metavar='')
parser.add_argument('-wl', '--wide_layout',  action='store_true',
    help='using wide layout (by default: standard layout)')
parser.add_argument('-sa', '--show_associations', action='store_true',
    help='show association scores using wide layout for the cluster datatable (by default: standard layout)')

params = parser.parse_args()
species=params.folder_name

if params.show_associations:
    print 'using wide layout showing association scores'
    os.system('cp ./views/instance-association.jade ./views/'+species+'.jade')
elif params.wide_layout==False:
    print 'using standard layout'
    os.system('cp ./views/instance.jade ./views/'+species+'.jade')
else: #params.wide_layout True
    print 'using wide layout'
    os.system('cp ./views/instance-wide.jade ./views/'+species+'.jade')

##process jade file (in folder ./views/)
os.system('sed -i -- "s/TestSet/'+species+'/g" ./views/'+species+'.jade')

##process js file (in folder ./routes/)
os.system('cp ./routes/TestSet.js ./routes/'+species+'.js')
os.system('sed -i -- "s/TestSet/'+species+'/g" ./routes/'+species+'.js')