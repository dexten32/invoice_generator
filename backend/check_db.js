const prisma = require('./lib/prisma');

async function main() {
  const company = await prisma.company.findFirst();
  console.log('Company Profile:', JSON.stringify(company, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
