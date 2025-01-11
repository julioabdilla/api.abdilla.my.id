FROM node:lts-alpine AS run
WORKDIR /app
CMD ["node", "dist/main.js"]
