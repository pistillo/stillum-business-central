-- Create databases for each service
CREATE DATABASE stillum_registry;
CREATE DATABASE stillum_publisher;
CREATE DATABASE stillum_gateway;
CREATE DATABASE stillum_keycloak;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE stillum_registry TO stillum;
GRANT ALL PRIVILEGES ON DATABASE stillum_publisher TO stillum;
GRANT ALL PRIVILEGES ON DATABASE stillum_gateway TO stillum;
GRANT ALL PRIVILEGES ON DATABASE stillum_keycloak TO stillum;
