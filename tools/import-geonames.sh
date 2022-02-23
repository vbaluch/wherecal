#!/bin/sh

curl -O https://download.geonames.org/export/dump/cities500.zip
curl -O https://download.geonames.org/export/dump/admin1CodesASCII.txt
curl -O https://download.geonames.org/export/dump/countryInfo.txt
unzip cities500.zip
ex +g/^#/d -cwq countryInfo.txt
export PGDATABASE=postgres
export PGHOST=localhost
export PGPORT=54322
export PGUSER=postgres 
psql -w -c "\copy geonames.geoname (geonameid, name, asciiname, alternatenames, latitude, longitude, feature_class, feature_code, country_code, cc2, admin1, admin2, admin3, admin4, population, elevation, dem, timezone, modification_date) from 'cities500.txt' null as '';"
psql -w -c "\copy geonames.admin1_codes (code, name, asciiname, geonameid) from 'admin1CodesASCII.txt' null as '';"
psql -w -c "\copy geonames.country_info (iso_alpha2, iso_alpha3, iso_numeric, fips_code, name, capital, area_in_sq_km, population, continent, tld, currency_code, currency_name, phone, postal_code, postal_code_regex, languages, geonameid, neighbors, equiv_fips_code) from 'countryInfo.txt' null as '';"
rm cities500.txt cities500.zip admin1CodesASCII.txt countryInfo.txt
