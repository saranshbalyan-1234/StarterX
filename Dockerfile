FROM node:22 AS build-env
COPY . /app
WORKDIR /app
ENV NODE_ENV=production
RUN npm ci

# FROM gcr.io/distroless/nodejs20-debian12
FROM node:22 
COPY --from=build-env /app /app

RUN curl -L https://github.com/grafana/k6/releases/download/v0.44.1/k6-v0.44.1-linux-amd64.tar.gz | tar xvz && \
    mv k6-v0.44.1-linux-amd64/k6 /usr/bin/k6 && \
    rm -rf k6-v0.44.1-linux-amd64

WORKDIR /app

#K6
# RUN curl -s https://k6.io/releases/latest/k6-latest-linux-amd64.tar.gz \
#     | tar -xz -C /usr/local/bin
# RUN k6 version
#K6



ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080
CMD ["index.js"]