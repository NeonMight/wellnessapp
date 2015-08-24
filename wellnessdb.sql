drop database if exists wellness;
create database wellness;
use wellness;

create table User(
username varchar(100) not null,
firstname varchar(100) not null,
lastname varchar(100) not null,
password varchar(100) not null,
email varchar(100) not null,
department varchar(100),
enabled boolean not null,
primary key(username)
);

create table Activity(
name varchar(100) not null,
description varchar(1000),
percent int not null,
enrollmentyear int not null,
eventsrequired int,
maxselection int,
isarchived boolean not null,
documentation varchar(200) not null,
primary key(name,enrollmentyear)
);

create table Event(
eventname varchar(100) not null,
activityname varchar(100) not null,
description varchar(100) not null,
startdate date not null,
enddate date not null,
isarchived boolean not null,
primary key(eventname),
foreign key(activityname) references Activity(name)
);
-- one to many relation between activity and event; activity has 0 or more events. Event must be matched with an activity
