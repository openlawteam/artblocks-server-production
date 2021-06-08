FROM node:10 as builder
WORKDIR /server
COPY package.json ./
COPY package-lock.json ./
COPY . ./
RUN npm install

ENTRYPOINT [ "sh", "-c", "npm run $SCRIPT_NAME" ]
