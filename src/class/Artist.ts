import { Prisma } from "@prisma/client"
import { prisma } from "../prisma"
import { uid } from "uid"
import { Band, band_include } from "./Band"
import { Event, event_include } from "./Event"
import { UploadedFile } from "express-fileupload"
import { saveFile } from "../tools/saveFile"

export type ArtistPrisma = Prisma.ArtistGetPayload<{}>
export interface ArtistForm {
    name: string
    description?: string
    image?: string
    instagram?: string
    birthdate?: string
}

export class Artist {
    id: string
    name: string
    description: string | null
    image: string | null
    instagram: string | null
    birthdate: string | null

    static async new(data: ArtistForm) {
        const new_artist = await prisma.artist.create({
            data: {
                id: uid(),
                name: data.name,
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
        this.birthdate = data.birthdate
        this.image = data.image
        this.instagram = data.instagram
    }

    load(data: ArtistPrisma) {
        this.id = data.id
        this.name = data.name
        this.description = data.description
        this.birthdate = data.birthdate
        this.image = data.image
        this.instagram = data.instagram
    }

    async update(data: Partial<ArtistForm>) {
        const result = await prisma.artist.update({
            where: { id: this.id },
            data: {
                name: data.name,
                description: data.description,
                birthdate: data.birthdate,
                image: data.image,
                instagram: data.instagram,
            },
        })
        this.load(result)
    }

    async updateImage(file: UploadedFile) {
        const { url } = saveFile(`/artists/${this.id}`, { name: file.name, file: file.data })
        await this.update({ image: url })

        return url
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

    async delete() {
        const result = await prisma.artist.delete({ where: { id: this.id } })
        return true
    }
}
