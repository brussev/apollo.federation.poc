FROM node:14.18-alpine3.11

ENV NODE_ENV=production

WORKDIR /opt/app
RUN chown -R 1000:1000 /opt

ADD --chown=1000:1000 ./yarn.lock /opt/app/
ADD --chown=1000:1000 ./package.json /opt/app/
ADD --chown=1000:1000 ./dist/ /opt/app/dist
ADD --chown=1000:1000 ./scripts/ /opt/app/utils

RUN yarn install --production

COPY --chown=1000:1000 . /opt/app/

USER 1000

CMD [ "yarn", "start:prod" ]
