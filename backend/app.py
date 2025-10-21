from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
import json

app = Flask(__name__)
CORS(app, origins="http://localhost:3000")


DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "your_db")
DB_USER = os.getenv("DB_USER", "your_user")
DB_PASS = os.getenv("DB_PASS", "your_password")
DB_PORT = os.getenv("DB_PORT", "5432")

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        port=DB_PORT,
    )

def fetch_json_column(subject_id, column_name):
    """Fetch JSON data from a specific column for a subject_id."""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        query = f"SELECT {column_name} FROM subjects WHERE id = %s LIMIT 1;"
        cur.execute(query, (subject_id,))
        row = cur.fetchone()
        if not row or not row[0]:
            return None, f"{column_name} not found"
        # Parse JSON
        data = json.loads(row[0])
        # Normalize to list
        if not isinstance(data, list):
            data = [data]
        return data, None
    except json.JSONDecodeError:
        return None, f"Invalid JSON format in {column_name} column"
    except Exception as e:
        return None, str(e)
    finally:
        cur.close()
        conn.close()

@app.route("/subjects")
def subjects():
    branch_name = request.args.get("branch")
    semester_name = request.args.get("semester")

    if not branch_name or not semester_name:
        return jsonify({"error": "branch and semester query parameters are required"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Get branch ID
        cur.execute("SELECT id FROM branches WHERE LOWER(name) = LOWER(%s) LIMIT 1", (branch_name,))
        branch_row = cur.fetchone()
        if not branch_row:
            return jsonify({"error": "Branch not found"}), 404
        branch_id = branch_row[0]

        # Get semester ID
        cur.execute("SELECT id FROM semesters WHERE LOWER(name) = LOWER(%s) LIMIT 1", (semester_name,))
        semester_row = cur.fetchone()
        if not semester_row:
            return jsonify({"error": "Semester not found"}), 404
        semester_id = semester_row[0]

        # Query subjects matching branch and semester
        query = """
            SELECT id, name
            FROM subjects
            WHERE %s = ANY (string_to_array(REPLACE(REPLACE(branch_id::text, '{', ''), '}', ''), ',')::int[])
              AND semester_id = %s
            ORDER BY name;
        """
        cur.execute(query, (branch_id, semester_id))
        rows = cur.fetchall()

        subjects_list = [{"id": r[0], "name": r[1]} for r in rows]

        cur.close()
        conn.close()

        return jsonify(subjects_list)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/syllabus")
def syllabus():
    subject_id = request.args.get("subject_id")
    if not subject_id:
        return jsonify({"error": "subject_id parameter is required"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        query = "SELECT syllabus_details FROM subjects WHERE id = %s LIMIT 1;"
        cur.execute(query, (subject_id,))
        row = cur.fetchone()

        cur.close()
        conn.close()

        if not row:
            return jsonify({"error": "Subject not found"}), 404

        syllabus_details = row[0]
        return jsonify({"syllabus_details": syllabus_details})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/notes")
def notes():
    subject_id = request.args.get("subject_id")
    if not subject_id:
        return jsonify({"error": "subject_id parameter is required"}), 400

    notes_data, error = fetch_json_column(subject_id, "notes")
    if error:
        return jsonify({"error": error}), 404 if "not found" in error else 500

    filtered_notes = []
    for note in notes_data:
        filtered_notes.append({
            "name": note.get("name"),
            "url_view": note.get("url_preview"),
            "url_download": note.get("url_download"),
        })

    return jsonify(filtered_notes)

def generic_resource_endpoint(column_name, filter_func=None):
    subject_id = request.args.get("subject_id")
    if not subject_id:
        return jsonify({"error": "subject_id parameter is required"}), 400

    data, error = fetch_json_column(subject_id, column_name)
    if error:
        return jsonify({"error": error}), 404 if "not found" in error else 500

    # Use provided filter function or default filtering
    if filter_func:
        filtered_data = [filter_func(item) for item in data]
    else:
        filtered_data = []
        for item in data:
            filtered_data.append({
                "name": item.get("name"),
                "url_view": item.get("url_preview"),
                "url_download": item.get("url_download"),
            })

    return jsonify(filtered_data)

@app.route("/pyqs")
def pyqs():
    return generic_resource_endpoint("pyqs")

@app.route("/lab")
def lab():
    return generic_resource_endpoint("lab")

@app.route("/books")
def books():
    return generic_resource_endpoint("books")

@app.route("/akash")
def akash():
    return generic_resource_endpoint("akash")

@app.route("/videos")
def videos():
    # videos have a different structure
    def video_filter(video):
        return {
            "title": video.get("title"),
            "author": video.get("author"),
            "embedUrl": video.get("embedUrl"),
            "playlistUrl": video.get("playlistUrl"),
            "thumbnailUrl": video.get("thumbnailUrl"),
        }
    return generic_resource_endpoint("videos", filter_func=video_filter)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
