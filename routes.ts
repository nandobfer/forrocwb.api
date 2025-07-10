import express, { Express, Request, Response } from "express"
import { version } from "./src/version"
import user from "./src/rest/user/user"
import event from "./src/rest/event/event"

export const router = express.Router()

router.get("/", (request, response) => {
    response.json({ version })
})

router.use("/user", user)
router.use("/event", event) 
