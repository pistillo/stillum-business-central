-- Reset Nexus admin password to "admin123" (hash Shiro SHA-512)
-- Uso: eseguire con scripts/reset-nexus-admin-password.sh (Nexus deve essere fermo)
UPDATE security_user
SET password = '$shiro1$SHA-512$1024$NE+wqQq/TmjZMvfI7ENh/g==$V4yPw8T64UQ6GfJfxYq2hLsVrBY8D1v+bktfOxGdt4b/9BthpWPNUy/CBk6V9iA0nHpzYzJFWO8v/tZFtES8CA==',
    status = 'active'
WHERE id = 'admin';
