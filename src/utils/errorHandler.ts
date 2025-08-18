import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

export interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  logger.error('Request Error', {
    message: err.message,
    stack: err.stack,
    statusCode,
    isOperational,
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });

  res.status(statusCode).json({
    status: statusCode,
    message: isOperational ? err.message : 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
};

export const createError = (message: string, statusCode: number = 500): CustomError => {
  const error = new Error(message) as CustomError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};