using System.Threading.Tasks;
using System.Collections.Generic;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IDatingAppRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveAll();
        Task<IEnumerable<User>> GetUsers();
        Task<User> GetUser(int id);
    }
}