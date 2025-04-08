from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import mysql.connector

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="Password123",
    database="your_database"
)
cursor = db.cursor(dictionary=True)

@app.route("/api/discussions", methods=["GET"])
def get_discussions():
    cursor.execute("SELECT id, topic, title, likes, created_at FROM discussions ORDER BY created_at DESC")
    discussions = cursor.fetchall()
    for d in discussions:
        cursor.execute("SELECT COUNT(*) AS count FROM comments WHERE discussion_id = %s", (d["id"],))
        d["replies"] = cursor.fetchone()["count"]
        d["activity"] = time_since(d["created_at"])
    return jsonify(discussions)

@app.route("/api/discussion/<int:id>", methods=["GET"])
def get_discussion(id):
    cursor.execute("SELECT * FROM discussions WHERE id = %s", (id,))
    discussion = cursor.fetchone()
    cursor.execute("SELECT * FROM comments WHERE discussion_id = %s", (id,))
    comments = cursor.fetchall()
    return jsonify({"discussion": discussion, "comments": comments})

@app.route("/api/discussion", methods=["POST"])
@cross_origin()
def post_discussion():
    data = request.get_json()
    print("Incoming data:", data)  # 🐞 Add this
    cursor.execute(
        "INSERT INTO discussions (user, topic, title, content) VALUES (%s, %s, %s, %s)",
        (data["user"], data["topic"], data["title"], data["content"])
    )
    db.commit()
    id = cursor.lastrowid
    cursor.execute("SELECT * FROM discussions WHERE id = %s", (id,))
    return jsonify(cursor.fetchone()), 201

@app.route("/api/comment", methods=["POST"])
@cross_origin()
def post_comment():
    data = request.json
    cursor.execute(
        "INSERT INTO comments (discussion_id, user, message) VALUES (%s, %s, %s)",
        (data["discussion_id"], data["user"], data["message"])
    )
    db.commit()
    return jsonify({"status": "success"}), 201

def time_since(timestamp):
    from datetime import datetime
    delta = datetime.now() - timestamp
    minutes = int(delta.total_seconds() / 60)
    if minutes < 1:
        return "Just now"
    elif minutes < 60:
        return f"{minutes} minutes ago"
    hours = int(minutes / 60)
    if hours < 24:
        return f"{hours} hours ago"
    days = int(hours / 24)
    return f"{days} days ago"

if __name__ == "__main__":
    app.run(debug=True)