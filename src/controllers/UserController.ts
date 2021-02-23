import { Request, Response } from 'express';


class UserController {
  async create(request: Request, response: Response) {

    const body = request.body;

    console.log(body);




    response.json({});
  }
};

export { UserController };
