@echo off
REM ------------------------------------------
REM This script runs your Go app with CGO + gcc
REM It injects a working PATH manually
REM ------------------------------------------

set "PATH=C:\Go\bin;C:\TDM-GCC-64\bin;C:\Windows\System32"
set "CGO_ENABLED=1"

echo Running main.go with custom environment...
go run main.go

pause