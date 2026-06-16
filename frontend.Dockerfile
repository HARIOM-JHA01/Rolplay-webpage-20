FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

FROM node:20-alpine

RUN npm install -g serve

COPY --from=build /app/build /app

EXPOSE 3000

CMD ["serve", "-s", "/app", "-l", "3000"]
