**Setup for getting and setting files(images) to S3 Bucket.**

Features:
> Submitting photo and description from the frontend(React) to Express server
> Adding photo to the S3 Bucket, adding photo metadata and description to the Sqlite
> Listing all posts(images/description) on the client.
> Deleting posts(removing post from the DB, removing the photo from S3 Bucket)

Add .env file with these keys

```
DATABASE_URL="file:./dev.db"

BUCKET_NAME="your_bucket_name"
BUCKET_REGION="your_bucket_region"

ACCESS_KEY="IAM_user_access_key"
SECRET_ACCESS_KEY="IAM_user_secret_key"
```

Using Prisma ORM with sqlite provider.
RUN `pnpx prisma migrate dev --name init` to initialize DB.
