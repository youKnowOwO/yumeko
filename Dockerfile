FROM node:12-alpine as build-stage

WORKDIR /tmp/build

# Copy package.json and yarn.lock
COPY package.json .
COPY yarn.lock .

# Install build tools for node-gyp
RUN apk add --no-cache build-base curl git python3 \
    # And some required shared libraries for node-canvas
    cairo-dev jpeg-dev pango-dev giflib-dev pixman-dev pangomm-dev libjpeg-turbo-dev freetype-dev

# Install node dependencies
RUN yarn install

# Now copy project files
COPY . .

# Prune dev dependencies
RUN yarn install --production

# Get ready for production
FROM node:12-alpine

LABEL name "Yumeko"

WORKDIR /app

# Install dependencies
RUN apk add --no-cache pixman cairo pango giflib libjpeg-turbo freetype \
    # and node-canvas default font
    ttf-opensans ttf-dejavu ttf-droid ttf-freefont ttf-liberation ttf-ubuntu-font-family fontconfig

# Copy needed project files
COPY --from=build-stage /tmp/build/package.json .
COPY --from=build-stage /tmp/build/yarn.lock .
COPY --from=build-stage /tmp/build/node_modules ./node_modules
COPY --from=build-stage /tmp/build/assets ./assets
COPY --from=build-stage /tmp/build/dist .

CMD ["node", "dist"]