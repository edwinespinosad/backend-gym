CREATE DATABASE IF NOT EXISTS gym;

use gym;

CREATE TABLE role_user(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255)
);

CREATE TABLE user(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    phone VARCHAR(10),
    active BOOLEAN DEFAULT true,
    fk_id_role_user INTEGER,
    FOREIGN KEY (fk_id_role_user) REFERENCES role_user(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE membership(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    duration VARCHAR(255),
    price FLOAT,
    benefits VARCHAR(255),
    active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE client(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    phone VARCHAR(10),
    active BOOLEAN DEFAULT true,
    fk_id_memberhsip INTEGER,
    FOREIGN KEY (fk_id_memberhsip) REFERENCES membership(id),
    fk_id_role_user INTEGER,
    FOREIGN KEY (fk_id_role_user) REFERENCES role_user(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE instructor(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    image VARCHAR(255),
    name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(10),
    active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE membership_purchase (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  fk_id_membership INT NOT NULL,
  fk_id_client INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (fk_id_membership) REFERENCES membership(id),
  FOREIGN KEY (fk_id_client) REFERENCES client(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
