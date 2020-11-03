FROM node:14

# install git and nodemon
RUN apt-get update && \
    apt-get install git && \
    npm install -g nodemon

# fetch latest $state
WORKDIR /usr/share/
RUN git clone https://github.com/stroskler/finance-app.git

# install npm requirements
WORKDIR /usr/share/finance-app/
RUN npm install && \
    chmod +x entrypoint.sh

# start command
CMD ["/bin/bash", "/usr/share/finance-app/entrypoint.sh"]

# port used by http
EXPOSE 3000

# adding volume to pass-through config
VOLUME ["/usr/share/finance-app"]
