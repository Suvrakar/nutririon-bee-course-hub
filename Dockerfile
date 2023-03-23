FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]

# Command 
# docker build -t my-node-app .
# docker run -p 3000:3000 my-node-app

