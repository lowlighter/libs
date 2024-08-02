FROM mcr.microsoft.com/devcontainers/base:debian

# Install deno
ENV DENO_INSTALL=/deno
RUN mkdir -p /deno \
    && curl -fsSL https://deno.land/install.sh | sh \
    && chown -R vscode /deno
ENV PATH=${DENO_INSTALL}/bin:${PATH} \
    DENO_DIR=${DENO_INSTALL}/.cache/deno

# Install Rust and Cargo
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

# Install Node.js
RUN apt-get update \
    && apt-get install -y nodejs npm

# Install Bun
ENV BUN_INSTALL=/bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH=${BUN_INSTALL}/bin:${PATH}
