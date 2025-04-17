CREATE DATABASE simpletodoapp;
USE simpletodoapp;

CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks(
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    task VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE label(
	id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    color VARCHAR(10) NOT NULL DEFAULT '#000000'
);