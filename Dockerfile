FROM oven/bun:1 AS build-env
COPY . /app
WORKDIR /app
ENV NODE_ENV=production
RUN bun install --production --frozen-lockfile

FROM oven/bun:1
COPY --from=build-env /app /app
WORKDIR /app

#K6
# RUN curl -s https://k6.io/releases/latest/k6-latest-linux-amd64.tar.gz \
#   | tar -xz -C /usr/local/bin
# RUN k6 version
#K6

ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080
CMD ["bun","index.js"]
