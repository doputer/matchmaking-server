import {
  applyDecorators,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ApiGet = (path: string, summary: string) => {
  return applyDecorators(
    Get(path),
    HttpCode(200),
    ApiOperation({ summary }),
    ApiResponse({ status: 200, description: 'Success' }),
  );
};

export const ApiPost = (path: string, summary: string) => {
  return applyDecorators(
    Post(path),
    HttpCode(201),
    ApiOperation({ summary }),
    ApiResponse({ status: 201, description: 'Success' }),
  );
};

export const ApiPatch = (path: string, summary: string) => {
  return applyDecorators(
    Patch(path),
    HttpCode(200),
    ApiOperation({ summary }),
    ApiResponse({ status: 200, description: 'Success' }),
  );
};

export const ApiDelete = (path: string, summary: string) => {
  return applyDecorators(
    Delete(path),
    HttpCode(200),
    ApiOperation({ summary }),
    ApiResponse({ status: 200, description: 'Success' }),
  );
};
