# HranaMea App Development Plan

## Overview

This document outlines the step-by-step process for transforming the current diabetic recipe web application into "HranaMea" - a comprehensive mobile application for Android and iOS platforms with enhanced features including:

1. The existing diabetic-friendly recipe database
2. A knowledge base for storing and accessing PDFs and text documents
3. An AI-powered chat feature that can access the knowledge base
4. Cross-platform compatibility (Android and iOS)

The plan is structured to cover hardware requirements, server setup, backend development, mobile app development, and deployment processes.

## ✅ Completed (May 28, 2026)

### AI Chat — Production Ready

- **Provider:** DeepSeek (`deepseek-chat` model) via `api.deepseek.com`
- **Previous providers removed:** X.ai (Grok) and OpenAI (quota exhausted)
- **Language:** Romanian, friendly nutritional assistant persona
- **Architecture:** Single-provider, no fallback chain. `routes/ai-routes.js` calls `callDeepSeek()`.
- **API key:** Stored in `.env` (`DEEPSEEK_API_KEY`), gitignored, never in repo.

### Deployment Pipeline — Live

- **Repo:** `https://github.com/DeadRyan/hranamea` (public)
- **Hosting:** cPanel VPS at `hranamea.ro` (path: `/home/hranamea/public_html/nodeapp`)
- **Auto-deploy:** Cron job pulls from GitHub every 5 minutes via `git pull origin master`
- **Workflow:** `git push` → GitHub → cron pulls → live within 5 minutes
- **`.env` file:** Manually managed (gitignored). Updated via cPanel File Manager when API keys change.

### Deploy Config Files

- `.cpanel.yml` — cPanel deployment tasks
- `HranaMea_cPanel_Deployment.md` — Full deployment guide

## Table of Contents

1. [Hardware and Infrastructure Planning](#1-hardware-and-infrastructure-planning)
2. [Server Setup and Configuration](#2-server-setup-and-configuration)
3. [Backend Development](#3-backend-development)
4. [Knowledge Base Implementation](#4-knowledge-base-implementation)
5. [AI Chat Feature Development](#5-ai-chat-feature-development)
6. [Mobile App Development (React Native)](#6-mobile-app-development-react-native)
7. [Testing and Quality Assurance](#7-testing-and-quality-assurance)
8. [App Store Deployment](#8-app-store-deployment)
9. [Maintenance and Scaling Plan](#9-maintenance-and-scaling-plan)

## 1. Hardware and Infrastructure Planning

### VPS Requirements for 10,000+ Users

For an application with 10,000 users in the first year (and growth beyond), we need a scalable infrastructure that can handle concurrent users, data storage, and AI processing.

#### Recommended VPS Configuration:

| Component          | Specification            | Justification                                                        |
| ------------------ | ------------------------ | -------------------------------------------------------------------- |
| CPU                | 8 vCPUs                  | To handle concurrent connections and AI processing                   |
| RAM                | 16GB                     | For database operations, caching, and AI model execution             |
| Storage            | 256GB SSD                | For application code, database, and initial knowledge base documents |
| Additional Storage | Expandable cloud storage | For growing document database and user uploads                       |
| Bandwidth          | 5TB/month                | To handle API calls, document transfers, and user interactions       |

#### Recommended Provider

**DigitalOcean** offers a good balance of performance, price, and scalability:

- Premium CPU-Optimized Droplet ($160/month)
- DigitalOcean Spaces for expandable object storage ($5/month + $0.01/GB)
- Load Balancer for high availability ($12/month)

This configuration allows for vertical scaling (upgrading the droplet) and horizontal scaling (adding multiple instances behind the load balancer) as the user base grows.

### Operating System Selection

**Ubuntu Server 22.04 LTS** is recommended for its:

- Long-term support (until April 2027)
- Extensive documentation and community support
- Compatibility with most development tools and services
- Regular security updates
- Strong performance with Node.js applications

## 2. Server Setup and Configuration

### Initial Server Setup

SSH into your newly created VPS:

```bash
ssh root@your_server_ip
```

Update the system and install essential packages:

```bash
# Update package list and upgrade existing packages
apt update && apt upgrade -y

# Install essential tools
apt install -y build-essential git curl wget nginx ufw
```

### Create a Non-root User

```bash
# Create a new user
adduser hranamea

# Add user to sudo group
usermod -aG sudo hranamea

# Switch to the new user
su - hranamea
```

### Configure Firewall

```bash
# Allow SSH connections
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow Node.js application port
sudo ufw allow 3000/tcp

# Enable firewall
sudo ufw enable
```

### Install Node.js and npm

```bash
# Install Node Version Manager (NVM)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js LTS version
nvm install --lts

# Verify installation
node --version
npm --version
```

### Install MongoDB

```bash
# Import the MongoDB public GPG key
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg \
   --dearmor

# Create a list file for MongoDB
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Reload package database
sudo apt update

# Install MongoDB packages
sudo apt install -y mongodb-org

# Start MongoDB and enable on boot
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

### Setup NGINX as Reverse Proxy

```bash
# Create NGINX config file for the app
sudo nano /etc/nginx/sites-available/hranamea

# Add the following configuration
```

Configuration to add:

```nginx
server {
    listen 80;
    server_name hranamea.com www.hranamea.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Continue with:

```bash
# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/hranamea /etc/nginx/sites-enabled/

# Test NGINX configuration
sudo nginx -t

# Restart NGINX
sudo systemctl restart nginx
```

### Install SSL Certificate with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain and install certificate
sudo certbot --nginx -d hranamea.com -d www.hranamea.com

# Verify auto-renewal
sudo systemctl status certbot.timer
```

### Install Docker for AI Components

```bash
# Install required packages
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add the Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update apt and install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Add user to docker group to run Docker without sudo
sudo usermod -aG docker hranamea

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Verify Docker installation
docker --version
```

### Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.16.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Apply executable permissions
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

## 3. Backend Development

### Project Directory Structure

First, create the application directory structure:

```bash
# Navigate to home directory
cd ~

# Create project directory
mkdir -p hranamea/backend
mkdir -p hranamea/mobile-app
cd hranamea/backend

# Initialize Node.js project
npm init -y

# Create directory structure
mkdir -p src/{config,controllers,models,routes,services,utils,middleware}
mkdir -p data/uploads
mkdir -p public/images
```

### Installing Backend Dependencies

```bash
# Core dependencies
npm install express mongoose cors dotenv bcryptjs jsonwebtoken multer express-validator

# Development dependencies
npm install -D nodemon eslint prettier
```

### Configuration Files

Create the following configuration files:

```bash
# Create environment variables file
nano .env
```

Add the following to the .env file:

```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hranamea
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=hranamea-documents
```

Create configuration module:

```bash
# Create config file
nano src/config/config.js
```

Add the following to config.js:

```javascript
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE,
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketName: process.env.AWS_BUCKET_NAME,
  },
};
```

### Database Models

Set up Mongoose models for the app:

```bash
# Create user model
nano src/models/User.js
```

Add the following to User.js:

```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
```

## 6. Mobile App Development (React Native)

### Setting Up React Native Environment

Install React Native CLI globally:

```bash
npm install -g react-native-cli
```

Create a new React Native project:

```bash
# Navigate to the mobile app directory
cd ~/hranamea/mobile-app

# Initialize a new React Native project
npx react-native init HranaMeaApp
cd HranaMeaApp

# Install essential dependencies
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-safe-area-context react-native-screens react-native-gesture-handler
npm install react-native-vector-icons axios redux react-redux @reduxjs/toolkit
npm install react-native-paper react-native-fs react-native-document-picker
npm install @react-native-async-storage/async-storage socket.io-client
```

### Project Structure

Organize the React Native project:

```bash
mkdir -p src/{components,screens,navigation,redux,services,utils,assets/{images,fonts},styles,hooks}
```

### App Configuration

Create application configuration:

```bash
# Create configuration file
nano src/utils/config.js
```

Add the following to config.js:

```javascript
const BASE_URL = __DEV__
  ? "http://10.0.2.2:3000/api/v1" // Android Emulator
  : "https://hranamea.com/api/v1"; // Production

const SOCKET_URL = __DEV__ ? "http://10.0.2.2:3001" : "https://ai.hranamea.com";

export default {
  BASE_URL,
  SOCKET_URL,
  API_TIMEOUT: 15000,
};
```

### User Interface Components

Create the main components for the application:

```bash
# Create custom button component
nano src/components/Button.js
```

Add the following to Button.js:

```javascript
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { Colors } from "../styles/Colors";

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  loading = false,
  disabled = false,
  primary = true,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        primary ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={primary ? Colors.white : Colors.primary} />
      ) : (
        <Text
          style={[
            styles.text,
            primary ? styles.primaryText : styles.secondaryText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  disabledButton: {
    backgroundColor: Colors.lightGray,
    borderColor: Colors.lightGray,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.primary,
  },
});

export default Button;
```

Create the navigation structure:

```bash
# Create app navigation
nano src/navigation/AppNavigator.js
```

Add the following to AppNavigator.js:

```javascript
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Import screens
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import RecipesScreen from "../screens/recipes/RecipesScreen";
import RecipeDetailScreen from "../screens/recipes/RecipeDetailScreen";
import KnowledgeBaseScreen from "../screens/knowledge/KnowledgeBaseScreen";
import DocumentViewScreen from "../screens/knowledge/DocumentViewScreen";
import ChatScreen from "../screens/chat/ChatScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

// Import colors
import { Colors } from "../styles/Colors";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: Colors.primary,
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}
  >
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ title: "Login" }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ title: "Register" }}
    />
  </Stack.Navigator>
);

// Recipes Stack
const RecipesNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: Colors.primary,
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}
  >
    <Stack.Screen
      name="Recipes"
      component={RecipesScreen}
      options={{ title: "Rețete" }}
    />
    <Stack.Screen
      name="RecipeDetail"
      component={RecipeDetailScreen}
      options={{ title: "Detalii Rețetă" }}
    />
  </Stack.Navigator>
);

// Knowledge Base Stack
const KnowledgeNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: Colors.primary,
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}
  >
    <Stack.Screen
      name="Knowledge"
      component={KnowledgeBaseScreen}
      options={{ title: "Biblioteca" }}
    />
    <Stack.Screen
      name="DocumentView"
      component={DocumentViewScreen}
      options={{ title: "Document" }}
    />
  </Stack.Navigator>
);

// Main App Tabs
const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "RecipesTab") {
          iconName = focused ? "food" : "food-outline";
        } else if (route.name === "KnowledgeTab") {
          iconName = focused ? "book-open-variant" : "book-open-outline";
        } else if (route.name === "ChatTab") {
          iconName = focused ? "chat" : "chat-outline";
        } else if (route.name === "ProfileTab") {
          iconName = focused ? "account" : "account-outline";
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.darkGray,
      headerShown: false,
    })}
  >
    <Tab.Screen
      name="RecipesTab"
      component={RecipesNavigator}
      options={{ title: "Rețete" }}
    />
    <Tab.Screen
      name="KnowledgeTab"
      component={KnowledgeNavigator}
      options={{ title: "Biblioteca" }}
    />
    <Tab.Screen
      name="ChatTab"
      component={ChatScreen}
      options={{ title: "Chat" }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileScreen}
      options={{ title: "Profil" }}
    />
  </Tab.Navigator>
);

// Root Navigator
const AppNavigator = ({ isAuthenticated }) => {
  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
```

## 7. Testing and Quality Assurance

### Backend Testing Setup

Set up Jest for testing the backend:

```bash
# Navigate to the backend directory
cd ~/hranamea/backend

# Install Jest and testing dependencies
npm install -D jest supertest mongodb-memory-server

# Create Jest configuration file
nano jest.config.js
```

Add the following to jest.config.js:

```javascript
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.js", "!src/server.js", "!src/config/*.js"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Mobile App Testing Setup

Set up React Native Testing Library:

```bash
# Navigate to the mobile app directory
cd ~/hranamea/mobile-app/HranaMeaApp

# Install testing dependencies
npm install -D @testing-library/react-native @testing-library/jest-native jest-react-native
```

## 8. App Store Deployment

### Android Deployment

Set up Gradle properties for release:

```bash
# Navigate to the Android directory
cd ~/hranamea/mobile-app/HranaMeaApp/android/app

# Create keystore for signing the app
keytool -genkeypair -v -storetype PKCS12 -keystore hranamea.keystore -alias hranamea -keyalg RSA -keysize 2048 -validity 10000

# Edit gradle properties
nano ../gradle.properties
```

Add the following to gradle.properties:

```
HRANAMEA_UPLOAD_STORE_FILE=hranamea.keystore
HRANAMEA_UPLOAD_KEY_ALIAS=hranamea
HRANAMEA_UPLOAD_STORE_PASSWORD=*****
HRANAMEA_UPLOAD_KEY_PASSWORD=*****
```

Configure build.gradle for release:

```bash
# Edit app build.gradle
nano build.gradle
```

Add the signing config to build.gradle:

```gradle
...
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            storeFile file(HRANAMEA_UPLOAD_STORE_FILE)
            storePassword HRANAMEA_UPLOAD_STORE_PASSWORD
            keyAlias HRANAMEA_UPLOAD_KEY_ALIAS
            keyPassword HRANAMEA_UPLOAD_KEY_PASSWORD
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
...
```

Generate release APK:

```bash
# Navigate to the root of the React Native project
cd ~/hranamea/mobile-app/HranaMeaApp

# Generate release build
cd android
./gradlew assembleRelease
```

### iOS Deployment

Configure Xcode project:

```bash
# Navigate to the iOS directory
cd ~/hranamea/mobile-app/HranaMeaApp/ios

# Install CocoaPods dependencies
pod install
```

Open Xcode and configure signing:

1. Open Xcode with the .xcworkspace file
2. Select the project in the Project Navigator
3. Select the target under "TARGETS"
4. Go to the "Signing & Capabilities" tab
5. Select a development team
6. Configure Bundle Identifier

Generate iOS archive:

1. In Xcode, select "Generic iOS Device" as the build destination
2. Choose Product > Archive from the menu
3. In the Archives window, click "Distribute App"
4. Follow the App Store Connect submission process

## 9. Maintenance and Scaling Plan

### Monitoring Setup

Install Prometheus and Grafana:

```bash
# Create monitoring directory
mkdir -p ~/hranamea/monitoring
cd ~/hranamea/monitoring

# Create docker-compose file for monitoring
nano docker-compose.yml
```

Add the following to docker-compose.yml:

```yaml
version: "3"

services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus:/etc/prometheus
      - prometheus_data:/prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
      - "--web.console.libraries=/usr/share/prometheus/console_libraries"
      - "--web.console.templates=/usr/share/prometheus/consoles"
    restart: unless-stopped

  grafana:
    image: grafana/grafana
    ports:
      - "3010:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus
    restart: unless-stopped

volumes:
  prometheus_data: {}
  grafana_data: {}
```

Create Prometheus configuration:

```bash
# Create prometheus directory
mkdir prometheus
nano prometheus/prometheus.yml
```

Add the following to prometheus.yml:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "hranamea_backend"
    static_configs:
      - targets: ["backend:3000"]

  - job_name: "hranamea_ai_service"
    static_configs:
      - targets: ["ai-chat-service:3001"]
```

### Backup Strategy

Set up automated MongoDB backups:

```bash
# Create backup script
nano ~/hranamea/backup_script.sh
```

Add the following to backup_script.sh:

```bash
#!/bin/bash

# Configuration
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/hranamea/backups"
MONGODB_HOST="localhost"
MONGODB_PORT="27017"
MONGODB_DB="hranamea"
S3_BUCKET="hranamea-backups"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform MongoDB backup
mongodump --host $MONGODB_HOST --port $MONGODB_PORT --db $MONGODB_DB --out $BACKUP_DIR/$TIMESTAMP

# Compress backup
tar -zcvf $BACKUP_DIR/$TIMESTAMP.tar.gz $BACKUP_DIR/$TIMESTAMP

# Upload to S3
aws s3 cp $BACKUP_DIR/$TIMESTAMP.tar.gz s3://$S3_BUCKET/mongodb_backups/

# Clean up
rm -rf $BACKUP_DIR/$TIMESTAMP
find $BACKUP_DIR -type f -name "*.tar.gz" -mtime +7 -delete
```

Make the script executable and set up a cron job:

```bash
# Make script executable
chmod +x ~/hranamea/backup_script.sh

# Edit crontab
crontab -e
```

Add the following to crontab:

```
# Run backup daily at 3 AM
0 3 * * * /home/hranamea/backup_script.sh >> /home/hranamea/backup.log 2>&1
```

### Horizontal Scaling Plan

Set up Docker Swarm for scaling:

```bash
# Initialize Docker Swarm on the manager node
docker swarm init

# Create a docker-compose file for swarm deployment
nano ~/hranamea/docker-compose.prod.yml
```

Add the following to docker-compose.prod.yml:

```yaml
version: "3.8"

services:
  backend:
    image: hranamea/backend:latest
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/hranamea
    networks:
      - hranamea-network
    depends_on:
      - mongodb

  ai-service:
    image: hranamea/ai-service:latest
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/hranamea
    networks:
      - hranamea-network
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    volumes:
      - mongodb-data:/data/db
    networks:
      - hranamea-network
    deploy:
      placement:
        constraints:
          - node.role == manager

networks:
  hranamea-network:

volumes:
  mongodb-data:
```

Deploy with Docker Stack:

```bash
# Deploy the stack
docker stack deploy -c ~/hranamea/docker-compose.prod.yml hranamea
```

This completes the comprehensive development plan for the HranaMea application. Following these steps will transform the current recipe web application into a robust mobile app with knowledge base and AI chat capabilities.
