import { MikroORM } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { EntityManager } from "@mikro-orm/postgresql";

export const orm = await MikroORM.init({
  metadataProvider: TsMorphMetadataProvider,
  entities: ["./dist/lib/entities/*.js"],
  entitiesTs: ["./src/lib/entities/*.ts"],
  dbName: process.env.DATABASE_NAME || "saas",
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT) || 5432,
  user: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASSWORD || "password",
});

export const em = orm.em.fork() as EntityManager;
