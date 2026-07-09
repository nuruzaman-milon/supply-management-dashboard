import "dotenv/config";
import prisma from "../lib/prisma";

const companies = [
  {
    companyName: "Rahman Traders",
    contactPerson: "Abdul Rahman",
    phone: "01711000101",
    email: "rahman.traders@example.com",
    address: "12 Motijheel C/A, Dhaka",
    notes: "Regular bulk buyer",
    status: "ACTIVE" as const,
  },
  {
    companyName: "Meghna Distribution",
    contactPerson: "Shamima Akter",
    phone: "01811000102",
    email: "info@meghnadist.com",
    address: "45 Agrabad, Chattogram",
    notes: null,
    status: "ACTIVE" as const,
  },
  {
    companyName: "Padma Supplies Ltd",
    contactPerson: "Kamrul Hasan",
    phone: "01911000103",
    email: "sales@padmasupplies.com",
    address: "Zindabazar, Sylhet",
    notes: "Net-30 terms",
    status: "ACTIVE" as const,
  },
  {
    companyName: "Jamuna Enterprise",
    contactPerson: "Nasrin Sultana",
    phone: "01611000104",
    email: null,
    address: "Bogura Sadar, Bogura",
    notes: null,
    status: "INACTIVE" as const,
  },
  {
    companyName: "Sonar Bangla Trading",
    contactPerson: "Mizanur Rahman",
    phone: "01511000105",
    email: "sonarbangla@example.com",
    address: "Station Road, Khulna",
    notes: "Prefers cash on delivery",
    status: "ACTIVE" as const,
  },
  {
    companyName: "Bengal Agro Corp",
    contactPerson: "Tania Ferdous",
    phone: "01311000106",
    email: "contact@bengalagro.com",
    address: "Rajshahi Court, Rajshahi",
    notes: null,
    status: "ACTIVE" as const,
  },
  {
    companyName: "Karnaphuli Suppliers",
    contactPerson: "Rafiqul Islam",
    phone: "01411000107",
    email: "karnaphuli.sup@example.com",
    address: "Halishahar, Chattogram",
    notes: "Seasonal orders only",
    status: "INACTIVE" as const,
  },
  {
    companyName: "Dhaka Metro Goods",
    contactPerson: "Farhana Yasmin",
    phone: "01711000108",
    email: "metro.goods@example.com",
    address: "Mirpur 10, Dhaka",
    notes: null,
    status: "ACTIVE" as const,
  },
  {
    companyName: "Teesta Trade House",
    contactPerson: "Sohel Rana",
    phone: "01811000109",
    email: "teesta.trade@example.com",
    address: "Rangpur Sadar, Rangpur",
    notes: "New client",
    status: "ACTIVE" as const,
  },
  {
    companyName: "Surma Commercial",
    contactPerson: "Israt Jahan",
    phone: "01911000110",
    email: "surma.commercial@example.com",
    address: "Bandar Bazar, Sylhet",
    notes: null,
    status: "ACTIVE" as const,
  },
];

async function main() {
  const result = await prisma.company.createMany({ data: companies });
  console.log(`Inserted ${result.count} companies.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
