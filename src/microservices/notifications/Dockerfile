FROM maven:3.8.2-eclipse-temurin-17
WORKDIR /notifications
COPY . .
#RUN mvn protobuf:compile
#RUN mvn verify
CMD ["java", "-cp", "target/notifications-1.0-jar-with-dependencies.jar", "com.sdcc.shoppinglist.server.NotificationConsumer", "kafka://kafka:9092"]
#CMD ["mvn", "exec:java", "-q", "-D\"exec.mainClass=com.sdcc.shoppinglist.server.JavaGrpcClient\""]