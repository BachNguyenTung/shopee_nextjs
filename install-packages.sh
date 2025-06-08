#!/bin/bash
echo "Installing packages in monorepo"
cd packages/utils && npm install
cd packages/ui && npm install
cd packages/tailwind-config && npm install
cd packages/eslint-config && npm install
cd ../..
