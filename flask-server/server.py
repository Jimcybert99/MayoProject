from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import mysql.connector

app = Flask(__name__)
CORS(app) # Enable CORS so the frontend (React) can talk to this backend

# Connect to MySQL database
db = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="Password123",
    database="your_database"
)
cursor = db.cursor(dictionary=True)# Use dictionary=True to return results as JSON-like dicts

# Route to fetch all discussions
@app.route("/api/discussions", methods=["GET"])
def get_discussions():
    # Get all discussions sorted by latest
    cursor.execute("SELECT id, title, likes, created_at FROM discussions ORDER BY created_at DESC")
    discussions = cursor.fetchall()
    # For each discussion, add the reply count and time since last activity
    for d in discussions:
        cursor.execute("SELECT COUNT(*) AS count FROM comments WHERE discussion_id = %s", (d["id"],))
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
    print("Incoming data:", data)  # 🐞 Add this
    # Insert the new discussion into the database
    cursor.execute(
        "INSERT INTO discussions (user, title, content) VALUES (%s, %s, %s)",
        (data["user"], data["title"], data["content"])
    )
    db.commit()
    # Fetch and return the newly inserted discussion
    id = cursor.lastrowid
    cursor.execute("SELECT * FROM discussions WHERE id = %s", (id,))
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

@app.route("/api/discussion/<int:id>", methods=["DELETE"])
def delete_discussion(id):
    cursor.execute("DELETE FROM discussions WHERE id = %s", (id,))
    db.commit()
    return jsonify({"status": "deleted"})


@app.route("/api/comment/<int:id>", methods=["DELETE"])
def delete_comment(id):
    cursor.execute("DELETE FROM comments WHERE id = %s", (id,))
    db.commit()
    return jsonify({"status": "deleted"})

# Run the Flask development server
if __name__ == "__main__":
    app.run(debug=True, port=5001)




