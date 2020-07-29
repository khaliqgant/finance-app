FROM staticfloat/nginx-certbot
COPY ./auth/htpasswd /etc/nginx/auth
COPY ./infrastructure/docker/nginx/default.conf /etc/nginx/user.conf.d/default.conf
COPY ./infrastructure/docker/nginx/includes/ /etc/nginx/includes/
COPY ./infrastructure/docker/nginx/start.sh /start.sh

RUN chmod +x /start.sh
ENTRYPOINT ["/start.sh"]

