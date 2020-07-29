#!/bin/bash
sed -i '3i\server_name '"$APP_URL;"'\' /etc/nginx/conf.d/certbot.conf

bash /scripts/entrypoint.sh
