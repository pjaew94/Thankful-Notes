CREATE DATABASE thankfulnotes;

CREATE TABLE users (
    id uuid NOT NULL PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    is_in_group BOOLEAN NOT NULL,
    group_id INT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    age INT NOT NULL check(age >= 1 and age <= 120),
    email VARCHAR(100) NOT NULL,
    password VARCHAR(200) NOT NULL,
    date_joined DATE NOT NULL,
    UNIQUE (email)
);


INSERT INTO users (is_in_group, first_name, last_name, age, email, password, date_joined) 
values (true, 'Jae', 'Park', 27, 'pjaew94@gmail.com', 'blacksheepwall', 'Nov 04 2021');   

SELECT * FROM users;