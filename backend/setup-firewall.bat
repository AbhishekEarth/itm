@echo off
:: Run this file as Administrator to open port 5432 for team access
netsh advfirewall firewall delete rule name="PostgreSQL 5432 Team Access" >nul 2>&1
netsh advfirewall firewall add rule name="PostgreSQL 5432 Team Access" dir=in action=allow protocol=TCP localport=5432
echo.
echo [OK] Firewall rule added - PostgreSQL port 5432 is now open on this machine.
echo.
echo Team members can connect using:
echo   Host    : 10.19.172.152
echo   Port    : 5432
echo   Database: itmgoi
echo   User    : postgres
echo   Password: (shared separately)
echo.
pause
