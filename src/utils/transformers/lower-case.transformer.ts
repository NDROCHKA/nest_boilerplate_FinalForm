import { TransformFnParams } from 'class-transformer/types/interfaces';

import { MaybeType } from '../types/maybe.type';

export const lowerCaseTransformer = (
  params: TransformFnParams,
): MaybeType<string> => {
  const value: unknown = params.value;
  return typeof value === 'string' ? value.toLowerCase().trim() : undefined;
};
