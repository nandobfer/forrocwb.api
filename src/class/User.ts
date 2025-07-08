import { Prisma } from "@prisma/client"
import { prisma } from "../prisma"
import { WithoutFunctions } from "./helpers"
import { uid } from "uid"

export type UserPrisma = Prisma.UserGetPayload<{}>

export type UserForm = Omit<WithoutFunctions<User>, "id"> & {password: string}

export interface LoginForm {
    login: string
    password: string
}

export class User {
    id: string
    name: string
    email: string
    // password: string
    phone: string
    admin: boolean

    static async new(data: UserForm) {
        const new_user = await prisma.user.create({
            data: {
                id: uid(),
                email: data.email,
                name: data.name,
                password: data.password,
                admin: data.admin,
                phone: data.phone,
            },
        })

        return new User(new_user)
    }

    static async login(data: LoginForm) {
        const result = await prisma.user.findFirst({ where: { email: data.login, password: data.password } })
        if (result) return new User(result)

        return null
    }

    static async getAll() {
        const data = await prisma.user.findMany({})
        return data.map((item) => new User(item))
    }

    static async findById(id: string) {
        const data = await prisma.user.findFirst({ where: { id } })
        if (data) return new User(data)
        return null
    }

    static async findByEmail(email: string) {
        const data = await prisma.user.findFirst({ where: { email } })
        if (data) return new User(data)
        return null
    }

    static async delete(user_id: string) {
        const result = await prisma.user.delete({ where: { id: user_id } })
        return new User(result)
    }

    constructor(data: UserPrisma) {
        this.id = data.id
        this.name = data.name
        this.email = data.email
        // this.password = data.password
        this.admin = data.admin
        this.phone = data.phone
    }

    load(data: UserPrisma) {
        this.id = data.id
        this.name = data.name
        this.email = data.email
        // this.password = data.password
        this.admin = data.admin
        this.phone = data.phone
    }

    async update(data: Partial<UserForm>) {
        const updated = await prisma.user.update({
            where: { id: this.id },
            data: {
                admin: data.admin,
                email: data.email,
                name: data.name,
                password: data.password,
                phone: data.phone,
            },
        })

        this.load(updated)
    }
}
