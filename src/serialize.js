export function serializeProperty(property) {
  const data = {
    id: property.id,
    name: property.name,
    location: property.location,
    address: property.address,
    price: Number(property.price),
    sizeSqft: property.sizeSqft,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    propertyType: property.propertyType,
    description: property.description,
    details: property.details,
    imageUrl: property.imageUrl,
    images: property.images,
    featured: property.featured,
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
  };

  if (property._count) {
    data.inquiryCount = property._count.inquiries;
  }

  return data;
}
