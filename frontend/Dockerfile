# Stage 1: Compile and Build angular codebase

FROM node:latest as build

WORKDIR /usr/local/app
COPY ./ /usr/local/app/

RUN npm install
RUN npm run build


# Stage 2: Serve app with nginx server

FROM nginx:latest
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/local/app/www /usr/share/nginx/html

# Expose port 80
EXPOSE 80