import sqlite3, os, json
from datetime import datetime, timezone

DB_PATH = os.path.join(os.path.dirname(__file__), "logs", "billy_analytics.db")
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            source TEXT NOT NULL,
            question TEXT NOT NULL,
            answer TEXT,
            no_answer INTEGER NOT NULL DEFAULT 0,
            escalated_department TEXT,
            response_time_ms INTEGER,
            num_documents INTEGER,
            off_topic INTEGER NOT NULL DEFAULT 0,
            drafted_email TEXT
        )
    """)
    # Migration path for databases created before off_topic/drafted_email existed.
    # SQLite has no "ADD COLUMN IF NOT EXISTS", so we just try and ignore the
    # error if the column is already there.
    for ddl in (
        "ALTER TABLE interactions ADD COLUMN off_topic INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE interactions ADD COLUMN drafted_email TEXT",
    ):
        try:
            conn.execute(ddl)
        except sqlite3.OperationalError:
            pass  # column already exists
    return conn

def log_interaction(
    source, question, answer, no_answer, escalated_department, response_time_ms,
    num_documents=None, off_topic=False, drafted_email=None,
):
    conn = get_conn()
    conn.execute(
        "INSERT INTO interactions "
        "(timestamp, source, question, answer, no_answer, escalated_department, response_time_ms, num_documents, off_topic, drafted_email) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            datetime.now(timezone.utc).isoformat(), source, question, answer, int(no_answer),
            escalated_department, response_time_ms, num_documents, int(off_topic), drafted_email,
        )
    )
    conn.commit()
    conn.close()

def get_stats():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM interactions")
    total = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM interactions WHERE no_answer = 0")
    resolved = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM interactions WHERE no_answer = 1")
    escalated = cur.fetchone()[0]
    cur.execute("SELECT AVG(response_time_ms) FROM interactions WHERE response_time_ms IS NOT NULL")
    avg_ms = cur.fetchone()[0] or 0
    cur.execute("SELECT source, COUNT(*) FROM interactions GROUP BY source")
    by_source = dict(cur.fetchall())

    # content gaps: unanswered questions, now with answer + drafted_email included
    cur.execute(
        "SELECT question, answer, drafted_email, timestamp FROM interactions "
        "WHERE no_answer = 1 ORDER BY timestamp DESC LIMIT 10"
    )
    content_gaps = [
        {"question": q, "answer": a, "drafted_email": de, "timestamp": t}
        for q, a, de, t in cur.fetchall()
    ]

    # recent: includes answer text and source
    cur.execute(
        "SELECT question, answer, source, no_answer, timestamp FROM interactions ORDER BY timestamp DESC LIMIT 50"
    )
    recent = [
        {"question": q, "answer": a, "source": s, "no_answer": bool(na), "timestamp": t}
        for q, a, s, na, t in cur.fetchall()
    ]

    # off_topic: questions Billy declined as unrelated to DePaul
    cur.execute("SELECT COUNT(*) FROM interactions WHERE off_topic = 1")
    off_topic_count = cur.fetchone()[0]
    cur.execute(
        "SELECT question, timestamp FROM interactions WHERE off_topic = 1 ORDER BY timestamp DESC LIMIT 20"
    )
    off_topic_questions = [{"question": q, "timestamp": t} for q, t in cur.fetchall()]
    off_topic = {
        "count": off_topic_count,
        "percentage": round((off_topic_count / total * 100), 1) if total else 0,
        "questions": off_topic_questions,
    }

    conn.close()
    return {
        "total_questions": total, "resolved": resolved, "escalated": escalated,
        "resolution_rate": round((resolved / total * 100), 1) if total else 0,
        "avg_response_time_ms": round(avg_ms), "by_source": by_source,
        "content_gaps": content_gaps, "recent": recent,
        "off_topic": off_topic,
    }