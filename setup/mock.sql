INSERT INTO users (username,email, password, profile_img) VALUES
('Aziz','superman@gmail.com', crypt('7777', gen_salt('bf')), '/profileImg/metting.jpg'),
('Dilshod', 'email@gmail.com',crypt('1111', gen_salt('bf')), '/profileImg/iam.jpg');


INSERT INTO messages (text_message, type, from_user_id, to_user_id) VALUES
('Assalomu alaykum!', 'text',1, 2),
('Valeykum assalom!', 'text',2, 1),
('Hayerli kun', 'text',1, 2);


