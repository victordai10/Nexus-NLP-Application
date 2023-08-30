import regex as re

age_key = '\d*\ years old'
name_key = 'name is *\\w*'
location_key = 'at (\d*\\w+\s?)+'
location_key = 'at (\d*\s*\w*\s\w*\s\w*)'

name_and_age = input("What is your name and age? ")
age = re.findall(age_key, name_and_age)[0].split()
age = age[0]

name = re.findall(name_key, name_and_age)[0].split()
name = name[2]

location = re.findall(location_key, 'I\'m at 200 South Laurel Ave.')[0]

print('Name: ' + name + '\nAge: ' + age + '\nLocation: ' + location)