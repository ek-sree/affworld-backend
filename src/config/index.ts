import dotenv from 'dotenv'
dotenv.config()
const config ={
    port: process.env.PORT || 3001,
    NODE_EN: process.env.NODE_ENV,
    mongoUrl: process.env.MONGODB_URI || '',
    EMAIL_NODEMAILER: process.env.EMAIL_NODEMAILER,
    PASSWORD_NODEMAILER: process.env.PASSWORD_NODEMAILER,
    SESSION_SECRET_KEY: process.env.SECRET_KEY_SESSION || 'secret-key',
    CORS_KEY: process.env.CORS_KEY,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
    jwt_access_key: process.env.JWT_ACCESS_TOKEN_KEY || '',
    jwt_refresh_key: process.env.JWT_REFRESH_TOKEN_KEY || ''


}

export default config