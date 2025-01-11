FROM node:lts-alpine AS build

WORKDIR /app
RUN yarn install
COPY . .
RUN yarn build

FROM node:lts-alpine AS run
WORKDIR /app
COPY package*.json .
COPY yarn* .
COPY .env .
RUN yarn install --production --frozen-lockfile
COPY --from=build /app/dist ./dist
CMD ["node", "dist/main.js"]
