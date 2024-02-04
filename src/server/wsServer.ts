import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws';
import { appRouter } from './api/root';
import { createTRPCContext } from '~/server/api/trpc';

const wss = new ws.Server({
  port: 3001,
});

const handler = applyWSSHandler({ wss, router: appRouter, createContext: createTRPCContext as any });

wss.on('connection', (ws) => {
  console.log(`Opened Connection (${wss.clients.size})`);
  ws.once('close', () => {
    console.log(`Closed Connection (${wss.clients.size})`);
  });
});     

console.log('✅ WebSocket Server listening on ws://localhost:3001');
process.on('SIGTERM', () => {
  console.log('SIGTERM');
  handler.broadcastReconnectNotification();
  wss.close();
});
