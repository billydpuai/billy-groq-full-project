import requests
from bs4 import BeautifulSoup

url = "https://www.depaul.edu/tuition-and-aid/financial-aid-overview"

response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
soup = BeautifulSoup(response.content, "html.parser")

text = soup.get_text(separator=" ", strip=True)

print("Page title:", soup.title.string if soup.title else "No title")
print("Status code:", response.status_code)
print("First 1000 characters of content:")
print(text[:1000])
