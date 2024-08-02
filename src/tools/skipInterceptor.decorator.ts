import { SetMetadata } from '@nestjs/common';

export const SkipInterceptor = () => SetMetadata('skipInterceptor', true);
