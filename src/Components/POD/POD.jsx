import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import './POD.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PodCount from '../POD Count/PODcount';

const POD = () => {
  const [url, setUrl] = useState('');
  const [isKeywordPresent, setIsKeywordPresent] = useState(null);
  const [pod, setPod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFrozen, setIsFrozen] = useState(false);
  let [podCount, setPodCount] = useState(0);

  const userDetails = JSON.parse(localStorage.getItem('userDetails'));

  if (!userDetails) {
    toast.error('User details not found. Please log in again.');
    setLoading(false);
    return;
  }

  const data = {
    user: userDetails.name,
    id: userDetails.ID,
  };


  const fetchRandomProblem = async () => {
    setLoading(true);

    try {
      const response = await axios.post('/api/user/problems', data);
      const problems = response.data.data.stat_status_pairs;
      const status_pod = response.data.podSubmissionStatus;
      console.log(response.data.podCount);
      setPodCount(response.data.podCount);

      if (problems.length === 0) {
        setLoading(false);
        return;
      }

      // Filter to get only easy and non-subscribed problems
      const easyNonSubscribedProblems = problems.filter(
        (problem) =>
          problem.difficulty.level === 1 &&
          !problem.paid_only &&
          (problem.stat.question__title_slug.includes('array') ||
           problem.stat.question__title_slug.includes('string') ||
           problem.stat.question__title_slug.includes('math'))
      );

      if (easyNonSubscribedProblems.length === 0) {
        setLoading(false);
        return;
      }

      const randomIndex = Math.floor(Math.random() * easyNonSubscribedProblems.length);
      const randomProblem = easyNonSubscribedProblems[randomIndex].stat;

      const newPod = {
        id: randomProblem.question_id,
        title: randomProblem.question__title,
        slug: randomProblem.question__title_slug,
        url: `https://leetcode.com/problems/${randomProblem.question__title_slug}/`
      };

      setPod(newPod);
      localStorage.setItem('pod', JSON.stringify(newPod));
      localStorage.setItem('statusPod', status_pod ? 'true' : 'false');
      setIsFrozen(status_pod); // Set freeze state based on `status_pod`
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  let gotData = true;

  const checkPodAndFetch = async () => {
    try {
      // Fetch POD status and problems
      const response = await axios.post('/api/user/problems', data);
      const storedPod = JSON.parse(localStorage.getItem('pod'));
      const storedStatusPod = localStorage.getItem('statusPod') === 'true';
      const serverPodStatus = response.data.podSubmissionStatus;
      setPodCount(response.data.podCount);

      // If POD exists in local storage and it is not frozen on the server
      if (storedPod && !serverPodStatus) {
        setPod(storedPod);
        setIsFrozen(storedStatusPod);
        setLoading(false); // No need to show loader if stored problem is available
      } else {       
          fetchRandomProblem(); // Fetch new problem if none is stored
      }

      // Always update local storage based on server status
      if (storedStatusPod !== serverPodStatus) {
        localStorage.setItem('statusPod', serverPodStatus ? 'true' : 'false');
        setIsFrozen(serverPodStatus);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching POD data.');
    }
  };

  useEffect(() => {
    if (gotData) {
      gotData = false;
    checkPodAndFetch();
  }
  
    // Clear local storage at specific time logic
    const clearLocalStorageAtTime = () => {
      localStorage.removeItem('pod');
      localStorage.removeItem('statusPod');
      fetchRandomProblem(); // Fetch new problem after clearing local storage
    };
  
    const calculateTimeToSpecificTime = () => {
      const now = new Date();
      const targetTime = new Date(now);
  
      targetTime.setHours(0, 0, 0, 0); // Set to start of the day
  
      if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1); // If the time has already passed today, set it for tomorrow
      }
  
      const timeToTarget = targetTime.getTime() - now.getTime();
      return timeToTarget;
    };
  
    const timeToTarget = calculateTimeToSpecificTime();
    const timeoutId = setTimeout(() => {
      clearLocalStorageAtTime();
      setInterval(clearLocalStorageAtTime, 24 * 60 * 60 * 1000); // Clear local storage every 24 hours
    }, timeToTarget);
  
    return () => {
      clearTimeout(timeoutId); // Clear timeout on component unmount
    };
  }, []);
  

  useEffect(() => {
    const submitPod = async () => {
      if (isKeywordPresent) {
        try {
          const response = await axios.post('/api/user/podSubmit', data);

          if (response.data.success && response.data.podSubmissionStatus) {
            toast.success('Submission successful!'); // Toast message for successful submission
            localStorage.setItem('statusPod', 'true');
            setIsFrozen(true);

            // Increment pod count immediately
            setPodCount((prevCount) => prevCount + 1);

            // Clear pod question link from local storage
          localStorage.removeItem('pod');
          setPod(null); // Clear the pod state as well
            
          } else {
            toast.error('Submission failed. Please try again.'); // Toast message for failed submission
          }
        } catch (error) {
          console.error('Error submitting POD:', error);
          toast.error('An error occurred. Please try again later.'); // Toast message for error
        }
      }
    };

    submitPod();
  }, [isKeywordPresent]);

  const handleChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pod) {
      const expectedSubmissionUrl = `${pod.url}submissions/`;
      const isMatch = url.startsWith(expectedSubmissionUrl);

      setIsKeywordPresent(isMatch);
    }
  };

  const handleReload = () => {
    localStorage.removeItem('statusPod');
    fetchRandomProblem();
  };

  return (
    <>
    <PodCount podCount={podCount}/>
    <div className="pod_container">
      <h2>Problem of the Day (POD)</h2>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <>
          {pod && !isFrozen && (
            <div className="pod-details">
              <p><strong>Assigned Problem of the Day:</strong></p>
              <p>ID: {pod.id}</p>
              <p>Title: {pod.title}</p>
              <p>
                URL: <a href={pod.url} target="_blank" rel="noopener noreferrer">{pod.url}</a>
              </p>
              <button className="reload-button" onClick={handleReload} disabled={isFrozen}>
                Reload POD
              </button>
            </div>
          )}
          {!isFrozen && pod && (
            <form onSubmit={handleSubmit} className="url-form">
              <input
                type="text"
                placeholder="Enter URL"
                value={url}
                onChange={handleChange}
                />
              <button type="submit">Submit POD</button>
            </form>
          )}
          {isKeywordPresent !== null && (
            <p className="result">
              {isKeywordPresent ? 'Thank you!' : 'Submitted URL is not valid'}
            </p>
          )}
          {isFrozen && (
            <p className="submitted-message">Submitted, come tomorrow!</p>
          )}
        </>
      )}
    </div>
      </>
  );
};

export default POD;
