import { prisma } from "../prisma.js";
import { fail, parseOrFail } from "../http.js";
import { inquirySchema } from "../validation/schemas.js";

export async function createInquiry(req, res) {
  const data = parseOrFail(inquirySchema, req.body);
  const property = await prisma.property.findUnique({ where: { id: data.propertyId } });
  if (!property) throw fail(404, "That residence is no longer listed.");

  const inquiry = await prisma.inquiry.create({ data });
  res.status(201).json({
    inquiry: {
      id: inquiry.id,
      createdAt: inquiry.createdAt.toISOString(),
    },
  });
}

export async function listInquiries(_req, res) {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      property: { select: { id: true, name: true, location: true } },
    },
  });

  res.json({
    inquiries: inquiries.map((inquiry) => ({
      id: inquiry.id,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      message: inquiry.message,
      createdAt: inquiry.createdAt.toISOString(),
      property: inquiry.property,
    })),
  });
}
