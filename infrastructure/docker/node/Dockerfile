FROM node:10.16.0

WORKDIR /finances

RUN apt-get update && apt-get install git-crypt

RUN mkdir -p /finances/node_modules
RUN chown -R node:node /finances/node_modules

COPY --chown=node:node package.json package-lock.json ./

RUN npm ci --dev
RUN npm install -g nodemon

COPY --chown=node:node . /finances
RUN chmod +x ./infrastructure/docker/node/entrypoint.sh

USER node

ENTRYPOINT ["./infrastructure/docker/node/entrypoint.sh"]
