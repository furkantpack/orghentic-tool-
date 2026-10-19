@echo off
cd /d "%~dp0"
npm.cmd run start -- --port 3010 >> prod-3010.log 2>> prod-3010.err.log
