FROM node
WORKDIR /front
COPY package.json package-lock.json ./
COPY public ./public
COPY src ./src
EXPOSE 3000
ARG REACT_APP_SERVER=http://localhost:2000
ENV REACT_APP_SERVER=$REACT_APP_SERVER
RUN npm install
CMD ["npm","start"]