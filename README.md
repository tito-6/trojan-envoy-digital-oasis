
# Trojan Envoy - Website and CMS

This project is a full-featured website with a content management system built with React, TypeScript, Tailwind CSS, Shadcn/UI, and MySQL.

## Features

- Responsive design
- Content management system
- Blog system
- Services showcase
- Portfolio gallery
- Team section
- Contact form
- SEO optimization
- Dark mode support
- Multi-language support

## Prerequisites

- Node.js (v16 or later)
- MySQL (v8.0 or later)
- Git

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/trojan-envoy.git
cd trojan-envoy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the MySQL database

Create a new MySQL database:

```sql
CREATE DATABASE trojan_envoy;
```

Run the setup script to create the necessary tables:

```bash
mysql -u your_username -p trojan_envoy < src/sql/setup.sql
```

### 4. Configure environment variables

Create a `.env` file in the root directory with the following variables:

```
# MySQL Connection
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=trojan_envoy
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password

# Supabase (optional)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### 5. Run the development server

```bash
npm run dev
```

Your application should now be running at [http://localhost:5173](http://localhost:5173)

## Project Structure

- `src/` - Source code
  - `components/` - React components
    - `admin/` - Admin dashboard components
    - `blog/` - Blog components
    - `common/` - Common components like Header and Footer
    - `home/` - Home page components
    - `services/` - Services components
    - `ui/` - Shadcn UI components
  - `hooks/` - Custom React hooks
  - `lib/` - Utility functions and services
    - `mysql.ts` - MySQL database connection
    - `storage.ts` - Data storage service
    - `types.ts` - TypeScript type definitions
  - `pages/` - Page components
  - `sql/` - SQL scripts for database setup

## Database Structure

The application uses a MySQL database with the following main tables:

- `content` - Stores all content items (pages, blog posts, services, etc.)
- `contact_requests` - Stores contact form submissions
- `navigation` - Stores navigation menu items
- `settings` - Stores application settings (header, footer, etc.)

See `src/sql/setup.sql` for the complete database schema.

## Development

### Adding a new page

1. Create a new component in `src/pages/`
2. Add the route in `src/App.tsx`

### Adding a new content type

1. Add the type definition in `src/lib/types.ts`
2. Extend the storage service in `src/lib/storage.ts`
3. Create corresponding components in `src/components/`

## Production Deployment

### Build for production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Database Migrations

For production deployments, make sure to run the database migration scripts:

```bash
mysql -u your_username -p your_database < src/sql/setup.sql
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
