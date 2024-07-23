import { User } from '../entities/user.entity';

export class CreateUserResponseSchema {
  message: string = 'user created successfully';
  statusCode = 201;
  data: {
    token: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      mobilePhone: string;
      created_at: string;
      updated_at: string;
      active: boolean;
      role: {
        id: string;
        name: string;
        description: string;
        created_at: string;
        updated_at: string;
      };
      permissions: string[];
    };
  };
}

export class GetAllUsersResponseSchema {
  message: string = 'success';
  count: number;
  data: User[];
}
export class GetOneUsersResponseSchema {
  message: string = 'success';
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobilePhone: string;
    created_at: string;
    updated_at: string;
    active: boolean;
    role: {
      id: string;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
    };
    permissions: string[];
  };
}

export class UpdateUserResponseSchema {
  message: string = 'success';
  statusCode: number;
  data: User;
}
