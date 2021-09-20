# Install dependencies only when needed
FROM node:14.17.3

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app
COPY package*.json ./
RUN npm config set update-notifier false && \
    npm install --loglevel error

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]