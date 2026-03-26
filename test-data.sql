USE local_service_platform;

-- Passwords are all hashed 'password' using BCrypt
INSERT INTO users (name, email, password, role, status, created_at, updated_at) VALUES 
('Admin User', 'admin@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ADMIN', true, NOW(), NOW()),
('John Plumber', 'provider@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'SERVICE_PROVIDER', true, NOW(), NOW()),
('Alice Customer', 'customer@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'CUSTOMER', true, NOW(), NOW());

INSERT INTO services (name, category, price, provider_id, created_at, updated_at) VALUES 
('Basic Plumbing Fix', 'Plumbing', 50.00, 2, NOW(), NOW()),
('Pipe Installation', 'Plumbing', 150.00, 2, NOW(), NOW());
