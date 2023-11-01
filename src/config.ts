type Config = {
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    s3BucketName: string;
  };
};

const requiredEnvVar = (varName: string): string => {
  const envVar = process.env[varName];
  if (!envVar) {
    throw new Error(`"${envVar}" is a required environment variable`);
  }
  return envVar;
};

const config: Config = {
  aws: {
    accessKeyId: requiredEnvVar('AWS_ACCESS_KEY_ID'),
    secretAccessKey: requiredEnvVar('AWS_SECRET_ACCESS_KEY'),
    region: requiredEnvVar('AWS_REGION'),
    s3BucketName: requiredEnvVar('S3_BUCKET_NAME'),
  },
};

export default config;
