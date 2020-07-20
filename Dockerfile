FROM node:12-alpine

LABEL name "Yumeko"

WORKDIR /usr/Yumeko

RUN apk add --no-cache --virtual .build-deps python g++ make git curl \
    && npm install -g yarn && yarn \
    && yarn build \
    && apk del .build-deps

COPY . .

CMD ["node", "dist"]