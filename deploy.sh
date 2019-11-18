#!/bin/bash

sudo docker stop frontendadmin
sudo docker rm frontendadmin
sudo docker rmi alfaruqi26/happy-trash-frontend-admin:v1
sudo docker run -d -p 3100:80 --name frontendadmin alfaruqi26/happy-trash-frontend-admin:v1