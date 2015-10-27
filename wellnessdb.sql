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
id int not null auto_increment,
name varchar(100) not null,
activityid int not null,
startdate date not null,
enddate date not null,
primary key(id),
foreign key(activityid) references Activity(id)
);
-- one to many relation between activity and event; activity has 0 or more events. Event must be matched with an activity

create table Enrollment(
user varchar(100) not null,
activityid int not null,
enrollmentdate date not null,
-- complete boolean not null,
primary key(user, activityid),
foreign key(user) references User(username),
foreign key(activityid) references Activity(id)
);

create table EventCredit(
user varchar(100) not null,
eventid int not null,
complete boolean not null,
primary key(user, eventid),
foreign key(user) references User(username),
foreign key(eventid) references Event(id)
);

create table Waiver(
user varchar(100) not null,
waivedate date not null,
primary key(user),
foreign key(user) references User(username)
);


-- TO DO QUERIES
-- select all activities from enrollment table and # of complete events from event credit table where username='test'
-- select all events and associated activity name for event from event credit table where username='test'

-- select a.name, en.user, count(ec.complete) as num from Activity a, Enrollment en, Event ev, EventCredit ec where a.id=en.activityid and a.id=ev.activityid and ec.eventid=ev.id and en.user="test" and ec.complete=1 group by a.name;

-- TEST DATA

insert into User(department, email, enabled, firstname, lastname, password, username)
values('IT','pritchard@jamz.net',1,'Alberto','Balsalm','a94a8fe5ccb19ba61c4c0873d391e987982fbbd3','test');
