FROM ubuntu:26.04 AS prod

ENV DEBIAN_FRONTEND=noninteractive

# System dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        wget \
        nodejs \
        npm \
        imagemagick \
        libfreetype6  \
        fontconfig  \
        fonts-dejavu \
        fonts-liberation \
        webp \
    && fc-cache -f -v \
    && wget -qO /etc/apt/trusted.gpg.d/obs-openscad-nightly.asc https://files.openscad.org/OBS-Repository-Key.pub \
    && echo "deb https://download.opensuse.org/repositories/home:/t-paul/xUbuntu_26.04/ ./" > /etc/apt/sources.list.d/openscad-nightly.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends openscad-nightly \
    && apt-get purge -y --auto-remove wget \
    && apt-get clean \
    && rm -rf  /var/lib/apt/lists/* /tmp/* /var/tmp/*

FROM node:22-alpine AS build
WORKDIR /app
COPY  src/package.json src/package-lock.json ./src/
COPY  srv/package.json srv/package-lock.json ./srv/

RUN cd src && npm i --no-audit --no-fund
RUN cd srv && npm i --no-audit --no-fund

COPY . .

RUN cd src && npm run build
RUN cd src && npm run build


FROM prod
WORKDIR /home/openscad
COPY --chmod=555 entrypoint.sh /entrypoint.sh
COPY --from=build /app/ /home/openscad/
RUN chown -R 1000:1000 /home/openscad/src/gen/
RUN cd src && npm install --omit=dev --no-audit --no-fund
RUN cd srv && npm install --omit=dev --no-audit --no-fund

USER 1000:1000
VOLUME /home/openscad/src/gen/
EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
