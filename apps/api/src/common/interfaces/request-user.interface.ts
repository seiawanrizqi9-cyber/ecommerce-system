import { Role } from '../../modules/auth/enums/role.enum';

export interface RequestUser {
  id: string;
  email: string;
  role: Role;
}
