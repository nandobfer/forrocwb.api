import express, { Express, Request, Response } from 'express'
import login from './login'
import { authenticate, AuthenticatedRequest } from "../../middlewares/authenticate"
import { User } from "../../class/User"

const router = express.Router()

router.use("/login", login)

router.get("/", authenticate, async (request: AuthenticatedRequest, response: Response) => {
    try {
        const user = await User.findById(request.userId!)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

export default router