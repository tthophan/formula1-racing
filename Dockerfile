FROM node:lts as base
COPY     . /app/

FROM     base as test
FROM     base as builder

WORKDIR  /app
RUN yarn install --frozen-lockfile && yarn build && mkdir /pkg && mv dist public package.json yarn.lock /pkg/

FROM node:lts-slim

ENV NODE_ENV=production PORT=80

WORKDIR  /app
COPY     --chown=root:root --from=builder /pkg /app/

RUN yarn install --ignore-scripts --production --frozen-lockfile
USER     root
EXPOSE   80
CMD      ["node", "dist/src/main", "2>&1"]
