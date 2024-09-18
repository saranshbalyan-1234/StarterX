FROM node:20 AS build-env
COPY . /app
WORKDIR /app
ENV NODE_ENV=production
RUN npm ci

FROM gcr.io/distroless/nodejs20-debian12
COPY --from=build-env /app /app
WORKDIR /app
ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080
CMD ["index.js"]