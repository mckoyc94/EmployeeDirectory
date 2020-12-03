CREATE DATABASE theRockClub;
USE theRockClub;

CREATE TABLE employees (
    id int NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30)  NOT NULL,
    role_id int NOT NULL,
    manager_id int,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id int,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL,
    department_id int NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE department (
    id int,
    name VARCHAR(30),
    PRIMARY KEY (id)
);