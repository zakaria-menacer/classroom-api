import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { UserOktaService } from '../src/okta/user-okta.service';
import { HashService } from '../src/tools/hash.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { AxiosError } from 'axios';

const prisma = new PrismaClient();
async function main() {
  const roles_permissions = [
    // admin
    { role: '7d27a29f-d401-472e-bb5a-3554f9197550', permission: 'create:role' },
    { role: '7d27a29f-d401-472e-bb5a-3554f9197550', permission: 'read:role' },
    {
      role: '7d27a29f-d401-472e-bb5a-3554f9197550',
      permission: 'read:role:all',
    },
    { role: '7d27a29f-d401-472e-bb5a-3554f9197550', permission: 'update:role' },
    { role: '7d27a29f-d401-472e-bb5a-3554f9197550', permission: 'delete:role' },
    { role: '7d27a29f-d401-472e-bb5a-3554f9197550', permission: 'create:user' },
    { role: '7d27a29f-d401-472e-bb5a-3554f9197550', permission: 'read:user' },
    {
      role: '7d27a29f-d401-472e-bb5a-3554f9197550',
      permission: 'read:user:all',
    },
    { role: '7d27a29f-d401-472e-bb5a-3554f9197550', permission: 'update:user' },
    { role: '7d27a29f-d401-472e-bb5a-3554f9197550', permission: 'delete:user' },
    {
      role: '7d27a29f-d401-472e-bb5a-3554f9197550',
      permission: 'create:classroom',
    },
    {
      role: '7d27a29f-d401-472e-bb5a-3554f9197550',
      permission: 'read:classroom',
    },
    {
      role: '7d27a29f-d401-472e-bb5a-3554f9197550',
      permission: 'read:classroom:all',
    },
    {
      role: '7d27a29f-d401-472e-bb5a-3554f9197550',
      permission: 'update:classroom',
    },
    {
      role: '7d27a29f-d401-472e-bb5a-3554f9197550',
      permission: 'delete:classroom',
    },
    {
      role: '7d27a29f-d401-472e-bb5a-3554f9197550',
      permission: 'create:assignment',
    },
    {
      role: '7d27a29f-d401-472e-bb5a-3554f9197550',
      permission: 'read:assignment',
    },
    {
      role: '7d27a29f-d401-472e-bb5a-3554f9197550',
      permission: 'read:assignment:all',
    },
    {
      role: '7d27a29f-d401-472e-bb5a-3554f9197550',
      permission: 'update:assignment',
    },
    {
      role: '7d27a29f-d401-472e-bb5a-3554f9197550',
      permission: 'delete:assignment',
    },
    {
      role: '7d27a29f-d401-472e-bb5a-3554f9197550',
      permission: 'create:submission',
    },
    {
      role: '7d27a29f-d401-472e-bb5a-3554f9197550',
      permission: 'read:submission',
    },
    {
      role: '7d27a29f-d401-472e-bb5a-3554f9197550',
      permission: 'read:submission:all',
    },
    {
      role: '7d27a29f-d401-472e-bb5a-3554f9197550',
      permission: 'grade:submission',
    },
    {
      role: '7d27a29f-d401-472e-bb5a-3554f9197550',
      permission: 'reject:submission',
    },

    // * MEMBER

    {
      role: 'e3bb256c-db8b-4993-b775-2b3d84352c78',
      permission: 'create:classroom',
    },
    {
      role: 'e3bb256c-db8b-4993-b775-2b3d84352c78',
      permission: 'read:classroom',
    },
    {
      role: 'e3bb256c-db8b-4993-b775-2b3d84352c78',
      permission: 'update:classroom',
    },
    {
      role: 'e3bb256c-db8b-4993-b775-2b3d84352c78',
      permission: 'delete:classroom',
    },
    {
      role: 'e3bb256c-db8b-4993-b775-2b3d84352c78',
      permission: 'create:assignment',
    },
    {
      role: 'e3bb256c-db8b-4993-b775-2b3d84352c78',
      permission: 'read:assignment',
    },
    {
      role: 'e3bb256c-db8b-4993-b775-2b3d84352c78',
      permission: 'update:assignment',
    },
    {
      role: 'e3bb256c-db8b-4993-b775-2b3d84352c78',
      permission: 'delete:assignment',
    },
    {
      role: 'e3bb256c-db8b-4993-b775-2b3d84352c78',
      permission: 'create:submission',
    },
    {
      role: 'e3bb256c-db8b-4993-b775-2b3d84352c78',
      permission: 'read:submission',
    },

    {
      role: 'e3bb256c-db8b-4993-b775-2b3d84352c78',
      permission: 'grade:submission',
    },
    {
      role: 'e3bb256c-db8b-4993-b775-2b3d84352c78',
      permission: 'reject:submission',
    },
  ];

  //* upsert roles
  await prisma.role.upsert({
    where: { id: '7d27a29f-d401-472e-bb5a-3554f9197550', name: 'ADMIN' },
    update: {},
    create: {
      id: '7d27a29f-d401-472e-bb5a-3554f9197550',
      name: 'ADMIN',
      description: '....',
    },
  });

  await prisma.role.upsert({
    where: { id: 'e3bb256c-db8b-4993-b775-2b3d84352c78', name: 'MEMBER' },
    update: {},
    create: {
      name: 'MEMBER',
      id: 'e3bb256c-db8b-4993-b775-2b3d84352c78',
      description: '....',
    },
  });

  //* remove all permission roles joins
  await prisma.rolePermission.deleteMany({});

  //* upsert roles permissions
  for (const rp of roles_permissions) {
    await prisma.rolePermission.upsert({
      where: { role_permission: { role: rp.role, permission: rp.permission } },
      update: {},
      create: {
        permissionsRef: {
          connectOrCreate: {
            where: { name: rp.permission },
            create: { name: rp.permission, description: '....' },
          },
        },
        rolesRef: {
          connect: { id: rp.role },
        },
      },
    });
  }

  //* create a default admin user
  try {
    const oktaService = new UserOktaService(
      new ConfigService(),
      new HashService(),
    );

    const admin = {
      firstName: 'admin',
      lastName: 'admin',
      email: process.env.ADMIN_EMAIL || 'admin-classroom@default.com',
      mobilePhone: '123456789',
      roleId: '7d27a29f-d401-472e-bb5a-3554f9197550',
      password: process.env.ADMIN_PASSWORD || 'admin1234',
    };

    const user = await oktaService.create(admin);
    delete admin.password;
    await prisma.user.upsert({
      where: { id: user.id },
      create: { ...admin, id: user.id },
      update: admin,
    });
    // const app = await NestFactory.createApplicationContext(AppModule);
    // const usersService = app.get(UsersService);
    // await usersService.create(admin);
  } catch (error) {
    if (error instanceof AxiosError) console.log(error.response?.data);
    else console.log(error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
