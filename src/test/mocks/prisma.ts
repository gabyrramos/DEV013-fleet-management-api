// test/mocks/prisma.ts
export const prismaMock = {
    taxi: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    trajectory: {
      findFirst: jest.fn(),
    },
    // Agrega otros métodos según sea necesario
  };
  
  export default prismaMock;
  