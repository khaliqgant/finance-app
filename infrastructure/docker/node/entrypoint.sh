#!/bin/bash

echo "$GIT_CRYPT_KEY" | base64  -d > ./git-crypt-key
git checkout -- .
git-crypt unlock ./git-crypt-key
rm ./git-crypt-key

nodemon server.js
