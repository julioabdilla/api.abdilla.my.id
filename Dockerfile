FROM node:22-alpine AS build

WORKDIR /app
RUN npm i -g @nestjs/cli
RUN yarn install
COPY . .
RUN yarn build

FROM node:22-alpine AS run
WORKDIR /app
COPY package*.json .
COPY yarn* .
COPY .env .
RUN yarn install --production --frozen-lockfile
COPY --from=build /app/dist ./dist
CMD ["node", "dist/main.js"]
