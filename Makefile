PROJECT_NAME := "fullstack"
PKG := "$(PROJECT_NAME)"
PKG_LIST := $(shell go list ${PKG}/src/...)

#  .PHONY: all dep build clean test coverage coverhtml lint secrets image
.PHONY: all dep build

all: image

dep: ## Get the dependencies
	@glide install
	@npm install

quick: ## Build the binary file
	@go build -o dist/server -v src/go/server.go
	@npm run-script build
	@go run src/go/server.go

build: dep ## Build the binary file
	@go build -o dist/server -v src/go/server.go
	@npm run-script build

help: ## Display this help screen
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

image: build ## Build docker image
	sh build.sh

lint: ## Lint the files
	@echo Running lint
	@golint -set_exit_status ./src/...

test: ## Run unit tests
	@go test ${PKG_LIST}

# npm_update_all:
# 	npm install -g npm-check-updates
# 	ncu -u
# 	npm install

#  clean: ## Remove previous build and generated output files
#    @rm -f bin/srv-$(PKG)
#    @rm -f coverage.html
#    @rm -f secret.yml
#    @rm -f env.list
#    @rm -f cmd/secret.yml
#    @rm -f cmd/env.list
