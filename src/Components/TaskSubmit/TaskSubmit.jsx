import React, { useState, useEffect } from 'react';
import "./TaskSubmit.css";
import axios from '../../axiosConfig';
import { format } from 'date-fns';
import Swal from 'sweetalert2';  // Import SweetAlert2

const TaskSubmit = () => {
  const [submissionLinks, setSubmissionLinks] = useState({});
  const [tasks, setTasks] = useState({ sem1: [], sem2: [], sem3: [] });
  const [semProj, setSemProj] = useState([]);
  const [links, setLinks] = useState({}); // Stores gitlink and livelink for each task


  const fetchTasks = async () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const { ID } = userDetails;
    if (!ID) {
      console.error('No username found in localStorage');
      return;
    }

    try {
      const response = await axios.post('/api/user/tasks', {
        username: ID
      });

      if (response.status === 200) {
        setTasks(response.data); // Set the tasks in the state
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };


  // Fetch semproj from the backend using Axios
  const fetchSemProj = async () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const { ID } = userDetails;
    if (!ID) {
      console.error('No username found in localStorage');
      return;
    }

    axios.post('api/user/getSemProj', { username: ID }) // Replace with your API endpoint
      .then((response) => {
        setSemProj(response.data)
      })
      .catch((error) => {
        // Show an error alert if the fetch fails
        Swal.fire({
          icon: 'error',
          title: 'Error Fetching Data',
          text: 'There was an issue fetching the task data. Please try again later.',
        });
        console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
    fetchSemProj();
    fetchTasks(); // Fetch tasks when the component is mounted
  }, []);



  //-------------- tasks submission------------------------------
  const handleSubmit = async (e, semester, taskId) => {
    e.preventDefault();
    const taskLink = submissionLinks[taskId];
    const submittedTime = new Date().toISOString();

    try {
      // Get user ID from localStorage
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));
      const { ID } = userDetails;

      if (!ID) {
        console.error('No username found in localStorage');
        return;
      }

      // Construct the submission data object
      const submissionData = {
        username: ID,
        semester,
        taskId,
        taskLink,
        submittedTime
      };

      console.log("Sending to backend:", submissionData);

      // Sending the data to the backend
      const response = await axios("/api/user/Submittask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(submissionData), // Use data instead of body for axios
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Task Submitted Successfully!',
          text: 'Your task has been submitted. We will process it shortly.',
        });
        await fetchTasks(); // Refetch tasks to update the UI
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Task Submission Failed!',
          text: 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      console.error("Error submitting task:", error.response ? error.response.data : error.message);
      Swal.fire({
        icon: 'error',
        title: 'Submission Error!',
        text: 'An error occurred while submitting your task. Please try again.',
      });
    }

    setSubmissionLinks((prevLinks) => {
      const updatedLinks = { ...prevLinks };
      delete updatedLinks[taskId];
      return updatedLinks;
    });
  };

  const handleSubmissionLinkChange = (e, taskId) => {
    setSubmissionLinks({
      ...submissionLinks,
      [taskId]: e.target.value
    });
  };


  // ----------submit sem project --------------
  const handleLinkChange = (e, taskId, linkType) => {
    setLinks({
      ...links,
      [taskId]: {
        ...links[taskId],
        [linkType]: e.target.value
      }
    });
  };

  const handleLinkSubmit = async (e,semester, taskId) => {
    e.preventDefault();

    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const { ID } = userDetails;
    if (!ID) {
      console.error('No username found in localStorage');
      return;
    }

    const { gitlink, livelink } = links[taskId] || {};
    const submittedTime = new Date().toISOString();

    const semSub = {
      username: ID,
      projId:taskId,
      gitLink: gitlink,
      liveLink: livelink,
      submittedTime,
      semester
    }
console.log(semSub)
    try {
        const response = await axios.post('/api/user/submitSemProj', semSub);

        console.log(response)


      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Links Submitted Successfully!',
          text: 'Your GitHub and Live links have been submitted.',
        });
        fetchSemProj(); // Refresh the data
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed!',
          text: 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Error!',
        text: 'An error occurred while submitting your links. Please try again.',
      });
      console.error('Error submitting links:', error);
    }
  };


  return (
    <div className="task-submit-container">
      <h2 className="task-title">Task Submission</h2>
      {Object.entries(tasks).map(([semester, semesterTasks]) => (
        <div key={semester} className="semester-section">
          <h3 className="semester-title">Semester {semester.replace('sem', '')}</h3>
          <hr />
          <br />
          {semesterTasks.length === 0 ? (
            <p>No tasks available for this semester now.</p>
          ) : (
            <div className="task-grid">
              {semesterTasks.map((task, index) => (
                <div key={index} className="task-item">
                  <h4 className="task-header">Task {task.task}</h4>

                  {/* Formatting Allocated Date */}
                  <p className="task-details">
                    <b>Allocated Date:</b> {format(new Date(task.allocDate), 'dd/MM/yyyy')}
                  </p>

                  {/* Formatting End Date */}
                  <p className="task-details">
                    <b>End Date:</b> {format(new Date(task.endDate), 'dd/MM/yyyy')}
                  </p>

                  <p className="task-details">
                    <b>Task Link:</b>
                    <a href={task.link} target="_blank" rel="noopener noreferrer">View Task</a>
                  </p>

                  {task.isSubmitted ? (
                    task.credit === -1 ? (
                      <p className="task-credits"><b>⌛ Credit assigning in process...</b></p>
                    ) : (
                      <p className="task-credits"><b>Credit Assigned:</b> {task.credit}</p>
                    )
                  ) : (
                    <p className="task-credits"><b>Pending credit assignment</b></p>
                  )}

                  {!task.isSubmitted ? (
                    <form className="task-form" onSubmit={(e) => handleSubmit(e, semester, task._id)}>
                      <label>Submit Your Task Link:</label>
                      <input
                        type="url"
                        value={submissionLinks[task._id] || ''}
                        onChange={(e) => handleSubmissionLinkChange(e, task._id)}
                        required
                        placeholder="Enter your GitHub link"
                      />
                      <button type="submit" className="submit-button">Submit</button>
                    </form>
                  ) : (
                    <p className="task-submitted">
                      Task already submitted. <br />
                      Submitted link: <a href={task.taskSubmitted} target="_blank" rel="noopener noreferrer">View link</a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      ))}

      {/* --------sem project------------- */}

      <h3 className="semester-title">Sem Project</h3>
      <hr />
      <br />
      <div >
        {semProj.length === 0 ? (
          <p>No Sem projects available now.</p>
        ) : (
          <div className="task-grid">
            {semProj.map((task) => (
              <div key={task._id} className="task-item">
                <h4 className="task-header">Sem-Proj: {task.sem}</h4>

                {/* Formatting Allocated Date */}
                <p className="task-details">
                  <b>Allocated Date:</b>
                  {format(new Date(task.allocDate), 'dd/MM/yyyy')}  {/* Output: 10/11/2024 */}
                </p>

                {/* Formatting End Date */}
                <p className="task-details">
                  <b>End Date:</b>
                  {format(new Date(task.endDate), 'dd/MM/yyyy')}  {/* Output: 10/11/2024 */}
                </p>
                <p className="task-details"><b>Task Link:</b> <a href={task.link} target="_blank" rel="noopener noreferrer">{"View Task"}</a></p>

                {task.isSubmitted ? (
                  task.credit === -1 ? (
                    <p className="task-credits"><b>⌛Credit assigning in process...</b></p>
                  ) : (
                    <p className="task-credits"><b>Credit Assigned:</b> {task.credit}</p>
                  )
                ) : (
                  <p className="task-credits"><b>Pending credit assignment</b></p>
                )}

                {/* Input fields for GitHub and Live link submission */}
                {!task.isSubmitted ? (


                  <form className="task-form" onSubmit={(e) => handleLinkSubmit(e,task.sem, task._id)}>
                    <label>
                      GitHub Link:
                      <input
                        type="url"
                        value={links[task._id]?.gitlink || ''}
                        onChange={(e) => handleLinkChange(e, task._id, 'gitlink')}
                        placeholder="Enter your GitHub link"
                        required
                      />
                    </label>
                    <br />
                    <label>
                      Live Link:
                      <input
                        type="url"
                        value={links[task._id]?.livelink || ''}
                        onChange={(e) => handleLinkChange(e, task._id, 'livelink')}
                        placeholder="Enter your Live link"
                        required
                      />
                    </label>
                    <br />
                    <button type="submit" className="submit-button">Submit Links</button>
                  </form>

                ) : (
                  <p className="task-submitted">Project already submitted. <br /> 
                  Submitted link: 
                  <br/>
                  <a href={task.gitlink} target="_blank" rel="noopener noreferrer">{"Git link"}</a> <br/>
                  <a href={task.livelink} target="_blank" rel="noopener noreferrer">{"Live link"}</a>
                  </p>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskSubmit;
