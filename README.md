# Pan-genome analysis and visualization

Even closely related bacterial genomes can differ in the presence of hundreds of genes and  individual genes can be horizontally acquired from distant strains and species.
This mix of inheritance patterns complicates phylogenetic analysis of bacteria.

Although several software are available for pan-genome analysis, yet visualization, interpretation and exploration of pan-genomes remains challenging.
**panX** (Pan-genome Analysis and Exploration) aims at facilitating pan-genome research with an easy-to-use and interactive platform to analyze and explore pan-genomic data.

panX displays the pan-genome using interconnected visual components including gene cluster table, multiple alignment, comparative phylogenetic tree viewers and strain metadata table. The pan-genome data structures are prepared by our [pan-genome-analysis](https://github.com/neherlab/pan-genome-analysis) analysis pipeline, which efficiently identifies orthologous clusters from large sets of genome sequences and pre-computes alignments, trees, and plenty of informative statistics.
**panX is available at [pangenome.de](http://pangenome.de)**
### Clone the repository
```
git clone https://github.com/neherlab/pan-genome-visualization
git submodule update --init
```
### Install npm packages and start the server: (if npm can not start, please make sure that [nodejs](https://nodejs.org/en/download/) is updated.)
```
npm install
npm start
```

check ```http://localhost:8000/``` in browser (One might need to upgrade the outdated browser.)

The example page shows the beauty and power of the panX visualization and exploration, even though only a few species and some of their gene clusters are showcased in the repository. Complete pan-genomes are exhibited at [pangenome.de](http://pangenome.de).
### Demo
based on post-vaccine epidemiology of 616 S. pneumoniae strains ([Croucher et al. 2015](https://www.nature.com/articles/sdata201558))

![panX](/public/images/Demo-Sp616.gif)

Moreover, for your own pan-genome:
## Add your own page in the local server ([add-new-pages-repo.sh](https://github.com/neherlab/pan-genome-visualization/blob/master/add-new-pages-repo.sh))
```
bash add-new-pages-repo.sh your_species_prefix
```
## Send your own data to the local server
After finishing the pan-genome-analysis pipeline, please use the script [link-to-server.py](https://github.com/neherlab/pan-genome-analysis/blob/master/link-to-server.py)  to transfer your data to the local server.
```
./link-to-server.py -s E_coli -v /usr/pan-genome-visualization
```

**Restart your server and enjoy your own interactive pan-genome dashboard!**


### **Pipeline overview:**
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