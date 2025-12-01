-- Add keywords column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS keywords text[] DEFAULT '{}';

-- Update existing products with relevant keywords
UPDATE products SET keywords = ARRAY['wireless', 'mouse', 'gaming', 'rgb', 'ergonomic', 'pc', 'computer'] WHERE name ILIKE '%mouse%';
UPDATE products SET keywords = ARRAY['mechanical', 'keyboard', 'gaming', 'rgb', 'typing', 'pc', 'computer', 'wireless'] WHERE name ILIKE '%keyboard%';
UPDATE products SET keywords = ARRAY['headphones', 'audio', 'wireless', 'bluetooth', 'music', 'noise cancelling', 'headset'] WHERE name ILIKE '%headphone%';
UPDATE products SET keywords = ARRAY['laptop', 'computer', 'notebook', 'pc', 'gaming', 'work', 'portable'] WHERE name ILIKE '%laptop%';
UPDATE products SET keywords = ARRAY['monitor', 'display', 'screen', 'gaming', 'work', 'pc', '4k', 'curved'] WHERE name ILIKE '%monitor%';
UPDATE products SET keywords = ARRAY['webcam', 'camera', 'streaming', 'video', 'conference', 'zoom', 'meeting'] WHERE name ILIKE '%webcam%';
UPDATE products SET keywords = ARRAY['speaker', 'audio', 'bluetooth', 'wireless', 'music', 'sound'] WHERE name ILIKE '%speaker%';
UPDATE products SET keywords = ARRAY['tablet', 'ipad', 'android', 'portable', 'touch', 'screen'] WHERE name ILIKE '%tablet%';
UPDATE products SET keywords = ARRAY['phone', 'smartphone', 'mobile', 'cellular', 'iphone', 'android'] WHERE name ILIKE '%phone%';
UPDATE products SET keywords = ARRAY['charger', 'power', 'cable', 'usb', 'charging', 'adapter'] WHERE name ILIKE '%charger%';
UPDATE products SET keywords = ARRAY['case', 'cover', 'protection', 'phone', 'tablet', 'laptop'] WHERE name ILIKE '%case%';
UPDATE products SET keywords = ARRAY['ssd', 'storage', 'drive', 'hard drive', 'disk', 'memory', 'data'] WHERE name ILIKE '%ssd%' OR name ILIKE '%drive%';
UPDATE products SET keywords = ARRAY['ram', 'memory', 'ddr', 'upgrade', 'pc', 'computer'] WHERE name ILIKE '%ram%' OR name ILIKE '%memory%';
UPDATE products SET keywords = ARRAY['router', 'wifi', 'wireless', 'internet', 'network', 'modem'] WHERE name ILIKE '%router%';
UPDATE products SET keywords = ARRAY['smart watch', 'watch', 'fitness', 'wearable', 'tracker', 'health'] WHERE name ILIKE '%watch%';
UPDATE products SET keywords = ARRAY['earbuds', 'wireless', 'bluetooth', 'audio', 'music', 'airpods', 'buds'] WHERE name ILIKE '%earbud%' OR name ILIKE '%airpod%';
UPDATE products SET keywords = ARRAY['tv', 'television', 'smart tv', '4k', 'screen', 'display', 'streaming'] WHERE name ILIKE '%tv%';
UPDATE products SET keywords = ARRAY['console', 'gaming', 'playstation', 'xbox', 'nintendo', 'video games'] WHERE name ILIKE '%console%' OR name ILIKE '%playstation%' OR name ILIKE '%xbox%';
UPDATE products SET keywords = ARRAY['controller', 'gaming', 'gamepad', 'joystick', 'playstation', 'xbox'] WHERE name ILIKE '%controller%';
UPDATE products SET keywords = ARRAY['microphone', 'mic', 'audio', 'recording', 'streaming', 'podcast'] WHERE name ILIKE '%microphone%' OR name ILIKE '%mic%';

-- Insert new products with keywords
INSERT INTO products (name, description, price, original_price, category, image, features, rating, reviews, in_stock, stock_quantity, keywords) VALUES
('Wireless Gaming Keyboard RGB', 'Mechanical wireless keyboard with customizable RGB lighting and programmable keys', 89.99, 129.99, 'Electronics', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', ARRAY['Mechanical switches', 'RGB lighting', 'Wireless connectivity', 'Programmable keys'], 4.6, 342, true, 67, ARRAY['keyboard', 'wireless', 'gaming', 'rgb', 'mechanical', 'typing', 'pc']),
('USB-C Hub Adapter', 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader', 34.99, 49.99, 'Electronics', 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500', ARRAY['USB-C connectivity', 'HDMI output', '3x USB 3.0 ports', 'SD card reader'], 4.4, 189, true, 125, ARRAY['usb', 'hub', 'adapter', 'usbc', 'hdmi', 'port', 'connector']),
('Portable Power Bank 20000mAh', 'High-capacity power bank with fast charging and dual USB ports', 39.99, 59.99, 'Electronics', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500', ARRAY['20000mAh capacity', 'Fast charging', 'Dual USB ports', 'LED indicator'], 4.5, 276, true, 89, ARRAY['power bank', 'charger', 'battery', 'portable', 'charging', 'usb', 'mobile']),
('Ergonomic Office Chair', 'Adjustable office chair with lumbar support and breathable mesh', 199.99, 299.99, 'Home & Kitchen', 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500', ARRAY['Lumbar support', 'Breathable mesh', 'Adjustable height', 'Ergonomic design'], 4.7, 412, true, 34, ARRAY['chair', 'office', 'ergonomic', 'desk', 'seating', 'work', 'furniture']),
('Standing Desk Converter', 'Height-adjustable standing desk converter for healthier work', 159.99, 229.99, 'Home & Kitchen', 'https://images.unsplash.com/photo-1595515106969-1ce29566ff2c?w=500', ARRAY['Height adjustable', 'Spacious surface', 'Easy assembly', 'Cable management'], 4.5, 298, true, 45, ARRAY['desk', 'standing', 'converter', 'office', 'work', 'ergonomic', 'furniture']),
('Blue Light Blocking Glasses', 'Computer glasses that reduce eye strain and improve sleep', 24.99, 39.99, 'Health & Sports', 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500', ARRAY['Blue light filtering', 'Anti-glare coating', 'Lightweight frame', 'UV protection'], 4.3, 567, true, 156, ARRAY['glasses', 'blue light', 'computer', 'eye', 'protection', 'screen', 'health']),
('Wireless Charging Pad', 'Fast wireless charging pad compatible with all Qi-enabled devices', 29.99, 44.99, 'Electronics', 'https://images.unsplash.com/photo-1591290619762-c588f0f1e366?w=500', ARRAY['Fast charging', 'Qi-compatible', 'LED indicator', 'Non-slip surface'], 4.4, 234, true, 98, ARRAY['charger', 'wireless', 'charging pad', 'qi', 'fast charge', 'phone', 'power']),
('RGB Gaming Headset Stand', 'Headset stand with RGB lighting and USB hub', 34.99, 49.99, 'Gaming', 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500', ARRAY['RGB lighting', 'USB 3.0 hub', 'Sturdy design', 'Cable management'], 4.5, 178, true, 72, ARRAY['headset', 'stand', 'rgb', 'gaming', 'holder', 'desk', 'accessory']),
('Laptop Cooling Pad', 'Cooling pad with adjustable fans and ergonomic design', 29.99, 44.99, 'Computing', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', ARRAY['5 cooling fans', 'Adjustable height', 'USB powered', 'LED lighting'], 4.3, 312, true, 84, ARRAY['cooling', 'pad', 'laptop', 'fan', 'cooler', 'gaming', 'computer']),
('Mechanical Numpad', 'Separate mechanical numpad for enhanced productivity', 39.99, 54.99, 'Electronics', 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=500', ARRAY['Mechanical switches', 'USB-C connection', 'Compact design', 'Hot-swappable'], 4.6, 145, true, 53, ARRAY['numpad', 'keyboard', 'mechanical', 'number pad', 'usb', 'pc', 'typing']);

-- Update search functionality to include keywords
CREATE INDEX IF NOT EXISTS idx_products_keywords ON products USING GIN (keywords);