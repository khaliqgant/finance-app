FROM node:16 as app

RUN apt-get update && apt-get install git-crypt

COPY . /src
WORKDIR /src

RUN npm ci --dev
RUN npm install -g nodemon

RUN chmod +x ./infrastructure/docker/node/entrypoint.sh


FROM app AS appFiles
USER node
COPY --chown=node:node --from=app /src /finances
WORKDIR /finances
ENTRYPOINT ["./infrastructure/docker/node/entrypoint.sh"]
