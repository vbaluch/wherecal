CREATE SCHEMA geonames;

CREATE TABLE geonames.geoname (
	geonameid integer PRIMARY KEY,
	name character varying(200),
	asciiname character varying(200),
	alternatenames text,
	latitude double precision,
	longitude double precision,
	feature_class character (1),
	feature_code character varying(10),
	country_code character (2),
	cc2 text,
	admin1 character varying(20),
	admin2 character varying(80),
	admin3 character varying(20),
	admin4 character varying(20),
	population bigint,
	elevation integer,
	dem integer,
	timezone character varying(40),
	modification_date date
);

CREATE TABLE geonames.admin1_codes (
	code varchar(20) PRIMARY KEY,
	name character varying(200),
	asciiname character varying(200),
	geonameid integer
);

CREATE TABLE geonames.country_info (
	iso_alpha2 character (2),
	iso_alpha3 character (3),
	iso_numeric integer,
	fips_code character varying(3),
	name character varying(200),
	capital character varying(200),
	area_in_sq_km double precision,
	population integer,
	continent character varying(2),
	tld character varying(10),
	currency_code character varying(3),
	currency_name character varying(20),
	phone character varying(20),
	postal_code character varying(100),
	postal_code_regex character varying(200),
	languages character varying(200),
	geonameid integer,
	neighbors character varying(50),
	equiv_fips_code character varying(3)
);

CREATE INDEX admin1_codes_code_country ON geonames.admin1_codes ((substring(code FROM 1 FOR 2)) text_ops);

CREATE INDEX admin1_codes_code_code ON geonames.admin1_codes ((substring(code FROM 4)) text_ops);
