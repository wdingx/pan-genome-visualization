# Pan-genome analysis and visualization

The exponentially increasing volume of new genome sequences has spurred researches on bacterial pan-genome, which embodies core genome shared by almost all strains, accessory genome only partly shared and strain-specific genes. Although several stand-alone softwares have already addressed different aspects of pan-genome analysis, yet there is still no web service for interactively visualizing and exploring pan-genomic data.

MPAV is a web-based versatile toolkit for microbial pan-genome visualization and exploration. MPAV provide researchers with little computational background an ease-to-use and richly interactive platform to analyze, visualize, and interpret pan-genomic data.

MPAV can efficiently identify core and pan-genome from large sets of genome sequences and integrate the determined core and accessory gene clusters in a well coordinated organization of gene table viewer, multiple alignment viewer and phylogenetic tree viewer.

MPAV also allows convenient visual comparison among core genome SNP phylogeny and single gene phylogeny to demonstrate gene presence and absence pattern as well as gene duplication.

MPAV is available via the Internet at http://pangenome.tuebingen.mpg.de

This repository refers to pan-genome visualization.
## Install npm packages:
```
npm install
```
## Start the server:
```
node ./bin/www
```
![MPAV](/web-demo.gif)

