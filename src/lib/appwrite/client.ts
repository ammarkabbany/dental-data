import { Account, Client, Databases, Avatars, Teams, Storage, Functions } from "appwrite";

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)

const account = new Account(client)
const databases = new Databases(client)
const avatars = new Avatars(client)
const teams = new Teams(client)
const storage = new Storage(client)
const functions = new Functions(client)

export { account, databases, avatars, client, teams, storage, functions }