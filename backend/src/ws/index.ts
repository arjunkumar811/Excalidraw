import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface DrawingElement {
  type: string;
  id: string;
  x: number;
  y: number;
  [key: string]: any;
}

interface Room {
  id: string;
  elements: DrawingElement[];
}

const rooms: Record<string, Room> = {};

interface User {
  ws: WebSocket;
  roomId: string | null;
  userId: string;
}

const users: User[] = [];

wss.on("connection", (ws: WebSocket, request) => {
  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }

  // Use a generated random user ID for simplicity
  const userId = "guest_" + Math.random().toString(36).substring(2, 9);

  users.push({
    userId,
    roomId: null,
    ws,
  });

  ws.on("message", (data) => {
    let parsedData;
    try {
      parsedData = JSON.parse(data.toString());
    } catch (err) {
      ws.send(JSON.stringify({ message: "Invalid message format" }));
      return;
    }

    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      if (user) {
        const roomId = parsedData.roomId;
        user.roomId = roomId;

        if (!rooms[roomId]) {
          rooms[roomId] = { id: roomId, elements: [] };
        }

        // Send existing elements to the newly joined user
        ws.send(
          JSON.stringify({
            type: "init",
            elements: rooms[roomId].elements,
          })
        );

        // Broadcast user count
        const usersInRoom = users.filter((u) => u.roomId === roomId);
        usersInRoom.forEach((u) => {
          u.ws.send(
            JSON.stringify({
              type: "userCount",
              count: usersInRoom.length,
              roomId,
            })
          );
        });
      }
    }

    if (parsedData.type === "drawing") {
      const { roomId, message } = parsedData;
      if (!roomId) return;

      const user = users.find((x) => x.ws === ws);
      if (user) {
        try {
          const element = JSON.parse(message);
          if (!rooms[roomId]) rooms[roomId] = { id: roomId, elements: [] };
          rooms[roomId].elements.push(element);
        } catch (e) {
          console.error("Failed to parse drawing element:", e);
        }

        users.forEach((u) => {
          if (u.roomId === roomId && u.ws !== ws) {
            u.ws.send(
              JSON.stringify({
                type: "drawing",
                message,
                roomId,
                userId: user.userId,
              })
            );
          }
        });
      }
    }

    if (parsedData.type === "elementRemoved") {
      const { roomId, elementId } = parsedData;
      if (!roomId || !elementId) return;

      const user = users.find((x) => x.ws === ws);
      if (user && rooms[roomId]) {
        rooms[roomId].elements = rooms[roomId].elements.filter(
          (el) => el.id !== elementId
        );

        users.forEach((u) => {
          if (u.roomId === roomId && u.ws !== ws) {
            u.ws.send(
              JSON.stringify({
                type: "elementRemoved",
                elementId,
                roomId,
                userId: user.userId,
              })
            );
          }
        });
      }
    }

    if (parsedData.type === "elementUpdated") {
      const { roomId, element } = parsedData;
      if (!roomId || !element) return;

      const user = users.find((x) => x.ws === ws);
      if (user && rooms[roomId]) {
        const index = rooms[roomId].elements.findIndex((el) => el.id === element.id);
        if (index !== -1) {
          rooms[roomId].elements[index] = element;
        }

        users.forEach((u) => {
          if (u.roomId === roomId && u.ws !== ws) {
            u.ws.send(
              JSON.stringify({
                type: "elementUpdated",
                element,
                roomId,
                userId: user.userId,
              })
            );
          }
        });
      }
    }

    if (parsedData.type === "clearCanvas") {
      const { roomId } = parsedData;
      if (!roomId) return;

      const user = users.find((x) => x.ws === ws);
      if (user && rooms[roomId]) {
        rooms[roomId].elements = [];

        users.forEach((u) => {
          if (u.roomId === roomId && u.ws !== ws) {
            u.ws.send(
              JSON.stringify({
                type: "clearCanvas",
                roomId,
                userId: user.userId,
              })
            );
          }
        });
      }
    }

    if (parsedData.type === "undo" || parsedData.type === "redo") {
      const { roomId, elements } = parsedData;
      if (!roomId || !Array.isArray(elements)) return;

      const user = users.find((x) => x.ws === ws);
      if (user && rooms[roomId]) {
        rooms[roomId].elements = elements;

        users.forEach((u) => {
          if (u.roomId === roomId && u.ws !== ws) {
            u.ws.send(
              JSON.stringify({
                type: parsedData.type,
                elements,
                roomId,
                userId: user.userId,
              })
            );
          }
        });
      }
    }
  });

  ws.on("close", () => {
    const userIndex = users.findIndex((x) => x.ws === ws);
    if (userIndex !== -1) {
      const user = users[userIndex];
      const roomId = user.roomId;
      users.splice(userIndex, 1);

      if (roomId) {
        const usersInRoom = users.filter((u) => u.roomId === roomId);
        usersInRoom.forEach((u) => {
          u.ws.send(
            JSON.stringify({
              type: "userCount",
              count: usersInRoom.length,
              roomId,
            })
          );
        });
      }
    }
  });
});
