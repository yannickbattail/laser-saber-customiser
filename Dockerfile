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

WORKDIR /home/ubuntu

COPY . .

RUN cd ./src  && npm install --no-audit --no-fund && npm run build \
 && cd ../srv && npm install --no-audit --no-fund && npm run build

COPY --chmod=555 entrypoint.sh /entrypoint.sh

USER ubuntu
VOLUME /home/openscad/src/gen/
EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
