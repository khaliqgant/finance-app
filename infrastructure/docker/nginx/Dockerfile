FROM nginx
COPY ./auth/htpasswd /etc/nginx/auth
COPY ./infrastructure/docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./infrastructure/docker/nginx/includes/ /etc/nginx/includes/

