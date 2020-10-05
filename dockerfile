FROM ubuntu:18.04

RUN apt-get update && apt-get -y upgrade \
    && mkdir /usr/src/app \
    && apt-get install -y curl build-essential autoconf libtool pkg-config nasm \
    && curl -sL https://deb.nodesource.com/setup_11.x -o nodesource_setup.sh \
    && bash nodesource_setup.sh \
    && apt-get install -y nodejs \
    && node -v 

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD [ "npm", "start" ]