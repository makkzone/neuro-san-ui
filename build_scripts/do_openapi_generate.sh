#!/usr/bin/env bash

# This script generates types for the web-based Neuro-san API based on an OpenAPI spec.
#
# See https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html for what these do
set -o errexit
set -o errtrace
set -o nounset
set -o pipefail

export NEURO_SAN_SERVER_URL="https://neuro-san.decisionai.ml"

yarn openapi-typescript "${NEURO_SAN_SERVER_URL}/api/v1/docs" -o ./generated/neuro-san/NeuroSanClient.d.ts
