# Pan-genome analysis and visualization

Even closely related bacterial genomes can differ in the presence of hundreds of genes and  individual genes can be horizontally acquired from distant strains and species.
This mix of inheritance patterns complicates phylogenetic analysis of bacteria.

Although several software are available for pan-genome analysis, yet visualization, interpretation and exploration of pan-genomes remains challenging.
**panX** (Pan-genome Analysis and Exploration) is meant to facilitate pan-genome research with an easy-to-use and interactive platform to analyze and explore pan-genomic data.

panX displays the pan-genome using interconnected visual components including gene cluster table, multiple alignment, comparative phylogenetic tree viewers and strain metadata table. The pan-genome data structures are prepared by our [pan-genome-analysis](https://github.com/neherlab/pan-genome-analysis) analysis pipeline, which efficiently identifies orthologous clusters from large sets of genome sequences and pre-computes alignments, trees, and plenty of informative statistics.
**panX is available at [pangenome.de](http://pangenome.de)**
### clone the repository
```
git clone https://github.com/neherlab/pan-genome-visualization
git submodule update --init
```
### Install npm packages and start the server:
```
npm install
npm start
```

check ```http://localhost:8000/``` in broswer (One might need to upgrade the outdated broswer.)

The example page shows the beauty and power of the panX visualization and exploration, even though only a few gene clusters are included in the repository.
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
Notes: the paths in the script need to be customized.
```
python link-to-server.py YourSpecies
```

Restart your server and enjoy your own interactive pan-genome dashboard!

