import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

export interface AuthenticatedRequest extends Request {
    userId: string | null
}

export const authenticate = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    const reject = () => response.status(401).json({ error: "not authorized" })
    const auth_header = request.headers.authorization

    if (!auth_header || !auth_header.includes("Bearer ")) {
        reject()
        return
    }

    const spllited = auth_header.split("Bearer ")
    if (spllited.length != 2) {
        reject()
        return
    }

    const token = spllited[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
        request.userId = decoded.id
        next()
    } catch (error) {
        reject()
    }
}
