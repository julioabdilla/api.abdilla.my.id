FROM node:lts-alpine
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY .env .
RUN yarn install
RUN yarn build
COPY dist/ .
CMD [ "node", "dist/main.js" ]