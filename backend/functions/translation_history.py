from flask import jsonify, request

def get_translation_history(mysql):
    session_token = request.args.get('sessionToken')
    if not session_token:
        return jsonify({"error": "Session token is required"}), 400

    cur = mysql.connection.cursor()
    # Find user_id from session token
    cur.execute("SELECT user_id FROM logged_in WHERE session_token=%s", (session_token,))
    result = cur.fetchone()
    if result:
        user_id = result['user_id']
        # Now fetch translation history with the user_id
        cur.execute("SELECT * FROM translation_history WHERE user_id=%s ORDER BY submission_date DESC", (user_id,))
        rows = cur.fetchall()
        return jsonify(rows)
    else:
        return jsonify({"error": "Invalid session token"}), 404
