from supabase import create_client
from sentence_transformers import SentenceTransformer
import time

SUPABASE_URL = "https://jmatvwlkpblueegafkqg.supabase.co"
SUPABASE_KEY = "sb_secret__GcewNP-jLzvJWGcRL3JLQ_nHPsfheS"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
embed_model = SentenceTransformer('all-MiniLM-L6-v2')

question = "What is FAFSA and why do I need it?"

t1 = time.time()
query_embedding = embed_model.encode(question).tolist()
t2 = time.time()

result = supabase.rpc("match_documents", {
    "query_embedding": query_embedding,
    "match_count": 3
}).execute()
t3 = time.time()

print("Embedding generation: " + str(round(t2-t1, 3)) + " seconds")
print("Supabase vector search: " + str(round(t3-t2, 3)) + " seconds")
print("Total retrieval time: " + str(round(t3-t1, 3)) + " seconds")
print("Results found: " + str(len(result.data)))
for doc in result.data:
    print("  - " + doc["url"])
