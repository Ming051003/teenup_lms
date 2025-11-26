using AutoMapper;
using Azure.Core;
using LMS.BLL.BusinessInterfaces;
using LMS.BLL.DTOs.Request;
using LMS.BLL.DTOs.Response;
using LMS.DAL.Interfaces;
using LMS.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BLL.BusinessService
{
    public class ParentService : IParentService
    {
        private readonly IParentRepository _parentRepository;
        private readonly IMapper _mapper;

        public ParentService(IParentRepository parentRepository, IMapper mapper)
        {
            _parentRepository = parentRepository;
            _mapper = mapper;

        }
        public async Task<List<ParentResponseDTO>> GetParentPage()
        {
             var result = await _parentRepository.GetParentPage();
            if (result == null || !result.Any()) return null;

            return _mapper.Map<List<ParentResponseDTO>>(result);
        }


        public async Task<ParentResponseDTO> GetParentInfo(long id)
        {
            var parent = await _parentRepository.GetParentInfo(id);
            if (parent == null) return null;

            return _mapper.Map<ParentResponseDTO>(parent);

        }

        public async Task<ParentResponseDTO> SetParentInfo(ParentRequestDTO request)
        {
            // Check email existed
            if (!string.IsNullOrEmpty(request.Email) &&
                await _parentRepository.ExistsByEmail(request.Email))
            {
                throw new InvalidOperationException(
                    $"Parent with email {request.Email} already exists");
            }

            // Check phone existed
            if (!string.IsNullOrEmpty(request.Phone) &&
                await _parentRepository.ExistsByPhone(request.Phone))
            {
                throw new InvalidOperationException(
                    $"Parent with phone {request.Phone} already exists");
            }

            var parent = _mapper.Map<Parent>(request);

            var created = await _parentRepository.SetParentInfo(parent);
            return _mapper.Map<ParentResponseDTO>(created);
        }

        public async Task<ParentResponseDTO> UpdateParentInfo(long id, ParentRequestDTO request)
        {
            var parent = await _parentRepository.GetParentInfo(id);
            if (parent == null) return null;

            // Check email changed + existed
            if (!string.IsNullOrEmpty(request.Email) &&
                request.Email != parent.Email)
            {
                if (await _parentRepository.ExistsByEmail(request.Email))
                {
                    throw new InvalidOperationException(
                        $"Parent with email {request.Email} already exists");
                }

                parent.Email = request.Email;
            }

            // Check phone changed + existed
            if (!string.IsNullOrEmpty(request.Phone) &&
                request.Phone != parent.Phone)
            {
                if (await _parentRepository.ExistsByPhone(request.Phone))
                {
                    throw new InvalidOperationException(
                        $"Parent with phone {request.Phone} already exists");
                }

                parent.Phone = request.Phone;
            }

            if (!string.IsNullOrEmpty(request.Name))
            {
                parent.Name = request.Name;
            }

            var updated = await _parentRepository.UpdateParentInfo(parent);

            return _mapper.Map<ParentResponseDTO>(updated);
        }

        public async Task<bool> DeleteParentAsync(long id)
        {
            return await _parentRepository.DeleteParent(id);
        }
    }
}
