# File Metadata Upload API

## Description

This API endpoint allows users to upload files and retrieve metadata information from Image or PDF.

> Note: I've hosted the server and also the database so you don't need to configure this code in your machine to test this endpoint. You can just any api client to test this API using the given url and request info.

## Request

- **URL:** <u>image-pdf-recognition-api.onrender.com/metadata</u>
- **Method:** POST

- **Content-Type:** multipart/form-data

#### Request Parameters

- `file` (multipart/form-data): The file to be uploaded.

## Response

- **Status Code:** 201 Created
- **Content-Type:** application/json

#### Example

```json
{
  "status": "success",
  "fileType": "image/jpeg",
  "dimension": "800x600",
  "metadata": "Metadata of the file"
}
```
