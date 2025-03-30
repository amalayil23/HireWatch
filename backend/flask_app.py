##
#HIREWATCH BACKEND APP########################################

from flask import Flask, request, jsonify
import pymysql
import credentials
from flask_cors import CORS
import hashlib as h
from datetime import timedelta, datetime

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
    def addUser(self, name, email, major, year, password):
        try:
            self.con.begin()
            sqlQuery = "INSERT INTO Users (name, email, major, year) VALUES (%s, %s, %s, %s)"
            self.cur.execute(sqlQuery, (name, email, major, year))
            userid = self.cur.lastrowid

            hashed_password = h.md5(password.encode()).hexdigest()
            sqlQueryPassword = "INSERT INTO Passwords (userid, pass) VALUES (%s, %s)"
            self.cur.execute(sqlQueryPassword, (userid, hashed_password))

            self.con.commit()
            return {"message": "User has been successfully added!"}
        except pymysql.IntegrityError as err:
            self.com.rollback()
            print(f"Database error: {err}")
            return {"error": f'Database error {err}'}
        finally:
            self.con.close()

#SEARCH-JOB#########################################################################################################################


    def searchJob(self, title, companyName, location):
        try:
            sqlQuery = """
            SELECT j.jobid, j.title, c.companyName, j.jobType, c.industry, c.companyLocation, j.jobUrl
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

#SAVE-JOBS#########################################################################################################################
    def saveJob(self, userid, jobid):
        try:
            sqlQueryCheck = "SELECT * FROM Saved_Jobs WHERE userid = %s AND jobid = %s"
            self.cur.execute(sqlQueryCheck, (userid, jobid))
            existing_entry = self.cur.fetchone()

            if existing_entry:
                return {"message": "Job already saved"}

            sqlQuerySave = "INSERT INTO Saved_Jobs (userid, jobid, dateSaved) VALUES (%s, %s, CURDATE())"
            self.cur.execute(sqlQuerySave, (userid, jobid))
            self.con.commit()
            return {"message": "Job saved successfully"}
        except pymysql.MYSQLError as err:
            self.con.rollback()
            return {"error": f"Database error {err}"}
        finally:
            self.con.close()

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

    def scheduleInterview(self, userid, appid, intDate, intTime, intLocation):
        if not userid:
            return 400

        if not all([userid, appid, intDate, intTime, intLocation]):
            return 400

        try:
            sqlInsert = "INSERT INTO Interviews ( userid, appid, intDate, intTime, intLocation) VALUES (%s, %s, %s, %s, %s)"
            self.cur.execute(sqlInsert, (userid, appid,intDate, intTime, intLocation))
            self.con.commit()
            return {"message": "Interview scheduled successfully!"}, 201

        except (pymysql.MySQLError, Exception) as err:
            self.con.rollback()
            return {"error": f"Database error {err}"}, 500
        finally:
            self.con.close()

#VIEW-INTERVIEWS#########################################################################################################################

    def getBookedInterviews(self, userid):
        if not userid:
            return 400
        else:
            try:
                sqlQuery = """
                SELECT *
                FROM Interviews i
                WHERE i.userid = %s
                ORDER BY i.intDate, i.intTime
                """
                params = [userid]
                self.cur.execute(sqlQuery, params)
                result = self.cur.fetchall()
                return result
            except Exception as err:
                return 500
            finally:
                self.con.close()

#SAVED-JOBS####################################################################################################################

    def savedJobs(self,userid):
        if not userid:
            return 400
        else:
            try:
                sqlQuery = """select j.jobid, j.title,j.jobUrl,j.jobType,c.companyName,sj.dateSaved
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

#APPLIED-JOBS####################################################################################################################
    def appliedJobs(self,userid):
        if not userid:
            return 400
        else:
            try:
                sqlQuery = """
                            select ap.appid, j.title, j.jobType,c.companyName, c.companyLocation, ap.dateApplied, ap.status
                            FROM Applications ap
                            NATURAL JOIN Jobs j
                            NATURAL JOIN Companies c
                            WHERE ap.userid = %s """

                params = [userid]
                self.cur.execute(sqlQuery, params)
                result = self.cur.fetchall()
                return result
            except Exception as err:
                return 500
            finally:
                self.con.close()

#UPDATE-APPLIED-JOBS####################################################################################################################
    def update_appliedJobs(self,appid,newstat):
        if not appid:
            return 400
        else:
            try:
                sqlQuery = """
                            UPDATE Applications ap
                            SET ap.status = %s
                            WHERE ap.appid = %s """

                params = [newstat,appid]
                self.cur.execute(sqlQuery, params)
                self.con.commit()
                return "Status updated"
            except Exception as err:
                return 500
            finally:
                self.con.close()


#DELETE-INTERVIEWS####################################################################################################################
    def rem_BookedInterviews(self, int_id):
        if not int_id:
            return 400
        else:
            try:
                sqlQuery = """
                            DELETE FROM Interviews
                            WHERE interviewid = %s
                            """
                self.cur.execute(sqlQuery, int_id)
                self.con.commit()
                return "Successfully removed the interview", 201
            except Exception as e:
                return 500


#ADD-APPLIED####################################################################################################################

    def add_Applications(self, userid, jobid):
        if not userid or not jobid:
            return 400
        else:
            try:
                sqlQuery  = "SELECT userid,jobid FROM Applications where userid =%s and jobid=%s"
                params = [userid, jobid]
                self.cur.execute(sqlQuery, params)
                result = self.cur.fetchall()
                if len(result) > 0:
                    return "Job already in Applied"
                else:
                    sqlInsert = """
                                INSERT INTO Applications (userid, jobid, status, dateApplied)
                                VALUES (%s, %s, %s, %s)
                               """
                    cur_date = datetime.now()
                    formatted_date = cur_date.strftime("%Y-%m-%d")
                    status = "Pending"
                    self.cur.execute(sqlInsert, (userid, jobid, status, formatted_date))
                    self.con.commit()
                    return "Success"
            except Exception as e:
                return [str(e),500]

            # sqlInsert = "INSERT INTO Interviews ( userid, appid, intDate, intTime, intLocation) VALUES (%s, %s, %s, %s, %s)"
            # self.cur.execute(sqlInsert, (userid, appid,intDate, intTime, intLocation))
            # self.con.commit()

#**************END OF CLASS DEF**************************************************************************************************************************************************

# db = Database()
# db.add_Applications(101,31)

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
    password = data.get('password')

    if not all([name, email, major, year, password]):
        return jsonify({'message': 'All fields are required'}), 400

    try:
        year = int(year)
        if year < 1 or year > 4:
            return jsonify({'message': 'Year must be between 1-4.'}), 400
    except ValueError:
        return jsonify({'message': 'Valid year must be entered.'}), 400

    db = Database()
    result = db.addUser(name, email, major, year, password)

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
    else:
        try:
            db = Database()
            result = db.searchJob(title, companyName, location)
        except Exception as e:
            return jsonify ({"Server Error":str(e)}),500

    if result == () or result == None:
        return jsonify({"msg": "No match found"})
    else:
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

#/scheduleinterview#############################################################################################################################
@app.route('/scheduleinterview', methods=['GET', 'POST'])
@jwt_required()
def scheduleInterview():
    #data = request.json
    current_user = get_jwt_identity()
    if not current_user:
        return jsonify("Missing Authorization")
    appid =  request.args.get('appid', '')
    intDate = request.args.get('intDate', '')
    intTime = request.args.get('intTime', '')
    intLocation = request.args.get('intLocation', '')
    #return jsonify([appid,intDate, intTime, intLocation])
    if not all([appid, intDate, intTime, intLocation]):
        return jsonify({'error': 'All fields are requried'}), 400
    else:
        try:
            db = Database()
            result = db.scheduleInterview(current_user, appid, intDate, intTime, intLocation)
            return jsonify(result,200)
        except:
            return jsonify("Server Error",500)


#/bookedinterviews#############################################################################################################################
@app.route("/bookedinterviews", methods=['GET', 'POST'])
@jwt_required()
def getBookedInterviews():
    current_user = get_jwt_identity()

    if not current_user:
        return jsonify({"error": "Invalid token or identity"}), 401

    try:
        #return jsonify(current_user)
        db = Database()
        result = db.getBookedInterviews(current_user)
        # result = result[0]
        # result['intTime'] = str(result['intTime'])
        # return jsonify(result)
        interviews = []
        if result:
            for item in result:
                temp = {}
                temp['intid'] =  item['interviewid']
                temp['intDate'] =  item['intDate']
                temp['intTime'] = str(item['intTime'])
                temp['intLocation'] =  item['intLocation']
                interviews.append(temp)


            return jsonify(interviews)
        if not result:
            return jsonify({"message": "No interviews booked yet"}), 200



    except Exception as err:
        return jsonify({"error": str(err)}), 500

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

#/savejobs#############################################################################################################################
@app.route("/savejob", methods=["GET", "POST"])
@jwt_required()
def save_job():
    current_user = get_jwt_identity()
    data = request.json
    jobid = data.get("jobid")

    if not jobid:
        return jsonify({"error": "Job ID is required"}), 400
    elif not current_user:
        return jsonify({"error": "Invalid or missing login"}), 403
    elif jobid and current_user:
        try:
            db = Database()
            result = db.saveJob(current_user, jobid)
        except Exception as e:
            return jsonify({"Error":str(e)})

    if "error" in result:
        return jsonify(result), 500

    else:
        return jsonify(result), 200


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

#/appliedjobs#############################################################################################################################
@app.route("/appliedjobs", methods=["GET", "PUT"])
@jwt_required()
def applied_jobs():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    if not current_user:
        return jsonify({"error": "Invalid token or identity"}), 401

    if request.method == 'GET' and current_user:
        if isinstance(current_user, int):
            try:
                db = Database()
                result = db.appliedJobs(current_user)
                if result == () or result == None:
                    return jsonify("No Jobs Saved"),200
                else:
                    return jsonify(result),200
            except Exception as e:
                return jsonify("Error try again"), 500

    elif request.method == 'PUT' and current_user:
        data = request.json
        if not data:
            return jsonify("Appid or status missing"),404
        else:
            try:
                appid = data.get('appid')
                newstat = data.get('newStatus')
                db = Database()
                result = db.update_appliedJobs(appid,newstat)
                return jsonify(result)
            except:
                return jsonify("Server Error"),500


#/addapplied#############################################################################################################################
@app.route("/addapplied", methods=["GET","POST"])
@jwt_required()
def add_applied():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    jobid =  request.args.get('jobid', '')
    if not current_user:
        return jsonify({"error": "Invalid token or identity"}), 401
    elif not jobid:
        return jsonify({"error": "Job ID missing or invalid"}), 401
    else:
        try:
            db = Database()
            #return("We are here")
            result = db.add_Applications(current_user, jobid)
            if result == 500:
                return jsonify ("Server Error"),500
            elif result == "Success":
                return jsonify(result),201
            elif result == "Job already in Applied":
                return jsonify("Job already in Applied", 404)
        except Exception as e:
            return jsonify("Server Error",e),500

#/removeinterview#############################################################################################################################
@app.route("/removeinterview", methods=["GET","DELETE"])
@jwt_required()
def remove_interview():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    int_id =  request.args.get('intid', '')
    if not current_user:
        return jsonify({"error": "Invalid token or identity"}), 401
    elif not int_id:
        return jsonify({"error": "Interview ID missing or invalid"}), 401
    else:
        try:
            db = Database()
            result = db.rem_BookedInterviews(int_id)
            # return ("We are here")
            if result == 500:
                return jsonify ("Server Error"),500
            elif result[0] == "Successfully removed the interview":
                return jsonify(result)
        except Exception as e:
            return jsonify("Server Error",e),500



##############################################################################################################################


if __name__ == '__main__':
    app.run(debug=True)