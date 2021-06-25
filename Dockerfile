FROM node:14.16.0

COPY ./wh2o-web/ /var/www

WORKDIR /var/www

EXPOSE 3001

# RUN chown -R node:node /var/www
# USER node

RUN npm install
RUN npm run build

#RUN npm ci --quiet && npm run build
#
#RUN npm ci --production --quiet
#
#RUN npm cache clean --force

CMD ["npm", "start" ]
