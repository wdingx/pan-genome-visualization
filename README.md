# Pan-genome analysis and visualization

In addition to vertical inheritance, bacteria frequently loose genes or take genes up from the environment. Even closely related bacterial genomes can differ in the presence of hundreds of genes and different genes don't necessesarily share a common phylogeny since individual genes can been acquired from distant strains and species.
This mix of inheritance patterns makes phylogenetic analyis of bacteria challenging.

Although several stand-alone software are available for pan-genome analysis, visualizion, analysis and exploration of pan-genomes remains challenging.

Microbial Pan-genome Analysis and Visualisation (MPAV) is meant to facilitate pan-genome research with an easy-to-use and interactive platform to explore and analyze pan-genomic data.

MPAV displays the pan-genome using connected visual components including a gene table viewer, multiple alignment viewer, and phylogenetic tree viewers. The pan-genome data structures are prepared by our [pan-genome-analysis](https://github.com/neherlab/pan-genome-analysis) pipeline, that efficiently identifies orthologous clusters from large sets of genome sequences and precomputes alignments, trees, and a number of informative statistics.

MPAV is available online at [pangenome.tuebingen.mpg.de](http://pangenome.tuebingen.mpg.de)

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
![MPAV](/web-demo.gif)

