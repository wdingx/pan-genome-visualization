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
  && if ! grep -q -E "^${GROUP}" /etc/group && [ "$(getent group ${GID})" == ""]; then addgroup --gid "${GID}" "${GROUP}"; fi \
  && if ! grep -q -E "^${USER}:" /etc/passwd && [ "$(getent passwd ${UID})" == "" ]; then adduser --system --uid "${UID}" --ingroup "${GROUP}" --home "/home" --shell /bin/bash "${USER}"; fi

COPY config/docker/nginx/files /

RUN set -x \
  && mkdir -p /home/$USER \
  && mkdir -p /var/lib/nginx/logs \
  && mkdir -p /var/cache/nginx \
  && touch /var/lib/nginx/logs/access.log \
  && touch /var/lib/nginx/logs/error.log \
  && ln -sf /dev/stdout /var/lib/nginx/logs/access.log \
  && ln -sf /dev/stderr /var/lib/nginx/logs/error.log \
  && chown $UID:$GID -R /home/$USER \
  && chown $UID:$GID -R /var/lib/nginx \
  && chown $UID:$GID -R /var/cache/nginx

USER $UID:$GID

ENTRYPOINT ["nginx", "-g", "daemon off;"]
