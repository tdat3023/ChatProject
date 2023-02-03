const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");
const MyError = require("../exception/MyError");
const BucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

class AwsS3Service {
  //upload file to s3
  async uploadFile(file, bucketName = BucketName) {
    const fileStream = fs.readFileSync(file.path);
    if(!fileStream) throw new MyError("File not exists");

    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: `zale_${Date.now()}_${file.originalname}`,
    };

    const { mimetype } = file;
    if (
      mimetype === "image/jpeg" ||
      mimetype === "image/png" ||
      mimetype === "image/gif" ||
      mimetype === "video/mp3" ||
      mimetype === "video/mp4" ||
      mimetype === "video/x-ms-wmv"
    )
      uploadParams.ContentType = mimetype;

    try {
      const result = await s3.upload(uploadParams).promise();
      return result.Location;
    } catch (error) {
      console.log(error);
      throw new MyError("Upload file failed");
    }
  }

  //delete file in s3
  // static async deleteFile(key) {
  //     if (!key) throw new MyError('Key not exists');

  //     const deleteParams = {
  //         Bucket: bucketName,
  //         Key: key,
  //     };

  //     const result = await s3.deleteObject(deleteParams).promise();

  //     return result;
  // }
}

module.exports = new AwsS3Service();
