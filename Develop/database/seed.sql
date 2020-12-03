-- Departments
INSERT INTO department (name) VALUES ('Management');
INSERT INTO department (name) VALUES ('Desk');
INSERT INTO department (name) VALUES ('Junior_Programs');
INSERT INTO department (name) VALUES ('Belayers');
INSERT INTO department (name) VALUES ('Setters');

-- Roles
INSERT INTO role (title, salary, department_id) VALUES ('Gym Director', 50000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Assistant Gym Director', 45000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Director of Maintenance', 40000, 1);

INSERT INTO role (title, salary, department_id) VALUES ('Shift Supervisor', 25000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Front Desk', 20000, 2);

INSERT INTO role (title, salary, department_id) VALUES ('Head Instructor', 15000, 3);
INSERT INTO role (title, salary, department_id) VALUES ('Instructor', 10000, 3);

INSERT INTO role (title, salary, department_id) VALUES ('Facilitator', 15000, 4);
INSERT INTO role (title, salary, department_id) VALUES ('Belayer', 8000, 4);

INSERT INTO role (title, salary, department_id) VALUES ('Setter', 13000, 5);
INSERT INTO role (title, salary, department_id) VALUES ('Maintanence', 12000, 5);


-- Employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Jordan', 'Pacheco', 1, 0);

