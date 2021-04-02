FROM nginx:1.19.7

ARG UID
ARG GID
ARG USER
ARG GROUP

ENV UID=${UID}
ENV GID=${GID}
ENV USER=${USER}
ENV GROUP=${GROUP}

RUN set -x \
 && export DEBIAN_FRONTEND=noninteractive \
 && apt-get update -qq --yes \
 && apt-get install -qq --no-install-recommends --yes \
  certbot \
  cron \
 >/dev/null \
 && apt-get autoremove --yes >/dev/null \
 && apt-get clean autoclean >/dev/null

RUN set -x \
  && rm -rf /etc/nginx \
  && rm -rf /etc/cron.d/certbot \
  && touch /var/log/cron.log \
  && mkdir -p /var/lib/nginx/logs \
  && ln -sf /dev/stdout /var/lib/nginx/logs/access.log \
  && ln -sf /dev/stderr /var/lib/nginx/logs/error.log \
  && rm -rf /usr/share/nginx/html/*

COPY config/docker/nginx/files /

CMD set -x \
  && cron \
  && nginx -g 'daemon off;'
