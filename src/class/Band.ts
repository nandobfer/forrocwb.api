import { Prisma } from "@prisma/client"
import { prisma } from "../prisma"
import { uid } from "uid"
import { Artist } from "./Artist"
import { Event, event_include } from "./Event"

export const band_include = Prisma.validator<Prisma.BandInclude>()({ artists: true })
export type BandPrisma = Prisma.BandGetPayload<{ include: typeof band_include }>
export type BandForm = Omit<Band, "id">

export class Band {
    id: string
    name: string
    description: string
    artists: Artist[]

    static async new(data: BandForm) {
        const new_band = await prisma.band.create({
            data: {
                id: uid(),
                name: data.name,
                description: data.description,
                artists: { connect: data.artists.map((artist) => ({ id: artist.id })) },
            },
            include: band_include,
        })

        return new Band(new_band)
    }

    static async getAll() {
        const data = await prisma.band.findMany({ include: band_include })
        return data.map((item) => new Band(item))
    }

    static async findById(id: string) {
        const data = await prisma.band.findUnique({ where: { id }, include: band_include })
        if (data) return new Band(data)
        return null
    }

    constructor(data: BandPrisma) {
        this.id = data.id
        this.name = data.name
        this.description = data.description
        this.artists = data.artists.map((artist) => new Artist(artist))
    }

    load(data: BandPrisma) {
        this.id = data.id
        this.name = data.name
        this.description = data.description
        this.artists = data.artists.map((artist) => new Artist(artist))
    }

    async update(data: Partial<BandForm>) {
        const result = await prisma.band.update({
            where: { id: this.id },
            data: {
                name: data.name,
                description: data.description,
                artists: data.artists ? { set: [], connect: data.artists.map((artist) => ({ id: artist.id })) } : undefined,
            },
            include: band_include,
        })
        this.load(result)
    }

    async getEvents() {
        const result = await prisma.event.findMany({
            where: { bands: { some: { id: this.id } } },
            include: event_include,
        })
        return result.map((item) => new Event(item))
    }
}
