# GGSIPU Notes Backend

This is the Flask backend API for the GGSIPU Notes project.

## Environment Variables

Create a `.env` file in the backend folder with the following variables:

DB_HOST=your-db-host.supabase.co
DB_NAME=postgres
DB_USER=postgres
DB_PASS=your-db-password
DB_PORT=5432

perl
Copy
Edit

Replace the values with your actual Supabase database credentials.

## Running the Backend

1. Install dependencies:

```bash
pip install -r requirements.txt
Run the Flask app:

bash
Copy
Edit
python app.py
Test the server health:

Visit http://localhost:5000/server
You should see:

json
Copy
Edit
{"message": "welcome to the backend!"}
API Endpoints (Phase 1.2)
/semesters — GET list of semesters

/subjects?semester=<id> — GET subjects for a semester

/syllabus?subject_id=<id> — GET syllabus link for subject

yaml
Copy
Edit

---

Want me to prepare the full README.md file for you and/or the requirements.txt?