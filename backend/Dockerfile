FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/prisma ./prisma
RUN npx prisma generate
COPY backend/tsconfig.json ./tsconfig.json
COPY backend/src ./src
COPY backend/tests ./tests
RUN npm run build
ENV NODE_ENV=production
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
