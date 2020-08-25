FROM node:12-alpine as build-stage

WORKDIR /tmp/build

COPY . .

# Install build tools for node-gyp
RUN apk add --no-cache build-base curl git python3 \
# Some required shared libraries for node-canvas
cairo-dev jpeg-dev pango-dev giflib-dev pixman-dev pangomm-dev libjpeg-turbo-dev freetype-dev

# Install node dependencies
RUN yarn install \
# Build typescript project
&& yarn build \
# Prune dev dependencies
&& yarn install --production

FROM node:12-alpine

LABEL name "Yumeko"

WORKDIR /app

# Copy needed project files
COPY --from=build-stage dist ./
COPY --from=build-stage config.json ./
COPY --from=build-stage assets ./
COPY --from=build-stage node_modules ./
COPY --from=build-stage package.json ./

# Install dependencies
RUN apk add --no-cache pixman cairo pango giflib \
# node-canvas default font
ttf-opensans ttf-dejavu ttf-droid ttf-freefont ttf-liberation ttf-ubuntu-font-family fontconfig

CMD ["node", "index.js"]