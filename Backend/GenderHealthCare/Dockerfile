# Sử dụng image Java chính thức
FROM openjdk:17-jdk-slim

# Tạo thư mục app trong container
WORKDIR /app

# Copy file jar vào container
COPY target/Group4Project-0.0.1-SNAPSHOT.jar app.jar

# Cấu hình port để expose
EXPOSE 8080

# Lệnh chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
