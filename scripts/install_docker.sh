#!/usr/bin/env bash

export DEBIAN_FRONTEND=noninteractive

DOCKER_COMPOSE_VERSION=1.27.0
CTOP_VERSION=0.7.4
LAZYDOCKER_VERSION=0.10

# Uninstall old versions:
sudo apt-get update -qq --yes
sudo apt-get remove -qq --yes \
  containerd \
  docker \
  docker-engine \
  docker.io \
  runc

sudo apt-get install -qq --install-recommends --yes \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg-agent \
  lsb-release \
  software-properties-common \
  >/dev/null

# Add Docker’s official GPG key:
curl -fsSL "https://download.docker.com/linux/ubuntu/gpg" | sudo apt-key add -

# Add repo:
sudo sh -c "echo \"deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\" > \"/etc/apt/sources.list.d/docker.list\""

# Install docker community edition:
sudo apt-get update -qq --yes
sudo apt-get install -qq --install-recommends --yes \
  docker-ce=5:20.10.5~3-0~ubuntu-focal \
  docker-ce-cli=5:20.10.5~3-0~ubuntu-focal \
  containerd.io=1.4.4-1 \
  >/dev/null

# Allow current user to run docker without sudo:
sudo groupadd docker 2>/dev/null
sudo gpasswd -a ${USER} docker >/dev/null

sudo service docker restart

# docker-compose
pushd "/tmp" >/dev/null
curl -fsSL "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o "docker-compose"
sudo chmod +x "docker-compose"
sudo mv docker-compose /usr/local/bin/
popd >/dev/null

# ctop
pushd "/tmp" >/dev/null
curl -fsSL "https://github.com/bcicen/ctop/releases/download/v${CTOP_VERSION}/ctop-${CTOP_VERSION}-linux-amd64" -o "ctop"
sudo chmod +x "ctop"
sudo mv ctop /usr/local/bin/
popd >/dev/null

# lazydocker
pushd "/tmp" >/dev/null
curl -fsSL "https://github.com/jesseduffield/lazydocker/releases/download/v${LAZYDOCKER_VERSION}/lazydocker_${LAZYDOCKER_VERSION}_Linux_x86_64.tar.gz" | tar -xz "lazydocker"
chmod +x "lazydocker"
sudo mv lazydocker /usr/local/bin/
popd >/dev/null

# Reload group settings:
exec newgrp docker
