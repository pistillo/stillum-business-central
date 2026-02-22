-- Create databases
CREATE DATABASE stillum_registry;
CREATE DATABASE stillum_publisher;
CREATE DATABASE stillum_gateway;
CREATE DATABASE stillum_keycloak;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE stillum_registry TO stillum;
GRANT ALL PRIVILEGES ON DATABASE stillum_publisher TO stillum;
GRANT ALL PRIVILEGES ON DATABASE stillum_gateway TO stillum;
GRANT ALL PRIVILEGES ON DATABASE stillum_keycloak TO stillum;

-- Connect to each database and create schemas
\c stillum_registry
CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL PRIVILEGES ON SCHEMA public TO stillum;

\c stillum_publisher
CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL PRIVILEGES ON SCHEMA public TO stillum;

\c stillum_gateway
CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL PRIVILEGES ON SCHEMA public TO stillum;

\c stillum_keycloak
CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL PRIVILEGES ON SCHEMA public TO stillum;
