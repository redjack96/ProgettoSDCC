FROM rust:latest as builder
WORKDIR /usr/src/myapp
COPY . .
RUN cargo install --bin api_gateway --path .

FROM debian:buster-slim
RUN apt-get update && apt-get install -y extra-runtime-dependencies protobuf-compiler && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/myapp /usr/local/bin/myapp
CMD ["./api_client"]
# manca da installare GLIBC_2.32 o 2.34
# RUN ["cargo", "run" , "--bin", "api_client", "--release"]