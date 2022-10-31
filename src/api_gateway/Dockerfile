# Stage 1 - we prepare the dependencies to install and build
FROM rust:latest as planner
WORKDIR /api_gateway
RUN cargo install cargo-chef
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

# Stage 2 - we build (cook) our dependencies with cargo-chef
FROM rust:latest as cacher
WORKDIR /api_gateway
RUN cargo install cargo-chef
COPY --from=planner /api_gateway/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json

# Stage 3 - compile only our app
FROM rust:latest as builder
WORKDIR /api_gateway
# Copy sources
COPY . .
# Copy dependencies from cacher Stage
COPY --from=cacher /api_gateway/target target
COPY --from=cacher /usr/local/cargo /usr/local/cargo
RUN apt-get update && apt-get install -y protobuf-compiler
# Build (only) the app
RUN cargo build --bin api_client --release

# Use google distroless image to have smaller docker image size
FROM ubuntu

WORKDIR /api_gateway
RUN apt-get update && apt-get install libcurl4 libcurl4-openssl-dev -y

# Copy app from builder
COPY --from=builder /api_gateway/target/release/api_client api_client

# set the startup command to run your binary
CMD ["./api_client"]