##
#HIREWATCH BACKEND APP########################################

from flask import Flask, request, jsonify
import pymysql
import credentials
from flask_cors import CORS
import hashlib as h

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

#********************CLASS DEF*********************************###***********************************************************************************************************


class Database:
    def __init__(self):
        host = credentials.DB_HOST
        user = credentials.DB_USER
        pwd = credentials.DB_PWD
        db = credentials.DB_NAME

        self.con = pymysql.connect(host=host, user=user, password=pwd, db=db, cursorclass=pymysql.cursors.DictCursor)
        self.cur = self.con.cursor()

##LOGIN################################LOGIN###############################################################################################################
    def login(self,username,password):
        try:
            sqlQuery = """
                        select u.userid, u.name, u.email from Users u
                        Natural Join Passwords p
                        WHERE u.email = %s
                        AND
                        p.pass = %s
                        """
            params = [username, password]
            self.cur.execute(sqlQuery, params)
            result = self.cur.fetchall()
            #userid = result[0][0]
        except Exception as err:
            result = "500 Server Error"
        finally:
            self.con.close()
        return result

#ADD-USER#######################################################ADD USER############################################################
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

#SEARCH-JOB#########################################################################################################################


    def searchJob(self, title, companyName, location):
        try:
            sqlQuery = """
            SELECT j.title, c.companyName, j.jobType, c.industry, c.companyLocation, j.jobUrl
            FROM Jobs j
            JOIN Companies c ON j.companyid = c.companyid
            WHERE j.title LIKE %s
            """
            params = [f"%{title}%"]

            if companyName:
                sqlQuery += " AND c.companyName LIKE %s"
                params.append(f"%{companyName}%")

            if location:
                sqlQuery += " AND c.companyLocation LIKE %s"
                params.append(f"%{location}%")

            self.cur.execute(sqlQuery, params)
            result = self.cur.fetchall()
        except pymysql.MySQLError as err:
            print(f"Database error: {err}")
            return {"error": f"Database error {err}"}
        finally:
            self.con.close()
        return result

#GET-REVIEWS#########################################################################################################################
    def getReviews(self, companyName=None):
        try:
            sqlQuery = """
            SELECT c.companyName, r.rating, r.feedback, r.datePosted
            FROM Reviews r
            JOIN Companies c ON r.companyid = c.companyid
            """

            params = []

            if companyName:
                sqlQuery += " WHERE c.companyName LIKE %s"
                params.append(f"%{companyName}%")

            self.cur.execute(sqlQuery, params)
            result = self.cur.fetchall()

            return result

        except pymysql.MYSQLError as err:
            print(f"Database error: {err}")
            return {"error": f"Database error {err}"}
        finally:
            self.con.close()

#ADD-INTERVIEWS#########################################################################################################################

    def scheduleInterview(self, firstName, lastName, jobTitle, intDate, intTime, intLocation):
        try:
            fullName = f"{firstName} {lastName}".strip()
            self.cur.execute("SELECT userid FROM Users WHERE name = %s", (fullName,))
            user = self.cur.fetchone()
            if not user:
                return {"error": "User not found."}
            userid = user["userid"]

            self.cur.execute("SELECT jobid FROM Jobs WHERE title = %s", (jobTitle,))
            job = self.cur.fetchone()
            if not job:
                return {"error": "Job not found."}
            jobid = job["jobid"]

            self.cur.execute("SELECT appid FROM Applications WHERE userid = %s AND jobid = %s LIMIT 1", (userid, jobid))
            app = self.cur.fetchone()
            appid = app["appid"] if app else None

            sqlQuery = "INSERT INTO Interviews (userid, appid, intDate, intTime, intLocation) VALUES (%s, %s, %s, %s, %s)"
            self.cur.execute(sqlQuery, (userid, userid, jobid, intDate, intTime, intLocation))
            self.con.commit()
            return {"message": "Interview scheduled successfully!"}
        except pymysql.MYSQLError as err:
            print(f"Database error: {err}")
            return {"error": f"Database error {err}"}
        finally:
            self.con.close()

#SAVED-JOBS####################################################################################################################

    def savedJobs(self,userid):
        if not userid:
            return 400
        else:
            try:
                sqlQuery = """select j.title,j.jobUrl,j.jobType,c.companyName,sj.dateSaved
                            from Users u
                            natural join Saved_Jobs sj
                            natural join Jobs j
                            natural join Companies c where u.userid = %s
                            """

                params = [userid]
                self.cur.execute(sqlQuery, params)
                result = self.cur.fetchall()
                return result
            except Exception as err:
                return 500
            finally:
                self.con.close()


#**************END OF CLASS DEF**************************************************************************************************************************************************


#***********************APPS*****************************************************************************************************************************************************

app = Flask(__name__)
CORS(app)

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = credentials.NWT_SECRET
jwt = JWTManager(app)

@app.route('/') #Defines the root of the directory
def homePage():
    return jsonify("Welcome to Hirewatch backend")

#/addusers#############################################################################################################################

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


#Search Jobs
#/searchjobs##############################################################################################################################
@app.route('/searchjobs', methods=['GET'])
def viewJobs():
    title = request.args.get('title', '').strip()
    companyName = request.args.get('companyName', '').strip()
    location = request.args.get('location','').strip()

    if not title:
        return jsonify({"error": "title parameter is required"}), 400

    db = Database()
    result = db.searchJob(title, companyName, location)
    return jsonify(result)

#/reviews#############################################################################################################################

@app.route('/reviews', methods=['GET', 'POST'])
def getReviews():
    companyName = request.args.get('companyName', '').strip()
    print(f"Received request for company {companyName}")

    db = Database()
    result = db.getReviews(companyName)

    if isinstance (result, dict) and "error" in result:
        print("Database Error:", result["error"])
        return jsonify(result), 500

    if not result:
        print("No reviews found.")

    print("Fetched reviews:", result)
    return jsonify(result), 200

##############################################################################################################################
@app.route('/scheduleinterview', methods=['GET', 'POST'])
def scheduleInterview():
    data = request.json
    print("Received Data:", data)

    firstName = data.get('firstName')
    lastName = data.get('lastName')
    jobTitle = data.get('jobTitle')
    intDate = data.get('intDate')
    intTime = data.get('intTime')
    intLocation = data.get('intLocation')

    if not firstName or not lastName or not jobTitle or not intDate or not intTime or not intLocation:
        return jsonify({'error': 'All fields are required.'}), 400

    db = Database()
    result = db.scheduleInterview(firstName, lastName, jobTitle, intDate, intTime, intLocation)

    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 201

#/login#############################################################################################################################
##JWT used
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    invalid = [None,""," "]
    if username in invalid or password in invalid:
        result = {"username and password are required": 400}
    else:
        h_password = h.md5(password.encode()).hexdigest()
        db = Database()
        result = db.login(username, h_password)
        if result == [] or result==():
            return jsonify({"Login Failed! Wrong Username or Password.":"403"})
        elif result == "500 Server Error":
            return jsonify({"Server Error":500})
        else:
            try:
                access_token = create_access_token(identity=result[0]['userid'])
                return jsonify(access_token=access_token, name = result[0]['name'])
            except Exception as e:
                return jsonify({"Error calling class object":str(e)})

    return jsonify(result)

#/savedjobs#############################################################################################################################


# Protected route with jwt_required, which will kick out requests
# without a valid JWT present.
@app.route("/savedjobs", methods=["GET"])
@jwt_required()
def get_savedjobs():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    if not current_user:
         return jsonify({"error": "Invalid token or identity"}), 401
    elif isinstance(current_user, int):
        db = Database()
        result = db.savedJobs(current_user)

    return jsonify(result), 200


if __name__ == '__main__':
    app.run(debug=True)