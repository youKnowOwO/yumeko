FROM node:12-alpine

LABEL name "Yumeko"

WORKDIR /usr/Yumeko

COPY . .

RUN echo [INFO] ✨ Installing build deps.. \
    && apk add --no-cache --virtual .build-deps python g++ make yarn \
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
