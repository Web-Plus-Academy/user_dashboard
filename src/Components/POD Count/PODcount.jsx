import './PodCount.css';

const PodCount = ({ podCount }) => {

  return (
    <div className="pod-count-container">
      <p className="pod-count-text">POD's Submitted: {podCount}</p>
      <Date/>
    </div>
  );
};

export default PodCount;
