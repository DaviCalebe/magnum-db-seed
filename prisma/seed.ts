import prisma from "../src/config/database"
import { faker } from "@faker-js/faker"

const clientes = 10;

async function main() {
    for (let i = 0; i < clientes; i++) {
        await prisma.clientes.create({
            data: {
                nome: faker.person.fullName(),
                email: faker.internet.email(),
                telefone: faker.phone.number(),
            }
        })
    }
}

main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})