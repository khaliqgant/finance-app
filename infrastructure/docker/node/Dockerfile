FROM node:10.16.0

WORKDIR /finances

RUN mkdir -p /finances/node_modules
RUN chown -R node:node /finances/node_modules

COPY --chown=node:node package.json package-lock.json ./

RUN npm ci --dev
RUN npm install -g forever nodemon

COPY --chown=node:node . /finances

USER node

CMD ["forever", "start", "-c", "nodemon", "server.js"]
