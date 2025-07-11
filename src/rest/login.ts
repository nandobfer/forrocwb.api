import express, { Express, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { LoginForm, User } from "../class/User"

const router = express.Router()

router.post("/", async (request: Request, response: Response) => {
    const data = request.body as LoginForm

    try {
        const user = await User.login(data)
        if (!user) {
            return response.status(401).json({ error: "Invalid credentials" })
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" })
        return response.send(token)
    } catch (error) {
        console.log(error)
        return response.status(500).send(error)
    }
})

export default router
