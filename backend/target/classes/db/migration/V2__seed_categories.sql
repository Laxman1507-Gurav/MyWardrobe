-- V2__seed_categories.sql
-- Seed standard clothing categories for MyWardrobe

INSERT INTO clothing_categories (name, code, display_order, description) VALUES
('T-Shirts', 'TSHIRTS', 1, 'Casual, oversized, polo, and graphic t-shirts'),
('Shirts', 'SHIRTS', 2, 'Formal, casual, button-down, and linen shirts'),
('Tops & Blouses', 'TOPS', 3, 'Tank tops, crop tops, tunics, and stylish knit tops'),
('Hoodies & Sweatshirts', 'HOODIES', 4, 'Zip-up, pullover hoodies, and fleece sweatshirts'),
('Jackets & Coats', 'JACKETS', 5, 'Puffers, corduroy, denim jackets, blazers, and trench coats'),
('Jeans', 'JEANS', 6, 'Straight leg, slim, baggy, wide leg, and cargo denim'),
('Trousers & Chinos', 'TROUSERS', 7, 'Tailored formal trousers, pleat pants, and casual chinos'),
('Shorts', 'SHORTS', 8, 'Bermuda, tailored, running, and casual lounge shorts'),
('Skirts', 'SKIRTS', 9, 'Mini, midi, pleated, and maxi skirts'),
('Dresses', 'DRESSES', 10, 'Casual day dresses, slip dresses, and evening gowns'),
('Ethnic & Traditional', 'ETHNIC', 11, 'Kurtas, ethnic sets, sherwanis, and festive garments'),
('Formal Wear', 'FORMAL', 12, 'Two-piece suits, tuxedos, and tailored formal vests'),
('Shoes & Sneakers', 'SHOES', 13, 'Sneakers, loafers, formal dress shoes, boots, and sandals'),
('Bags & Wallets', 'BAGS', 14, 'Totes, cross-body bags, backpacks, and leather briefcases'),
('Watches & Jewelry', 'WATCHES', 15, 'Analogue, digital chronographs, and jewelry accents'),
('Accessories & Hats', 'ACCESSORIES', 16, 'Belts, scarves, caps, beanies, and sunglasses')
ON DUPLICATE KEY UPDATE description = VALUES(description);
