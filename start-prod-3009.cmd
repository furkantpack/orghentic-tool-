@echo off
cd /d "%~dp0"
npm.cmd run start -- --port 3009 >> next-3009.log 2>> next-3009.err.log
