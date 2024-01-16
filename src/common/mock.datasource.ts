import { DataSource, QueryRunner } from 'typeorm';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<QueryRunner>;
};

export const dataSourceMock: () => MockType<DataSource> = jest.fn(() => ({
  createQueryRunner: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    startTransaction: jest.fn(),
    manager: {
      create: jest.fn(),
      save: jest.fn(),
    },
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
  })),
}));
