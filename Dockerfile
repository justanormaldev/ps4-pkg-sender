FROM node:8

WORKDIR /opt/apps/pkg_sender

COPY package.json package.json
RUN npm install
#RUN npm install http-server -g

COPY src src
COPY bin/run bin/run

CMD ["bin/run"]
