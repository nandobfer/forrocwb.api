import { Prisma } from "@prisma/client"
import { Band, band_include } from "./Band"
import { prisma } from "../prisma"
import { Artist } from "./Artist"
import { uid } from "uid"

export const event_include = Prisma.validator<Prisma.EventInclude>()({
    bands: { include: band_include },
    artists: true,
})

export type EventPrisma = Prisma.EventGetPayload<{ include: typeof event_include }>
export type EventForm = Omit<Event, "id">

export interface Location {
    street: string
    district: string
    number: string
    cep: string
    complement: string
}

export class Event {
    id: string
    title: string
    description: string
    datetime: string
    price: number
    location: Location
    bands: Band[]
    artists: Artist[]

    static async getAll() {
        const data = await prisma.event.findMany({ include: event_include })
        return data.map((item) => new Event(item))
    }

    static async findById(id: string) {
        const data = await prisma.event.findUnique({ where: { id }, include: event_include })
        if (data) return new Event(data)
        return null
    }

    static async new(data: EventForm) {
        const new_event = await prisma.event.create({
            data: {
                id: uid(),
                title: data.title,
                description: data.description,
                datetime: data.datetime,
                price: data.price,
                location: JSON.stringify(data.location),
                bands: { connect: data.bands.map((band) => ({ id: band.id })) },
                artists: { connect: data.artists.map((artist) => ({ id: artist.id })) },
            },
            include: event_include,
        })

        return new Event(new_event)
    }

    constructor(data: EventPrisma) {
        this.id = data.id
        this.title = data.title
        this.description = data.description
        this.datetime = data.datetime
        this.price = data.price
        this.location = JSON.parse(data.location as string)
        this.bands = data.bands.map((item) => new Band(item))
        this.artists = data.artists.map((item) => new Artist(item))
    }

    load(data: EventPrisma) {
        this.id = data.id
        this.title = data.title
        this.description = data.description
        this.datetime = data.datetime
        this.price = data.price
        this.location = JSON.parse(data.location as string)
        this.bands = data.bands.map((item) => new Band(item))
        this.artists = data.artists.map((item) => new Artist(item))
    }

    async update(data: Partial<EventForm>) {
        const result = await prisma.event.update({
            where: { id: this.id },
            data: {
                title: data.title,
                description: data.description,
                datetime: data.datetime,
                price: data.price,
                location: JSON.stringify(data.location),
                bands: data.bands ? { set: [], connect: data.bands.map((band) => ({ id: band.id })) } : undefined,
                artists: data.artists ? { set: [], connect: data.artists.map((artist) => ({ id: artist.id })) } : undefined,
            },
            include: event_include,
        })
        this.load(result)
    }
}
