# Copyright (c) Datalayer, Inc. https://datalayer.io
# Distributed under the terms of the MIT License.

SHELL=/bin/bash

CONDA=source $$(conda info --base)/etc/profile.d/conda.sh
CONDA_ACTIVATE=source $$(conda info --base)/etc/profile.d/conda.sh ; conda activate
CONDA_DEACTIVATE=source $$(conda info --base)/etc/profile.d/conda.sh ; conda deactivate
CONDA_REMOVE=source $$(conda info --base)/etc/profile.d/conda.sh ; conda remove -y --all -n

ENV_NAME=datalayer

.PHONY: help

default: help ## default target is help

all: clean install build

help: ## display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

clean: ## clean
	@exec echo CLEAN
	($(CONDA_ACTIVATE) ${ENV_NAME}; \
		yarn clean )

build: ## build all modules
	@exec echo BUILD
	($(CONDA_ACTIVATE) ${ENV_NAME}; \
		yarn build )

dev: ## start
	($(CONDA_ACTIVATE) ${ENV_NAME}; \
		yarn dev )

publish-npm: clean build ## publish to npm
	@exec echo PUBLISH NPM
	($(CONDA_ACTIVATE) ${ENV_NAME}; \
	  cd icons-react && \
		npm publish --access public )
	echo open https://www.npmjs.com/package/@datalayer/icons-react
