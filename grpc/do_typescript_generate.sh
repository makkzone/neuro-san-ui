#!/usr/bin/env bash

# This script generates gRPC stubs for Typescript from the definitions in the ./proto directory.
# Pre-requisites:
# 1) Install the protoc compiler
# 2) Install the ts-proto plugin https://github.com/stephenh/ts-proto/
#
# Note: The Dockerfile should take care of installing the pre-requisites.
#
# This script must be run from the nextfront directory, which is in line with the Docker build which runs from the
# nextfront directory.

# Define dirs
GENERATED_DIR=./generated
PROTOS_DIR=./proto

# Ordering matters w/rt where generated file is output
PROTO_PATH="--proto_path=${GENERATED_DIR} \
            --proto_path=${PROTOS_DIR} \
            --proto_path=./node_modules/protobufjs"

PACKAGE="backend.grpc.generated"

echo "Generating gRPC code in ${GENERATED_DIR}..."

# Create the generated directory if it doesn't exist already
mkdir -p "${GENERATED_DIR}"

# Clean existing
rm -rf "${GENERATED_DIR}"/*

ALL_PROTO_FILES=$(< "${PROTOS_DIR}"/backend_shared_proto.txt)

# Generate the Typepscript types for the services
for PROTO_FILE in ${ALL_PROTO_FILES}
do
    # Generate the GRPC code for a single service proto file.
    echo "generating gRPC code for ${PROTO_FILE}."

    protoc  --plugin=./node_modules/.bin/protoc-gen-ts_proto ${PROTO_PATH} \
            --ts_proto_out="${GENERATED_DIR}" "${PROTO_FILE}" \
            --ts_proto_opt=esModuleInterop=true
done
