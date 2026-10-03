import { RelationsAndSelectsOptions } from '../../utils/types/relations-and-selects-options';

export const userFindManyDefault: RelationsAndSelectsOptions = {
  select: [
    'user.id',
    'user.email',
    'user.phoneNumber',
    'user.firstName',
    'user.lastName',
    'user.profilePicture',
    'user.emailVerified',
    'user.tokenVersion',
    'user.role',
    'user.createdAt',
    'user.updatedAt',
    'user.deletedAt',
  ],
  joins: [],
};

export const userFindOneDefault: RelationsAndSelectsOptions = {
  select: [
    'user.id',
    'user.email',
    'user.phoneNumber',
    'user.firstName',
    'user.lastName',
    'user.profilePicture',
    'user.emailVerified',
    'user.tokenVersion',
    'user.role',
    'user.createdAt',
    'user.updatedAt',
    'user.deletedAt',
  ],
  joins: [],
};
export const userFindOneAuthLogin: RelationsAndSelectsOptions = {
  select: [
    'user.id',
    'user.email',
    'user.emailVerified',
    'user.phoneNumber',
    'user.firstName',
    'user.lastName',
    'user.profilePicture',
    'user.password',
    'user.tokenVersion',
    'user.role',
  ],
  joins: [],
};
