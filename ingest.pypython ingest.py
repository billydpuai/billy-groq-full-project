import requests
from bs4 import BeautifulSoup
import re
from supabase import create_client
from sentence_transformers import SentenceTransformer

SUPABASE_URL = "https://jmatvwlkpblueegafkqg.supabase.co"
SUPABASE_KEY = "sb_secret_tG-lS6QvzDKONg6FN2uahg_1BHqqKZk"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
embed_model = SentenceTransformer('all-MiniLM-L6-v2')

urls = [
    "https://www.depaul.edu/tuition-and-aid/financial-aid-overview",
    "https://www.depaul.edu/tuition-and-aid/apply-for-aid",
    "https://www.depaul.edu/tuition-and-aid/scholarships",
    "https://www.depaul.edu/tuition-and-aid/types-of-aid",
    "https://www.depaul.edu/tuition-and-aid/types-of-aid/federal-loans",
    "https://www.depaul.edu/tuition-and-aid/types-of-aid/grants",
    "https://www.depaul.edu/tuition-and-aid/financial-aid-and-eligibility/sap",
    "https://www.depaul.edu/tuition-and-aid/financial-aid-forms-and-resources/contact-us",
]

def scrape_page(url):
    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
    soup = BeautifulSoup(response.content, "html.parser")
    title = soup.title.string if soup.title else url
    text = soup.get_text(separator=" ", strip=True)
    text = re.sub(r'\s+', ' ', text)
    return title, text

def chunk_text(text, chunk_size=500, overlap=50):
    chunks = []
    start = 0
    while start < len(text):
        chunks.append(text[start:start+chunk_size])
        start += chunk_size - overlap
    return chunks

for url in urls:
    title, text = scrape_page(url)
    chunks = chunk_text(text)
    print(url + " -> " + str(len(chunks)) + " chunks")
    for chunk in chunks:
        embedding = embed_model.encode(chunk).tolist()
        supabase.table("documents").insert({
            "url": url, "title": title, "content": chunk, "embedding": embedding
        }).execute()

print("Done.")


