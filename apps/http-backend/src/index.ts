import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-comman/config";
import { middleware } from "./middleware.js";
import cors from "cors";

import {
  CreateRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
const PORT = process.env.PORT || 3002;

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async function (req, res) {
  const ParseData = CreateUserSchema.safeParse(req.body);
  if (!ParseData.success) {
    res.status(400).json({
      message: "Incorrect inputs. Please check your form data.",
    });
    return;
  }

  try {
    const user = await prismaClient.user.create({
      data: {
        email: ParseData.data.email,
        password: ParseData.data.password,
        name: ParseData.data.name,
      },
    });

    // Generate token just like in signin
    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET
    );

    res.json({
      message: "Signup successful",
      userId: user.id,
      name: user.name,
      token: token,
    });
  } catch (error) {
    res.status(409).json({
      message: "User already exists with this email address",
    });  }
});

app.post("/signin", async function (req, res) {
  const ParseData = SigninSchema.safeParse(req.body);
  if (!ParseData.success) {
    res.json({
      message: "Incorrect Input",
    });
    return;
  }
  const user = await prismaClient.user.findFirst({
    where: {
      email: ParseData.data.email,
      password: ParseData.data.password,
    },
  });

  if (!user) {
    return res.status(403).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );
  res.json({
    token,
    userId: user.id,
    name: user.name,
  });
});

app.post("/room", middleware, async function (req, res) {
  const ParseData = CreateRoomSchema.safeParse(req.body);
  if (!ParseData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  //@ts-ignore
  const userId = req.userId;
  try {
    const room = await prismaClient.room.create({
      data: {
        slug: ParseData.data.name,
        adminId: userId,
      },
    });

    res.status(411).json({
      roomId: room.id,
    });
  } catch (e) {
    res.json({
      message: "Room alresdy exist",
    });  }
});

app.get("/chats/:roomId", async function (req, res) {
  try {
    const roomId = Number(req.params.roomId);
    console.log(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });

    res.json({
      messages,
    });
  } catch (e) {
    console.log(e);
    res.json({
      messages: [],
    });  }
});

app.get("/room/:slug", async function (req, res) {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug,
    },
  });

  res.json({
    room,  });
});

app.listen(PORT, function () {
  console.log(`Server is running on http://localhost:${PORT}`);
});
