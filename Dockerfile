FROM node:12-alpine

LABEL name "Yumeko"

WORKDIR /usr/Yumeko

COPY . .

RUN echo [INFO] ✨ Installing build deps.. \
    && apk add --no-cache --virtual .build-deps python g++ make yarn \
    && echo [INFO] ⚡ Installing 3rd party package \
    && apk add --no-cache --virtual .deps cairo-dev jpeg-dev pango-dev giflib-dev \
    && apk add --update --repository http://dl-3.alpinelinux.org/alpine/edge/testing libmount ttf-dejavu ttf-droid ttf-freefont ttf-liberation ttf-ubuntu-font-family fontconfig \
    && echo [INFO] 🗑️ Cleanning package cache.. \
    && yarn cache clean \
    && echo [INFO] 🔗 Installing dependencies.. \
    && yarn install \
    && echo [INFO] ✍️ Building source.. \
    && yarn build \
    && echo [INFO] 🗑️ Cleanning Dev dependencies.. \
    && yarn install --production \
    && apk del .build-deps

CMD ["node", "dist"]
