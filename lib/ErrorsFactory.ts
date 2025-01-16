import { type NextApiResponse } from "next/types";

export class ErrorsFactory<T = unknown> {
  constructor(private readonly res: NextApiResponse<T>) {}

  validation(message: string) {
    console.error(`Validation: ${message}`);
    this.res.status(400).write("Invalid 'page' search parameter");
    this.res.end();
  }
}
