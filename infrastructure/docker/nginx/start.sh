#!/bin/bash
sed -i 's/default_server/'"$APP_URL"'/g' /etc/nginx/conf.d/certbot.conf

nginx -g "daemon off;"
