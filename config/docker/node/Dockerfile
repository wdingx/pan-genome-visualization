# We freeze the image to this particular hash which points to node:10.24.0-buster
# https://hub.docker.com/layers/node/library/node/10.24.0-buster/images/sha256-59aeb3af09a43a5fb9078d559755e0b9c89d141ccd866127abeac39a06b7d8de
FROM node@sha256:59aeb3af09a43a5fb9078d559755e0b9c89d141ccd866127abeac39a06b7d8de

ARG UID
ARG GID
ARG USER
ARG GROUP

ENV UID=${UID}
ENV GID=${GID}
ENV USER=${USER}
ENV GROUP=${GROUP}

#RUN set -x \
#  && export DEBIAN_FRONTEND=noninteractive \
#  && apt-get update -qq --yes \
#  && apt-get install -qq --no-install-recommends --yes \
#
#  >/dev/null \
#  && apt-get autoremove --yes >/dev/null \
#  && apt-get clean autoclean >/dev/null

RUN set -x \
  && if ! grep -q -E "^${GROUP}" /etc/group && [ "$(getent group ${GID})" == ""]; then addgroup --gid "${GID}" "${GROUP}"; fi \
  && if ! grep -q -E "^${USER}:" /etc/passwd && [ "$(getent passwd ${UID})" == "" ]; then adduser --system --uid "${UID}" --ingroup "${GROUP}" --home "/home" --shell /bin/bash "${USER}"; fi

COPY . /app

RUN set -x \
  && mkdir -p /home/$USER \
  && chown $UID:$GID -R /home/$USER \
  && chown $UID:$GID -R /app

WORKDIR /app

RUN set -x \
  && npm install \
  && npm run build

USER $UID:$GID

ENTRYPOINT ["npm", "start"]
