# Pan-genome analysis and visualization

Even closely related bacterial genomes can differ in the presence of hundreds of genes and  individual genes can be horizontally acquired from distant strains and species.
This mix of inheritance patterns complicates phylogenetic analysis of bacteria.

Although several software are available for pan-genome analysis, yet visualization, interpretation and exploration of pan-genomes remains challenging.
**panX** (Pan-genome Analysis and Exploration) aims at facilitating pan-genome research with an easy-to-use and interactive platform for analyzing and exploring pan-genomic data.

panX displays the pan-genome using interconnected visual components including gene cluster table, multiple alignment, comparative phylogenetic tree viewers and strain metadata table. The pan-genome data structures are prepared by our [pan-genome-analysis](https://github.com/neherlab/pan-genome-analysis) analysis pipeline, which efficiently identifies orthologous clusters from large sets of genome sequences and pre-computes alignments, trees, and plenty of informative statistics.
**panX is available at [pangenome.de](http://pangenome.de)**

  * [Start the visualization](#start-the-visualization)
  * [Add your own data](#add-your-own-data)
  * [Visualize associations](#visualize-associations)
  * [Pipeline overview](#pipeline-overview)
  * [FAQ](#faq)

## Start the visualization
### Clone the repository
```
git clone https://github.com/neherlab/pan-genome-visualization
git submodule update --init
```
### Install npm packages and start the server:
```
npm install
npm start
```

check ```http://localhost:8000/``` in browser (One might need to upgrade the outdated browser.)
If npm can not start, please make sure that [nodejs](https://nodejs.org/en/download/) is updated.

The example page shows the beauty and power of the panX visualization and exploration, even though only a few species and some of their gene clusters are showcased in the repository. Complete pan-genomes are exhibited at [pangenome.de](http://pangenome.de).
### Demo
based on post-vaccine epidemiology of 616 S. pneumoniae strains ([Croucher et al. 2015](https://www.nature.com/articles/sdata201558))

![panX](/public/images/Demo-Sp616.gif)

## Add your own data
### Add your own page in the local server ([add-new-pages-repo.sh](https://github.com/neherlab/pan-genome-visualization/blob/master/add-new-pages-repo.sh))
Using standard layout (gene cluster table and alignment on the same row):
```
bash add-new-pages-repo.sh your_species
```
Using wide layout (gene cluster table for one row and alignment at the bottom):
```
bash add-new-pages-repo.sh your_species wide
```
### Send your own data to the local server
After finishing the pan-genome-analysis pipeline, please use the script [link-to-server.py](https://github.com/neherlab/pan-genome-analysis/blob/master/link-to-server.py)  to transfer your data to the local server.
```
./link-to-server.py -s E_coli -v /usr/pan-genome-visualization
```

**Restart your server and enjoy your own interactive pan-genome dashboard!**

## Visualize associations
### Special feature: visualize branch association(BA) and presence/absence(PA) association
Once BA and PA with metadata (e.g. drug concentration) are calculated in panX analysis pipeline, users can create their custom pages to flexibly visualize branch associations.

[Example](https://github.com/neherlab/pan-genome-visualization/blob/master/views/S_pneumoniae616.jade) on how the page should be customized for BA and PA association:

add this line and corresponding file (modify "yourSpecies")
```
script(src='dataset/yourSpecies/newColumnConfig.js')
```

[Example](https://github.com/neherlab/pan-genome-visualization/blob/master/public/dataset/S_pneumoniae616/newColumnConfig.js) for newColumnConfig.js

## **Pipeline overview:**
![panX](/panX-pipeline.png)

panX analysis pipeline is based on [DIAMOND](https://github.com/bbuchfink/diamond) ([Buchfink et al. 2015 Nature Methods](http://www.nature.com/nmeth/journal/v12/n1/full/nmeth.3176.html)), MCL and post-
processing to determine clusters of orthologous genes from a collection of annotated genomes.
panX generates a strain/species tree based on core genome SNPs and a gene tree for each gene cluster.

**panX interactive visualization**: (1) The dynamic pan-genome statistical charts allow rapid filtering and selection of gene subsets in cluster table;

clicking a gene cluster in cluster table loads (2) related alignment, (3) individual gene tree and (4) gene presence/absence and gain/loss pattern on strain/species tree;

(5) Selecting sequences in alignment highlights associated strains on strain/species tree;

(6) (7) Strain/species tree interacts with gene tree in various ways;

(8) Zooming into a clade on strain/species tree screens strains in metadata table;

(9) Searching in metadata table display strains pertinent to specific meta-information.

## FAQ
  * **Is my dataset publicly available or does it remains private?**<br />
    The panX visualization application can either be hosted on a web server or used locally to explore custom pan-genomes produced by the panX analysis pipeline.
    If you run it locally and access it via http://localhost:8000 , only you can see it.
    If you want to make your data publicly available, you can host it on a web server.

  * **How can I host panX visualization application on my own server?**<br />
    Here is a tutorial for hosting and deploying Node.js application on Ubuntu:
    https://www.terlici.com/2015/02/05/hosting-deploying-nodejs.html

  * **How to use a different port than 8000?**<br />
    Open the file **./bin/www**, go to the line `var port = normalizePort(process.env.PORT || '8000');` and change `'8000'` to `'3000'`.<br />
    Then, check http://localhost:3000

  * **I pushed the panX analysis result to the visualization repository, but can not find my own data?**<br />
    After sending your data to the local server and adding your own page in the local server, one can access it via http://localhost:8000/my_species.<br />
    The visualization repository only shows the test datasets in the dropdown menu for "species selection". After changing the configuration file [species-list-info.js](https://github.com/neherlab/pan-genome-visualization/blob/master/public/javascripts/species-list-info.js), the new species can be added to the drop-down menu.

  * **Strange errors when using dots in the species/dataset name (e.g.: localhost:8000/E.coli)**<br />
    Dots are often used to separate the parts of the domain name. So, please use "_" (underscore) for the species/dataset name within the url.<br />
    E.g.: http://localhost:8000/E_coli instead of http://localhost:8000/E.coli

