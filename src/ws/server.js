import { WebSocket, WebSocketServer } from "ws";
import { wsArcjet } from "../arcjet.js";

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload) {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) continue;
    client.send(JSON.stringify(payload));
  }
}

export function attachWebSocketServer(server) {
 
  const wss = new WebSocketServer({
    noServer: true,
    maxPayload: 1024 * 1024,
  });

  server.on("upgrade", async (req, socket, head) => {
    try {
      if (wsArcjet) {
        const decision = await wsArcjet.protect(req);

        if (decision.isDenied()) {
            if(decision.reason.isRateLimit()) {
                socket.write('HTTP/1.1 429 Too many requests\r\n\r\n');
            } else {
                socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
            }
            socket.destroy();
            return;
        }
      }

      if (req.url !== "/ws") {
        socket.destroy();
        return;
      }

      wss.handleUpgrade(req, socket, head, (ws) => {
          wss.emit("connection", ws, req);
        });
    } catch (err) {
        console.error("WS upgrade error:", err);
        socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
        socket.destroy();
        return;
    }
  });

  wss.on("connection", (socket, req) => {
    socket.isAlive = true;

    socket.on("pong", () => {
      socket.isAlive = true;
    });

    sendJson(socket, { type: "Welcome" });

    socket.on("error", console.error);
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on("close", () => clearInterval(interval));

  function broadcastMatchCreated(match) {
    broadcast(wss, { type: "match_created", data: match });
  }

  return { broadcastMatchCreated };
}