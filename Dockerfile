FROM node:14

# install git and nodemon
RUN apt-get update && \
    apt-get install git && \
    npm install -g nodemon

# fetch latest $state
WORKDIR /usr/share/
RUN git clone https://github.com/khaliqgant/finance-app.git

# install npm requirements
WORKDIR /usr/share/finance-app/
RUN npm install

CMD ["nodemon", "server.js"]
EXPOSE 3000
