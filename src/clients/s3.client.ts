import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import config from '../config';

export class AwsS3Client {
  private client = new S3Client({
    region: config.aws.region,
    credentials: {
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey,
    },
  });

  public async putObject(key: string, body: Buffer): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: config.aws.s3BucketName,
      Key: key,
      Body: body,
      ContentType: 'audio/mpeg',
    });
    await this.client.send(command);
  }

  public async getObject(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: config.aws.s3BucketName,
      Key: key,
    });
    const data = await this.client.send(command);
    if (!data.Body) {
      throw new Error(`No Body / content found in object: ${key}`);
    }
    return Buffer.from(await data.Body.transformToByteArray());
  }
}

/*
When object is not found:

NoSuchKey: The specified key does not exist.
    at de_NoSuchKeyRes (/Users/tommoir/Motive/training/nest-streaming-app/node_modules/@aws-sdk/client-s3/dist-cjs/protocols/Aws_restXml.js:6082:23)
    at de_GetObjectCommandError (/Users/tommoir/Motive/training/nest-streaming-app/node_modules/@aws-sdk/client-s3/dist-cjs/protocols/Aws_restXml.js:4327:25)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async /Users/tommoir/Motive/training/nest-streaming-app/node_modules/@smithy/middleware-serde/dist-cjs/deserializerMiddleware.js:7:24
    at async /Users/tommoir/Motive/training/nest-streaming-app/node_modules/@aws-sdk/middleware-signing/dist-cjs/awsAuthMiddleware.js:14:20
    at async /Users/tommoir/Motive/training/nest-streaming-app/node_modules/@smithy/middleware-retry/dist-cjs/retryMiddleware.js:27:46
    at async /Users/tommoir/Motive/training/nest-streaming-app/node_modules/@aws-sdk/middleware-flexible-checksums/dist-cjs/flexibleChecksumsMiddleware.js:63:20
    at async /Users/tommoir/Motive/training/nest-streaming-app/node_modules/@aws-sdk/middleware-sdk-s3/dist-cjs/region-redirect-endpoint-middleware.js:14:24
    at async /Users/tommoir/Motive/training/nest-streaming-app/node_modules/@aws-sdk/middleware-sdk-s3/dist-cjs/region-redirect-middleware.js:9:20 {
  '$fault': 'client',
  '$metadata': {
    httpStatusCode: 404,
    requestId: 'GCN6171BH0PDW5JE',
    extendedRequestId: 'jLNPPbX4U7vd8f6TH4BMFCajS8SRM35eKxkQqD98xvRbR+58Zy6KqhGu14dcGu/yrCtTzwTt3W0=',
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  Code: 'NoSuchKey',
  Key: '4bc247b1-2d50-4c36-beed-dc91fd1d3e74',
  RequestId: 'GCN6171BH0PDW5JE',
  HostId: 'jLNPPbX4U7vd8f6TH4BMFCajS8SRM35eKxkQqD98xvRbR+58Zy6KqhGu14dcGu/yrCtTzwTt3W0='
}
*/
