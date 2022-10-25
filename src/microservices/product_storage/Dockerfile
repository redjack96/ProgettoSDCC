FROM rust:latest

WORKDIR /usr/src/product_storage
# COPY e' utile solo per la versione finale
# per sviluppare rapidamente (senza copiare, sfrutta il dockerfile)
# COPY target/release/product_storage .

# Alternative to cargo run
# RUN cargo install --path .
# /usr/local/cargo/bin/product_storage

# TODO: adesso compila ed esegue: finché programmiamo va bene, ma poi quando si rilascia è troppo pesante. Al rilascio, usare una multibuild (e.g. un altro FROM) per evitare di compilare ed eseguire ogni volta
# TODO: ricorda di aggiungere il parametro --release per ottimizzare al massimo il file binario!!!
CMD ["cargo", "run"]
# CMD ["cargo", "run", "--release"]
