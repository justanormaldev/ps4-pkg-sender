FROM node:8

WORKDIR /opt/apps/pkg_sender

COPY package.json package.json
RUN npm install
#RUN npm install http-server -g
Run npm install lru-cache --save

COPY src src
COPY bin/run bin/run

CMD ["bin/run"]
