import prisma from "../src/config/database"
import { fakerPT_BR as faker } from "@faker-js/faker"


const clientes = 10;
const colaboradores = 30;
const dadosUnidades = [
    {
        cidade: 'João Pessoa',
    estado: 'PB'
  },
  {
    cidade: 'Campina Grande',
    estado: 'PB'
  },
  {
    cidade: 'Recife',
    estado: 'PE'
  },
  {
    cidade: 'Natal',
    estado: 'RN'
  },
  {
    cidade: 'Fortaleza',
    estado: 'CE'
  },
  {
    cidade: 'Maceió',
    estado: 'AL'
  },
  {
    cidade: 'Salvador',
    estado: 'BA'
  }
]
const dadosSetores = [
    {
        nome: 'Comercial',
        descricao: 'Responsável por gerenciar as vendas e o relacionamento com os clientes.'
    },
    {
        nome: 'Financeiro',
        descricao: 'Responsável por gerenciar as finanças da empresa, incluindo contas a pagar e a receber, fluxo de caixa e planejamento financeiro.'
    },
    {
        nome: 'RH',
        descricao: 'Responsável por gerenciar os recursos humanos da empresa, incluindo recrutamento, seleção, treinamento e desenvolvimento dos colaboradores.'
    },
    {
        nome: 'Logística',
        descricao: 'Responsável por gerenciar a cadeia de suprimentos da empresa, incluindo o transporte, armazenamento e distribuição dos produtos.'
    },
    {
        nome: 'CFTV',
        descricao: 'Responsável por gerenciar o sistema de câmeras de vigilância da empresa.'
    }
]

async function createClientes() {
    for (let i = 0; i < clientes; i++) {
        const nome = faker.person.fullName();
        const email = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ /g, '.') + '@clientes.com.br';
        await prisma.clientes.create({
            data: {
                nome,
                email,
                telefone: faker.phone.number(),
            }
        })
    }
}

async function createUnidades() {
    const unidadesCriadas = []
    for (let i = 0; i < dadosUnidades.length; i++) {
        const unidades = dadosUnidades[i]

        const unidade = await prisma.unidades.create({
            data: {
                nome: `Magnum Tires ${unidades.estado} - ${unidades.cidade}`,
                cnpj: faker.string.numeric(14),
                telefone: `(${faker.number.int({ min: 11, max: 99 })}) 9${faker.number.int({ min: 1000, max: 9999 })}-${faker.number.int({ min: 1000, max: 9999 })}`,
                email: faker.internet.email(),
                endereco: faker.location.streetAddress(),
                cidade: unidades.cidade,
                estado: unidades.estado,
                cep: faker.location.zipCode('########'),
            }
        })
        unidadesCriadas.push(unidade);
    }
    return unidadesCriadas;
}

async function createSetores() {
    const setoresCriados = [];
    for (let i = 0; i < dadosSetores.length; i++) {
        const setores = dadosSetores[i]

        const setor = await prisma.setores.create({
            data: {
                nome: setores.nome,
                descricao: setores.descricao,
                status: 'ativo',
            }
        })
        setoresCriados.push(setor);
    }
    return setoresCriados;
}

async function createColaboradores (unidadesCriadas: string | any[], setoresCriados: string | any[]) {
    for (let i = 0; i < colaboradores; i++) {
        const nome = faker.person.fullName();
        const email = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ /g, '.') + '@magnumtires.com.br';
        await prisma.colaboradores.create({
            data: {
                nome,
                email,
                telefone: faker.phone.number(),
                ocupacao: faker.person.jobTitle(),
                unidade_id: unidadesCriadas[i % unidadesCriadas.length].id,
                setor_id: setoresCriados[i % setoresCriados.length].id
            }
        })
    }
}

async function main() {
    await createClientes();
    const unidadesCriadas = await createUnidades();
    const setoresCriados = await createSetores();
    await createColaboradores(unidadesCriadas, setoresCriados);
    
}

main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})