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

RUN apt-get update \
    && apt-get install -y \
    gconf-service \
    libgbm-dev \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
# RUN npx puppeteer browsers install chrome

#K6
# RUN curl -s https://k6.io/releases/latest/k6-latest-linux-amd64.tar.gz \
#     | tar -xz -C /usr/local/bin
# RUN k6 version
#K6



ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080
CMD ["index.js"]