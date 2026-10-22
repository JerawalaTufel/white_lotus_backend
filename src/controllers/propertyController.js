import { prisma } from "../prisma.js";
import { fail, parseOrFail } from "../http.js";
import { listQuerySchema, propertySchema } from "../validation/schemas.js";
import { serializeProperty } from "../serialize.js";

const sortMap = {
  newest: { createdAt: "desc" },
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
  size_desc: { sizeSqft: "desc" },
  bedrooms_desc: { bedrooms: "desc" },
};

export async function getPropertyMeta(_req, res) {
  const [locations, featured] = await Promise.all([
    prisma.property.findMany({
      distinct: ["location"],
      select: { location: true },
      orderBy: { location: "asc" },
    }),
    prisma.property.findFirst({
      where: { featured: true },
      orderBy: { price: "desc" },
    }),
  ]);

  const hero = featured || (await prisma.property.findFirst({ orderBy: { createdAt: "desc" } }));

  res.json({
    locations: locations.map((row) => row.location),
    featured: hero ? serializeProperty(hero) : null,
  });
}

export async function listProperties(req, res) {
  const query = parseOrFail(listQuerySchema, {
    location: req.query.location || undefined,
    bedrooms: req.query.bedrooms || undefined,
    sort: req.query.sort || undefined,
  });

  const where = {};
  if (query.location) where.location = query.location;
  if (query.bedrooms !== undefined) where.bedrooms = { gte: query.bedrooms };

  const properties = await prisma.property.findMany({
    where,
    orderBy: [sortMap[query.sort], { name: "asc" }],
  });

  res.json({
    properties: properties.map(serializeProperty),
    total: properties.length,
  });
}

export async function getProperty(req, res) {
  const property = await prisma.property.findUnique({ where: { id: req.params.id } });
  if (!property) {
    res.status(404).json({ error: "That residence could not be found." });
    return;
  }
  res.json({ property: serializeProperty(property) });
}

export async function listAdminProperties(_req, res) {
  const properties = await prisma.property.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { inquiries: true } } },
  });
  res.json({ properties: properties.map(serializeProperty) });
}

export async function createProperty(req, res) {
  const data = parseOrFail(propertySchema, req.body);
  const property = await prisma.property.create({ data });
  res.status(201).json({ property: serializeProperty(property) });
}

export async function updateProperty(req, res) {
  const data = parseOrFail(propertySchema, req.body);
  const existing = await prisma.property.findUnique({ where: { id: req.params.id } });
  if (!existing) throw fail(404, "That residence could not be found.");

  const property = await prisma.property.update({
    where: { id: req.params.id },
    data,
  });
  res.json({ property: serializeProperty(property) });
}

export async function deleteProperty(req, res) {
  const existing = await prisma.property.findUnique({ where: { id: req.params.id } });
  if (!existing) throw fail(404, "That residence could not be found.");
  await prisma.property.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
