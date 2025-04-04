#!/usr/bin/env bash

#
# This script runs the ESLint linter on the current directory and all subdirectories. Corollary: given our project
# structure, the caller should have changed directory to nextfront where the UI code lives first.
# It will lint all javascript-ish and Typescript-ish type source files.
#
# For now we have an error and warning threshold (the status quo) and if a checkin causes more errors or warnings
# to be generated than this threshold, this script will complain and exist with non-zero status, breaking the build.
# On failure, warnings and errors are spewed to stdout to help diagnose what went wrong. On success, the script is
# silent.
#

# See https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html for what these do
set -o errtrace
set -o nounset
set -o pipefail

yarn lint --version  # Display version for troubleshooting

# Run EsLint. As of today (Oct 2022) we run "clean" with zero errors and zero warnings. Any newly-introduced issues
# will result in a non-zero exit code and presumably fail the build.
yarn lint  --report-unused-disable-directives-severity "error" --max-warnings 0 2>&1

# Exit code is whatever code 'yarn lint' reported.

