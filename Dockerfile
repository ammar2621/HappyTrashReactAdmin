FROM nginx:stable
MAINTAINER "famri@alterra.id"

RUN mkdir -p /alterra/www/frontendadmin.fikriamri.xyz
RUN mkdir -p /alterra/logs/nginx

COPY default.conf /etc/nginx/conf.d/
COPY . /alterra/www/frontendadmin.fikriamri.xyz/

WORKDIR /alterra/www/frontendadmin.fikriamri.xyz