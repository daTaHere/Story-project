using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain.SharedStories;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using Sabio.Models;
using Sabio.Services;
using Sabio.Models.Requests.SharedStories;
using Microsoft.AspNetCore.Authorization;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/sharedstories")]
    [ApiController]
    public class SharedStoriesApiController : BaseApiController
    {
        private ISharedStoriesServices _service = null;
        private IAuthenticationService<int> _authenticationService;
        public SharedStoriesApiController(
            ISharedStoriesServices services,
            IAuthenticationService<int> authSerice,
            ILogger<SharedStoriesApiController> logger) : base(logger)
        {
            _service = services;
            _authenticationService = authSerice;
        }

        [HttpDelete("{storyId:int}")]
        public ActionResult<SuccessResponse> Delete(int storyId)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Delete(storyId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("{sharedStoryId:int}")]
        public ActionResult<ItemResponse<SharedStory>> GetById(int sharedStoryId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                SharedStory aStory = _service.GetById(sharedStoryId);
                if (aStory == null)
                {
                    code = 404;
                    response = new ErrorResponse("Data Not Found.");
                }
                else
                {
                    response = new ItemResponse<SharedStory> { Item = aStory };
                }

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("paginate")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Paged<SharedStory>>> GetPagination(int pageIdx, int pageSize, bool isApproved)
        {
            ActionResult result = null;
            try
            {
                Paged<SharedStory> paged = _service.GetByApproved(pageIdx, pageSize, isApproved);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records not found"));
                }
                else
                {
                    ItemResponse<Paged<SharedStory>> response = new ItemResponse<Paged<SharedStory>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.ToString()));
            }
            return result;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(SharedStoryAddRequest newStoryRequest)
        {
            ObjectResult result = null;
            int userId = _authenticationService.GetCurrentUserId();
            try
            {
                int id = _service.Create(newStoryRequest, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(SharedStoryUpdateRequest storyToUpdate, int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Update(storyToUpdate, id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpPut("approval{storyId:int}")]
        public ActionResult<SuccessResponse> UpdateApproval(int storyId, bool approved)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authenticationService.GetCurrentUserId();
                _service.UpdateApproval(storyId, approved, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
    }
}