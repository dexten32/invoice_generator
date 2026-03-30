const prisma = require('./lib/prisma');

async function testSave() {
  const existing = await prisma.company.findFirst();
  if (!existing) {
    console.log('No company found to update.');
    return;
  }

  console.log('Existing company:', existing.id);
  
  const updated = await prisma.company.update({
    where: { id: existing.id },
    data: {
      companyName: 'Cynox Security LLP TEST',
      email: 'test@cynox.com',
      website: 'www.cynox-test.com',
      bankName: 'Test Bank',
      accountNumber: '123456789',
      ifscCode: 'TEST0001',
      bankLocation: 'Mumbai',
      signatureName: 'John Doe Signatory',
      signatureImage: 'data:image/png;base64,...test_sign...',
    }
  });

  console.log('Update result:', JSON.stringify(updated, null, 2));
}

testSave()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
