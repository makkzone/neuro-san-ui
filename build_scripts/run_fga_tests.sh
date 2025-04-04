#!/usr/bin/env bash

# set -euo pipefail

TEST_DIRS=tests

dirs=$1
if [ "${dirs}" == "" ]
then
    dirs=${TEST_DIRS}
fi

# Comb through directories to see what we will actually use
test_files=""
for dir in ${dirs}
do
    found_files=$(find "${dir}" -type f -print | grep .fga.yml)
    test_files="${test_files} ${found_files}"
done

retval=0
for test_file in ${test_files}
do
    echo "Running tests in ${test_file}:"
    test_output=$(fga model test --tests "${test_file}")
    echo "${test_output}"

    failure=$(echo "${test_output}" | grep FAILING)
    if [ "${failure}" != "" ]
    then
        retval=1
    fi
done

if [ ${retval} == 0 ]
then
    # If we got this far, all is well
    echo "FGA tests complete. No issues found."
fi

exit ${retval}
