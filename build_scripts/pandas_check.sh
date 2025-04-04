#!/bin/sh

# Why does this script exist and what does it do?
# In our current environment of python 3.12, in order to make
# pandasai work, we need a specific version of pandas, namely
# 1.5.3 which does not currently exist as a pip-installable package.
# Instead, a pip install of pandas 1.5.3 results in building 
# a wheel file from source. This process takes on the order of 7 minutes
# which slows down our builds (unit-test and all-build pipelines)
# substantially. In order to optimize for this current situation,
# we pre-build an image with python and pandas (and git) pre-installed
# and base our subsequent builds upon this pre-built image.
# In order for this to work, the pre-built image needs to exist that
# matches the defined pandas version. 
# Currently, pandas is set to 1.5.3 in two service requirement files,
# namely the analytics service and the top level
# req file which is used by run-submission service.
# There is currently an assumption that these two values will be the same
# but that's not enforced in any way. 
# Therefore, this script exists to ensure our assumption still holds true.
# If that is not true, the script will fail and we will be alerted to 
# take a look. If the assumption remains true, then we set an env var
# for the PANDAS_VERSION which is used in a subsequent Codefresh
# build step to ensure the required base image does indeed exist.

# This script runs on alpine in codefresh so we use /bin/sh
# These are the supported directives for /bin/sh
set -eu

# Paths to known requirements files (with pandas)
REQ_FILE_1="../backend/analytics/service/requirements.txt"
REQ_FILE_2="../requirements.txt"

# Extract pandas version spec (allowing ==, >=, <=, ~=)
extract_version_spec() {
  grep -E '^pandas[[:space:]]*(==|>=|<=|~=)' "$1" | \
    grep -v 'pandasai' | \
    sed -E 's/^pandas[[:space:]]*(==|>=|<=|~=)[[:space:]]*//'
}

# Get version specs from each file
VER1=$(extract_version_spec "$REQ_FILE_1")
VER2=$(extract_version_spec "$REQ_FILE_2")

echo "Found in $REQ_FILE_1: pandas $VER1"
echo "Found in $REQ_FILE_2: pandas $VER2"

# Compare
if [ "$VER1" != "$VER2" ]; then
  echo ""
  echo "❌ ERROR: pandas versions do not match!"
  echo "🔍 $REQ_FILE_1 has: pandas $VER1"
  echo "🔍 $REQ_FILE_2 has: pandas $VER2"
  echo "💡 Please align the pandas versions in both files."
  exit 1
else
  echo "✅ pandas versions match"
  # Set a codefresh enabled env var so the version can be used in later steps
  cf_export PANDAS_VERSION="$VER1"
fi

