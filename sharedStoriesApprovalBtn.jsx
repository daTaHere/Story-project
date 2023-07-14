import React from 'react';
import './sharedStories.css';
import PropTypes from 'prop-types';

function ApprovedBtn({ aStory, updateSharedStory }) {
  const onApporvedClick = () => {
    updateSharedStory((prevState) => {
      const ps = { ...prevState };
      ps.isApproved = !prevState.isApproved;
      ps.isChecked = !prevState.isChecked;
      ps.pageIndex = 1;
      return ps;
    });
  };

  return (
    <div className='col-md-8 approved-stories-filter-container mt-2'>
      {aStory.isApproved === true ? (
        <button
          className='btn btn-primary stories-button-approved'
          onClick={onApporvedClick}
        >
          Approved
        </button>
      ) : (
        <button
          className='btn btn-primary stories-button-approved'
          onClick={onApporvedClick}
        >
          Not Approved
        </button>
      )}
    </div>
  );
}

ApprovedBtn.propTypes = {
  updateSharedStory: PropTypes.func.isRequired,
  aStory: PropTypes.shape({
    isApproved: PropTypes.bool.isRequired,
  }),
};

export default ApprovedBtn;
