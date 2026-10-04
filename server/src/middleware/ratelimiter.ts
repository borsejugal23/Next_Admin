import { rateLimit } from "express-rate-limit";

const rateLimitMessage = {
  message: "Too many requests, please try again later.",
};

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: rateLimitMessage,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: rateLimitMessage,
});

export default apiLimiter;
