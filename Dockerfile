FROM node:20

# Create app directory
WORKDIR /usr/src/app

ENV PORT 8080

# Install app dependencies
COPY /package*.json ./
RUN npm install
# RUN npm install pm2 -g

# Bundle app source
COPY . ./

EXPOSE 8080

#scaling
# CMD ["pm2-runtime", "index.js", "-i","-0"]
CMD [ "npm","start" ]