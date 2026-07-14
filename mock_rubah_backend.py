from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MOCK_RESPONSES = {
    "default": {
        "success": True,
        "intent": "list",
        "answer": "Environmental Science relates to several other programs across DePaul, including Climate Change Science and Policy (Minor), Environmental Communication (Minor), Environmental Studies (BA/Minor), Sustainability Studies (Minor), and Sustainable Urban Development (MA).",
        "vector_only_answer": "Environmental Science (BS) is offered by the College of Science and Health.",
        "documents": [
            {
                "program_name": "Environmental Studies",
                "degree_type": "BA",
                "college": "College of Science and Health",
                "source": "vector"
            },
            {
                "program_name": "Climate Change Science and Policy",
                "degree_type": "Minor",
                "college": "College of Liberal Arts and Social Sciences",
                "source": "graph"
            }
        ],
        "debug": {
            "vector_context": "mock vector context",
            "graph_context": "mock graph context",
            "fused_context": "mock fused context",
            "cypher_query": "MATCH (p:Program)-[:RELATED_TO]->(other) WHERE p.name = 'Environmental Science' RETURN other.name, other.degree_type"
        }
    }
}

@app.route("/api/retrieve", methods=["POST"])
def retrieve():
    data = request.get_json(silent=True) or {}
    query = data.get("query", "").strip()

    if not query:
        return jsonify({"success": False, "error": "Missing 'query' field"}), 400

    response = dict(MOCK_RESPONSES["default"])
    response["query"] = query
    return jsonify(response)

if __name__ == "__main__":
    app.run(port=5001, debug=True)