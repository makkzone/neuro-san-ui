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

# Define directories
GENERATED_DIR=./generated
PROTOS_DIR=./proto

# Hack: google proto files expect to be in a certain hardcoded location, so we copy them there
mkdir -p "${PROTOS_DIR}/internal"
cp -r "node_modules/protobufjs/google" "${PROTOS_DIR}/internal"

OPENAPIV2=protoc-gen-openapiv2
GRPC_ECOSYSTEM_PATH="grpc-ecosystem/grpc-gateway/v2"

# This is a hack to avoid nasty problems with proto files
# import paths and such.
# End result is much simpler generation, and these extra protobuf features
# will likely go away anyway, when we abandon Golang implementation.
echo "Copying up ${OPENAPIV2} directory"
rm -rf "${PROTOS_DIR:?}/${OPENAPIV2:?}"
cp -R "${PROTOS_DIR}/${GRPC_ECOSYSTEM_PATH}/${OPENAPIV2}" "${PROTOS_DIR}"

# Ordering matters w/rt where generated file is output
PROTO_PATH="--proto_path=${GENERATED_DIR} \
            --proto_path=${PROTOS_DIR} \
            --proto_path=${PROTOS_DIR}/grpc-ecosystem/grpc-gateway/v2 \
            --proto_path=./node_modules/protobufjs"

echo "PROTO_PATH=${PROTO_PATH}"
echo "Generating gRPC code in ${GENERATED_DIR}..."

# Create the generated directory if it doesn't exist already
mkdir -p "${GENERATED_DIR}"

# Clean existing
rm -rf "${GENERATED_DIR:?}"/*

ALL_PROTO_FILES=$(< "${PROTOS_DIR}"/mdserver_proto.txt)

# Generate the Typepscript types for the services
for PROTO_FILE in ${ALL_PROTO_FILES}
do
    # Generate the GRPC code for a single service proto file.
    echo "generating gRPC code for ${PROTO_FILE}."

    # See ts-proto doc (linked at top of this file) for what these various options do
     # shellcheck disable=SC2086    # PROTO_PATH is compilation of cmd line args
    protoc  --plugin=./node_modules/.bin/protoc-gen-ts_proto ${PROTO_PATH} \
            --ts_proto_opt=comments=false \
            --ts_proto_opt=esModuleInterop=true \
            --ts_proto_opt=forceLong=number \
            --ts_proto_opt=lowerCaseServiceMethods=true \
            --ts_proto_opt=outputClientImpl=false \
            --ts_proto_opt=outputEncodeMethods=false \
            --ts_proto_opt=outputJsonMethods=true \
            --ts_proto_opt=outputServices=false \
            --ts_proto_opt=removeEnumPrefix=true \
            --ts_proto_opt=snakeToCamel=keys \
            --ts_proto_opt=stringEnums=true \
            --ts_proto_opt=useSnakeTypeName=false \
            --ts_proto_out="${GENERATED_DIR}" "${PROTO_FILE}"
done
