import express, { Express, Request, Response } from 'express'
import { Event } from '../../class/Event'

const router = express.Router()

router.get('/', async (request:Request, response:Response) => {    
        try {
            const events = await Event.getAll()
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }

})

export default router