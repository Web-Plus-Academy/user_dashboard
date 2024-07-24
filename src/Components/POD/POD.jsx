import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import './POD.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const POD = () => {
  const [url, setUrl] = useState('');
  const [isKeywordPresent, setIsKeywordPresent] = useState(null);
  const [pod, setPod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFrozen, setIsFrozen] = useState(false);

  const fetchRandomProblem = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/user/problems', { withCredentials: true });
      const problems = response.data.data.stat_status_pairs;
      const status_pod = response.data.podSubmissionStatus;

      if (problems.length === 0) {
        setLoading(false);
        return;
      }

      // Filter to get only easy and non-subscribed problems
      const easyNonSubscribedProblems = problems.filter(
        problem => problem.difficulty.level === 1 && !problem.paid_only
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

  var gotdata = true;

  useEffect(() => {
    const storedPod = JSON.parse(localStorage.getItem('pod'));
    const storedStatusPod = localStorage.getItem('statusPod') === 'true';

    if (storedPod) {
      setPod(storedPod);
      setIsFrozen(storedStatusPod);
      setLoading(false); // No need to show loader if stored problem is available
    } else {
      if (gotdata) {
        gotdata = false;
        fetchRandomProblem(); // Fetch new problem if none is stored
      }
    }

    const clearLocalStorageAtTime = () => {
      localStorage.removeItem('pod');
      localStorage.removeItem('statusPod');
      fetchRandomProblem(); // Fetch new problem after clearing local storage
    };

    const calculateTimeToSpecificTime = () => {
      const now = new Date();
      const targetTime = new Date(now);

      targetTime.setHours(0, 0, 0, 0); // Set to 21:52:00

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
          const response = await axios.get('/api/user/podSubmit', { withCredentials: true });

          if (response.data.success && response.data.podSubmissionStatus) {
            toast.success('Submission successful!'); // Toast message for successful submission
            localStorage.setItem('statusPod', 'true');
            setIsFrozen(true);
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
      {/* <ToastContainer /> Add this to render toast messages */}
    </div>
  );
};

export default POD;
