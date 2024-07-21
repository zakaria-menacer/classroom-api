export class Role {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
  permissions?: string[];
}
