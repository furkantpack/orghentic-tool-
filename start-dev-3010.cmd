@echo off
cd /d "%~dp0"
npm.cmd run dev -- --port 3010 >> dev-3010.log 2>> dev-3010.err.log
