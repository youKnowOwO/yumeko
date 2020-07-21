FROM node:12-alpine

LABEL name "Yumeko"

WORKDIR /usr/Yumeko

COPY . .

RUN echo ✨ Installing build deps..
    && apk add --no-cache --virtual .build-deps python g++ make yarn \
    && echo 🗑️ Cleanning package cache..
    && yarn clean cache \
    && echo 🔗 Installing dependencies..
    && yarn install \
    && echo ✍️ Building source..
    && yarn build \
    && echo 🗑️ Cleanning Dev dependencies..
    && yarn install --production
    && apk del .build-deps

CMD ["node", "dist"]
