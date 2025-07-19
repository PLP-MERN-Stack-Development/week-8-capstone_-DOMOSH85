# GreenLands - Land Management Platform

A comprehensive MERN stack application focused on technology to improve land management, connecting farmers, government organizations, and stakeholders with robust data visualization and analytics.

## 🌟 Features

### **Core Functionality**
- **Land Mapping**: Interactive maps showing land parcels, soil data, and crop information
- **Farmer Portal**: Profile management, crop tracking, weather alerts
- **Government Dashboard**: Policy updates, subsidy information, compliance tracking
- **Analytics Hub**: Data visualization, reports, trend analysis
- **Communication Center**: Messaging between stakeholders
- **Real-time Updates**: Live data synchronization across all modules

### **Design & UX**
- **Responsive Design**: Works seamlessly on all screen sizes (mobile, tablet, desktop)
- **Modern UI**: Built with Radix UI components and Tailwind CSS
- **Color Theme**: Professional green and black color palette
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Performance**: Optimized for fast loading and smooth interactions

### **Technology Stack**
- **Frontend**: React 18, Radix UI, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT tokens with role-based access
- **Maps**: Leaflet.js for interactive mapping
- **Charts**: Recharts for data visualization
- **State Management**: React Context API

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd greenlands-land-management
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Create .env file in root directory
   cp .env.example .env
   ```

   Add your environment variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/greenlands
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the application**
   ```bash
   # Development mode (runs both server and client)
   npm run dev
   
   # Or run separately:
   # Terminal 1 - Start server
   npm run server
   
   # Terminal 2 - Start client
   npm run client
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 📁 Project Structure

```
greenlands-land-management/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── index.js           # Server entry point
├── package.json
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary Green**: `#0F5132` (Deep green)
- **Secondary Green**: `#10B981` (Light green)
- **Accent Green**: `#047857` (Emerald)
- **Black**: `#0A0A0A` (Pure black)
- **Charcoal**: `#1F2937` (Dark gray)
- **Sage**: `#6B7280` (Medium gray)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Multiple variants (primary, secondary, outline)
- **Forms**: Consistent input styling with focus states
- **Navigation**: Responsive sidebar with active states

## 🔧 Configuration

### Frontend Configuration
The React app uses:
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **Axios** for API calls
- **Recharts** for data visualization

### Backend Configuration
The Express server includes:
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Rate limiting** for API protection
- **Compression** for response optimization
- **Morgan** for request logging

## 📊 Data Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['farmer', 'government', 'admin'],
  phone: String,
  location: String,
  farmDetails: Object, // For farmers
  department: String,   // For government
  permissions: Array
}
```

### Land Model
```javascript
{
  name: String,
  area: Number,
  crop: String,
  soilType: String,
  status: String,
  coordinates: [Number, Number],
  farmer: ObjectId,
  lastUpdated: Date
}
```

## 🔐 Authentication & Authorization

- **JWT-based authentication**
- **Role-based access control**
- **Secure password hashing** with bcrypt
- **Token expiration** (24 hours)
- **Protected routes** with middleware

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
cd client
npm run build

# Deploy to your preferred platform (Vercel, Netlify, etc.)
```

### Backend Deployment
```bash
# Set production environment variables
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Real-time notifications** with WebSocket
- **Mobile app** with React Native
- **AI-powered insights** for crop recommendations
- **Weather integration** for farming decisions
- **Blockchain integration** for land ownership verification
- **Multi-language support** for international users

---

**Built with ❤️ for sustainable agriculture and land management** 