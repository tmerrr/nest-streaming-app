type Config = {
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    s3BucketName: string;
  };
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
  cache: {
    ttl: number;
  };
};

const getRequiredEnvVar = (varName: string): string => {
  const envVar = process.env[varName];
  if (!envVar) {
    throw new Error(`"${envVar}" is a required environment variable`);
  }
  return envVar;
};

const getEnvVarWithDefault = (varName: string, defaultValue: string) =>
  process.env[varName] ?? defaultValue;

const config: Config = {
  aws: {
    accessKeyId: getRequiredEnvVar('AWS_ACCESS_KEY_ID'),
    secretAccessKey: getRequiredEnvVar('AWS_SECRET_ACCESS_KEY'),
    region: getRequiredEnvVar('AWS_REGION'),
    s3BucketName: getRequiredEnvVar('S3_BUCKET_NAME'),
  },
  db: {
    host: getEnvVarWithDefault('DB_HOST', 'localhost'),
    port: Number(getEnvVarWithDefault('DB_PORT', '5432')),
    user: getEnvVarWithDefault('DB_USER', 'db_user'),
    password: getEnvVarWithDefault('DB_PASSWORD', 'db_password'),
    name: getEnvVarWithDefault('DB_NAME', 'db_name'),
  },
  cache: {
    ttl: Number(getEnvVarWithDefault('CACHE_TTL_SECONDS', '86400')),
  },
};

export default config;
