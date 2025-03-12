FROM openscad/openscad:dev

ARG F3D_URL="https://github.com/f3d-app/f3d/releases/download/v3.0.0/F3D-3.0.0-Linux-x86_64.deb"

#RUN echo F3D_URL="${F3D_URL}" SCADFORMAT_URL="${SCADFORMAT_URL}"
# install tools
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        ca-certificates \
        jq \
        imagemagick \
        webp \
        xvfb \
        zip \
        unzip \
        nodejs \
        npm

# install f3d last releases
RUN curl -L -o /tmp/f3d.deb "${F3D_URL}" \
    && apt-get install -y --no-install-recommends libxcursor1 /tmp/f3d.deb \
    && f3d --version \
    && rm -rf /var/lib/apt/lists/* /tmp/f3d.deb

RUN groupadd -g 1000 openscad \
    && useradd -m -u 1000 -g 1000 -d /home/openscad -s /bin/bash openscad \
    && mkdir /home/openscad/.config/ \
    && chown -R 1000:1000 /home/openscad/.config/ /openscad

COPY --chmod=555 entrypoint.sh /entrypoint.sh
COPY ./node_modules/ /node_modules/
COPY ./commons/ /commons/
COPY ./src/ /src/
COPY ./srv/ /srv/

RUN chown -R 1000:1000 /srv/generatedImages

USER 1000:1000
WORKDIR /srv/
#VOLUME /srv/generatedImages
EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
