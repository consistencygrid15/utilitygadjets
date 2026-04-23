const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for auth endpoints (login/register).
 * Limits: 10 requests per 15 minutes per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again in 15 minutes.',
  },
});

/**
 * General API rate limiter.
 * Limits: 100 requests per minute per IP.
 */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Rate limit exceeded. Please slow down.',
  },
});

/**
 * Device command rate limiter.
 * Limits: 20 commands per minute per IP.
 */
const commandLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many device commands. Please wait before sending more.',
  },
});

module.exports = { authLimiter, apiLimiter, commandLimiter };
