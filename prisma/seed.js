import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1800&q=80`;

const properties = [
  {
    name: "Villa Serenissima",
    location: "Lake Como",
    address: "Via dei Fiori 12, Tremezzo",
    price: 12400000,
    sizeSqft: 8600,
    bedrooms: 6,
    bathrooms: 7,
    propertyType: "Villa",
    description: "A pale stone house above the lake, with a long loggia and a garden that falls toward the water.",
    details:
      "The main rooms face the water. Six bedrooms are split between the house and a guest pavilion in the olives. There is a pool terrace, a kitchen garden, and a boathouse reached by a private path. The house is sold furnished, including the library.",
    imageUrl: photo("1613490493576-7fde63acd811"),
    images: [photo("1600607687939-ce8a6c25118c"), photo("1600566753190-17f0baa2a6c3")],
    featured: true,
  },
  {
    name: "The Cedar House",
    location: "Kyoto",
    address: "48 Philosopher's Path, Kyoto",
    price: 4800000,
    sizeSqft: 3200,
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "Bungalow",
    description: "A timber house beside a moss court, planned around the sound of rain.",
    details:
      "Four bedrooms, a cedar bath, and a kitchen that opens to the garden. Screens slide away in summer. The lane is quiet, and the walk to the temple path takes eight minutes.",
    imageUrl: photo("1600585154340-be6161a56a0c"),
    images: [photo("1600210492486-724fe5c67fb0"), photo("1616594039964-ae9021a400a0")],
    featured: false,
  },
  {
    name: "Palm Court",
    location: "Marrakech",
    address: "7 Derb El Kadi, Medina",
    price: 3150000,
    sizeSqft: 5400,
    bedrooms: 5,
    bathrooms: 6,
    propertyType: "Villa",
    description: "A restored courtyard house with carved plaster, a long pool, and rooms that stay cool at noon.",
    details:
      "Five bedroom suites ring the court. The roof is for the evening. Staff rooms and a separate kitchen sit off the entrance lane. The medina is outside the door; the house itself is silent.",
    imageUrl: photo("1599809275671-b5942cabc7a2"),
    images: [photo("1600585154526-990dced4db0d"), photo("1554995207-c18c203602cb")],
    featured: false,
  },
  {
    name: "Horizon",
    location: "Singapore",
    address: "18 Marina Boulevard, Level 62",
    price: 9750000,
    sizeSqft: 4100,
    bedrooms: 4,
    bathrooms: 4,
    propertyType: "Penthouse",
    description: "A full-floor penthouse with a gallery hall and a kitchen built for a private chef.",
    details:
      "Four bedrooms, a study, and a long living room looking over the marina. The building has a concierge and a residents' lap pool. One covered parking space is included.",
    imageUrl: photo("1512917774080-9991f1c4c750"),
    images: [photo("1560448204-e02f11c3d0e2"), photo("1484154218962-a197022b5858")],
    featured: false,
  },
  {
    name: "Casa delle Rocce",
    location: "Amalfi",
    address: "Via dei Limiti 3, Praiano",
    price: 7200000,
    sizeSqft: 4800,
    bedrooms: 5,
    bathrooms: 5,
    propertyType: "Villa",
    description: "Terraces stepped down a cliff, with lemon trees and a stair to a private landing.",
    details:
      "The house is a run of white rooms, each with a door to the outside. Five bedrooms, a summer kitchen, and a small pool on the lowest terrace. Access is by a gated lane. The town is a ten-minute walk uphill.",
    imageUrl: photo("1613977257363-707ba9348227"),
    images: [photo("1600596542815-ffad4c1539a9"), photo("1502672260266-1c1ef2d93688")],
    featured: false,
  },
  {
    name: "The White Pavilion",
    location: "Udaipur",
    address: "Lake Palace Road, Udaipur",
    price: 2650000,
    sizeSqft: 6100,
    bedrooms: 6,
    bathrooms: 6,
    propertyType: "Estate",
    description: "A lakeside pavilion in white plaster, arranged as a sequence of courts.",
    details:
      "Six bedrooms, a formal dining room, and a rooftop that faces the water. The garden holds a small pool and an old frangipani. It sits in a quiet pocket of the old city, with parking inside the gate.",
    imageUrl: photo("1580587771525-78b9dba3b914"),
    images: [photo("1600210492493-0946911123ea"), photo("1572120360610-d971b9d7767c")],
    featured: true,
  },
  {
    name: "Atelier Huit",
    location: "Paris",
    address: "8 Rue des Archives, 75004 Paris",
    price: 5400000,
    sizeSqft: 2400,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "Apartment",
    description: "A Haussmann apartment with the original parquet, a new kitchen, and windows onto a planted court.",
    details:
      "Two bedrooms and a library. The ceilings are high, the fireplaces work, and the building has a lift. Cellar storage is included. The courtyard keeps the street noise out.",
    imageUrl: photo("1493809842364-78817add7ffb"),
    images: [photo("1522708323590-d24dbb6b0267"), photo("1600121848594-d8644e57abab")],
    featured: false,
  },
  {
    name: "Dune House",
    location: "AlUla",
    address: "Al Jadidah Road, AlUla",
    price: 6100000,
    sizeSqft: 5200,
    bedrooms: 4,
    bathrooms: 5,
    propertyType: "Estate",
    description: "Rammed earth and stone, a shaded court, and an empty view to the horizon.",
    details:
      "Four bedroom suites, a long sitting room, and a kitchen courtyard. The house keeps its own water in a cistern, and a solar array is already in place. The nearest road is a short drive through the rocks.",
    imageUrl: photo("1564013799919-ab600027ffc6"),
    images: [photo("1600047509358-9dc75507daeb"), photo("1600585153490-76fb20a32601")],
    featured: false,
  },
];

const sampleInquiries = [
  {
    propertyName: "Villa Serenissima",
    name: "Elena Varga",
    email: "elena.varga@example.com",
    phone: "+39 345 220 1184",
    message: "I would like to arrange a private viewing in May, ideally in the late afternoon when the lake light is low.",
  },
  {
    propertyName: "The White Pavilion",
    name: "James Okonkwo",
    email: "james.okonkwo@example.com",
    phone: "+91 98200 44128",
    message: "Please send the floor plan and confirm whether the rooftop can host a dinner for twelve.",
  },
  {
    propertyName: "Horizon",
    name: "Mei Lin",
    email: "mei.lin@example.com",
    phone: "+65 8123 4409",
    message: "We are comparing two penthouses in the marina. Could the sales desk share the service charge and the parking arrangement?",
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("LotusAdmin#2026", 12);

  await prisma.inquiry.deleteMany();
  await prisma.property.deleteMany();

  await prisma.admin.upsert({
    where: { email: "admin@whitelotus.local" },
    update: { name: "Sales desk", passwordHash },
    create: {
      email: "admin@whitelotus.local",
      name: "Sales desk",
      passwordHash,
    },
  });

  const created = [];
  for (const property of properties) {
    created.push(await prisma.property.create({ data: property }));
  }

  const byName = new Map(created.map((property) => [property.name, property]));
  for (const inquiry of sampleInquiries) {
    await prisma.inquiry.create({
      data: {
        propertyId: byName.get(inquiry.propertyName).id,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        message: inquiry.message,
      },
    });
  }

  console.log(`Seeded ${created.length} residences and ${sampleInquiries.length} inquiries.`);
  console.log("Sales desk: admin@whitelotus.local / LotusAdmin#2026");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
