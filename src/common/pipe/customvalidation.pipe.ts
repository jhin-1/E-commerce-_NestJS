import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodType } from 'zod/v3';

export class CustomValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: any, metadata: ArgumentMetadata) {
    let result = this.schema.safeParse(value);

    if (!result.success) {
      const erorrs = result.error.issues.map((issue) => ({
        filed: issue.path.join('.'),
        message: issue.message,
      }));

      throw new BadRequestException({
        messsage: 'validation erorr',
        erorrs,
      });
    }
    return value;
  }
}
