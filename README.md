# FinanceTools

FinanceTools is a comprehensive financial management web application featuring four main tools:
1. Tax Calculator
2. Invoice Generator
3. Expense Tracker
4. Payment Reminder System

## Features

- **Tax Calculator**: Handle international tax calculations for income, self-employment, capital gains, and deductions with live updates. Includes a Sales Tax/VAT calculator.
- **Invoice Generator**: Create professional invoices with business/client details, dynamic itemized lists, tax/discount fields, export options, and payment integration.
- **Expense Tracker**: AI Finance Buddy theme with real-time tips, interactive charts, and a supportive chatbot interface.
- **Payment Reminder System**: Animated Finance Buddy theme that manages payment reminders with smart notifications, auto-payment links, AI categorization, and emotional tone settings.
- **User Authentication**: Secure user authentication including Google login capabilities.
- **Admin Panel**: Comprehensive admin dashboard for managing all aspects of the application.

## Deployment Guide

### Step 1: Prepare Your Application for Deployment

1. Build the production version of the application:
   ```bash
   npm run build
   ```
   This will create a `dist` folder containing the compiled server code and a `dist/client` folder with the frontend assets.

### Step 2: Create Production Environment Variables

Create a `.env` file in your production server with all required environment variables:

```
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# SendGrid 
SENDGRID_API_KEY=your_sendgrid_api_key

# Anthropic API (for AI assistant)
ANTHROPIC_API_KEY=your_anthropic_api_key

# Session Secret (generate a random string)
SESSION_SECRET=your_random_session_secret

# Add other environment variables as needed
```

### Step 3: Install Dependencies on Your Server

```bash
npm install --production
```

This only installs the dependencies needed for production, skipping development dependencies.

### Step 4: Start the Server

```bash
npm run start
```

This will run the production build of your application.

### Step 5: Set Up a Process Manager (Recommended)

For production, you should use a process manager like PM2 to keep your application running:

1. Install PM2:
   ```bash
   npm install -g pm2
   ```

2. Start your application with PM2:
   ```bash
   pm2 start dist/index.js
   ```

3. Set up PM2 to start on server boot:
   ```bash
   pm2 startup
   pm2 save
   ```

### Step 6: Set Up a Reverse Proxy (Recommended)

For better performance and security, use Nginx or Apache as a reverse proxy.

#### Using Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000; # Port your app runs on
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Using Apache:

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com

    ProxyRequests Off
    ProxyPreserveHost On
    ProxyVia Full

    <Proxy *>
        Require all granted
    </Proxy>

    ProxyPass / http://localhost:5000/
    ProxyPassReverse / http://localhost:5000/
</VirtualHost>
```

### Step 7: Set Up SSL (Highly Recommended)

Use Let's Encrypt with Certbot to set up free SSL certificates:

```bash
sudo apt-get install certbot
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Troubleshooting Common Issues

### Application won't start
- Ensure all environment variables are correctly set
- Check server logs for errors
- Verify Node.js version (this app uses modern JavaScript features)

### Can't connect to the application
- Check if the application is running (`pm2 list`)
- Verify firewall settings allow traffic on your port
- Check your reverse proxy configuration

### Firebase Authentication Issues
- Ensure your Firebase project is correctly configured
- Add your production domain to the authorized domains in Firebase console

## Default Login Credentials

Admin Panel:
- Username: admin
- Password: admin123

## License

MIT