This describes how to upload new data to "master" environment

### Data directory format

Consider the following `data/` directory (note that all pathogens are nested under `datasets/` and `index.json` is a
sibling of `datasets/`):

```
.
├── dataset
│   ├── Acetobacter_pasteurianus
│   │   ├── geneCluster
│   │   │   └── xxxxxx.fa.gz
│   │   │   └── ....
│   │   ├── all_gene_alignments.tar.gz
│   │   ├── allclusters_final.tsv
│   │   ├── coreGenomeTree.json
│   │   ├── core_gene_alignments.tar.gz
│   │   ├── geneCluster.json
│   │   ├── metaConfiguration.js
│   │   ├── metainfo.tsv
│   │   ├── strainMetainfo.json
│   │   └── strain_tree.nwk
│   ├── Achromobacter_xylosoxidans
│   │   ├── ...
│   ├── Acinetobacter_baumannii
│   │   ├── ...
...     ...      ...
│   ├── Yersinia_pestis
│   │   └── ...
│   ├── Yersinia_pseudotuberculosis
│   │   └── ...
│   ├── Yersinia_ruckeri
│   │   └── ...
│   └── Zymomonas_mobilis
│       └── ...
└── index.json
```

This is the expected format which can be uploaded to the S3 bucket directly.

### Generate `index.json`

Run `build_data_index.py` providing path to `datasets/` directory:

```
python3 scripts/build_data_index.py '<path_to_data>/dataset'
```

It will generate `index.json` in `<path_to_data>/`.

### Upload everything to S3 (might take a while because 'geneCluster/' directories contain many small files)

```bash
aws s3 sync . s3://pangenome.org-data-master/
```

### Upload everything to S3, except 'geneCluster/' directories

```bash
aws s3 sync --exclude '*geneCluster/*' . s3://pangenome.org-data-master/
```

### Invalidate AWS Cloudfront cache

This is needed for data to be reflected in the web app.

```bash
aws cloudfront create-invalidation \
  --distribution-id E3GL5ZSJKHVU20 \
  --paths "/*"
```

This will tell AWS that we want to copy our data from S3 to all AWS edge locations in the world. Give it up to 15 minutes to propagate fully.
