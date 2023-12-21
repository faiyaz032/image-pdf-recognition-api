# File Metadata Upload API

## Description

This API endpoint allows users to upload files and retrieve metadata information from Image or PDF.

> <strong>Note:</strong> I've hosted the server and also the database so you don't need to configure this code in your machine to test this endpoint. You can just any api client to test this API using the given url and request info.

## Request

- **URL:** <u>image-pdf-recognition-api.onrender.com/metadata</u>
- **Method:** POST

- **Content-Type:** multipart/form-data

#### Request Body

- `file` (multipart/form-data): Any Image or PDF file.

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
><strong>Note</strong>: The server may take little longer to send the response to the client as this is a cpu intensive task. 