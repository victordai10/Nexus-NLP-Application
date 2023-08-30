import phonenumbers
from phonenumbers import geocoder
import folium
import opencage
import requests

session = requests.Session()
session.trust_env = False

check_number = phonenumbers.parse("+12108214105")
number_location = geocoder.description_for_number(check_number, "en")
print(number_location)

# from phonenumbers import carrier
# service_provider = phonenumbers.parse("+12108214105")
# print(carrier.name_for_number(service_provider, "en"))

# from opencage.geocoder import OpenCageGeocode

# key = '7ef91da492d847e991d71e626bea351a'

# geocoder = OpenCageGeocode(key)
# query = str(number_location)
# results = geocoder.geocode(query)
# print(results)

# lat = results[0]['geometry']['lat']
# lng = results[0]['geometry']['lng']

# print(lat, lng)

# myMap = folium.Map(location=[lat, lng], zoom_start = 9)
# folium.Marker([lat, lng], popup=number_location).add_to(myMap)

# myMap.save("mylocation.html")