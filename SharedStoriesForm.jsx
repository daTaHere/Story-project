import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { Card } from 'react-bootstrap';
import StoryService from 'services/sharedStoriesServices';
import sharedStoryFormSchema from 'schemas/sharedStoriesFormSchema';
import PropTypes from 'prop-types';
import UploadFile from '../files/UploadFile';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import toastr from 'toastr';
import logger from 'sabio-debug';
import './sharedStories.css';
function ShareStoryForm({ currentUser }) {
  const _logger = logger.extend('Story');
  const { state, pathname } = useLocation();
  _logger(state);
  const [storyData, setStoryData] = useState({
    name: '',
    email: '',
    story: '',
    fileId: 0,
  });

  const [fileData, setFileData] = useState({
    Name: '',
    Url: '',
    FileTypeId: 0,
    CreatedBy: currentUser.id,
  });
  _logger(fileData, setFileData);

  useEffect(() => {
    if (pathname.includes('new')) {
      setStoryData((prevState) => {
        const newForm = { ...prevState };
        newForm.name = 'Title';
        newForm.email = '';
        newForm.story = 'Share Your Story';
        return newForm;
      });
    } else if (state?.payload && state?.type === 'STORY_PAYLOAD') {
      setStoryData((prevState) => {
        const locationState = { ...prevState };
        locationState.name = state.payload.name;
        locationState.email = state.payload.email;
        locationState.story = state.payload.story;
        locationState.file = state.payload.file.id;

        return locationState;
      });
    }
  }, [state, pathname]);

  const onSubmitRequest = (values) => {
    _logger(values, 'onSubmitRequest');
    if (pathname.includes('new')) {
      StoryService.addAStory(values)
        .then(onAddAStorySuccess)
        .catch(onAddAStoryError);
    } else {
      StoryService.editStory(values, state.payload.id)
        .then(onEditAStorySuccess)
        .catch(onEditAStoryError);
    }
  };

  const onEditAStorySuccess = (response) => {
    _logger(response);
    toastr.success('Your Story has been updated.');
  };

  const onEditAStoryError = (error) => {
    _logger({ Error: error });
    toastr.error('Your Story failed to Update.');
  };

  const onAddAStorySuccess = (response) => {
    _logger(response);
    toastr.success('Your Story has been added.');
  };

  const onAddAStoryError = (error) => {
    _logger({ Error: error });
    toastr.error('Your Story failed to add.');
  };

  const renderForm = useCallback(({ values, setFieldValue }) => {
    return (
      <div className='row'>
        <Form className='d-inline-flex ms-13'>
          <div className='col-4 mx-13 px-3 ms-3'>
            <div className='form-group formik-text py-1'>
              <label htmlFor='name'>Story Title</label>
              <Field
                className='form-control stories-formik-focus'
                type='text'
                name='name'
              />
              <ErrorMessage
                className=' text-warning'
                name='name'
                component='div'
              />
            </div>

            <div className='form-group formik-text py-1'>
              <label htmlFor='subject'>Email</label>
              <Field
                className='form-control stories-formik-focus'
                type='text'
                name='email'
              />
              <ErrorMessage
                className='text-warning'
                name='email'
                component='div'
              />
            </div>

            <div className='form-group formik-text py-1'>
              <label htmlFor='story'>Shared Story</label>
              <Field
                className='form-control stories-formik-focus text-warning'
                type='text'
                name='story'
              >
                {({ field }) => (
                  <CKEditor
                    name='story'
                    editor={ClassicEditor}
                    data={field.value}
                    onChange={(e, editor) => {
                      const data = editor.getData();
                      setFieldValue('story', data);
                      _logger('Change.', { e, editor, data });
                    }}
                  />
                )}
              </Field>
              <ErrorMessage
                name='story'
                component='div'
                className='text-warning'
              />
            </div>
            <div className='form-group py-1'>
              <div className='w-100 my-3 cursor-pointer'>
                <label htmlFor=''>Upload your image here</label>
                <UploadFile
                  getResponseFile={(arr) => {
                    let fileUrl = arr[0].url;
                    _logger(fileUrl);
                    setFieldValue('image', fileUrl);
                  }}
                />
              </div>
              <ErrorMessage
                className='text-warning'
                name='image'
                component='div'
              />
            </div>
            <button className='btn btn-dark my-2' type='submit'>
              Submit
            </button>
          </div>

          <div className='col-4 py-4 '>
            <Card className='stories-box-gradient'>
              <Card.Img
                className='mx-auto p-4 stories-form-card-image'
                variant='top'
                src={values.image}
                alt='...'
              />
              <Card.Body>
                <Card.Title className='display-5'>{values.name}</Card.Title>
                <Card.Text
                  dangerouslySetInnerHTML={{ __html: values.story }}
                ></Card.Text>
              </Card.Body>
            </Card>
          </div>
        </Form>
      </div>
    );
  }, []);

  return (
    <>
      <div className='mt-3'>
        <div className='container-fluid'>
          <Formik
            enableReinitialize={true}
            initialValues={storyData}
            validationSchema={sharedStoryFormSchema}
            onSubmit={onSubmitRequest}
          >
            {renderForm}
          </Formik>
        </div>
      </div>
    </>
  );
}

ShareStoryForm.propTypes = {
  aStory: PropTypes.shape({
    name: PropTypes.string.isRequired,
    story: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
  currentUser: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    id: PropTypes.number.isRequired,
  }),
};

export default ShareStoryForm;
