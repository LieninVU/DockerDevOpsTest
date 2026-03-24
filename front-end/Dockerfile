FROM node
WORKDIR /front
COPY package.json package-lock.json ./
COPY public ./public
COPY src ./src
COPY .env ./
EXPOSE 2000
RUN npm install
CMD ["npm","start"]