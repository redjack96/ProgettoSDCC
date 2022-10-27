# Here we do a multi-build dockerfile to reduce final container size
# first we start from rust image and install our app
FROM rust:latest as builder
#WORKDIR /usr/src/myapp
#COPY Cargo.toml .
## important: api_client is the bin name. The crate name is defined in Cargo.toml
#RUN apt-get update && apt-get install -y protobuf-compiler && rm -rf /var/lib/apt/lists/*
## first we install all the dependency and cache it (we do not want to download all dependencies every time)
#RUN cargo fetch
#
#COPY src/ ./src
#COPY shopping_list.proto .
#COPY build.rs .
## now we run the app
## TODO: aggiungi --release  !!!
#RUN cargo build
#CMD ["cargo", "run"]
RUN apt-get update && apt-get install -y protobuf-compiler && rm -rf /var/lib/apt/lists/*
# create a new empty shell project
RUN USER=root cargo new api_gateway
WORKDIR /api_gateway

# copy over your manifests
COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml
COPY ./src/lib.rs ./src/lib.rs
COPY ./shopping_list.proto ./shopping_list.proto
COPY build.rs ./build.rs

# this build step will cache your dependencies
RUN cargo build --release
RUN rm src/*.rs

# copy your source tree
COPY ./src ./src


# build for release
RUN rm ./target/release/deps/api_client*
RUN cargo build --bin api_client --release

# set the startup command to run your binary
CMD ["./target/release/api_client"]