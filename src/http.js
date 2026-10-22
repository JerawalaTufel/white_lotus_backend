import { z } from "zod";

export function fail(status, error, fields) {
  const err = new Error(error);
  err.status = status;
  if (fields) err.fields = fields;
  return err;
}

export function asyncHandler(fn) {
  return function handler(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function parseOrFail(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw fail(400, "Please correct the fields below.", result.error.flatten().fieldErrors);
  }
  return result.data;
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof z.ZodError) {
    res.status(400).json({
      error: "Please correct the fields below.",
      fields: err.flatten().fieldErrors,
    });
    return;
  }

  if (err.status) {
    res.status(err.status).json({
      error: err.message,
      ...(err.fields ? { fields: err.fields } : {}),
    });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
}
