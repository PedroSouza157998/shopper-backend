FROM node:20-alpine

WORKDIR .

COPY . .

RUN rm -rf node_modules
RUN rm -rf build
RUN npm install

EXPOSE 3000

CMD [ "npm",  "start" ]