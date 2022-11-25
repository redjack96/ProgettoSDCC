FROM node:19-alpine as builder
# Adding build tools to make yarn install work on Apple silicon / arm64 machines
RUN apk add --no-cache python3 g++ make

WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci
ENV NODE_ENV=production
EXPOSE 3000
COPY ./tsconfig.json ./tsconfig.json
COPY ./public ./public
COPY ./src ./src
# Build the app
RUN npm run build

FROM node:19-alpine as runner
COPY --from=builder /app/build /app/build
WORKDIR /app
RUN npm install -g serve
# production build
CMD serve -s build