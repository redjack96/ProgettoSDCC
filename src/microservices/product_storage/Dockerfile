# Stage 1 - we prepare the dependencies to install and build
FROM rust as planner
WORKDIR /product_storage
RUN cargo install cargo-chef
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

# Stage 2 - we build (cook) our dependencies with cargo-chef
FROM rust as cacher
WORKDIR /product_storage
RUN cargo install cargo-chef
COPY --from=planner /product_storage/recipe.json recipe.json
RUN apt-get update && apt-get install -y libclang-dev libssl-dev
RUN cargo chef cook --release --recipe-path recipe.json

# Stage 3 - compile only our app
FROM rust as builder
WORKDIR /product_storage
# Copy sources
COPY . .
# Copy dependencies from cacher Stage
COPY --from=cacher /product_storage/target target
COPY --from=cacher /usr/local/cargo /usr/local/cargo
RUN apt-get update && apt-get install -y protobuf-compiler
# Build (only) the app
RUN cargo build --bin product_storage --release

# Use google distroless image to have smaller docker image size
FROM ubuntu

WORKDIR /product_storage
RUN apt-get update && apt-get install libcurl4 libcurl4-openssl-dev -y

# Copy app from builder
COPY --from=builder /product_storage/target/release/product_storage product_storage

# set the startup command to run your binary
CMD ["./product_storage"]