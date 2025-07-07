import express, { Express, Request, Response } from "express"
import user from "./src/rest/user/user"
import { version } from "./src/version"

export const router = express.Router()

router.get("/", (request, response) => {
    response.json({ version })
})

router.use("/user", user)
