import { getTenantDB } from '#utils/Mongo/mongo.connection.js';

const seedSuperAdmin = async () => {
  const conn = await getTenantDB();
  console.debug(conn.models);
  const superAdmin = {
    email: 'superadmin@mail.com',
    name: 'Super Admin',
    password: 'superadmin'
  };
  await conn.models.user.findOneAndUpdate({ email: superAdmin.email },
    {
      email: superAdmin.email,
      password: superAdmin.password,
      superAdmin: true
    },
    { upsert: true });

  return console.success('super admin seeded');
};

export default seedSuperAdmin;
