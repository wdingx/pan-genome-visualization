## Usage: bash add-new-pages-repo.sh your_species_prefix
#species_prefix

species=$1

# process jade (in folder ./views/)
mkdir -p ./public/dataset/$species
mkdir -p ./public/dataset/$species/geneCluster
cp ./views/instance.jade ./views/$species.jade
sed -i -- "s/TestSet/$species/g" ./views/$species.jade
# process js (in folder ./routes/)
cp ./routes/TestSet.js ./routes/$species.js
sed -i -- "s/TestSet/$species/g" ./routes/$species.js
