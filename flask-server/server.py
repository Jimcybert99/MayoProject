from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import mysql.connector
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS so the frontend (React) can talk to this backend

# In-memory store of valid admin tokens
active_admin_tokens = set()

# Connect to MySQL database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="your_database"
)
cursor = db.cursor(dictionary=True)  # Use dictionary=True to return JSON-like dicts


# Helper: check if request is from the thread/comment owner or a valid admin
def is_authorised(request_username, owner_username):
    token = request.headers.get("X-Admin-Token", "")
    if token in active_admin_tokens:
        return True
    return request_username == owner_username


# Route to fetch all discussions
@app.route("/api/discussions", methods=["GET"])
def get_discussions():
    # Include the user so the client knows the owner
    cursor.execute("SELECT id, user, title, likes, created_at FROM discussions ORDER BY created_at DESC")
    discussions = cursor.fetchall()
    for d in discussions:
        cursor.execute(
            "SELECT COUNT(*) AS count FROM comments WHERE discussion_id = %s",
            (d["id"],)
        )
        d["replies"] = cursor.fetchone()["count"]
        d["activity"] = time_since(d["created_at"])
    return jsonify(discussions)


# Route to increment like count for a discussion
@app.route("/api/discussion/<int:id>/like", methods=["POST"])
def like_discussion(id):
    cursor.execute("UPDATE discussions SET likes = likes + 1 WHERE id = %s", (id,))
    db.commit()
    return jsonify({"status": "success"})


# Route to get a specific discussion and all its comments
@app.route("/api/discussion/<int:id>", methods=["GET"])
def get_discussion(id):
    cursor.execute("SELECT * FROM discussions WHERE id = %s", (id,))
    discussion = cursor.fetchone()
    cursor.execute("SELECT * FROM comments WHERE discussion_id = %s", (id,))
    comments = cursor.fetchall()
    return jsonify({"discussion": discussion, "comments": comments})


# Route to post a new discussion
@app.route("/api/discussion", methods=["POST"])
@cross_origin()
def post_discussion():
    data = request.get_json()
    print("Incoming data:", data)  # 🐞 Debug
    cursor.execute(
        "INSERT INTO discussions (user, title, content) VALUES (%s, %s, %s)",
        (data["user"], data["title"], data["content"])
    )
    db.commit()
    new_id = cursor.lastrowid
    cursor.execute("SELECT * FROM discussions WHERE id = %s", (new_id,))
    return jsonify(cursor.fetchone()), 201


# Route to post a new comment on a discussion
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


# Route to increment like count for a comment
@app.route("/api/comment/<int:id>/like", methods=["POST"])
def like_comment(id):
    cursor.execute("UPDATE comments SET likes = likes + 1 WHERE id = %s", (id,))
    db.commit()
    return jsonify({"status": "success"})


# Route to delete a discussion (only by owner or admin)
@app.route("/api/discussion/<int:id>", methods=["DELETE"])
def delete_discussion(id):
    username = request.headers.get("X-Username", "")
    cursor.execute("SELECT user FROM discussions WHERE id = %s", (id,))
    row = cursor.fetchone()
    if not row:
        return jsonify({"error": "Discussion not found"}), 404

    if not is_authorised(username, row["user"]):
        return jsonify({"error": "Unauthorized"}), 403

    cursor.execute("DELETE FROM discussions WHERE id = %s", (id,))
    db.commit()
    return jsonify({"status": "deleted"})


# Route to delete a comment (only by owner or admin)
@app.route("/api/comment/<int:id>", methods=["DELETE"])
def delete_comment(id):
    # 🐞 DEBUG: dump incoming headers
    print("🔍 DELETE /api/comment headers:", dict(request.headers))
    username = request.headers.get("X-Username", "")
    cursor.execute("SELECT user FROM comments WHERE id = %s", (id,))
    row = cursor.fetchone()
    if not row:
        return jsonify({"error": "Comment not found"}), 404

    print(f"🔍 Comment owner = {row['user']}, requester = {username}")
    if not is_authorised(username, row["user"]):
        return jsonify({"error": "Unauthorized"}), 403

    cursor.execute("DELETE FROM comments WHERE id = %s", (id,))
    db.commit()
    return jsonify({"status": "deleted"})


# Route to handle admin login
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    cursor.execute(
        "SELECT * FROM admins WHERE username = %s AND password = %s",
        (data["username"], data["password"])
    )
    user = cursor.fetchone()
    if user:
        # issue a simple token and remember it
        token = str(uuid.uuid4())
        active_admin_tokens.add(token)
        return jsonify({"status": "success", "role": "admin", "token": token})
    return jsonify({"status": "failure"}), 401


# Route to post a mood journal entry
@app.route("/api/mood", methods=["POST"])
@cross_origin()
def post_mood_entry():
    data = request.get_json()
    cursor.execute(
        "INSERT INTO mood_entries (mood, rating, reason, timestamp) VALUES (%s, %s, %s, %s)",
        (data["mood"], data["rating"], data["reason"], data["date"])
    )
    db.commit()
    return jsonify({"status": "success"}), 201


# Route to fetch mood journal entries
@app.route("/api/moods", methods=["GET"])
def get_mood_entries():
    cursor.execute(
        "SELECT mood, rating, reason, timestamp AS date FROM mood_entries ORDER BY timestamp DESC"
    )
    return jsonify(cursor.fetchall())


# Route to clear all mood journal entries
@app.route("/api/moods", methods=["DELETE"])
def clear_mood_entries():
    cursor.execute("DELETE FROM mood_entries")
    db.commit()
    return jsonify({"status": "cleared"})


# Convert a datetime to readable time difference ('2 hours ago')
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


# Run the Flask development server
if __name__ == "__main__":
    app.run(debug=True, port=5001)





