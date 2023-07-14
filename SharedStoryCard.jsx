import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col } from 'react-bootstrap';

import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';

import logger from 'sabio-debug';
function StoryCard({ aStory, user, deleteClick, approvedChange }) {
  const _logger = logger.extend('StoryCard');
  const navigate = useNavigate();

  const handleCheck = () => {
    _logger('handleCheck', aStory);
    approvedChange(aStory);
  };

  const onEditClicked = () => {
    const payload = { state: { type: 'STORY_PAYLOAD', payload: aStory } };
    navigate(`/sharedstories/edit/${aStory.id}`, payload);
    _logger(payload);
  };

  const deleteRequest = () => {
    _logger('deleteCkd: ', aStory);
    deleteClick(aStory.id);
  };

  return (
    <Col lg={4} md={6} sm={12} className='my-1'>
      <Card className='mb-4 shadow-lg h-100'>
        <Card.Img
          className='stories-card-image'
          variant='top'
          src={aStory.file.url}
        />
        <Card.Body className='p-3 stories-card-body'>
          <Card.Title className='stories-card-title'>
            <h3>{aStory.name}</h3>
          </Card.Title>
          <Card.Text
            className='m-4 stories-card-text mb-3'
            dangerouslySetInnerHTML={{ __html: aStory.story }}
          ></Card.Text>
        </Card.Body>
        <Card.Footer>
          <div className='row stories-card-footer'>
            {user.roles[0] === 'Admin' && (
              <React.Fragment>
                <div className='col-6'>
                  <div className='row'>
                    <div className='col-6'>
                      <label htmlFor='isApproved'>Approve</label>
                    </div>
                    <div className='col-6'>
                      <input
                        type='checkbox'
                        checked={aStory.isApproved}
                        name='isApproved'
                        className='mt-'
                        onChange={handleCheck}
                      />
                    </div>
                  </div>
                </div>
                <div className='col'>
                  <div className='row'>
                    <div className='col'>
                      <FaTrashAlt
                        size={20}
                        className=' d-flex ms-2 float-end fa-edit'
                        color='black'
                        onClick={deleteRequest}
                      />
                      <FaRegEdit
                        size={20}
                        className=' d-flex float-end fa-edit'
                        color='black'
                        onClick={onEditClicked}
                      />
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}

            {user.id === aStory.createdBy.id && user.roles[0] !== 'Admin' && (
              <div className='col'>
                <div className='row'>
                  <div className='col'>
                    <FaRegEdit
                      size={20}
                      className=' d-flex float-end fa-edit'
                      color='black'
                      onClick={onEditClicked}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card.Footer>
      </Card>
    </Col>
  );
}

StoryCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired),
  }),
  aStory: PropTypes.shape({
    name: PropTypes.string.isRequired,
    story: PropTypes.string.isRequired,
    isApproved: PropTypes.bool.isRequired,
    createdBy: PropTypes.shape({
      avatarUrl: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    }),
    file: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }),
    id: PropTypes.number.isRequired,
  }),
  deleteClick: PropTypes.func.isRequired,
  approvedChange: PropTypes.func.isRequired,
};

export default StoryCard;
