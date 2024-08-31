# Use the official Rust image as the base image
FROM rust:latest as builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the Cargo.toml and Cargo.lock files
COPY Cargo.toml Cargo.lock ./

# Copy the source code
COPY . .

# Build the application in release mode
RUN cargo build --release

# Create a smaller final image
FROM debian:buster-slim

# Copy the compiled binary from the builder stage
COPY --from=builder /usr/src/app/target/release/bitlet /usr/local/bin/bitlet

# Expose the port the app runs on
EXPOSE 3030

# Set the command to run the binary
CMD ["bitlet-backend"]
