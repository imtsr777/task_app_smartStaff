CREATE DATABASE chatsocket;
CREATE EXTENSION pgcrypto;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS messages CASCADE;

CREATE TABLE users (
	user_id serial not null primary key,
	username varchar(64) not null,
	email varchar(128) not null,
	password varchar(256) not null,
	profile_img varchar(256) not null,
	create_at_user timestamp default current_timestamp
);

CREATE TABLE messages (
	message_id serial not null primary key,
	text_message varchar(2500) not null,
	type varchar(32) check(type in ('text', 'audio','video', 'application','image')),
	new_message boolean default false,
	from_user_id int not null references users(user_id),
	to_user_id int not null references users(user_id),
	create_at_mes timestamp default current_timestamp
);


COMMENT ON TABLE users IS 'Chat users';
COMMENT ON TABLE messages IS 'Chat messages';