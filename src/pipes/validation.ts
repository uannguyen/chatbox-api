import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value, metadata: ArgumentMetadata) {
    // if (!value.cmdtype) {
    //   throw new WsException('Validation failed');
    // }
    return value;
  }
}
