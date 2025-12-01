# Category File Upload Documentation

## Overview

The category system now supports **both file uploads and direct URL links** for icon and banner images.

## Features Added

### 1. **Multer Middleware** (`middleware/uploadMiddleware.js`)

- Handles multipart/form-data file uploads
- Supports both icon and banner image uploads
- File size limit: 5MB per file
- Allowed formats: JPEG, JPG, PNG, GIF, WEBP, SVG
- Files stored in: `uploads/categories/`
- Auto-generated unique filenames: `category-icon-{timestamp}-{random}.ext`

### 2. **Updated Category Controller** (`controllers/categoryController.js`)

- ✅ Supports both file uploads AND URL links
- ✅ Automatic file deletion when updating/deleting categories
- ✅ Error handling with automatic cleanup on failure
- ✅ Backward compatible with existing URL-based approach

### 3. **Updated Routes** (`routes/categoryRoutes.js`)

- Added `uploadCategoryImages` middleware to POST and PUT routes
- Routes:
  - `POST /api/admin/categories` - Create with files/URLs
  - `PUT /api/admin/categories/:id` - Update with files/URLs

### 4. **Static File Serving** (`server.js`)

- Uploaded files accessible at: `http://localhost:5000/uploads/categories/filename.jpg`

---

## Usage

### Option 1: Upload Files (Multipart Form Data)

**Using Postman/Thunder Client:**

1. **Create Category with File Upload:**

   ```
   POST http://localhost:5000/api/admin/categories
   Headers:
     - Authorization: Bearer {token}

   Body (form-data):
     - name: Electronics
     - slug: electronics
     - icon: [FILE] (select image file)
     - image: [FILE] (select banner file)
     - status: true
     - metaTitle: Best Electronics
     - metaDescription: Shop electronics online
   ```

2. **Update Category with File Upload:**

   ```
   PUT http://localhost:5000/api/admin/categories/{id}
   Headers:
     - Authorization: Bearer {token}

   Body (form-data):
     - name: Electronics Updated
     - icon: [FILE] (new icon file)
     - image: [FILE] (new banner file)
   ```

**Response Example:**

```json
{
  "_id": "6543210abcdef",
  "name": "Electronics",
  "slug": "electronics",
  "icon": "/uploads/categories/category-icon-1699123456789-987654321.png",
  "image": "/uploads/categories/category-image-1699123456789-123456789.jpg",
  "status": true,
  "createdAt": "2025-11-07T10:30:00.000Z",
  "updatedAt": "2025-11-07T10:30:00.000Z"
}
```

### Option 2: Use Direct URLs (JSON)

**You can still use direct URLs without uploading files:**

```
POST http://localhost:5000/api/admin/categories
Headers:
  - Authorization: Bearer {token}
  - Content-Type: application/json

Body (raw JSON):
{
  "name": "Fashion",
  "slug": "fashion",
  "icon": "https://cdn.example.com/icons/fashion.png",
  "image": "https://cdn.example.com/banners/fashion.jpg",
  "status": true,
  "metaTitle": "Fashion Store",
  "metaDescription": "Latest fashion trends"
}
```

### Option 3: Mix Files and URLs

**You can upload icon as file and provide image as URL:**

```
POST http://localhost:5000/api/admin/categories
Headers:
  - Authorization: Bearer {token}

Body (form-data):
  - name: Sports
  - slug: sports
  - icon: [FILE] (upload file)
  - image: https://cdn.example.com/banners/sports.jpg (URL)
  - status: true
```

---

## Frontend Integration

### Using Axios with FormData

```javascript
const createCategory = async (formData) => {
  const data = new FormData();

  // Add text fields
  data.append("name", formData.name);
  data.append("slug", formData.slug);
  data.append("status", formData.status);
  data.append("parentId", formData.parentId);

  // Add files if selected
  if (formData.iconFile) {
    data.append("icon", formData.iconFile); // File object from input
  } else if (formData.iconUrl) {
    data.append("icon", formData.iconUrl); // URL string
  }

  if (formData.imageFile) {
    data.append("image", formData.imageFile); // File object
  } else if (formData.imageUrl) {
    data.append("image", formData.imageUrl); // URL string
  }

  const response = await api.post("/admin/categories", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
```

### React Component Example

```jsx
const [iconType, setIconType] = useState("file"); // 'file' or 'url'
const [iconFile, setIconFile] = useState(null);
const [iconUrl, setIconUrl] = useState("");

<div>
  <label>Icon Upload Method:</label>
  <select value={iconType} onChange={(e) => setIconType(e.target.value)}>
    <option value="file">Upload File</option>
    <option value="url">Enter URL</option>
  </select>

  {iconType === "file" ? (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setIconFile(e.target.files[0])}
    />
  ) : (
    <input
      type="url"
      placeholder="https://example.com/icon.png"
      value={iconUrl}
      onChange={(e) => setIconUrl(e.target.value)}
    />
  )}
</div>;
```

---

## File Management

### Automatic Cleanup

- **On Update**: Old uploaded files are automatically deleted when replaced
- **On Delete**: All associated uploaded files are deleted with the category
- **On Error**: Uploaded files are cleaned up if category creation/update fails

### File Location

```
apiBackend/
└── uploads/
    └── categories/
        ├── category-icon-1699123456789-987654321.png
        ├── category-image-1699123456789-123456789.jpg
        └── ...
```

### Accessing Uploaded Files

- **Local**: `http://localhost:5000/uploads/categories/filename.jpg`
- **Production**: `https://yourdomain.com/uploads/categories/filename.jpg`

---

## Error Handling

### File Upload Errors

1. **Invalid File Type:**

   ```json
   {
     "message": "Invalid file type. Only JPEG, PNG, GIF, WEBP, and SVG are allowed."
   }
   ```

2. **File Too Large (>5MB):**

   ```json
   {
     "message": "File too large. Maximum size is 5MB."
   }
   ```

3. **Upload Failed:**
   - Uploaded files are automatically deleted
   - Returns appropriate error message

---

## Migration from URL-only to File Upload

**Existing categories with URLs will continue to work!**

No database migration needed. The system detects uploaded files vs URLs:

- Uploaded files start with `/uploads/`
- URL links start with `http://` or `https://`

When updating a category:

- If switching from URL to file upload: Old URL is replaced
- If switching from file to URL: Old file is deleted
- If replacing file with new file: Old file is deleted

---

## Security Features

✅ File type validation (images only)
✅ File size limit (5MB)
✅ Unique filename generation (prevents overwriting)
✅ Automatic cleanup on errors
✅ Protected routes (admin authentication required)
✅ Path traversal prevention

---

## Testing

### Test File Upload:

```bash
curl -X POST http://localhost:5000/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Test Category" \
  -F "slug=test-category" \
  -F "icon=@/path/to/icon.png" \
  -F "image=@/path/to/banner.jpg" \
  -F "status=true"
```

### Test URL Method (still works):

```bash
curl -X POST http://localhost:5000/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Category",
    "slug": "test-category",
    "icon": "https://example.com/icon.png",
    "image": "https://example.com/banner.jpg",
    "status": true
  }'
```

---

## Next Steps

1. **Frontend Update**: Update the category form to support file uploads
2. **Image Optimization**: Consider adding image compression/resizing
3. **CDN Integration**: For production, integrate with AWS S3 or Cloudinary
4. **Backup**: Set up backup strategy for uploaded files

---

## Support

For issues or questions:

- Check console logs for detailed error messages
- Verify file permissions on `uploads/categories/` directory
- Ensure multer is properly installed: `npm i multer`
