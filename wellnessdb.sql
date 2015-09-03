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
isadmin boolean not null,
primary key(username)
);

create table Activity(
id int not null auto_increment,
name varchar(100) not null,
description varchar(1000),
percent int not null,
enrollmentyear int not null,
eventsrequired int,
maxselection int,
isarchived boolean not null,
documentation varchar(200) not null,
primary key(id)
);

create table Event(
eventname varchar(100) not null,
activityid int not null,
description varchar(100) not null,
startdate date not null,
enddate date not null,
isarchived boolean not null,
primary key(eventname),
foreign key(activityid) references Activity(id)
);
-- one to many relation between activity and event; activity has 0 or more events. Event must be matched with an activity

create table Enrollment(
user varchar(100) not null,
activityid int not null,
enrollmentdate date not null,
primary key(user, activityid),
foreign key(user) references User(username),
foreign key(activityid) references Activity(id)
);

-- TEST DATA

insert into User(department, email, enabled, firstname, lastname, password, username)
values('IT','pritchard@jamz.net',1,'Alberto','Balsalm','a94a8fe5ccb19ba61c4c0873d391e987982fbbd3','test');

insert into Activity(description, documentation, enrollmentyear, eventsrequired, isarchived, maxselection, name, percent)
values('A year long zumba party!', 'none', 2015, 365, 0, 365, 'ZumbaMania', 10);
insert into Activity(description, documentation, enrollmentyear, eventsrequired, isarchived, maxselection, name, percent)
values('Competetive CoEd softball tournament (no noobs allowed)', 'none', 2015, 26, 0, 30, 'Srs Bizness Softball', 10);
insert into Activity(description, documentation, enrollmentyear, eventsrequired, isarchived, maxselection, name, percent)
values('Crossfit meetup for people to talk about crossfit', 'none', 2015, 7, 0, 12, 'CROSSFIT', 10);
