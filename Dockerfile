# Build stage
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@latest
RUN npm install --include=dev
RUN ls -la node_modules/.bin
RUN npm list tailwindcss
COPY . .
RUN npx tailwindcss -i ./src/input.css -o ./dist/output.css --minify

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
