import { Request, Response, NextFunction } from 'express';
import { redact, redactJson } from '../utils/redactionUtils';

const logRequestDetails = (req: Request) => {
  console.log(`[INFO] Incoming Request: ${req.method} ${req.originalUrl}`);
  const headers = { ...req.headers };
  if (headers['authorization']) {
    headers['authorization'] = redact(headers['authorization']);
  }
  console.log(`[INFO] Headers: ${JSON.stringify(headers)}`);
  if (Object.keys(req.query).length > 0) {
    console.log(`[INFO] Query Params: ${JSON.stringify(redactJson(req.query))}`);
  }
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`[INFO] Body: ${JSON.stringify(redactJson(req.body))}`);
  }
};

const logResponseDetails = (res: Response, startTime: number) => {
  const duration = Date.now() - startTime;
  console.log(`[INFO] Response Status: ${res.statusCode} - Response Time: ${duration}ms`);
};

const logErrorDetails = (error: Error, req: Request, res: Response) => {
  const errorIsUnhandled = res.statusCode >= 500;
  if (errorIsUnhandled) {
    console.error(`[ERROR] Request failed: ${req.method} ${req.originalUrl}`);
    console.error(`[ERROR] Error Message: ${error.message}`);
    console.error(`[ERROR] Error Details: ${error}`);
    console.error(`[ERROR] Stack Trace: ${error.stack}`);
    console.error(`[ERROR] Response Status: ${res.statusCode}`);
  } else {
    console.warn(`[WARN] Request handled with error code: ${req.method} ${req.originalUrl}`);
    console.warn(`[WARN] Response Status: ${res.statusCode}`);
  }
};

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Log the incoming request details
  logRequestDetails(req);

  // Wrapping the res.send method to log response details when the response is sent
  const originalSend = res.send;
  res.send = function (body?: any): Response {
    logResponseDetails(res, startTime);
    return originalSend.call(this, body);
  };

  // Catch errors and log them
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      logErrorDetails(new Error('Client or server error'), req, res);
    }
  });

  next();
};