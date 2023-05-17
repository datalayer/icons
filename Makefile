# Copyright (c) Datalayer, Inc. https://datalayer.io
# Distributed under the terms of the MIT License.

SHELL=/bin/bash

CONDA=source $$(conda info --base)/etc/profile.d/conda.sh
CONDA_ACTIVATE=source $$(conda info --base)/etc/profile.d/conda.sh ; conda activate ; conda activate
CONDA_DEACTIVATE=source $$(conda info --base)/etc/profile.d/conda.sh ; conda deactivate
CONDA_REMOVE=source $$(conda info --base)/etc/profile.d/conda.sh ; conda remove -y --all -n

ENV_NAME=datalayer

.PHONY: help

default: help ## default target is help

all: clean install build

help: ## display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

clean: ## clean
	($(CONDA_ACTIVATE) ${ENV_NAME}; \
		yarn clean )

build: ## build all modules
	($(CONDA_ACTIVATE) ${ENV_NAME}; \
		yarn build )

dev: ## start
	($(CONDA_ACTIVATE) ${ENV_NAME}; \
		yarn dev )

publish-web: build ## publish to web
	($(CONDA_ACTIVATE) ${ENV_NAME}; \
	  aws s3 cp \
		./dist \
		s3://datalayer-icons/ \
		--recursive \
		--profile datalayer && \
	  aws cloudfront create-invalidation \
		--distribution-id E3FYSDH2PV7AQ5 \
		--paths / \
		--profile datalayer && \
	echo open ✨  https://icons.datalayer.design )

publish-npm: clean build ## publish to npm
	($(CONDA_ACTIVATE) ${ENV_NAME}; \
	  cd react && \
		npm publish --access public )
	echo open https://www.npmjs.com/package/@datalayer/icons-react
