# backend/storages_backends.py

from storages.backends.s3boto3 import S3Boto3Storage
from decouple import config


class StaticStorage(S3Boto3Storage):
    location = config("AWS_LOCATION_STATIC", default="static")
    default_acl = "public-read"
    file_overwrite = True


class MediaStorage(S3Boto3Storage):
    location = config("AWS_LOCATION", default="media")
    default_acl = "public-read"
    file_overwrite = False
