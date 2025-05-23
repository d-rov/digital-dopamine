#!/bin/bash

# --------------------------------------------
# This script runs your Go app with CGO + GCC
# It manually sets the PATH so Go can find gcc
# --------------------------------------------

export PATH="/c/Go/bin:/c/TDM-GCC-64/bin:/c/Windows/System32:$PATH"
export CGO_ENABLED=1

echo "Running main.go with custom environment..."
go run main.go