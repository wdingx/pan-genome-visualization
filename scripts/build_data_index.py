import json
from datetime import datetime
from glob import glob
import os
import sys
import logging
from logging import info, warning, INFO
from os.path import join, basename, isfile

logging.basicConfig(level=INFO)


def list_unique_files(dataset_path):
    unique_files = set()
    for f in os.scandir(dataset_path):
        if f.is_dir:
            for file in glob(f"{f.path}/*"):
                unique_files.add(basename(file))
    return list(sorted(unique_files))


def generate_index_json(dataset_path):
    datasets = []
    for f in os.scandir(dataset_path):
        if f.is_dir:
            files = list(filter(lambda f: isfile(f), glob(f"{f.path}")))

            pathogen_name = basename(f.path)
            has_standard_column_config = "newColumnConfig.js" in files
            has_new_column_config = "standardColumnConfig.js" in files

            datasets.append({
                "pathogenName": pathogen_name,
                "hasStandardColumnConfig": has_standard_column_config,
                "hasNewColumnConfig": has_new_column_config,
            })

    index_json = {
        "created_at": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "total_datasets": len(datasets),
        "datasets": sorted(datasets, key=lambda dataset: dataset["pathogenName"]),
    }

    index_json_path = join(dataset_path, "index.json")
    with open(index_json_path, "w") as f:
        json.dump(index_json, f, indent=2, sort_keys=False)

    info(f"Index written to '{index_json_path}'")


if __name__ == '__main__':
    dataset_path = sys.argv[1]

    info("Unique filenames across datasets: ")
    for file in list_unique_files(dataset_path):
        info(f"  {file}")

    generate_index_json(dataset_path)
