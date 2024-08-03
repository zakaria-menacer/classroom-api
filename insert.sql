insert into roles (id, name, description)
values (
    'e3bb256c-db8b-4993-b775-2b3d84352c78',
    'MEMBER',
    '....'
  ),
  (
    '7d27a29f-d401-472e-bb5a-3554f9197550',
    'ADMIN',
    '.....'
  );
insert into permissions (name, description)
values('create:role', '...'),
  ('read:role', '...'),
  ('read:role:all', '...'),
  ('update:role', '...'),
  ('delete:role', '...');
insert into roles_permissions (role, permission)
values (
    '7d27a29f-d401-472e-bb5a-3554f9197550',
    'create:role'
  ),
  (
    '7d27a29f-d401-472e-bb5a-3554f9197550',
    'read:role'
  ),
  (
    '7d27a29f-d401-472e-bb5a-3554f9197550',
    'read:role:all'
  ),
  (
    '7d27a29f-d401-472e-bb5a-3554f9197550',
    'update:role'
  ),
  (
    '7d27a29f-d401-472e-bb5a-3554f9197550',
    'delete:role'
  );