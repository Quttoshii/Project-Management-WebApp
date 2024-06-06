const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mysql = require("mysql");
var userID = "";
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'V@lorant1',
    database: 'pwb'
})

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log("Routed to log in");
    res.sendFile(__dirname + '/public/user_login.html')
})

app.post('/', (req, res) => {
    const user=req.body.username;
    const pass=req.body.password;
    pool.query((`SELECT password FROM User WHERE username=?`), [user], 
        (err, results) => {
            if (err) {
                console.log("Query error!");
                res.redirect('error');
            }
            else {
                results = JSON.parse(JSON.stringify(results));
                if (pass == results[0].password) {
                    console.log("Login Sucessful!");
                    userID = user;
                    pool.query((`SELECT Role FROM User WHERE username=?`),  [user], 
                    (err, results) => {
                        results = JSON.parse(JSON.stringify(results));
                        switch (results[0].Role) {
                            case "Admin":
                                res.redirect('admin');
                                break;
                            case "Developer":
                                res.redirect('developer');
                                break;
                            case "Project Manager":
                                res.redirect('project_manager');
                                break;
                            case "Customer":
                                res.redirect('customer');
                                break; 
                            default:
                                res.redirect('error');
                        }
                    })
                }
                else {
                    console.log("Incorrect Login Details");
                    res.redirect('error');
                }
            }
        })
})

app.get('/admin', (req, res) => {
    console.log("Routed to admin");
    res.sendFile(__dirname + '/public/admin_page1.html')
})

app.get('/user_management', (req, res) => {
    console.log("Routed to user management");
    res.sendFile(__dirname + '/public/user_management.html')
})

app.get('/add_user', (req, res) => {
    console.log("Routed to add user");
    res.sendFile(__dirname + '/public/add_user.html')
})

app.post('/add_user', (req, res) => {
    const fname = req.body.firstname;
    const lname = req.body.lastname;
    const email = req.body.email;
    const role = req.body.role;
    const uname = req.body.username;
    const pass = req.body.password;
    pool.query((`INSERT INTO User (UserID, IssueID, TeamID, FirstName, LastName, Email, Username, Password, Role)
                VALUES (Default, NULL, NULL, ?, ?, ?, ?, ?, ?)`), [fname, lname, email, uname, pass, role],
        (err, results) => {
            if (err) {
                console.log("Query error! " + err);
                res.redirect('error');
            }
            else {
                console.log("data entered");
                res.redirect('done');
            }
        })
})

app.get('/remove_user', (req, res) => {
    console.log("Routed to remove user");
    res.sendFile(__dirname + '/public/remove_user.html')
})

app.post('/remove_user', (req, res) => {
    const fname = req.body.firstname;
    const lname = req.body.lastname;
    const email = req.body.email;
    const uname = req.body.username;
    pool.query((`DELETE FROM User
                WHERE FirstName=? and LastName=? and email=? and username=?`), [fname, lname, email, uname],
        (err, results) => {
            if (err) {
                console.log("Query error! " + err);
                res.redirect('error');
            }
            else {
                console.log("User Removed");
                res.redirect('done');
            }
        })
})

app.get('/done', (req, res) => {
    console.log("routed to done");
    res.sendFile(__dirname + '/public/done.html')
})

app.get('/error', (req, res) => {
    console.log("routed to error");
    res.sendFile(__dirname + '/public/error.html')
})

app.get('/roles', (req, res) => {
    console.log("Routed to remove user");
    res.sendFile(__dirname + '/public/roles.html')
})

app.post('/roles', (req, res) => {
    const uname = req.body.username;
    const role = req.body.role;
    pool.query((`UPDATE User
                SET Role=?
                WHERE username=?`), [role, uname],
        (err, results) => {
            if (err) {
                console.log("Query error! " + err);
                res.redirect('error');
            }
            else {
                console.log("Role Updated");
                res.redirect('done');
            }
        })
})

app.get('/project_management', (req, res) => {
    console.log("Routed to project management");
    res.sendFile(__dirname + '/public/project_management.html')
})

app.get('/project_creation', (req, res) => {
    console.log("Routed to project creation");
    res.sendFile(__dirname + '/public/project_creation.html')
})

app.post('/project_creation', (req, res) => {
    const pname = req.body.projectname;
    const des = req.body.description;
    const status = req.body.status;
    pool.query((`INSERT INTO Project (Project_ID, Project_Name, Project_Description, Status)
    VALUES (DEFAULT, ?, ?, ?)`), [pname, des, status],
        (err, results) => {
            if (err) {
                console.log("Query error! " + err);
                res.redirect('error');
            }
            else {
                console.log("data entered");
                res.redirect('done');
            }
        })
})

app.get('/assign_issues', (req, res) => {
    console.log("Routed to assign issues");
    res.sendFile(__dirname + '/public/assign_issues.html')
})

app.post('/assign_issues', (req, res) => {
    const itype = req.body.issuetype;
    const sum = req.body.summary;
    // const des = req.body.description;
    const ddate = req.body.duedate;
    const sid = req.body.sprintid;
    const wid = req.body.workflowid;
    const cstat = req.body.currentstate;
    const priority = req.body.priority;
    pool.query(`INSERT INTO Issue (IssueID, SprintID, WorkflowID, IssueType, CurrentState, Priority, Summary, Description, DueDate)
    VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?)`, [sid, wid, itype, cstat, priority, sum, sum, ddate],
        (err, results) => {
            if (err) {
                console.log("Query error! " + err);
                res.redirect('error');
            }
            else {
                console.log("data entered");
                res.redirect('done');
            }
        })
})

app.get('/views', (req, res) => {
    console.log("Routed to views");
    // pool.query(`SELECT Project_ID
    //             FROM Project`, (err, results) => {
    //                 if (err) {
    //                     console.log("Query error! " + err);
    //                     res.redirect('error');
    //                 }
    //                 else {
    //                     results = JSON.parse(JSON.stringify(results));
    //                     data = results;
    //                     console.log(data);
    //                     console.log("data retrieved");
    //                     console.log("routed to views");
    //                     res.render('views.ejs', data);
    //                 }
    //             })
    res.sendFile(__dirname + '/public/views.html')
})

app.post('/views', (req, res) => {
    // res.sendFile(__dirname + '/public/view_results.html')
    const pid = req.body.projectid;
    pool.query(`SELECT Project.Project_ID, Project_Name, Project_Description, Status, Version.Version_ID, Version_Name 
                FROM Project
                INNER JOIN Version
                ON Project.Project_ID=Version.Version_ID
                WHERE Project.Project_ID=?`, [pid],
        (err, results) => {
            if (err) {
                console.log("Query error! " + err);
                res.redirect('error');
            }
            else {
                results = JSON.parse(JSON.stringify(results));
                data = results[0];
                // console.log(data);
                console.log("data retrieved");
                console.log("routed to view results");
                res.render('view_results.ejs', data);
            }
        })
})

app.get('/team_details', (req, res) => {
    console.log("Routed to team details");
    res.sendFile(__dirname + '/public/team_details.html')
})

app.post('/team_details', (req, res) => {
    // res.sendFile(__dirname + '/public/view_results.html')
    const tid = req.body.teamid;
    pool.query(`SELECT * 
                FROM Team
                INNER JOIN Project 
                ON Team.Team_ID=Project.Project_ID
                WHERE Team.Team_ID=?`, [tid],
        (err, results) => {
            if (err) {
                console.log("Query error! " + err);
                res.redirect('error');
            }
            else {
                results = JSON.parse(JSON.stringify(results));
                data = results[0];
                // console.log(data);
                console.log("data retrieved");
                console.log("routed to team results");
                res.render('team_results.ejs', data);
            }
        })
})

app.get('/sprints', (req, res) => {
    console.log("Routed to sprints");
    res.sendFile(__dirname + '/public/sprints.html')
})

app.get('/add_sprint', (req, res) => {
    console.log("Routed to add sprint");
    res.sendFile(__dirname + '/public/add_sprint.html')
})

app.post('/add_sprint', (req, res) => {
    const pid = req.body.projectid;
    const sd = req.body.startdate;
    const ed = req.body.enddate;
    pool.query((`INSERT INTO Sprint (Sprint_ID, Project_ID, Start_Date, End_Date)
    VALUES (DEFAULT, ?, ?, ?)`), [pid, sd, ed],
        (err, results) => {
            if (err) {
                console.log("Query error! " + err);
                res.redirect('error');
            }
            else {
                console.log("data entered");
                res.redirect('done');
            }
        })
})

app.get('/remove_sprint', (req, res) => {
    console.log("Routed to remove sprint");
    res.sendFile(__dirname + '/public/remove_sprint.html')
})

app.post('/remove_sprint', (req, res) => {
    const sid = req.body.sprintid;
    pool.query((`DELETE FROM Sprint
                WHERE Sprint_ID=?`), [sid],
        (err, results) => {
            if (err) {
                console.log("Query error! " + err);
                res.redirect('error');
            }
            else {
                console.log("User Removed");
                res.redirect('done');
            }
        })
})

app.get('/view_sprint', (req, res) => {
    console.log("Routed to view sprints");
    res.sendFile(__dirname + '/public/view_sprint.html')
})

app.post('/view_sprint', (req, res) => {
    // res.sendFile(__dirname + '/public/view_results.html')
    const sid = req.body.sprintid;
    pool.query(`SELECT * 
                FROM Sprint
                INNER JOIN Project 
                ON Sprint.Sprint_ID=Project.Project_ID
                WHERE Sprint.Sprint_ID=?`, [sid],
        (err, results) => {
            if (err) {
                console.log("Query error! " + err);
                res.redirect('error');
            }
            else {
                results = JSON.parse(JSON.stringify(results));
                data = results[0];
                // console.log(data);
                console.log("data retrieved");
                console.log("routed to team results");
                res.render('sprint_results.ejs', data);
            }
        })
})

app.get('/developer', (req, res) => {
    console.log("Routed to developer");
    res.sendFile(__dirname + '/public/developer.html')
})

app.get('/update_status', (req, res) => {
    console.log("Routed to update status");
    res.sendFile(__dirname + '/public/update_status.html')
})

app.post('/update_status', (req, res) => {
    const iid = req.body.issueid;
    const ns = req.body.newstate;
    pool.query((`UPDATE Issue
                SET CurrentState=?
                WHERE IssueID=?`), [ns, iid],
        (err, results) => {
            if (err) {
                console.log("Query error! " + err);
                res.redirect('error');
            }
            else {
                console.log("Role Updated");
                res.redirect('done');
            }
        })
})

app.get('/view_tasks', (req, res) => {
    // res.sendFile(__dirname + '/public/view_results.html')
    // console.log(userID);
    pool.query(`SELECT DISTINCT Issue.IssueID, SprintID, WorkflowID, IssueType, CurrentState, Priority, Summary, DueDate 
                FROM Issue
                INNER JOIN User 
                ON Issue.IssueID=User.IssueID
                WHERE User.Username=?`, [userID],
        (err, results) => {
            if (err) {
                console.log("Query error! " + err);
                res.redirect('error');
            }
            else {
                results = JSON.parse(JSON.stringify(results));
                data = results[0];
                // console.log(data);
                console.log("data retrieved");
                console.log("routed to view tasks");
                res.render('view_tasks.ejs', data);
            }
        })
})

app.get('/report_management', (req, res) => {
    console.log("Routed to report management");
    res.sendFile(__dirname + '/public/report_management.html')
})

app.get('/add_report', (req, res) => {
    console.log("Routed to add report");
    res.sendFile(__dirname + '/public/add_report.html')
})

app.post('/add_report', (req, res) => {
    const pid = req.body.projectid;
    const uid = req.body.userid;
    const rn = req.body.reportname;
    const rt = req.body.reporttype;
    const date = req.body.datecreated;
    const ds = req.body.description;
    pool.query((`INSERT INTO Report (Report_ID, Project_ID, User_ID, Report_Name, Report_Type, Date_Created, Description)
    VALUES (DEFAULT, ?, ?, ?, ?, ?, ?)`), [pid, uid, rn, rt, date, ds],
        (err, results) => {
            if (err) {
                console.log("Query error! " + err);
                res.redirect('error');
            }
            else {
                console.log("data entered");
                res.redirect('done');
            }
        })
})

app.get('/report', (req, res) => {
    console.log("Routed to view reports");
    res.sendFile(__dirname + '/public/report.html')
})

app.post('/report', (req, res) => {
    // res.sendFile(__dirname + '/public/view_results.html')
    const rid = req.body.reportid;
    pool.query(`SELECT Report_ID, Project_Name, FirstName, LastName, Report_Name, Report_Type, Date_Created, Description
                FROM Report
                INNER JOIN Project
                INNER JOIN User
                ON Project.Project_ID=Report.Project_ID and User.UserID=Report.User_ID
                WHERE Report_ID=?`, [rid],
        (err, results) => {
            if (err) {
                console.log("Query error! " + err);
                res.redirect('error');
            }
            else {
                results = JSON.parse(JSON.stringify(results));
                data = results[0];
                // console.log(data);
                console.log("data retrieved");
                console.log("routed to report");
                res.render('report_results.ejs', data);
            }
        })
})

app.get('/customer', (req, res) => {
    console.log("Routed to customer");
    res.sendFile(__dirname + '/public/customer.html')
})

app.get('/track_issue', (req, res) => {
    console.log("Routed to track_issue");
    res.sendFile(__dirname + '/public/track_issue.html')
})

app.post('/track_issue', (req, res) => {
    const iid = req.body.issueid;
    pool.query(`SELECT IssueID, SprintID, WorkflowID, IssueType, CurrentState, Priority, Summary, Description, DueDate
                FROM Issue
                WHERE IssueID=?`, [iid],
        (err, results) => {
            if (err) {
                console.log("Query error! " + err);
                res.redirect('error');
            }
            else {
                results = JSON.parse(JSON.stringify(results));
                data = results[0];
                // console.log(data);
                console.log("data retrieved");
                console.log("routed to track issue results");
                res.render('track_issue_result.ejs', data);
            }
        })
})

app.get('/project_manager', (req, res) => {
    console.log("Routed to project manager");
    res.redirect('project_management');
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})