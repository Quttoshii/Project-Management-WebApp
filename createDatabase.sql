################################## table creations ##################################
create Database pwb;
use pwb;

CREATE TABLE Project (
  Project_ID INT AUTO_INCREMENT PRIMARY KEY,
  Project_Name VARCHAR(255),
  Project_Description TEXT,
  Status VARCHAR(255)
);

CREATE TABLE Sprint (
  Sprint_ID INT AUTO_INCREMENT PRIMARY KEY,
  Project_ID INT,
  Start_Date DATE,
  End_Date DATE,
  FOREIGN KEY (Project_ID) REFERENCES Project(Project_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Team (
  Team_ID INT AUTO_INCREMENT PRIMARY KEY,
  Project_ID INT,
  Team_Name VARCHAR(255),
  Number_Of_Members INT,
  FOREIGN KEY (Project_ID) REFERENCES Project(Project_ID)
);

CREATE TABLE Issue (
    IssueID INT AUTO_INCREMENT PRIMARY KEY,
    SprintID INT NOT NULL,
    WorkflowID INT NOT NULL,
    IssueType VARCHAR(20) NOT NULL CHECK (IssueType IN ('bug', 'task', 'feature request', 'improvement')),
    CurrentState VARCHAR(20) NOT NULL CHECK (CurrentState IN ('open', 'in progress', 'resolved')),
    Priority VARCHAR(10) NOT NULL CHECK (Priority IN ('critical', 'high', 'medium', 'low')),
    Summary VARCHAR(255) NOT NULL,
    Description TEXT NOT NULL,
    DueDate DATE
);

CREATE TABLE User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    IssueID INT NULL,
    TeamID INT NULL,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Username VARCHAR(50) NOT NULL,
    Password VARCHAR(50) NOT NULL,
    Role VARCHAR(20) NOT NULL
);

CREATE TABLE Workflow (
  Workflow_ID INT AUTO_INCREMENT PRIMARY KEY,
  Workflow_Name VARCHAR(255),
  Workflow_Steps TEXT
);


ALTER TABLE Issue ADD COLUMN UserID INT;
ALTER TABLE Issue ADD CONSTRAINT FK_User_Issue FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE User ADD CONSTRAINT FK_Issue_User FOREIGN KEY (IssueID) REFERENCES Issue(IssueID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE Issue ADD CONSTRAINT FK_Sprint FOREIGN KEY (SprintID) REFERENCES Sprint(Sprint_ID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE Issue ADD CONSTRAINT FK_Workflow FOREIGN KEY (WorkflowID) REFERENCES Workflow(Workflow_ID) ON DELETE CASCADE ON UPDATE CASCADE;


CREATE TABLE Version (
  Version_ID INT AUTO_INCREMENT PRIMARY KEY,
  Project_ID INT,
  Version_Name VARCHAR(255),
  FOREIGN KEY (Project_ID) REFERENCES Project(Project_ID) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE Report (
  Report_ID INT AUTO_INCREMENT PRIMARY KEY,
  Project_ID INT,
  User_ID INT,
  Report_Name VARCHAR(255),
  Report_Type VARCHAR(255),
  Date_Created DATE,
  Description TEXT,
  FOREIGN KEY (Project_ID) REFERENCES Project(Project_ID) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (User_ID) REFERENCES User(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

################################## insertions ##################################
use pwb;

-- Insertion commands for the Project table
INSERT INTO Project (Project_ID, Project_Name, Project_Description, Status)
VALUES (1, 'DataInsight', 'Analyzing and visualizing large datasets for business intelligence', 'In Progress'),
       (2, 'PredictiveAnalytics', 'Building predictive models for forecasting customer behavior', 'Completed'),
       (3, 'TextMining', 'Developing algorithms to extract insights from unstructured text data', 'Planning'),
       (4, 'RecommendationEngine', 'Creating a personalized recommendation system for an e-commerce platform', 'In Progress'),
       (5, 'FraudDetection', 'Implementing machine learning techniques to detect fraudulent activities', 'In Progress');

-- Insertion commands for the Team table
INSERT INTO Team (Team_ID, Project_ID, Team_Name, Number_Of_Members)
VALUES (1, 1, 'DataInsight Team', 5),
       (2, 2, 'PredictiveAnalytics Team', 7),
       (3, 3, 'TextMining Team', 4),
       (4, 4, 'RecommendationEngine Team', 6),
       (5, 5, 'FraudDetection Team', 8);

INSERT INTO Sprint (Sprint_ID, Project_ID, Start_Date, End_Date)
VALUES (1, 1, '2022-01-01', '2022-01-15'),
(2, 1, '2022-02-01', '2022-02-15'),
(3, 2, '2022-03-01', '2022-03-15'),
(4, 2, '2022-04-01', '2022-04-15'),
(5, 3, '2022-05-01', '2022-05-15');

-- Insertion commands for the Workflow table
INSERT INTO Workflow (Workflow_ID, Workflow_Name, Workflow_Steps)
VALUES (1, 'Bug Workflow', 'Open, In Progress, Resolved'),
       (2, 'Task Workflow', 'Open, In Progress, Resolved'),
       (3, 'Feature Request Workflow', 'Open, In Progress, Resolved');

-- Insertion commands for the Issue table
INSERT INTO Issue (IssueID, SprintID, WorkflowID, IssueType, CurrentState, Priority, Summary, Description, DueDate, UserID)
VALUES (1, 1, 1, 'bug', 'open', 'high', 'Data inconsistency', 'Data inaccuracy found in the system', '2022-01-05'),
       (2, 1, 1, 'task', 'in progress', 'medium', 'Data preprocessing', 'Cleaning and transforming raw data', '2022-01-08'),
       (3, 2, 2, 'feature request', 'open', 'low', 'Data visualization', 'Request for interactive charts and graphs', '2022-02-10'),
       (4, 2, 2, 'bug', 'resolved', 'medium', 'Chart display issue', 'Fixing incorrect chart rendering', '2022-02-05'),
       (5, 3, 3, 'task', 'open', 'high', 'Text extraction algorithm', 'Implementing text extraction algorithm', '2022-03-01');

-- Insertion commands for the User table
INSERT INTO User (UserID, IssueID, TeamID, FirstName, LastName, Email, Username, Password, Role)
VALUES (1, 1, 1, 'Muhammad', 'Ali', 'muhammad.ali@example.com', 'muhammadali', 'password123', 'Admin'),
       (2, 2, 1, 'Fatima', 'Khan', 'fatima.khan@example.com', 'fatimakhan', 'password456', 'Developer'),
       (3, 3, 2, 'Ahmed', 'Rahman', 'ahmed.rahman@example.com', 'ahmedrahman', 'password789', 'Customer'),
       (4, 4, 3, 'Ayesha', 'Ahmed', 'ayesha.ahmed@example.com', 'ayeshaahmed', 'passwordabc', 'Project Manager'),
       (5, 5, 4, 'Hassan', 'Ali', 'hassan.ali@example.com', 'hassanali', 'passwordxyz', 'Developer');



-- Insertion commands for the Version table
INSERT INTO Version (Version_ID, Project_ID, Version_Name)
VALUES (1, 1, '1.0'),
       (2, 2, '2.0'),
       (3, 3, '1.1');

-- Insertion commands for the Report table 
INSERT INTO Report (Report_ID, Project_ID, User_ID, Report_Name, Report_Type, Date_Created, Description)
VALUES (1, 1, 1, 'DataInsight Report', 'Business Intelligence', '2022-01-10', 'Monthly report on business performance'),
       (2, 2, 2, 'PredictiveAnalytics Report', 'Forecasting', '2022-02-15', 'Analysis of customer behavior trends'),
       (3, 3, 3, 'TextMining Report', 'Text Analysis', '2022-03-05', 'Insights extracted from unstructured text data'),
       (4, 4, 4, 'RecommendationEngine Report', 'Personalization', '2022-04-02', 'Evaluation of recommendation algorithms'),
       (5, 5, 5, 'FraudDetection Report', 'Fraud Detection', '2022-05-10', 'Detection of suspicious activities');