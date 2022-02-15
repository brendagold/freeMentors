CREATE EXTENSION IF NOT EXISTS 'uuid-ossp';

CREATE DATABASE freementors;

CREATE TABLE users (
    userId uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    address TEXT NOT NULL,
    bio TEXT NOT NULL,
    occupation TEXT NOT NULL,
    expertise TEXT NOT NULL
);

SELECT
    *
FROM
    users;

INSERT INTO
    users (
        firstName,
        lastName,
        email,
        password,
        address,
        bio,
        occupation,
        expertise
    )
VALUES
(
        'Brenda',
        'Peters',
        'brenda@yahoo.com',
        'Brenda919',
        '54 clemmy street',
        'Web developer extraordinary, get in touch today',
        'Software Engineer',
        'Expert'
    );

INSERT INTO
    users (
        firstName,
        lastName,
        email,
        password,
        address,
        bio,
        occupation,
        expertise
    )
VALUES
(
        'Clem',
        'Leibniz',
        'clemL@yahoo.com',
        'clem9',
        '54 clement street',
        'crypto expert, get in touch today',
        'crypto Expert',
        'Expert'
    );

INSERT INTO
    users (
        firstName,
        lastName,
        email,
        password,
        address,
        bio,
        occupation,
        expertise
    )
VALUES
(
        'Dondada',
        'Stepzin',
        'dondadaS@yahoo.com',
        'donbullezin9',
        '54 dondada street',
        'crypto expert, get in touch today',
        'crypto Expert',
        'Intermediate'
    );