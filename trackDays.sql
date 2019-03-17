use trackdaybas; -- Byt till eget användarnamn

SET NAMES 'cp1250';
SET CHARSET 'utf8';


drop table bookings; -- Om det finns en tidigare databas
drop table users; -- Om det finns en tidigare databas
drop table trackdays; -- Om det finns en tidigare databas
drop table circuits; -- Om det finns en tidigare databas

create table circuits (
circuitID serial,
name varchar(64),
length int,
adress varchar(255),
info varchar(255),
url text,
PRIMARY KEY (circuitID)
);

create table trackdays (
trackdayID serial,
circuitID bigint unsigned,
trackdayDate varchar(64),
noParticipants int,
pace varchar(64),
PRIMARY KEY (trackdayID),
FOREIGN KEY (circuitID) REFERENCES circuits(circuitID)
);

create table users (
userName varchar(64),
password_hash varchar(255),
salt varchar(64),
name varchar(64),
adress varchar(64),
phoneNo varchar(64),
isAdmin boolean,
PRIMARY KEY (userName)
);

create table bookings (
bookingID serial,
trackdayID bigint unsigned,
userName varchar(64),
PRIMARY KEY (bookingID),
FOREIGN KEY (trackdayID) REFERENCES trackdays(trackdayID),
FOREIGN KEY (userName) REFERENCES users(userName)
);

insert into circuits values (null,'Köpingbanan',20,'Almgrengatan 1','Många svåra kurvor');
insert into circuits values (null,'Gelleråsen',43,'Motorbanan 12 Karlskoga','Jävligt rolig bana - Sveriges äldsta!');
insert into trackdays values (null,1,'2019-04-04', 20, 'Långsam');
insert into trackdays values (null,1,'2019-04-04', 20, 'Medel');
insert into trackdays values (null,1,'2019-04-04', 20, 'Snabb');
insert into trackdays values (null,1,'2019-06-12', 20, 'Långsam');
insert into trackdays values (null,1,'2019-06-12', 20, 'Medel');
insert into trackdays values (null,1,'2019-06-12', 20, 'Snabb');
insert into trackdays values (null,2,'2019-05-05', 20, 'Långsam');
insert into trackdays values (null,2,'2019-05-05', 20, 'Medel');
insert into trackdays values (null,2,'2019-05-05', 20, 'Snabb');
insert into users values ('aelm','fndfnjf','fdwfeefe','Emil Almgren','Köping',NULL,0);
insert into users values ('fale','c1561cca7a12616d01fd38afd8ecd80720857878fa9d1ffbc4a3317e3445151de80076bbb10114e53702d5fadbdba5687ea1d4f5436a4efe8446d845220d2b41','56b76b25',NULL,NULL,NULL,1);
insert into bookings values (null,1,'aelm');
insert into bookings values (null,1,'aelm');
insert into bookings values (null,1,'aelm');
insert into bookings values (null,6,'aelm');
insert into bookings values (null,1,'fale');
insert into bookings values (null,1,'fale');
insert into bookings values (null,1,'fale');
insert into bookings values (null,6,'fale');
SELECT * FROM circuits;
SELECT * FROM trackdays;
SELECT * FROM users;
SELECT * FROM bookings;
