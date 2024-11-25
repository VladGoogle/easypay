# Stage 1: Build the application
FROM node:21-alpine AS development

WORKDIR /app

COPY package*.json yarn*.lock ./

RUN apk update && \
    apk add --no-cache \
    chromium

RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install --only=production --frozen-lockfile

COPY . .

RUN yarn build

# Stage 2: Run the application
FROM node:21-alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json yarn.lock ./

COPY --from=development /app/dist ./dist

CMD [ "yarn", "start:prod" ]
