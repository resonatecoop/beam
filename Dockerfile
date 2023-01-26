FROM nginx:alpine

RUN rm /usr/share/nginx/html/index.html
COPY build /usr/share/nginx/html

COPY conf/default.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 5000
CMD ["nginx", "-g", "daemon off;"]
