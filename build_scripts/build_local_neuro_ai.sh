#!/bin/bash

# Script for preparing requirements file for running NeuroAI locally

function check_run_directory() {

    # Everything here needs to be done from the top-level directory for the repo
    working_dir=$(pwd)
    exec_dir=$(basename "${working_dir}")
    if [ "$exec_dir" != "unileaf" ]
    then
        echo "This script must be run from the top-level directory for the repo"
        exit 1
    fi
}

function create_git_creds_requirements() {
    # Create a temporary requirements file which is used to setup
    # the virtual environment for running NeuroAI locally

    # Get rid of any turds from any previous attempts with a fresh copy
    # of the base requirements file.
    WITH_CREDS_REQUIREMENTS=local_neuro_ai_requirements.txt
    cp requirements.txt ${WITH_CREDS_REQUIREMENTS}

    # Get the ephemeral token for public repos
    EPHEMERAL_LEAF_SOURCE_CREDENTIALS="x-access-token:${LEAF_SOURCE_CREDENTIALS}"
    sed -i.bak "s/\${LEAF_SOURCE_CREDENTIALS}/${EPHEMERAL_LEAF_SOURCE_CREDENTIALS}/g" ${WITH_CREDS_REQUIREMENTS}

    # Get the ephemeral token for private repos
    EPHEMERAL_LEAF_SOURCE_CREDENTIALS="x-access-token:${LEAF_PRIVATE_SOURCE_CREDENTIALS}"
    sed -i.bak "s/\${LEAF_PRIVATE_SOURCE_CREDENTIALS}/${EPHEMERAL_LEAF_SOURCE_CREDENTIALS}/g" ${WITH_CREDS_REQUIREMENTS}

    # Add -e to the beginning of the private repo URLs. That
    # way when we pip.freeze the environment to send to the
    # worker nodes, private repo paths are specified in full.
    sed -i.bak "s/git+https/-e git+https/g" ${WITH_CREDS_REQUIREMENTS}

    # Add "#egg=" to the end of lines with private repos
    sed -i.bak "/git+https/ s/$/#egg=/" ${WITH_CREDS_REQUIREMENTS}

    chmod 600 ${WITH_CREDS_REQUIREMENTS}
}

function build_main() {
    # Outline function which delegates most work to other functions

    check_run_directory
    create_git_creds_requirements
}


# Call the build_main() outline function
build_main
