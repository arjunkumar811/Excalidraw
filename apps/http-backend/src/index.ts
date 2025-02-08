import express from "express"
import jwt from "jsonwebtoken";
console.log(require.resolve("@repo/backend-comman/config"));
import { JWT_SECRET } from "@repo/backend-comman/config"
import { middleware } from "./middleware";


import { CreateRoomSchema, CreateUserSchema, SigninSchema } from '@repo/common/types';
import { prismaClient } from "@repo/db/client";
const PORT = process.env.PORT || 3001;


const app = express();
app.use(express.json());

app.post("/signup", async function(req, res) {

    const ParseData = CreateUserSchema.safeParse(req.body);
if(!ParseData.success) {
    res.json({
        massage: "Incorrect Inputs"
    })
    return;
}
 
try {
const user = await prismaClient.user.create({
    data: {
        email: ParseData.data.email,
        password: ParseData.data.password,
        name: ParseData.data.name
    }
})

    res.json({
        messgae: "you have been signup",
        userId: user.id
    })
} catch {
    res.status(411).json({
        massage : "User already exist"
    })
}
})



app.post("/signin", async function(req, res) {
const ParseData = SigninSchema.safeParse(req.body);
if(!ParseData.success) {
   res.json({
    message: "Incorrect Input"
   })
   return
}

const user = await prismaClient.user.findFirst({
    where: {
        email: ParseData.data.email,
        password: ParseData.data.password
    }
})

if(!user) {
    res.status(403).json({
        message: "Not Authorized"
    })
}



const token = jwt.sign({
    userId: user?.id
}, JWT_SECRET)


    res.json({
        token
    })

})



app.post("/room", middleware, async function(req, res) {
const ParseData = CreateRoomSchema.safeParse(req.body);
if(!ParseData.success) {
    res.json({
        message: "Incorrect inputs"
    })
    return
}

//@ts-ignore
const userId = req.userId;
try {
const room = await prismaClient.room.create({
    data: {
        slug: ParseData.data.name,
        adminId: userId
    }
})

    res.status(411).json({
        roomId: room.id
    }) } catch(e) {
     res.json({
        message: "Room alresdy exist"
     })
    }
})



app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        console.log(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 50
        });

        res.json({
            messages
        })
    } catch(e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
})



app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  