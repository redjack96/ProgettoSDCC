# Here we do a multi-build dockerfile to reduce final container size
# first we start from rust image and install our app
FROM rust:latest as builder

RUN apt-get update && apt-get install -y protobuf-compiler && rm -rf /var/lib/apt/lists/*
# create a new empty shell project
RUN USER=root cargo new product_storage
WORKDIR /product_storage

# copy over your manifests
COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml
COPY ./src/lib.rs ./src/lib.rs
COPY ./product_storage.proto ./product_storage.proto
COPY build.rs ./build.rs

# this build step will cache your dependencies
RUN cargo build --release
RUN rm src/*.rs

# copy your source tree
COPY ./src ./src


# build for release
RUN rm ./target/release/deps/product_storage*
RUN cargo build --bin product_storage --release

# set the startup command to run your binary
CMD ["./target/release/product_storage"]