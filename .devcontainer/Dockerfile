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

# Install google chrome
RUN curl -fsSL https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] https://dl-ssl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list \
    && sudo apt-get update \
    && sudo apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-freefont-ttf libxss1 --no-install-recommends \
    && google-chrome --version
ENV ASTRAL_BIN_PATH=/usr/bin/google-chrome-stable
ENV ASTRAL_BIN_ARGS="--no-sandbox --disable-dev-shm-usage"

# Install rust
RUN curl -fsSL https://sh.rustup.rs | bash -s -- -y \
    && . "$HOME/.cargo/env" \
    && cargo --version

# Install Deno into a shared prefix on PATH
ENV DENO_INSTALL=/usr/local
RUN curl -fsSL https://deno.land/install.sh | sh -s \
    && chmod -R a+rx ${DENO_INSTALL}/bin/deno \
    && deno --version

