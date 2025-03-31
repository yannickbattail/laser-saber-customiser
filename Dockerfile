FROM openscad/openscad:dev AS prod

# install tools
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        webp \
        nodejs \
        npm \
    && rm -rf /var/cache/apt/archives /var/lib/apt/lists/*

RUN groupadd -g 1000 openscad \
    && useradd -m -u 1000 -g 1000 -d /home/openscad -s /bin/bash openscad \
    && mkdir /home/openscad/.config/ \
    && chown -R 1000:1000 /home/openscad/.config/ /openscad


FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json  ./
COPY  commons/package.json ./commons/
COPY  src/package.json ./src/
COPY  srv/package.json ./srv/
RUN npm --workspaces install
COPY . .
RUN npm run --workspaces build


FROM prod
WORKDIR /home/openscad
COPY --chmod=555 entrypoint.sh /entrypoint.sh
COPY --from=build /app/ /home/openscad/
RUN chown -R 1000:1000 /home/openscad/src/gen/
RUN npm --workspaces clean-install --omit=dev

USER 1000:1000
VOLUME /home/openscad/src/gen/
EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
