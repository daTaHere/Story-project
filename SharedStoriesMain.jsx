import React, { useState, useEffect } from "react";

import StoryCard from "./SharedStoryCard";
import ApprovedBtn from "./sharedStoriesApprovalBtn";
import StoryServices from "services/sharedStoriesServices";

import Pagination from "rc-pagination";
import locale from "rc-pagination/lib/locale/en_US";
import toastr from "toastr";
import "rc-pagination/assets/index.css";

import "./sharedStories.css";
import PropTypes from "prop-types";
import logger from "sabio-debug";

const _logger = logger.extend("Story");

function SharedStories({ currentUser }) {
  const [sharedStories, setSharedStories] = useState({
    arrayOfSharedStories: [],
    sharedStoriesComponents: [],
    pageIndex: 1,
    pageSize: 6,
    totalCount: 0,
    isApproved: true,
  });

  useEffect(() => {
    StoryServices.getApproveStories(
      sharedStories.pageIndex - 1,
      sharedStories.pageSize,
      sharedStories.isApproved
    )
      .then(onGetStorySuccess)
      .catch(onGetStoryError);
  }, [sharedStories.pageIndex, sharedStories.isApproved]);

  const onGetStorySuccess = (response) => {
    const newAryStories = response.item.pagedItems;
    _logger("onGetStorySuccess", newAryStories);

    setSharedStories((prevState) => {
      const newStory = { ...prevState };
      newStory.arrayOfSharedStories = newAryStories;
      newStory.sharedStoriesComponents = newAryStories.map(mapStories);
      newStory.totalCount = response.item.totalCount;
      return newStory;
    });
  };
  const onGetStoryError = (error) => {
    _logger({ Error: error });
    toastr.error("Something went wrong please visit later.");
  };

  const mapStories = (aStory) => {
    return (
      <StoryCard
        aStory={aStory}
        sharedStories={sharedStories}
        key={aStory.id}
        user={currentUser}
        deleteClick={onDeleteClicked}
        approvedChange={onApprovedRequest}
      />
    );
  };

  const onPaginationClick = (pageNumber) => {
    _logger("pageNumber", pageNumber);
    setSharedStories((prevState) => {
      const pd = { ...prevState };
      pd.pageIndex = pageNumber;
      return pd;
    });
  };

  const onDeleteClicked = (aStoryId) => {
    StoryServices.deleteAStory(aStoryId)
      .then(() => onDeleteAStorySuccess(aStoryId))
      .catch(onDeleteAStoryError);
  };

  const onDeleteAStorySuccess = (response) => {
    _logger("deleted storyId: ", response);
    setSharedStories((prevState) => {
      const newArrayOfSharedStories = prevState.arrayOfSharedStories.filter(
        (aStory) => aStory.id !== response
      );
      const newSharedStoriesComponents =
        newArrayOfSharedStories.map(mapStories);
      return {
        ...prevState,
        arrayOfSharedStories: newArrayOfSharedStories,
        sharedStoriesComponents: newSharedStoriesComponents,
      };
    });
    toastr.success("Story has been deleted.");
  };
  const onDeleteAStoryError = (error) => {
    _logger({ Error: error });
    toastr.warning("Delete Story Failed.");
  };
  const onApprovedRequest = (aStory) => {
    _logger("onApprovedRequest", aStory);
    aStory.isApproved = !aStory.isApproved;
    StoryServices.updateApprovedStory(aStory.id, aStory.isApproved)
      .then(() => onApproveSuccess(aStory.id))
      .catch(onApproveError);
  };

  const onApproveSuccess = (response) => {
    _logger(response);
  };

  const onApproveError = (error) => {
    _logger({ Error: error });
  };

  return (
    <div>
      <div className='stories-main-container'>
        <div className='container story-card-container'>
          <div className='row'>
            <div className='col-md-4 mb-5'>
              <Pagination
                total={sharedStories.totalCount}
                current={sharedStories.pageIndex}
                pageSize={sharedStories.pageSize}
                showLessItems={true}
                onChange={onPaginationClick}
                locale={locale}
              />
            </div>

            {currentUser.roles[0] === "Admin" && (
              <ApprovedBtn
                aStory={sharedStories}
                updateSharedStory={setSharedStories}
              />
            )}
          </div>
          <div className='row'>{sharedStories.sharedStoriesComponents}</div>
        </div>
      </div>
    </div>
  );
}

SharedStories.propTypes = {
  isApproved: PropTypes.bool.isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired),
  }),
};

export default SharedStories;
