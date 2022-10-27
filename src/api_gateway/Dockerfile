# Here we do a multi-build dockerfile to reduce final container size
# first we start from rust image and install our app
FROM rust:latest as builder
WORKDIR /usr/src/myapp
COPY Cargo.toml .
# important: api_client is the bin name. The crate name is defined in Cargo.toml
RUN apt-get update && apt-get install -y protobuf-compiler && rm -rf /var/lib/apt/lists/*
# first we install all the dependency and cache it (we do not want to download all dependencies every time)
RUN cargo fetch

COPY src/ ./src
COPY shopping_list.proto .
COPY build.rs .
# now we run the app
# TODO: aggiungi --release  !!!
RUN cargo build
CMD ["cargo", "run"]
