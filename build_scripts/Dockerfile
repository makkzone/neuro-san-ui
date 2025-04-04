ARG PYTHON_VERSION
ARG GIT_VERSION
ARG PANDAS_VERSION
# Stage 1: Builder Stage - Use a pre-built base that contains
# 1. git - we did this because we need to build git from source to avoid
#    a critical cve. Git is needed because of our reliance on our own private repos
# 2. pandas - due to current python/pandasai/pandas compatibility, we have to
#    build pandas 1.5.3 from source, which is very slow. 
FROM public.ecr.aws/q0i6b0q4/python-git-pandas:${PYTHON_VERSION}-${GIT_VERSION}-${PANDAS_VERSION} AS builder

# We have to redefine the ARG here in order to use it inside the 
# image as env var during build time.
ARG PYTHON_VERSION
# We need to set this as env var so it can be replaced in the
# PACKAGES_PATH
ENV PYTHON_VERSION=${PYTHON_VERSION}

##############################################################
#			Basic Housekeeping
##############################################################
LABEL maintainer=donn.goodhew@cognizant.com
ENV LANG C.UTF-8
ENV PIP3_VERSION 24.0
ENV DEBIAN_FRONTEND noninteractive

# Set the shell and options per hadolint recommendations
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Ubuntu basics

# Install shellcheck without specifying version. Specified version does not install
# and while there may be ways to install a specific version of shellcheck, it requires
# installing other tools which also do not install in a simple versioned way.
# Ultimately, trying to appease hadolint for shellcheck ends up making the Dockerfile
# worse and not better.
# hadolint ignore=DL3008
RUN apt-get update -y \
    && apt-get install --no-install-recommends -y \
            shellcheck \
            build-essential \
            jq=1.6-2.1 \
            wget \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean \
    && rm -rf \
            /tmp/* \
            /var/tmp/* \
            /usr/share/man \
            /usr/share/doc \
            /usr/share/doc-base

# Change EXTERNAL_BUILD_ROOT to . if debugging locally
ENV EXTERNAL_BUILD_ROOT .

ARG USERNAME leaf
RUN  adduser --disabled-password --gecos '' ${USERNAME}

# The APP_HOME home is our root directory within the image
# where we place the repo's source directory.
ARG APP_HOME /home/${USERNAME}
ENV BUILD_LOCAL ${APP_HOME}/build_local

# Build a local version of the OpenFGA CLI called fga.
# This requires a go build (downloaded here) and
# build-essentials (for make) in the apt-get installs above.
# OpenFGA client lib is at python 0.9.0.    How does this relate?
ENV FGA_VERSION 0.5.1
ENV FGA_TAG v${FGA_VERSION}
ENV OPEN_FGA_CLI ${BUILD_LOCAL}/cli
ENV FGA_GO_VERSION 1.22.5
ENV GO_DEST ${BUILD_LOCAL}
RUN mkdir -p ${OPEN_FGA_CLI}
WORKDIR ${OPEN_FGA_CLI}
RUN git clone --branch ${FGA_TAG} https://github.com/openfga/cli ${OPEN_FGA_CLI} \
    && wget --progress=dot:giga https://go.dev/dl/go${FGA_GO_VERSION}.linux-amd64.tar.gz \
    && rm -rf ${GO_DEST}/go \
    && tar -C ${GO_DEST} -xzf go${FGA_GO_VERSION}.linux-amd64.tar.gz \
    && PATH="${PATH}:${GO_DEST}/go/bin" make build \
    && cp ${OPEN_FGA_CLI}/dist/fga /usr/bin/fga \
    && rm -rf ${GO_DEST}/go \
    && rm -rf ${OPEN_FGA_CLI}

ENV PYTHONPATH="/install/lib/python${PYTHON_VERSION}/site-packages:$PYTHONPATH"

# Make directories as needed and install stuff
RUN mkdir -p ${APP_HOME} \
    && pip3 install --no-cache-dir --upgrade pip==${PIP3_VERSION} \
    wheel==0.40.0 \
    virtualenv==20.26.2

ARG REPO
ARG APP_SOURCE ${APP_HOME}/${REPO}
RUN mkdir -p ${APP_SOURCE}

# Now bring all of our requirement files in and pip install as needed.
# Create a separate layer for each of the requirements files for maximum
# caching performance. Ordered by general frequency of change, least-to-most.
# We use A COPY step before the pip install in the RUN step so that requirements
# only changes cause a proper container rebuild.
COPY --chown=${USERNAME}:${USERNAME} ${EXTERNAL_BUILD_ROOT}/requirements-build.txt ${APP_SOURCE}
RUN /bin/bash -c "pip3 install -r ${APP_SOURCE}/requirements-build.txt"

# Use the with_creds_requirements secret as the basis for the pip install
# of the main requirements.  We still do the COPY first so the container
# cache is properly broken on changes.
#
# NOTE: We expect the with_creds_requirement file to provide us with
#       ephemeral GitHub creds from vault as the proper replacement mechanism
#       for LEAF_SOURCE_CREDENTIALS.  This way, it's OK if these inherently
#       short-lived happen to be stored in the container.
COPY --chown=${USERNAME}:${USERNAME}  ${EXTERNAL_BUILD_ROOT}/requirements.txt ${APP_SOURCE}
RUN --mount=type=secret,id=with_creds_requirements \
    pip install --extra-index-url https://download.pytorch.org/whl/cpu \
        -r /run/secrets/with_creds_requirements

# in practice break the cache since we build when code changes.
# We do this after all the requirements are installed as code changes more often than requirements
COPY --chown=${USERNAME}:${USERNAME} . ${APP_SOURCE}

# UNILEAF SPECIAL
# Now run the generation stuff since that may need to be run after code changes in python or go
# This includes generated gRPC files as well as OpenFGA policy files.
WORKDIR ${APP_SOURCE}
RUN ./backend/grpc/do_generate.sh \
    && ./backend/grpc/do_mdserver_generate.sh \
    && chown ${USERNAME}:${USERNAME} backend/grpc/generated/* \
    && ./backend/pmdserver/authorization/open_fga/transform_fga.sh \
    && chown ${USERNAME}:${USERNAME} ./backend/pmdserver/authorization/open_fga/*.json

USER ${USERNAME}
WORKDIR ${APP_HOME}
