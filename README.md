# نظام إدارة قضايا المحاماة

تطبيق ويب بسيط لإدارة العملاء والقضايا القانونية، مبني باستخدام Node.js و Express.js و MongoDB.

## المميزات

- **إدارة العملاء**: إضافة وتعديل وحذف وعرض معلومات العملاء
- **إدارة القضايا**: إنشاء وإدارة القضايا القانونية المرتبطة بالعملاء
- **واجهة مستخدم نظيفة**: تصميم حديث ومتجاوب مع التنقل البديهي
- **عمليات CRUD كاملة**: إنشاء وقراءة وتحديث وحذف كامل
- **العلاقات بين البيانات**: القضايا مرتبطة بعملاء محددين
- **البحث برقم الهاتف**: إمكانية البحث عن القضايا برقم هاتف العميل
- **واجهة عربية**: النظام بالكامل باللغة العربية لسهولة الاستخدام

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Custom CSS with modern design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start MongoDB**:
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017/lawyer-case-management`

4. **Start the application**:
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Or production mode
   npm start
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3000`

## Project Structure

```
lawyer-case-management/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── models/                # MongoDB models
│   ├── Client.js         # Client schema
│   └── Case.js           # Case schema
├── routes/                # API routes
│   ├── clients.js        # Client CRUD endpoints
│   └── cases.js          # Case CRUD endpoints
└── public/                # Frontend files
    ├── index.html        # Dashboard
    ├── clients.html      # Client management page
    ├── cases.html        # Case management page
    ├── styles.css        # Styling
    ├── clients.js        # Client page JavaScript
    └── cases.js          # Case page JavaScript
```

## API Endpoints

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create a new client
- `PUT /api/clients/:id` - Update a client
- `DELETE /api/clients/:id` - Delete a client

### Cases
- `GET /api/cases` - Get all cases with client information
- `POST /api/cases` - Create a new case
- `PUT /api/cases/:id` - Update a case
- `DELETE /api/cases/:id` - Delete a case

## طريقة الاستخدام

1. **لوحة التحكم**: ابدأ من اللوحة الرئيسية للتنقل بين العملاء والقضايا
2. **إضافة العملاء**: استخدم نموذج العميل لإضافة معلومات العميل (الاسم، الهاتف، البريد الإلكتروني، العنوان)
3. **إضافة القضايا**: أنشئ قضايا واربطها بالعملاء الموجودين
4. **تعديل/حذف**: استخدم أزرار الإجراءات لتعديل أو إزالة العملاء والقضايا
5. **عرض التفاصيل**: جميع المعلومات معروضة في بطاقات منظمة ونظيفة
6. **البحث**: استخدم ميزة البحث برقم هاتف العميل للعثور على قضاياه

## Sample Data

The application includes sample data that will be automatically loaded when you first run it. You can add, edit, or delete this data as needed.

## Development

- The server uses nodemon for automatic restarts during development
- MongoDB connection is configured for local development
- All API responses are in JSON format
- Frontend uses vanilla JavaScript with modern ES6+ features

## Troubleshooting

- **MongoDB Connection Error**: Ensure MongoDB is running and accessible
- **Port Already in Use**: Change the PORT in server.js or kill the process using port 3000
- **CORS Issues**: The app includes CORS middleware for cross-origin requests

## License

MIT License - feel free to use this project for learning or commercial purposes.
