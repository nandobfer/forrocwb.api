import { Prisma } from "@prisma/client"
import { prisma } from "../prisma"
import { uid } from "uid"
import { Band, band_include } from "./Band"
import { Event, event_include } from "./Event"

export type ArtistPrisma = Prisma.ArtistGetPayload<{}>
export interface ArtistForm {
    name: string
    description: string
}

export class Artist {
    id: string
    name: string
    description: string

    static async new(data: ArtistForm) {
        const new_artist = await prisma.artist.create({
            data: {
                id: uid(),
                name: data.name,
                description: data.description,
            },
        })

        return new Artist(new_artist)
    }

    static async getAll() {
        const data = await prisma.artist.findMany({})
        return data.map((item) => new Artist(item))
    }

    static async findById(id: string) {
        const data = await prisma.artist.findUnique({ where: { id } })
        if (data) return new Artist(data)
        return null
    }

    constructor(data: ArtistPrisma) {
        this.id = data.id
        this.name = data.name
        this.description = data.description
    }

    load(data: ArtistPrisma) {
        this.id = data.id
        this.name = data.name
        this.description = data.description
    }

    async update(data: Partial<Artist>) {
        const result = await prisma.artist.update({
            where: { id: this.id },
            data: {
                name: data.name,
                description: data.description,
            },
        })
        this.load(result)
    }

    async getBands() {
        const result = await prisma.band.findMany({ where: { artists: { some: { id: this.id } } }, include: band_include })
        return result.map((item) => new Band(item))
    }

    async getEvents() {
        const result = await prisma.event.findMany({
            where: { artists: { some: { id: this.id } } },
            include: event_include,
        })
        return result.map((item) => new Event(item))
    }
}
