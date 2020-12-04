-- Departments
INSERT INTO department (department) VALUES ('Management');
INSERT INTO department (department) VALUES ('Desk');
INSERT INTO department (department) VALUES ('Junior_Programs');
INSERT INTO department (department) VALUES ('Belayers');
INSERT INTO department (department) VALUES ('Setters');

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
INSERT INTO employees (first_name, last_name, role_id) VALUES ('Jordan', 'Pacheco', 1);
INSERT INTO employees (first_name, last_name, role_id) VALUES ('Daniel', 'Gruza', 2);
INSERT INTO employees (first_name, last_name, role_id) VALUES ('Jenny', 'Fryer', 2);
INSERT INTO employees (first_name, last_name, role_id) VALUES ('Xaiver', 'Torriente', 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Ashlee', 'Crewe', 4, 2);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Conor', 'McKoy', 4, 2);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Madi', 'Albu', 5, 5);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Marcial', 'Aguilar', 5, 5);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Micah', 'Excell', 5, 6);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Aubrey', 'Leary', 5, 6);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Max', 'Golden', 6, 2);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Marissa', 'Klein', 6, 2);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Mika', 'Finkman', 7, 11);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Luis', 'Gondar', 7, 11);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Molly', 'Weiss', 7, 12);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Esteban', 'Rivera', 7, 12);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Wayne', 'Moore', 8, 3);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Erica', 'Smith', 8, 3);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Christian', 'Piansay', 8, 3);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Roshan', "Soondar", 9, 3);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Areyana', 'Midler', 9, 3);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Theo', 'Morris', 9, 3);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Brandon', 'Tse', 9, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Chris', 'St. Pierre', 10, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Chris', 'Perez', 10, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Chris', 'Moyle', 10, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Zac', 'Belida', 11, 4);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Josh', 'Colberg', 11, 4);