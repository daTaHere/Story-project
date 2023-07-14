using Sabio.Data.Providers;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using Sabio.Models.Domain.SharedStories;
using Sabio.Data;
using Sabio.Services.Interfaces;
using Sabio.Models.Domain.Users;
using Sabio.Models;
using Sabio.Models.Requests.SharedStories;
using System;
using Sabio.Models.Files;

namespace Sabio.Services
{
    public class SharedStoriesServices : ISharedStoriesServices
    {
        private readonly IDataProvider _dataProvider = null;

        public SharedStoriesServices(IDataProvider data)
        {
            _dataProvider = data;
        }

        public int Create(SharedStoryAddRequest newStoryRequest, int userId)
        {
            int id = 0;
            string procName = "[dbo].[ShareStory_InsertV2]";

            _dataProvider.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    AddCommonParams(newStoryRequest, paramCollection);
                    paramCollection.AddWithValue("@CreatedBy", userId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    paramCollection.Add(idOut);

                }, returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;
                    int.TryParse(oId.ToString(), out id);
                }
            );
            return id;
        }

        public void Delete(int storyId)
        {
            string procName = "[dbo].[ShareStory_Delete_ById]";

            _dataProvider.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@Id", storyId);
                },
            returnParameters: null);
        }

        public SharedStory GetById(int storyId)
        {
            string procName = "[dbo].[ShareStory_Select_ById]";
            SharedStory aStory = null;

            _dataProvider.ExecuteCmd(procName, inputParamMapper:
                delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@Id", storyId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int idx = 0;
                    aStory = MapSingleStory(reader, ref idx);
                });
            return aStory;
        }

        public Paged<SharedStory> GetByApproved(int pageIdx, int pageSize, bool isApproved)
        {
            string procName = "[dbo].[ShareStory_PaginationV2]";
            Paged<SharedStory> pagedList = null;
            List<SharedStory> list = null;
            int totalCount = 0;

            _dataProvider.ExecuteCmd(procName, inputParamMapper:
                delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@PageIndex ", pageIdx);
                    paramCollection.AddWithValue("@PageSize ", pageSize);
                    paramCollection.AddWithValue("@Query ", isApproved);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int idx = 0;
                    SharedStory aStory = MapSingleStory(reader, ref idx);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(idx);
                    }
                    if (list == null)
                    {
                        list = new List<SharedStory>();
                    }
                    list.Add(aStory);
                });
            if (list != null)
            {
                pagedList = new Paged<SharedStory>(list, pageIdx, pageSize, totalCount);
            }
            return pagedList;
        }

        public void Update(SharedStoryUpdateRequest storyToUpdate, int id)
        {
            string procName = "[dbo].[ShareStory_UpdateV2]";

            _dataProvider.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    AddCommonParams(storyToUpdate, paramCollection);
                    paramCollection.AddWithValue("@Id", id);
                });
        }

        public void UpdateApproval(int storyId, bool isApproved, int userId)
        {
            string procName = "[dbo].[ShareStory_Update_Approval]";

            _dataProvider.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@ApprovedBy", userId);
                    paramCollection.AddWithValue("@IsApproved", isApproved);
                    paramCollection.AddWithValue("@Id", storyId);
                });
        }

        private static SharedStory MapSingleStory(IDataReader reader, ref int idx)
        {
            Console.WriteLine(reader);
            SharedStory aStory = new SharedStory();
            aStory.CreatedBy = new User();
            aStory.File = new File();
            
           
            aStory.Id = reader.GetSafeInt32(idx++);
            aStory.Name = reader.GetSafeString(idx++);
            aStory.Email = reader.GetSafeString(idx++);
            aStory.Story = reader.GetSafeString(idx++);
            aStory.CreatedBy.Id = reader.GetSafeInt32(idx++);
            aStory.CreatedBy.FirstName = reader.GetSafeString(idx++);
            aStory.CreatedBy.LastName = reader.GetSafeString(idx++);
            aStory.CreatedBy.Mi = reader.GetSafeString(idx++);
            aStory.CreatedBy.AvatarUrl = reader.GetSafeString(idx++);
            aStory.File.Id = reader.GetSafeInt32(idx++);
            aStory.File.Url = reader.GetSafeString(idx++);        
            aStory.IsApproved = reader.GetSafeBool(idx++);
            aStory.ApprovedBy = reader.GetSafeInt32(idx++);
            aStory.DateCreate = reader.GetSafeDateTime(idx++);
            aStory.DateModified = reader.GetSafeDateTime(idx++);
            return aStory;
        }

        private static void AddCommonParams(SharedStoryAddRequest newStoryRequest, SqlParameterCollection paramCollection)
        {
            paramCollection.AddWithValue("@Name", newStoryRequest.Name);
            paramCollection.AddWithValue("@Email", newStoryRequest.Email);
            paramCollection.AddWithValue("@Story", newStoryRequest.Story);
            paramCollection.AddWithValue("@FileId", newStoryRequest.FileId);
        }
    }
}