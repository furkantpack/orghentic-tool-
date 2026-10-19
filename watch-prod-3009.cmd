@echo off
cd /d "%~dp0"

:restart
echo [%date% %time%] starting Orgentic on port 3009>> next-3009.log
npm.cmd run start -- --port 3009 >> next-3009.log 2>> next-3009.err.log
echo [%date% %time%] server exited, restarting in 2 seconds>> next-3009.err.log
timeout /t 2 /nobreak > nul
goto restart
