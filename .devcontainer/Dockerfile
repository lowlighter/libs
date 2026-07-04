FROM mcr.microsoft.com/devcontainers/base:debian

# Install Docker CLI + Compose plugin from Docker's official repo
RUN sudo apt-get update \
    && sudo apt-get install -y ca-certificates curl gnupg \
    && sudo install -m 0755 -d /etc/apt/keyrings \
    && curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
    && sudo chmod a+r /etc/apt/keyrings/docker.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && sudo apt-get update \
    && sudo apt-get install -y docker-ce-cli docker-compose-plugin

# Install Deno into a shared prefix on PATH
# `a+rx` so the non-root `vscode` user can execute it
ENV DENO_INSTALL=/usr/local
RUN curl -fsSL https://deno.land/install.sh | sh -s \
    && chmod -R a+rx ${DENO_INSTALL}/bin/deno \
    && deno --version

