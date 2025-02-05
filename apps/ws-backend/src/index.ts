import { WebSocket, WebSocketServer } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-comman/config';
import { prismaClient } from '@repo/db/client';

const wss = new WebSocketServer({ port: 8080 });

interface Users {
    ws: WebSocket;
    rooms: string[];
    userId: string;
}

const users: Users[] = [];

function CheckUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        if (!decoded || !decoded.userId) {
            return null;
        }

        return decoded.userId;
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            console.error('Token expired');
        } else {
            console.error('Invalid token:', err.message);
        }
        return null;
    }
}

wss.on('connection', (ws: WebSocket, request) => {
    const url = request.url;

    if (!url) {
        ws.close();
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token');

    if (!token) {
        ws.send(JSON.stringify({
            message: 'Unauthorized'
        }));
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

    ws.on('message', async function message(data) {
        let ParseData;

        try {
            ParseData = JSON.parse(data.toString());
        } catch (err) {
            ws.send(JSON.stringify({ message: 'Invalid message format' }));
            return;
        }

        if (ParseData.type === 'join_room') {
            const user = users.find(x => x.ws === ws);
            if (user) {
                user.rooms.push(ParseData.roomId);
            }
        }

        if (ParseData.type === 'leave_room') {
            const user = users.find(x => x.ws === ws);
            if (user) {
                user.rooms = user.rooms.filter(x => x !== ParseData.room);
            }
        }

        if (ParseData.type === 'chat') {
            const { roomId, message } = ParseData;

            if (!roomId || typeof message !== 'string') {
                ws.send(JSON.stringify({ message: 'Invalid chat payload' }));
                return;
            }

            const user = users.find(x => x.ws === ws)
            if(user)
            await prismaClient.chat.create({
                data: {
                  roomId: Number(roomId),
                  message,
                 userId: user.userId
                }
              });



            users.forEach(user => {
                if (user.rooms.includes(roomId)) {
                    user.ws.send(JSON.stringify({
                        type: 'chat',
                        message: message,
                        roomId
                    }));
                }
            });
        }
    });

    ws.on('close', () => {
        const userIndex = users.findIndex(x => x.ws === ws);
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
        }
        console.log('Client disconnected');
    });
});
