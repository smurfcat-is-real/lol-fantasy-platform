import { hash } from 'bcryptjs';
import { prisma } from './prisma';

export async function createUser(
  email: string,
  password: string,
  name: string
) {
  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      name,
    },
  });

  return { id: user.id, email: user.email, name: user.name };
}
