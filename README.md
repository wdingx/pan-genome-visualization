# Pan-genome analysis and visualization

In addition to vertical inheritance, bacteria frequently lose genes or take genes up from the environment. Even closely related bacterial genomes can differ in the presence of hundreds of genes and different genes don't necessarily share a common phylogeny since individual genes can been acquired from distant strains and species.
This mix of inheritance patterns makes phylogenetic analysis of bacteria challenging.

Although several stand-alone software are available for pan-genome analysis, visualization, analysis and exploration of pan-genomes remains challenging.

Pan-genome Analysis and Exploration (panX) is meant to facilitate pan-genome research with an easy-to-use and interactive platform to explore and analyze pan-genomic data.

panX displays the pan-genome using connected visual components including a gene table viewer, multiple alignment viewer, and phylogenetic tree viewers. The pan-genome data structures are prepared by our [pan-genome-analysis](https://github.com/neherlab/pan-genome-analysis) pipeline, that efficiently identifies orthologous clusters from large sets of genome sequences and pre-computes alignments, trees, and a number of informative statistics.

panX is available online at [pangenome.de](http://pangenome.de)

This repository refers to pan-genome visualization.
## Install npm packages:
```
npm install
```
## Start the server:
```
node ./bin/www
```
## Have fun!
```
http://localhost:8000/
```
![panX](/web-demo.gif)

