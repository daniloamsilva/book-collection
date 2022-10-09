import NodeEnvironment from 'jest-environment-node';
import { config } from 'dotenv';
import { execSync } from 'node:child_process';
import { Client } from 'pg';
import { v4 as uuid } from 'uuid';
import { JestEnvironmentConfig } from '@jest/environment';

config({ path: '.env' });

export default class PrismaTestEnvironment extends NodeEnvironment {
  private schema: string;
  private connectionString: string;

  constructor(config: JestEnvironmentConfig, context: any) {
    super(config, context);

    const dbUser = process.env.DATABASE_TEST_USER;
    const dbPass = process.env.DATABASE_TEST_PASS;
    const dbHost = process.env.DATABASE_TEST_HOST;
    const dbPort = process.env.DATABASE_TEST_PORT;
    const dbName = process.env.DATABASE_TEST_NAME;

    this.schema = `test_${uuid()}`;
    this.connectionString = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=${this.schema}`;
  }

  setup() {
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;

    execSync(`yarn prisma migrate deploy`);

    return super.setup();
  }

  async teardown() {
    const client = new Client({
      connectionString: this.connectionString,
    });

    await client.connect();
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`);
    await client.end();
  }
}
