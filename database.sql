CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE freementors;

CREATE TABLE users (
    userid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_img TEXT NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    address TEXT NOT NULL,
    bio TEXT NOT NULL,
    occupation TEXT NOT NULL,
    expertise TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
);

CREATE TABLE mentors (
    mentorId uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_img TEXT NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    address TEXT NOT NULL,
    bio TEXT NOT NULL,
    occupation TEXT NOT NULL,
    expertise TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'mentor'
);

CREATE TABLE sessions (
    sessionId uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    questions TEXT NOT NULL,
    menteeEmail TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending...',
    score INTEGER NOT NULL DEFAULT 0,
    remarks TEXT NOT NULL DEFAULT ' ',
    mentorId uuid NOT NULL,
    menteeId uuid NOT NULL,
    menteeFullName TEXT NOT NULL 
);

SELECT
    *
FROM
    users;

INSERT INTO
    users (
        profile_img,
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
    'http://res.cloudinary.com/dtn9c7vkv/image/upload/v1650999225/bismid.PNG.png',
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
    mentors (
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

INSERT INTO
    mentors (
        profile_img,
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
    'http://res.cloudinary.com/dtn9c7vkv/image/upload/v1650999225/bismid.PNG.png',
        'Seraf',
        'Grestin',
        'seraf@yahoo.com',
        'Seraf919',
        '54 clemmy street',
        'Web developer extraordinary, get in touch today',
        'Software Engineer',
        'Expert'
    );

INSERT INTO sessions (
    questions,
    menteeEmail
) VALUES (
    'How to become a crypto expert',
    'bgold@gmail.com'
);

INSERT INTO sessions (
    questions,
    menteeEmail,
    status
) VALUES (
    'How to be a very good web developer?',
    'bgold@gmail.com',
    'accepted'
);