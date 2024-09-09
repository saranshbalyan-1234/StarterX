import { getTenantDB } from '#utils/Mongo/mongo.connection.js';

const seedSuperAdmin = async () => {
  const conn = await getTenantDB();

  const superAdmin = {
    email: 'superadmin@mail.com',
    name: 'Super Admin',
    password: 'superadmin'
  };
  await conn.models.customer.findOneAndUpdate({ email: superAdmin.email },
    {
      email: superAdmin.email,
      password: superAdmin.password,
      superAdmin: true,
      tenant: [process.env.DATABASE_PREFIX + process.env.DATABASE_NAME]
    },
    { upsert: true });

  await conn.models.user.findOneAndUpdate({ email: superAdmin.email },
    {
      email: superAdmin.email,
      name: superAdmin.name,
      type: 'issuer'
    },
    { upsert: true });

  return console.success('super admin seeded');
};

export default seedSuperAdmin;
