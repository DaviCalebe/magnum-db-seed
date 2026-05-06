import prisma from "../src/config/database"
import { fakerPT_BR as faker } from "@faker-js/faker"

const clientes = 10;

async function main() {
    for (let i = 0; i < clientes; i++) {
        const nome = faker.person.fullName();
        const email = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ /g, '.') + '@magnumtires.com.br';
        await prisma.clientes.create({
            data: {
                nome,
                email,
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