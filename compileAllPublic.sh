#!/bin/bash

# Change to the "./public" directory
cd ./public || exit

# Find all .ts files recursively and compile them
find . -name "*.ts" -exec tsc {} \;
