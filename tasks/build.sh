#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Print shell input lines as they are read
set -v

# Clean dist and package folder
rm -rf dist
rm -rf artifact

mkdir dist
mkdir artifact
mkdir -p dist/scripts/info

# Get package name and version
PACKAGE_NAME=`node -e "console.log(require('./package.json').name);"`
PACKAGE_VERSION=`node -e "console.log(require('./package.json').version);"`

# Git revision
git-rev dist/VERSION

# Copy assets
cp -r assets package.json dist/
cp -r scripts/info dist/scripts

# Install production dependencies
npm install --production --prefix dist

# Transpile
babel scripts --out-dir dist/scripts/ --source-maps true
babel src --out-dir dist/src/ --source-maps true
babel config --out-dir dist/config/ --source-maps true
babel ${PACKAGE_NAME}.js --out-dir dist/ --source-maps true

# Create Tar
tar -czf artifact/${PACKAGE_NAME}-${PACKAGE_VERSION}.tar.gz -C dist .
