FROM node:lts-alpine AS build
WORKDIR /app
RUN npm i -g @nestjs/cli
COPY package*.json .
COPY yarn* .
RUN yarn install
COPY . .
RUN yarn build

FROM node:lts-alpine AS migration
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.env .env
COPY --from=build /app/.sequelizerc .sequelizerc
COPY --from=build /app/src/database/migrations ./src/database/migrations
COPY --from=build /app/src/database/seeders ./src/database/seeders
COPY --from=build /app/src/database/sequelizerc.config.js ./src/database/sequelizerc.config.js

FROM node:lts-alpine AS run
WORKDIR /app
COPY package*.json .
COPY yarn* .
RUN yarn install --production --frozen-lockfile
COPY --from=build /app/dist ./dist
CMD ["node", "dist/main.js"]
