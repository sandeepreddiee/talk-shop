-- Add sample customer reviews for products
-- Using random UUIDs for user_id since these are sample reviews for demonstration

-- Add reviews for various product categories
DO $$
DECLARE
  product_rec RECORD;
BEGIN
  -- Add reviews for wireless headphones
  FOR product_rec IN (SELECT id FROM products WHERE keywords @> ARRAY['wireless', 'headphones'] LIMIT 1)
  LOOP
    INSERT INTO reviews (product_id, user_id, rating, title, content, verified_purchase, helpful_count)
    VALUES
      (product_rec.id, gen_random_uuid(), 5, 'Amazing sound quality!', 'These headphones exceeded my expectations. The bass is deep, mids are clear, and highs are crisp. Battery life easily lasts all day. Comfort is excellent even after hours of use.', true, 45),
      (product_rec.id, gen_random_uuid(), 4, 'Great value for money', 'Solid performance for the price. Noise cancellation works well on planes. Only minor issue is the carrying case could be better quality.', true, 32),
      (product_rec.id, gen_random_uuid(), 5, 'Best purchase this year', 'I have tried many wireless headphones and these are by far the best. Crystal clear audio, comfortable fit, and excellent build quality.', true, 28);
  END LOOP;

  -- Add reviews for smartwatches
  FOR product_rec IN (SELECT id FROM products WHERE keywords @> ARRAY['smartwatch'] LIMIT 1)
  LOOP
    INSERT INTO reviews (product_id, user_id, rating, title, content, verified_purchase, helpful_count)
    VALUES
      (product_rec.id, gen_random_uuid(), 5, 'Perfect fitness companion', 'Tracks all my workouts accurately. Heart rate monitor is spot on. Sleep tracking has helped me improve my rest. Battery lasts 3-4 days.', true, 56),
      (product_rec.id, gen_random_uuid(), 4, 'Very useful but learning curve', 'Takes a bit to learn all features but once you do, it is incredibly useful. Love the notification system and health insights.', true, 23),
      (product_rec.id, gen_random_uuid(), 5, 'Highly recommended!', 'This watch has everything I need. GPS is accurate, water resistant works great for swimming, and the interface is intuitive.', true, 41);
  END LOOP;

  -- Add reviews for laptops
  FOR product_rec IN (SELECT id FROM products WHERE keywords @> ARRAY['laptop'] LIMIT 1)
  LOOP
    INSERT INTO reviews (product_id, user_id, rating, title, content, verified_purchase, helpful_count)
    VALUES
      (product_rec.id, gen_random_uuid(), 5, 'Powerhouse performance', 'Handles video editing and 3D rendering with ease. Screen is gorgeous. Keyboard feels premium. Worth every penny.', true, 67),
      (product_rec.id, gen_random_uuid(), 4, 'Great for work and gaming', 'Fast processor, plenty of RAM. Can run demanding games at high settings. Battery life is decent for the specs.', true, 38),
      (product_rec.id, gen_random_uuid(), 5, 'Best laptop I have owned', 'Build quality is exceptional. Performance is blazing fast. The display is stunning with accurate colors.', true, 52);
  END LOOP;

  -- Add reviews for gaming mice
  FOR product_rec IN (SELECT id FROM products WHERE keywords @> ARRAY['mouse', 'gaming'] LIMIT 1)
  LOOP
    INSERT INTO reviews (product_id, user_id, rating, title, content, verified_purchase, helpful_count)
    VALUES
      (product_rec.id, gen_random_uuid(), 5, 'Precision gaming mouse', 'Sensor is incredibly accurate. Comfortable grip for long gaming sessions. RGB lighting looks amazing. Highly customizable buttons.', true, 43),
      (product_rec.id, gen_random_uuid(), 4, 'Solid gaming peripheral', 'Great mouse for competitive gaming. DPI adjustment is smooth. Weight feels just right. Software could be more intuitive.', true, 29),
      (product_rec.id, gen_random_uuid(), 5, 'Perfect for FPS games', 'Low latency, high precision. This mouse has improved my aim significantly. Build quality feels premium and durable.', true, 36);
  END LOOP;

  -- Add reviews for keyboards
  FOR product_rec IN (SELECT id FROM products WHERE keywords @> ARRAY['keyboard'] LIMIT 1)
  LOOP
    INSERT INTO reviews (product_id, user_id, rating, title, content, verified_purchase, helpful_count)
    VALUES
      (product_rec.id, gen_random_uuid(), 5, 'Typing heaven', 'Mechanical switches feel amazing. Typing accuracy has improved dramatically. RGB effects are beautiful. Worth the investment.', true, 58),
      (product_rec.id, gen_random_uuid(), 4, 'Great for programming', 'Love the tactile feedback. Quiet enough for office use. Solid build quality. Function keys are well placed.', true, 34),
      (product_rec.id, gen_random_uuid(), 5, 'Best keyboard ever', 'This keyboard is a joy to type on. The sound is satisfying, response is instant, and durability seems excellent.', true, 47);
  END LOOP;

  -- Add reviews for monitors
  FOR product_rec IN (SELECT id FROM products WHERE keywords @> ARRAY['monitor'] LIMIT 1)
  LOOP
    INSERT INTO reviews (product_id, user_id, rating, title, content, verified_purchase, helpful_count)
    VALUES
      (product_rec.id, gen_random_uuid(), 5, 'Stunning display quality', 'Colors are vibrant and accurate. 4K resolution makes everything crisp. Perfect for photo editing and gaming.', true, 61),
      (product_rec.id, gen_random_uuid(), 4, 'Excellent gaming monitor', 'High refresh rate makes games buttery smooth. Response time is great. No ghosting or tearing. Stand is sturdy.', true, 42),
      (product_rec.id, gen_random_uuid(), 5, 'Professional grade monitor', 'Color accuracy is spot on for design work. Large screen real estate boosts productivity. Build quality is premium.', true, 39);
  END LOOP;

  -- Add reviews for phones
  FOR product_rec IN (SELECT id FROM products WHERE keywords @> ARRAY['phone', 'smartphone'] LIMIT 1)
  LOOP
    INSERT INTO reviews (product_id, user_id, rating, title, content, verified_purchase, helpful_count)
    VALUES
      (product_rec.id, gen_random_uuid(), 5, 'Camera is incredible', 'Photo quality rivals professional cameras. Night mode is amazing. Battery lasts all day with heavy use. Fast charging is convenient.', true, 74),
      (product_rec.id, gen_random_uuid(), 4, 'Flagship performance', 'Blazing fast processor. Display is gorgeous. Build feels premium. Only wish battery was slightly larger.', true, 48),
      (product_rec.id, gen_random_uuid(), 5, 'Best smartphone experience', 'Everything about this phone is excellent. Speed, camera, display, battery life. Highly recommend for anyone upgrading.', true, 55);
  END LOOP;

  -- Add reviews for speakers
  FOR product_rec IN (SELECT id FROM products WHERE keywords @> ARRAY['speaker', 'bluetooth'] LIMIT 1)
  LOOP
    INSERT INTO reviews (product_id, user_id, rating, title, content, verified_purchase, helpful_count)
    VALUES
      (product_rec.id, gen_random_uuid(), 5, 'Room filling sound', 'Bass is powerful without being muddy. Volume gets impressively loud. Battery life is outstanding. Perfect for parties.', true, 51),
      (product_rec.id, gen_random_uuid(), 4, 'Great portable speaker', 'Sound quality is excellent for the size. Waterproof design works as advertised. Bluetooth range is good.', true, 37),
      (product_rec.id, gen_random_uuid(), 5, 'Impressive audio quality', 'Crisp highs, rich mids, deep bass. Compact size but huge sound. Build quality feels durable and premium.', true, 44);
  END LOOP;

  -- Add reviews for power banks
  FOR product_rec IN (SELECT id FROM products WHERE keywords @> ARRAY['power', 'charger'] LIMIT 1)
  LOOP
    INSERT INTO reviews (product_id, user_id, rating, title, content, verified_purchase, helpful_count)
    VALUES
      (product_rec.id, gen_random_uuid(), 5, 'Essential travel companion', 'Charges my phone multiple times on a single charge. Compact and lightweight. Fast charging works great.', true, 39),
      (product_rec.id, gen_random_uuid(), 4, 'Reliable power bank', 'Good capacity and charges devices quickly. Build quality is solid. LED indicator is helpful.', true, 27),
      (product_rec.id, gen_random_uuid(), 5, 'Best power bank I have used', 'Never worry about battery again. Can charge laptop and phone simultaneously. Highly recommend.', true, 33);
  END LOOP;

  -- Add reviews for USB cables
  FOR product_rec IN (SELECT id FROM products WHERE keywords @> ARRAY['cable', 'usb'] LIMIT 1)
  LOOP
    INSERT INTO reviews (product_id, user_id, rating, title, content, verified_purchase, helpful_count)
    VALUES
      (product_rec.id, gen_random_uuid(), 5, 'Durable and fast', 'These cables are built to last. Data transfer is very fast. Connectors fit snugly without being too tight.', true, 28),
      (product_rec.id, gen_random_uuid(), 4, 'Great quality cables', 'Good length and flexibility. Charging speed is excellent. Worth paying extra for quality.', true, 22),
      (product_rec.id, gen_random_uuid(), 5, 'Finally a cable that lasts', 'After going through cheap cables that break quickly, these are a relief. Solid construction and work perfectly.', true, 31);
  END LOOP;

END $$;