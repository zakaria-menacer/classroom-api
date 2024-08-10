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
values ('create:role', '...'),
  ('read:role', '...'),
  ('read:role:all', '...'),
  ('update:role', '...'),
  ('delete:role', '...'),
  ('create:user', '...'),
  ('read:user', '...'),
  ('read:user:all', '...'),
  ('update:user', '...'),
  ('delete:user', '...'),
  ('create:classroom', '...'),
  ('read:classroom', '...'),
  ('read:classroom:all', '...'),
  ('update:classroom', '...'),
  ('delete:classroom', '...');
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
  ),
  (
    '7d27a29f-d401-472e-bb5a-3554f9197550',
    'create:user'
  ),
  (
    '7d27a29f-d401-472e-bb5a-3554f9197550',
    'read:user'
  ),
  (
    '7d27a29f-d401-472e-bb5a-3554f9197550',
    'read:user:all'
  ),
  (
    '7d27a29f-d401-472e-bb5a-3554f9197550',
    'update:user'
  ),
  (
    '7d27a29f-d401-472e-bb5a-3554f9197550',
    'delete:user'
  );