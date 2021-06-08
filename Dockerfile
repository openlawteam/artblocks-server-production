FROM node:10 as builder
WORKDIR /server
COPY package.json ./
COPY package-lock.json ./
COPY . ./
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable libxss1 libnspr4 libnspr4-dev libnss3 libnss3-dev libgbm-dev libatk-bridge2.0-0 libx11-xcb1 libxtst6 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
RUN npm ci
ENTRYPOINT [ "sh", "-c", "npm run $SCRIPT_NAME" ]
