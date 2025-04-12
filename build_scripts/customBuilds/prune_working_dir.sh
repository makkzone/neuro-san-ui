#!/usr/bin/env bash

# This script removes files from the working directory in preparation for a custom Docker build.


# See https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html for what these do
set -o errexit
set -o errtrace
set -o nounset
set -o pipefail

check_clean_working_dir() {
  if [ -n "$(git status --porcelain)" ]; then
  echo "Working directory not clean. Refusing to proceed."
  echo "Commit your changes or reset your working directory and try again."
    exit 1
  fi
}

check_env_var() {
  # if BUILD_TARGET is not set, exit with an error
  if [ -z "${BUILD_TARGET:-}" ]; then
    echo "Error: BUILD_TARGET environment variable must be set."
    exit 2
  fi
}

check_build_target() {
  local build_target="$1"
  
  # If there isn't a file named build_target under the pruneLists directory, exit with an error
  if [ ! -f "build_scripts/customBuilds/pruneLists/${build_target}.txt" ]; then
    echo "Error: No build target found for ${build_target}"
    exit 2
  fi
}

prune_files() {
  local build_target="$1"
#  xargs -d '\n' -I {} rm -rf "{}" < pruneLists/${build_target.txt}
  echo "Pruning files for build target: ${build_target}"
}

# Main entry point of the script
main() {
  check_clean_working_dir
  check_env_var
  check_build_target "${BUILD_TARGET}"
  prune_files "${BUILD_TARGET}"
}
  
# Execute main
main

