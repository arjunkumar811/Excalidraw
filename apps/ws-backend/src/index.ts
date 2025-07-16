import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-comman/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface Users {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: Users[] = [];

function CheckUser(token: string): string | null {
  // Handle guest tokens
  if (token.startsWith("guest_")) {
    return token; // Use the guest ID as the userId
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      console.error("Token expired");
    } else {
      console.error("Invalid token:", err.message);
    }
    return null;
  }
}

wss.on("connection", (ws: WebSocket, request) => {
  const url = request.url;

  if (!url) {
    ws.close();
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");

  if (!token) {
    ws.send(
      JSON.stringify({
        message: "Unauthorized",
      })
    );
    ws.close();
    return;
  }

  const userAuthenticated = CheckUser(token);

  if (!userAuthenticated) {
    ws.close();
    return;
  }

  users.push({
    userId: userAuthenticated,
    rooms: [],
    ws,
  });

  ws.on("message", async function message(data) {
    let ParseData;

    try {
      ParseData = JSON.parse(data.toString());
    } catch (err) {
      ws.send(JSON.stringify({ message: "Invalid message format" }));
      return;
    }
    if (ParseData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      if (user) {
        user.rooms.push(ParseData.roomId);

        // Notify all users in the room about the new user
        const usersInRoom = users.filter((u) =>
          u.rooms.includes(ParseData.roomId)
        );

        // Send the user count to all users in the room
        usersInRoom.forEach((u) => {
          u.ws.send(
            JSON.stringify({
              type: "userCount",
              count: usersInRoom.length,
              roomId: ParseData.roomId,
            })
          );
        });
      }
    }
    if (ParseData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (user) {
        const roomId = ParseData.roomId || ParseData.room;
        user.rooms = user.rooms.filter((x) => x !== roomId);

        // Notify remaining users in the room
        const usersInRoom = users.filter((u) => u.rooms.includes(roomId));

        // Send the updated user count
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
    if (ParseData.type === "chat") {
      const { roomId, message } = ParseData;

      if (!roomId || typeof message !== "string") {
        ws.send(JSON.stringify({ message: "Invalid chat payload" }));
        return;
      }

      const user = users.find((x) => x.ws === ws);
      if (user) {
        // Only save to database if it's a registered user (not a guest)
        if (!user.userId.startsWith("guest_")) {
          try {
            await prismaClient.chat.create({
              data: {
                roomId: Number(roomId),
                message,
                userId: user.userId,
              },
            });
          } catch (error) {
            console.error("Failed to save chat message to database:", error);
            // Continue even if database save fails
          }
        }

        // Broadcast the message to all users in the room
        users.forEach((u) => {
          if (u.rooms.includes(roomId)) {
            u.ws.send(
              JSON.stringify({
                type: "chat",
                message: message,
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
      // Get all rooms the user was in before removing them
      const userRooms = user ? [...user.rooms] : [];

      // Remove the user from the users array
      users.splice(userIndex, 1);

      // Notify other users in each room that this user was in
      userRooms.forEach((roomId) => {
        const usersInRoom = users.filter((u) => u.rooms.includes(roomId));

        // Update user count for each room
        usersInRoom.forEach((u) => {
          u.ws.send(
            JSON.stringify({
              type: "userCount",
              count: usersInRoom.length,
              roomId,
            })
          );
        });
      });
    }
    console.log("Client disconnected");
  });
});
