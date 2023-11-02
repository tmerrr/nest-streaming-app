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
