@ECHO OFF

CD client

IF "%1"=="start" (
	START nginx -p nginx
)

IF "%1"=="stop" (
	nginx -s stop -p nginx
)

CD ..
