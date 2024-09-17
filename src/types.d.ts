import { Request } from 'express';

declare global {
  namespace Express {  //para extender las interfaces de Express
    interface Request {
      user?: { //añadimos una propiedad user al objeto Req.
        id: number;
        email: string;
        role?: string;
      };
    }
  }
}
