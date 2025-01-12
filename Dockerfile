FROM node:18

# Create app directory
WORKDIR /usr/src/app

ENV PORT 8080


# Install app dependencies
COPY /package*.json ./
RUN npm install --silent
# RUN npm install pm2 -g

# Bundle app source
COPY . .

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \ 
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
RUN apt-get update && apt-get -y install google-chrome-stable

RUN npm install -g puppeteer --unsafe-perm=true -allow-root
RUN apt install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

# RUN npm i -g webdriver-manager
# RUN webdriver-manager update
# RUN webdriver-manager status
RUN mkdir /nonexistent
RUN chmod -R 777 /nonexistent

EXPOSE 8080
USER root

    
#scaling
# CMD ["pm2-runtime", "index.js","--no-daemon", "-i","-0"]
CMD [ "node", "index.js" ]



# FROM ubuntu:22.04

# RUN apt-get update && apt-get upgrade -y
# RUN apt-get install -y curl
# RUN curl -sL https://deb.nodesource.com/setup_16.x | bash
# RUN apt-get install -y nodejs

# # RUN apt install chromium-browser -y
# RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
# RUN apt install ./google-chrome-stable_current_amd64.deb
# RUN apt update



# WORKDIR /usr/src/app
# COPY . .
# ENV NODE_ENV=production
# RUN npm install --production
# RUN chmod 777 /usr/src/app/dockerentrypoint.sh

# EXPOSE 80
# ENTRYPOINT ["/usr/src/app/dockerentrypoint.sh"]