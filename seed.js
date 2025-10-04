const mongoose = require('mongoose');
const Client = require('./models/Client');
const Case = require('./models/Case');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/lawyer-case-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleClients = [
  {
    name: 'أحمد محمد علي',
    phone: '0501234567',
    email: 'ahmed.mohamed@email.com',
    address: 'شارع الملك فهد، الرياض، المملكة العربية السعودية'
  },
  {
    name: 'فاطمة عبدالله السعد',
    phone: '0509876543',
    email: 'fatima.abdullah@email.com',
    address: 'حي النخيل، جدة، المملكة العربية السعودية'
  },
  {
    name: 'محمد سالم القحطاني',
    phone: '0504567890',
    email: 'mohamed.salem@email.com',
    address: 'شارع العليا، الدمام، المملكة العربية السعودية'
  },
  {
    name: 'نورا عبدالرحمن الشمري',
    phone: '0503210987',
    email: 'nora.abdulrahman@email.com',
    address: 'حي الروضة، مكة المكرمة، المملكة العربية السعودية'
  }
];

const sampleCases = [
  {
    caseNumber: 'CASE-2024-001',
    title: 'مطالبة إصابات شخصية',
    court: 'المحكمة العامة بالرياض',
    type: 'إصابات شخصية',
    status: 'open',
    startDate: new Date('2024-01-15'),
    notes: 'العميل أصيب في حادث مروري. جاري جمع التقارير الطبية.'
  },
  {
    caseNumber: 'CASE-2024-002',
    title: 'نزاع تعاقدي',
    court: 'المحكمة التجارية بجدة',
    type: 'قانون تجاري',
    status: 'adjourned',
    startDate: new Date('2024-02-01'),
    notes: 'قضية إخلال بالعقد. في انتظار مرحلة التحقيق.'
  },
  {
    caseNumber: 'CASE-2024-003',
    title: 'تمييز في العمل',
    court: 'محكمة العمل بالدمام',
    type: 'قانون عمل',
    status: 'open',
    startDate: new Date('2024-01-20'),
    notes: 'العميل يدعي إنهاء خدمة غير مبرر. جاري إعداد الوثائق.'
  },
  {
    caseNumber: 'CASE-2024-004',
    title: 'معاملة عقارية',
    court: 'محكمة التنفيذ بمكة',
    type: 'عقارات',
    status: 'closed',
    startDate: new Date('2023-12-10'),
    notes: 'نزاع شراء عقار. تم حله بنجاح.'
  }
];

async function seedDatabase() {
  try {
    // Clear existing data
    await Client.deleteMany({});
    await Case.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample clients
    const clients = await Client.insertMany(sampleClients);
    console.log(`Inserted ${clients.length} clients`);

    // Insert sample cases with client references
    const cases = await Case.insertMany([
      {
        ...sampleCases[0],
        clientId: clients[0]._id
      },
      {
        ...sampleCases[1],
        clientId: clients[1]._id
      },
      {
        ...sampleCases[2],
        clientId: clients[2]._id
      },
      {
        ...sampleCases[3],
        clientId: clients[3]._id
      }
    ]);
    console.log(`Inserted ${cases.length} cases`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
