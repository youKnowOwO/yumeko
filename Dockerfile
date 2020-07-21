FROM node:12-alpine

LABEL name "Yumeko"

WORKDIR /usr/Yumeko

RUN apk add --no-cache --virtual .build-deps python g++ make yarn \
    && yarn install \
    && yarn build \
    && apk del .build-deps

COPY package.json yarn.lock

CMD ["node", "dist"]
