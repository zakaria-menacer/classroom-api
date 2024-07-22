export class LoginResponseSchema {
  message: string = 'success';
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
