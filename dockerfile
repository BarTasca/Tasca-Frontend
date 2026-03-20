FROM node:22-bookworm-slim AS builder
WORKDIR /app

ARG VITE_MODE=production
ARG VITE_API_BASE_URL
ARG VITE_SIGNALR_HUB_TICKETS
ARG VITE_SIGNALR_TICKET_EVENTS
ARG VITE_SIGNALR_HUB_PUBLIC

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SIGNALR_HUB_TICKETS=$VITE_SIGNALR_HUB_TICKETS
ENV VITE_SIGNALR_TICKET_EVENTS=$VITE_SIGNALR_TICKET_EVENTS
ENV VITE_SIGNALR_HUB_PUBLIC=$VITE_SIGNALR_HUB_PUBLIC

COPY package.json package-lock.json ./
RUN npm ci \
  || (npm i -D @rollup/rollup-linux-x64-gnu && npm ci)

COPY . .

RUN npm run type-check
RUN npm run build-only -- --mode ${VITE_MODE}

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 