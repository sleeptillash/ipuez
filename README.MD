# GGSIPU Notes Backend

This is the Flask backend API for the GGSIPU Notes project.

---

## 🔐 Environment Variables

Create a `.env` file in the `backend` folder with the following variables:

DB_HOST=your-db-host.supabase.co
DB_NAME=postgres
DB_USER=postgres
DB_PASS=your-db-password
DB_PORT=5432

yaml
Copy code

Replace the values with your actual Supabase database credentials.

---

## 🚀 Running the Backend

### 1. Install dependencies

```bash
pip install -r requirements.txt
2. Run the Flask app
bash
Copy code
python app.py
