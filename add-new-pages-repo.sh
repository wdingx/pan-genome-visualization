## Usage:
## standard layout (gene cluster table and alignment on the same row):
##	bash add-new-pages-repo.sh your_species
## wide layout (gene cluster table in one row and alignment at the bottom):
##	bash add-new-pages-repo.sh your_species wide

species=$1;
layout=$2;
# process jade file (in folder ./views/)
mkdir -p ./public/dataset/$species
if [ "$layout" == "wide" ]; then
	echo 'using wide layout';
	cp ./views/instance-wide.jade ./views/$species.jade
else
	echo 'using standard layout';
	cp ./views/instance.jade ./views/$species.jade
fi

sed -i -- "s/TestSet/$species/g" ./views/$species.jade

# process js file (in folder ./routes/)
cp ./routes/TestSet.js ./routes/$species.js
sed -i -- "s/TestSet/$species/g" ./routes/$species.js
