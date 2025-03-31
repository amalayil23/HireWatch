
# A very simple Flask Hello World app for you to get started with...

from flask import Flask, render_template, request, jsonify
import pymysql
import credentials
from flask_cors import CORS

class Database:
    def __init__(self):
        host = credentials.DB_HOST
        user = credentials.DB_USER
        pwd = credentials.DB_PWD
        db = credentials.DB_NAME

        self.con = pymysql.connect(host=host, user=user, password=pwd, db=db, cursorclass=pymysql.cursors.DictCursor)
        self.cur = self.con.cursor()

    def addUser(self, name, email, major, year):
        try:
            sqlQuery = "INSERT INTO Users (name, email, major, year) VALUES (%s, %s, %s, %s)"
            self.cur.execute(sqlQuery, (name, email, major, year))
            self.con.commit()
            return {"message": "User has been successfully added!"}
        except pymysql.MYSQLError as err:
            print(f"Database error: {err}")
            return {"error": f'Database error {err}'}
        finally:
            self.con.close()

    def allJob(self):
        try:
            sqlQuery = """
            SELECT j.title, c.companyName, j.jobType, c.industry, c.companyLocation, j.jobUrl
            FROM Jobs j
            NATURAL JOIN Companies c
            """
            self.cur.execute(sqlQuery, )
            result = self.cur.fetchall()
        except:
            return "Error executing SQL"
        finally:
            self.con.close()
        return result

    def searchJob(self, title, location):
        print(title)
        print(location)
        try:
            sqlQuery = """
            SELECT j.title, c.companyName, j.jobType, c.industry, c.companyLocation, j.jobUrl
            FROM Jobs j
            JOIN Companies c ON j.companyid = c.companyid
            WHERE j.title LIKE %s
            AND (%s = '' OR c.companyLocation = %s)
            """
            final_query = sqlQuery % (f"'{title}'", f"'{location}'", f"'{location}'")
            print("Final Query with Parameters:", final_query)
            self.cur.execute(sqlQuery, (f"%{title}%",location, f"{location}", ))
            result = self.cur.fetchall()
        except pymysql as err:
            print(f"Database error: {err}")
            return {"error": f"Database error {err}"}
        finally:
            self.con.close()
        #print(result)
        return result

app = Flask(__name__)
CORS(app)
@app.route('/') #Defines the root of the directory
def homePage():
    return "Welcome to HireWatch"

@app.route('/addusers', methods=['GET', 'POST'])
def addUser():
    data = request.json
    print("Received Data:", data)

    name = data.get('name')
    email = data.get('email')
    major = data.get('major')
    year = data.get('year')

    if not name or not email or not major or not year:
        return jsonify({'message': 'First name, last name, email, major and year are required'}), 400

    try:
        year = int(year)
        if year < 1 or year > 4:
            return jsonify({'message': 'Year must be between 1-4.'}), 400
    except ValueError:
        return jsonify({'message': 'Valid year must be entered.'}), 400

    db = Database()
    result = db.addUser(name, email, major, year)

    if "error" in result:
        print("Database Error:", result["error"])
        return jsonify(result), 500

    return jsonify(result), 201


#all Jobs




# Search Jobs

@app.route('/searchjobs', methods=['GET'])
def viewJobs():
    title = request.args.get('title', '')
    companyname = request.args.get('companyname', '')
    location = request.args.get('location','')

    if not title:
        return jsonify({"error": "title parameter is required"}), 400

    db = Database()
    result = db.searchJob(title,  location)
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)

