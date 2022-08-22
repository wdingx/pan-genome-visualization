export const DATA_ROOT_URL = process.env.DATA_ROOT_URL
export const DATASET_ROOT_URL=`${DATA_ROOT_URL}dataset/`

/** data paths */
export const path_datatable1=DATASET_ROOT_URL+speciesAbbr+"/geneCluster.json";
export const coreTree_path=DATASET_ROOT_URL+speciesAbbr+"/coreGenomeTree.json";
export const aln_file_path=DATASET_ROOT_URL+speciesAbbr+"/geneCluster/";
export const path_datatable_meta=DATASET_ROOT_URL+speciesAbbr+"/strainMetainfo.json";
//export const path_metaConfiguration=DATASET_ROOT_URL+speciesAbbr+"/metaDetails.json";

if (typeof speciesAbbr2=='undefined') {
	var speciesAbbr2=speciesAbbr+'2';
}
export const geneEvent_path_A=DATASET_ROOT_URL+speciesAbbr+'/geneGainLossEvent.json';
export const geneEvent_path_B=DATASET_ROOT_URL+speciesAbbr2+'/geneGainLossEvent.json';
export const path_datatable11=DATASET_ROOT_URL+speciesAbbr2+"/geneCluster.json";
export const coreTree_path_B=DATASET_ROOT_URL+speciesAbbr2+"/coreGenomeTree.json";
export const aln_file_path_B=DATASET_ROOT_URL+speciesAbbr2+"/geneCluster/";
export const sequenceJsonPath=DATASET_ROOT_URL+speciesAbbr+"/_seq.json";
//nodeAttriPath=DATASET_ROOT_URL+speciesAbbr+"/-tnt-nodeAttri.json"
