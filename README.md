# Custom T-Shirt Designer Website

Welcome to the Custom T-Shirt Designer Website! This platform allows users to design and customize their own t-shirts based on their preferences. Users can choose colors, upload images, and generate custom patterns and logos using the OPEN AI API key.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Custom T-Shirt Designer Website is a user-friendly platform that enables users to create personalized t-shirt designs. It offers a range of features, including a color picker to select various t-shirt colors, a file picker to upload images, and integration with the OPEN AI API to generate custom patterns and logos.

## Features

- Color picker: Users can choose from a wide range of colors to customize the t-shirt design.
- File picker: Users can upload their own images or logos to be incorporated into the design.
- OPEN AI API integration: The website integrates with the OPEN AI API to generate unique patterns and logos based on user inputs.
- Preview: Users can preview their designed t-shirt before finalizing the order.
- User accounts: Allow users to create accounts and save their designs for future editing or purchasing.

## Getting Started

Follow the instructions below to set up the Custom T-Shirt Designer Website on your local machine.

### Prerequisites

- Node.js (at least version 12.x)
- npm (Node Package Manager)
- OPEN AI API key (You need to sign up for an API key from OPEN AI)

### Installation

1. Clone the repository from GitHub:

```
git clone https://github.com/vivekup3424/Product-Customizer.git
cd product-customizer
```

2. Install the required dependencies:

```
npm install
```

### Configuration

Before running the application, you need to set up the OPEN AI API key in the environment. Create a new file named `.env` in the root directory and add the following:

```
OPEN_AI_API_KEY=your_open_ai_api_key_here
```

## Usage

1. Start the application:

```
npm start
```

2. Open your web browser and navigate to `http://localhost:3000` to access the Custom T-Shirt Designer Website.

3. Choose the t-shirt color using the color picker.

4. Upload your own logo or image using the file picker.

5. Click on the "Generate Pattern" button to create a custom pattern or logo using the OPEN AI API.

6. Preview your design and make any necessary adjustments.

7. Save or order your customized t-shirt.

## API Integration

The Custom T-Shirt Designer Website integrates with the OPEN AI API to generate custom patterns and logos. To learn more about the API and how to use it, refer to the [official documentation](https://openai.com/docs).

## Public deployment

The client and API are separate applications. A straightforward setup is to deploy the `client` directory as a static site (for example, on Vercel or Netlify) and the `server` directory as a Node.js web service (for example, on Render).

1. Deploy `server` as a Node.js service. Use `npm install` as the install command and `npm start` as the start command. Set these server environment variables in the hosting dashboard:
   - `OPENAI_API_KEY`: your OpenAI API key.
   - `CLIENT_ORIGIN`: the exact public client origin, such as `https://your-site.example` (no trailing slash). Multiple origins can be comma-separated.
   - Optional order email settings: `ORDER_EMAIL_FROM` and either `RESEND_API_KEY`, or `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, and `SMTP_PASSWORD`.
2. Deploy `client` as a static site. Set its build command to `npm run build`, its output directory to `dist`, and its `VITE_API_URL` environment variable to the server's public origin, such as `https://your-api.example` (no trailing slash).
3. Redeploy the client after setting `VITE_API_URL`; Vite embeds this value at build time.
4. Open the public site and test AI image generation and, if configured, order confirmation email delivery.

### Railway

Create two Railway services from the same repository. Set the first service's root directory to `server`, with start command `npm start`. Set the second service's root directory to `client`, build command `npm run build`, and start command `npm run preview -- --host 0.0.0.0 --port $PORT`. If the repository contains an extra enclosing project folder, include that folder in each root directory path. Set `OPENAI_API_KEY` on the server and `VITE_API_URL` on the client to the server's public origin. After Railway assigns the client a public domain, set `CLIENT_ORIGIN` on the server to that exact origin and redeploy both services.

Vite's preview server is suitable for a quick public demo; use a production static hosting server for a long-running production storefront.

Never put API keys in the client or commit `.env` files. This project currently stores account/cart state in the browser and does not connect checkout to a real payment processor or persist orders in a database; treat it as a demo until those production commerce requirements are implemented.

## Contributing

We welcome contributions from the community! If you'd like to contribute to the project, please follow the guidelines outlined in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

The Custom T-Shirt Designer Website is open-source and distributed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as per the terms of the license.

---

Thank you for using the Custom T-Shirt Designer Website! If you have any questions or encounter any issues, please don't hesitate to reach out to us via GitHub issues or email. Happy designing!
# ECEB
