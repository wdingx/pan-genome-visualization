# Pan-genome analysis and visualization

Even closely related bacterial genomes can differ in the presence of hundreds of genes and different genes don't necessarily share a common phylogeny since individual genes can be horizontally acquired from distant strains and species.
This mix of inheritance patterns makes phylogenetic analysis of bacteria challenging.

Although several stand-alone software are available for pan-genome analysis, visualization, analysis and exploration of pan-genomes remains challenging.
**panX** (Pan-genome Analysis and Exploration) is meant to facilitate pan-genome research with an easy-to-use and interactive platform to analyze and explore pan-genomic data.

panX displays the pan-genome using interconnected visual components including a gene table viewer, multiple alignment viewer, phylogenetic tree viewers and strain metadata viewer. The pan-genome data structures are prepared by our [pan-genome-analysis](https://github.com/neherlab/pan-genome-analysis) analysis pipeline, which efficiently identifies orthologous clusters from large sets of genome sequences and pre-computes alignments, trees, and a number of informative statistics.
**panX is available online at [pangenome.de](http://pangenome.de)**
### Install npm packages and start the server:
```
npm install
npm start
http://localhost:8000/
```
The example page shows the beauty and power of the panX visualization and exploration, even though [only a few gene clusters](https://github.com/neherlab/pan-genome-visualization/tree/master/public/dataset/Sa/geneCluster) are included in the repository.
### Demo
based on post-vaccine epidemiology of 616 S. pneumoniae strains ([Croucher et al. 2015](https://www.nature.com/articles/sdata201558))

![panX](/public/images/Demo-Sp616.gif)

Moreover, for your own pan-genome:
## Send your own data to the local server
After finishing the pan-genome-analysis pipeline, please use the script [link-to-server.py](https://github.com/neherlab/pan-genome-analysis/blob/master/link-to-server.py)  to transfer your data to the local server.
Notes: the paths in the script need to be customized.
```
python link-to-server.py YourSpecies
```
## Add your own page ([add-new-pages-repo.sh](https://github.com/neherlab/pan-genome-visualization/blob/master/add-new-pages-repo.sh))
```
bash add-new-pages-repo.sh your_species_prefix
```
Restart your server and enjoy your own interactive pan-genome dashboard!

